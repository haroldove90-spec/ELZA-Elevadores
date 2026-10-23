import React, { useState, useEffect } from 'react';
import { ServiceSheet } from './types/serviceSheet';
import { storageService } from './services/storageService';
import { pdfExportService } from './services/pdfExportService';
import { Header } from './components/Header';
import { Sidebar, ActiveModule } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { MainDashboard } from './components/MainDashboard';
import { ServiceForm } from './components/ServiceForm';
import { RecordsModule } from './components/RecordsModule';
import { HistoryModule } from './components/HistoryModule';
import { SystemSettingsModal } from './components/SystemSettingsModal';
import { ServiceSheetPreview } from './components/ServiceSheetPreview';
import { CheckCircle2, AlertCircle, X, FileDown, Printer } from 'lucide-react';

export default function App() {
  // Active Module State: Default to 'dashboard' (El panel de control principal)
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');

  // Sidebar collapse on desktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sheets data
  const [sheets, setSheets] = useState<ServiceSheet[]>([]);
  const [editingSheet, setEditingSheet] = useState<ServiceSheet | null>(null);

  // Quick sheet inspection modal
  const [previewingSheet, setPreviewingSheet] = useState<ServiceSheet | null>(null);

  // Settings modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Reload data from local storage
  const loadSheets = () => {
    const data = storageService.getSheets();
    setSheets(data);
  };

  useEffect(() => {
    loadSheets();
  }, []);

  const hasSampleData = sheets.some((s) => s.esMuestra);

  const handleNavigate = (mod: ActiveModule) => {
    if (mod === 'ajustes') {
      setIsSettingsOpen(true);
    } else {
      if (mod === 'nueva_hoja_servicio' && activeModule !== 'nueva_hoja_servicio') {
        setEditingSheet(null);
      }
      setActiveModule(mod);
    }
  };

  // Save sheet handler
  const handleSaveSheet = async (sheet: ServiceSheet, andExportPdf: boolean = false) => {
    storageService.saveSheet(sheet);
    loadSheets();
    setEditingSheet(null);
    showToast(`Hoja de Servicio ${sheet.ordenServicio} guardada exitosamente.`);

    if (andExportPdf) {
      const filename = `ELZE_Hoja_${sheet.ordenServicio.replace(/\s+/g, '_')}_${sheet.nombreCliente.replace(/\s+/g, '_')}.pdf`;
      setActiveModule('registros');
      setTimeout(async () => {
        await pdfExportService.exportElementToPdf('service-sheet-document', filename);
        showToast('PDF generado y descargado correctamente.');
      }, 350);
    } else {
      setActiveModule('registros');
    }
  };

  // Delete sheet handler
  const handleDeleteSheet = (id: string) => {
    storageService.deleteSheet(id);
    loadSheets();
    showToast('Hoja de servicio eliminada.', 'info');
  };

  // Duplicate sheet handler
  const handleDuplicateSheet = (sheet: ServiceSheet) => {
    const duplicated: ServiceSheet = {
      ...sheet,
      id: `os-${Date.now().toString().slice(-6)}`,
      ordenServicio: `${Math.floor(100000 + Math.random() * 900000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      fechaCreacion: new Date().toISOString(),
      esMuestra: false,
    };
    setEditingSheet(duplicated);
    setActiveModule('nueva_hoja_servicio');
    showToast('Copia lista para edición en Nueva Hoja de Servicio.');
  };

  // Edit sheet handler
  const handleEditSheet = (sheet: ServiceSheet) => {
    setEditingSheet(sheet);
    setActiveModule('nueva_hoja_servicio');
  };

  // Create new sheet
  const handleCreateNew = () => {
    setEditingSheet(null);
    setActiveModule('nueva_hoja_servicio');
  };

  // Clear sample data handler
  const handleClearSampleData = () => {
    const { countCleared } = storageService.clearSampleData();
    loadSheets();
    showToast(`Se eliminaron ${countCleared} registros de muestra. El navegador no los mostrará más.`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased overflow-x-hidden">
      {/* 1. Cabecera Institucional Unificada con enlaces directos al Dashboard y módulos */}
      <Header
        activeModule={activeModule}
        onSelectModule={handleNavigate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSampleDataModal={handleClearSampleData}
        hasSampleData={hasSampleData}
      />

      {/* Main Layout with Desktop Sidebar and Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* 2. Menú Lateral en Escritorio */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          hasSampleData={hasSampleData}
          onClearSampleData={handleClearSampleData}
        />

        {/* 3. Área de Trabajo Limpia */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 min-w-0">
          {/* Módulo: Dashboard (Panel Principal) */}
          {activeModule === 'dashboard' && (
            <MainDashboard
              sheets={sheets}
              onNavigate={(mod) => {
                if (mod === 'nueva_hoja_servicio') setEditingSheet(null);
                setActiveModule(mod);
              }}
              onViewSheet={(sheet) => setPreviewingSheet(sheet)}
              onClearSampleData={handleClearSampleData}
              hasSampleData={hasSampleData}
            />
          )}

          {/* Módulo: Nueva Hoja de Servicio */}
          {activeModule === 'nueva_hoja_servicio' && (
            <ServiceForm
              initialData={editingSheet}
              onSave={handleSaveSheet}
              onCancel={() => {
                setEditingSheet(null);
                setActiveModule('registros');
              }}
            />
          )}

          {/* Módulo: Registros (Separado) */}
          {activeModule === 'registros' && (
            <RecordsModule
              sheets={sheets}
              onEdit={handleEditSheet}
              onDelete={handleDeleteSheet}
              onDuplicate={handleDuplicateSheet}
              onCreateNew={handleCreateNew}
              onClearSampleData={handleClearSampleData}
              hasSampleData={hasSampleData}
            />
          )}

          {/* Módulo: Historial (Separado) */}
          {activeModule === 'historial' && (
            <HistoryModule
              sheets={sheets}
              onViewSheet={(sheet) => setPreviewingSheet(sheet)}
              onCreateNew={handleCreateNew}
            />
          )}
        </main>
      </div>

      {/* 4. Barra de Navegación Móvil y Tablet (Color de fondo oscuro e íconos en blanco) */}
      <BottomNav
        activeModule={activeModule}
        onSelectModule={handleNavigate}
      />

      {/* 5. Modal de Ajustes, Borrado de Muestra & Supabase */}
      <SystemSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataChanged={loadSheets}
        hasSampleData={hasSampleData}
      />

      {/* 6. Modal de Previsualización Oficial */}
      {previewingSheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-300">
            <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm">
                  O.S. {previewingSheet.ordenServicio} - {previewingSheet.nombreCliente}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const filename = `ELZE_Hoja_${previewingSheet.ordenServicio.replace(/\s+/g, '_')}.pdf`;
                    pdfExportService.exportElementToPdf('global-sheet-preview-modal', filename);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Descargar PDF
                </button>
                <button
                  type="button"
                  onClick={() => pdfExportService.printElement()}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewingSheet(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6 overflow-y-auto bg-slate-100 flex-1">
              <ServiceSheetPreview sheet={previewingSheet} id="global-sheet-preview-modal" />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold animate-slide-up">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
