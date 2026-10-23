import React, { useState } from 'react';
import { ServiceSheet } from '../types/serviceSheet';
import { ServiceSheetPreview } from './ServiceSheetPreview';
import { pdfExportService } from '../services/pdfExportService';
import {
  FileSpreadsheet,
  Search,
  FileDown,
  Printer,
  Eye,
  Edit2,
  Trash2,
  Copy,
  PlusCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Calendar,
  Building,
} from 'lucide-react';

interface RecordsModuleProps {
  sheets: ServiceSheet[];
  onEdit: (sheet: ServiceSheet) => void;
  onDelete: (id: string) => void;
  onDuplicate: (sheet: ServiceSheet) => void;
  onCreateNew: () => void;
  onClearSampleData: () => void;
  hasSampleData: boolean;
}

export const RecordsModule: React.FC<RecordsModuleProps> = ({
  sheets,
  onEdit,
  onDelete,
  onDuplicate,
  onCreateNew,
  onClearSampleData,
  hasSampleData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'operando' | 'reparacion' | 'riesgo'>('all');
  const [selectedSheetForView, setSelectedSheetForView] = useState<ServiceSheet | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter logic
  const filteredSheets = sheets.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.ordenServicio.toLowerCase().includes(term) ||
      s.nombreCliente.toLowerCase().includes(term) ||
      s.direccionCliente.toLowerCase().includes(term) ||
      (s.tecnicoNombre && s.tecnicoNombre.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    if (statusFilter === 'operando') return s.equipoFuncionando;
    if (statusFilter === 'reparacion') return s.necesarioReparacion;
    if (statusFilter === 'riesgo') return s.riesgoFueraServicio;

    return true;
  });

  const handleExportPdf = async (sheet: ServiceSheet) => {
    setIsExportingPdf(sheet.id);
    setSelectedSheetForView(sheet);

    setTimeout(async () => {
      const filename = `ELZE_Hoja_${sheet.ordenServicio.replace(/\s+/g, '_')}_${sheet.nombreCliente.replace(/\s+/g, '_')}.pdf`;
      await pdfExportService.exportElementToPdf('modal-records-preview', filename);
      setIsExportingPdf(null);
    }, 250);
  };

  const handlePrint = (sheet: ServiceSheet) => {
    setSelectedSheetForView(sheet);
    setTimeout(() => {
      pdfExportService.printElement();
    }, 250);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-600" />
            Módulo de Registros
          </h2>
          <p className="text-xs text-slate-500">
            Administración completa de todas las hojas de servicio técnico creadas en el sistema.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hasSampleData && (
            <button
              type="button"
              onClick={onClearSampleData}
              className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-600" />
              Borrar Muestra
            </button>
          )}

          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva Hoja de Servicio
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por orden de servicio, edificio, cliente o técnico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
          {[
            { id: 'all' as const, label: 'Todos' },
            { id: 'operando' as const, label: 'Operando' },
            { id: 'reparacion' as const, label: 'Requiere Reparación' },
            { id: 'riesgo' as const, label: 'Riesgo Crítico' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border whitespace-nowrap transition ${
                statusFilter === f.id
                  ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
        <span>Mostrando {filteredSheets.length} de {sheets.length} registros</span>
        {hasSampleData && (
          <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-mono">
            Incluye datos de muestra
          </span>
        )}
      </div>

      {/* Records List */}
      {filteredSheets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No hay registros guardados</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? 'Ningún registro coincide con la búsqueda.'
              : 'Empieza registrando una nueva hoja de servicio oficial de elevadores.'}
          </p>
          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2 bg-sky-700 text-white font-bold text-xs rounded-xl hover:bg-sky-800 transition"
          >
            Crear Hoja de Servicio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredSheets.map((sheet) => (
            <div
              key={sheet.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 p-4 transition-all space-y-3"
            >
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-sky-950 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                    O.S. {sheet.ordenServicio}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {sheet.equipos || 'IZQ / DER'}
                  </span>
                  {sheet.esMuestra && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                      Muestra Foto
                    </span>
                  )}
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  {sheet.equipoFuncionando ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Operando
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      <XCircle className="w-3 h-3" /> Detenido
                    </span>
                  )}

                  {sheet.necesarioReparacion && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      Requiere Reparación
                    </span>
                  )}

                  {sheet.riesgoFueraServicio && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                      <AlertTriangle className="w-3 h-3" /> Riesgo
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Cliente / Ubicación
                  </span>
                  <span className="font-bold text-slate-900 block truncate">
                    {sheet.nombreCliente}
                  </span>
                  <span className="text-slate-500 text-[11px] block truncate">
                    {sheet.direccionCliente}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Periodo & Tipos
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {sheet.periodoMeses?.join(', ') || 'N/A'}
                  </span>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {sheet.tiposTrabajo?.map((t) => (t === 'mantto_preventivo' ? 'Preventivo' : t === 'reparacion' ? 'Reparación' : 'Falla')).join(' • ')}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Personal Responsable
                  </span>
                  <span className="font-bold text-slate-800 block">
                    Téc. {sheet.tecnicoNombre || 'E. Casas'}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Recibió: {sheet.clienteNombre || 'Sin firmar'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: {sheet.id}
                </span>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setSelectedSheetForView(sheet)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver Hoja
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportPdf(sheet)}
                    disabled={isExportingPdf === sheet.id}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs flex items-center gap-1 disabled:opacity-50"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    {isExportingPdf === sheet.id ? 'Generando...' : 'Exportar PDF'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePrint(sheet)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Imprimir
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(sheet)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicate(sheet)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                    title="Duplicar hoja"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === sheet.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(sheet.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-1 text-xs font-bold text-white bg-rose-600 rounded"
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 text-xs text-slate-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(sheet.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal View for Inspection / PDF Export */}
      {selectedSheetForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-300">
            <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm">
                  Documento Oficial: O.S. {selectedSheetForView.ordenServicio}
                </span>
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  • {selectedSheetForView.nombreCliente}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExportPdf(selectedSheetForView)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Descargar PDF
                </button>
                <button
                  type="button"
                  onClick={() => handlePrint(selectedSheetForView)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSheetForView(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6 overflow-y-auto bg-slate-100 flex-1">
              <ServiceSheetPreview sheet={selectedSheetForView} id="modal-records-preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
