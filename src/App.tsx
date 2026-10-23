import React, { useState, useEffect } from 'react';
import { UserRole, ServiceSheet } from './types/serviceSheet';
import { storageService } from './services/storageService';
import { pdfExportService } from './services/pdfExportService';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar, ActiveModule } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ServiceForm } from './components/ServiceForm';
import { ServiceHistory } from './components/ServiceHistory';
import { MetricsDashboard } from './components/MetricsDashboard';
import { SystemSettingsModal } from './components/SystemSettingsModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Role State (if null, displays the initial role selector)
  const [activeRole, setActiveRole] = useState<UserRole | null>(() => {
    const saved = storageService.getActiveRole();
    if (saved === 'admin' || saved === 'tecnico' || saved === 'supervisor' || saved === 'cliente') {
      return saved;
    }
    return null;
  });

  // Active Module State
  const [activeModule, setActiveModule] = useState<ActiveModule>('nueva_hoja');

  // Sidebar collapse & mobile drawer
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sheets data
  const [sheets, setSheets] = useState<ServiceSheet[]>([]);
  const [editingSheet, setEditingSheet] = useState<ServiceSheet | null>(null);

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

  // Role selection
  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    storageService.setActiveRole(role);

    // Default module per role
    if (role === 'admin' || role === 'tecnico') {
      setActiveModule('nueva_hoja');
    } else {
      setActiveModule('historial');
    }
    showToast(`Bienvenido a Invernadero ELZE • Modo ${role.toUpperCase()}`, 'info');
  };

  // Logout / Switch role
  const handleLogout = () => {
    setActiveRole(null);
    storageService.setActiveRole(null);
    setEditingSheet(null);
  };

  // Save sheet handler
  const handleSaveSheet = async (sheet: ServiceSheet, andExportPdf: boolean = false) => {
    storageService.saveSheet(sheet);
    loadSheets();
    setEditingSheet(null);
    showToast(`Hoja de Servicio ${sheet.ordenServicio} guardada exitosamente.`);

    if (andExportPdf) {
      // Trigger PDF export
      const filename = `ELZE_Hoja_${sheet.ordenServicio.replace(/\s+/g, '_')}_${sheet.nombreCliente.replace(/\s+/g, '_')}.pdf`;
      setActiveModule('historial');
      setTimeout(async () => {
        await pdfExportService.exportElementToPdf('service-sheet-document', filename);
        showToast('PDF generado y descargado correctamente.');
      }, 400);
    } else {
      setActiveModule('historial');
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
    setActiveModule('nueva_hoja');
    showToast('Copia de hoja creada en el formulario para edición.');
  };

  // Edit sheet handler
  const handleEditSheet = (sheet: ServiceSheet) => {
    setEditingSheet(sheet);
    setActiveModule('nueva_hoja');
  };

  // Create new sheet
  const handleCreateNew = () => {
    setEditingSheet(null);
    setActiveModule('nueva_hoja');
  };

  // Clear sample data handler
  const handleClearSampleData = () => {
    const { countCleared } = storageService.clearSampleData();
    loadSheets();
    showToast(`Se eliminaron ${countCleared} registros de muestra. El navegador no los mostrará más.`, 'info');
  };

  // If no role is selected, show initial clean 2-col/4-col selector without header
  if (!activeRole) {
    return <RoleSelector onSelectRole={handleSelectRole} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      {/* 1. Cabecera Institucional Unificada */}
      <Header
        activeRole={activeRole}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSampleDataModal={handleClearSampleData}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        hasSampleData={hasSampleData}
      />

      {/* Main Container with Desktop Sidebar and Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* 2. Menú Lateral Desplegable en Escritorio */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={(mod) => {
            if (mod === 'ajustes') {
              setIsSettingsOpen(true);
            } else {
              if (mod === 'nueva_hoja' && activeModule !== 'nueva_hoja') {
                setEditingSheet(null);
              }
              setActiveModule(mod);
            }
          }}
          activeRole={activeRole}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          hasSampleData={hasSampleData}
          onClearSampleData={handleClearSampleData}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* 3. Área de Trabajo Limpia (Sin Pestañas Repetitivas) */}
        <main className="flex-1 p-3 sm:p-6 min-w-0">
          {activeModule === 'nueva_hoja' && (
            <ServiceForm
              initialData={editingSheet}
              onSave={handleSaveSheet}
              onCancel={() => {
                setEditingSheet(null);
                setActiveModule('historial');
              }}
            />
          )}

          {activeModule === 'historial' && (
            <ServiceHistory
              sheets={sheets}
              onEdit={handleEditSheet}
              onDelete={handleDeleteSheet}
              onDuplicate={handleDuplicateSheet}
              onCreateNew={handleCreateNew}
              onClearSampleData={handleClearSampleData}
              hasSampleData={hasSampleData}
            />
          )}

          {activeModule === 'metricas' && (
            <MetricsDashboard
              sheets={sheets}
              onViewSheet={(sheet) => {
                setEditingSheet(sheet);
                setActiveModule('historial');
              }}
              onCreateNew={handleCreateNew}
            />
          )}
        </main>
      </div>

      {/* 4. Navegación Móvil y Tablet (Bottom Bar) */}
      <BottomNav
        activeModule={activeModule}
        onSelectModule={(mod) => {
          if (mod === 'ajustes') {
            setIsSettingsOpen(true);
          } else {
            if (mod === 'nueva_hoja' && activeModule !== 'nueva_hoja') {
              setEditingSheet(null);
            }
            setActiveModule(mod);
          }
        }}
      />

      {/* 5. Modal de Ajustes, Borrado de Muestra & Supabase */}
      <SystemSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataChanged={loadSheets}
        hasSampleData={hasSampleData}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-16 md:bottom-6 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold animate-slide-up">
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
