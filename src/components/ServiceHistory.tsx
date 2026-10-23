import React, { useState } from 'react';
import { ServiceSheet } from '../types/serviceSheet';
import { ServiceSheetPreview } from './ServiceSheetPreview';
import { pdfExportService } from '../services/pdfExportService';
import {
  Search,
  FileDown,
  Printer,
  Eye,
  Edit2,
  Trash2,
  Copy,
  AlertTriangle,
  Building,
  Calendar,
  Wrench,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ServiceHistoryProps {
  sheets: ServiceSheet[];
  onEdit: (sheet: ServiceSheet) => void;
  onDelete: (id: string) => void;
  onDuplicate: (sheet: ServiceSheet) => void;
  onCreateNew: () => void;
  onClearSampleData: () => void;
  hasSampleData: boolean;
}

export const ServiceHistory: React.FC<ServiceHistoryProps> = ({
  sheets,
  onEdit,
  onDelete,
  onDuplicate,
  onCreateNew,
  onClearSampleData,
  hasSampleData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedSheetForView, setSelectedSheetForView] = useState<ServiceSheet | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtering
  const filteredSheets = sheets.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.ordenServicio.toLowerCase().includes(term) ||
      s.nombreCliente.toLowerCase().includes(term) ||
      s.direccionCliente.toLowerCase().includes(term) ||
      (s.tecnicoNombre && s.tecnicoNombre.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    if (filterType === 'reparacion') {
      return s.necesarioReparacion || s.tiposTrabajo.includes('reparacion');
    }
    if (filterType === 'riesgo') {
      return s.riesgoFueraServicio;
    }
    if (filterType === 'preventivo') {
      return s.tiposTrabajo.includes('mantto_preventivo');
    }

    return true;
  });

  const handleExportPdf = async (sheet: ServiceSheet) => {
    setIsExportingPdf(sheet.id);
    setSelectedSheetForView(sheet);

    // Short timeout so the preview DOM node renders
    setTimeout(async () => {
      const filename = `ELZE_Hoja_Servicio_${sheet.ordenServicio.replace(/\s+/g, '_')}_${sheet.nombreCliente.replace(/\s+/g, '_')}.pdf`;
      await pdfExportService.exportElementToPdf('modal-sheet-preview', filename);
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
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-600" />
            Historial de Hojas de Servicio
          </h2>
          <p className="text-xs text-slate-500">
            Registro cronológico de servicios de mantenimiento, inspección y transporte vertical.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hasSampleData && (
            <button
              type="button"
              onClick={onClearSampleData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
              title="Borrar registros de muestra precargados"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Borrar Datos de Muestra
            </button>
          )}

          <button
            type="button"
            onClick={onCreateNew}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-sky-700 text-white hover:bg-sky-800 rounded-lg transition shadow-sm"
          >
            <Wrench className="w-4 h-4" />
            + Nueva Hoja
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por orden, cliente, dirección o técnico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'preventivo', label: 'Preventivos' },
            { id: 'reparacion', label: 'Reparación / Piezas' },
            { id: 'riesgo', label: 'Riesgo Fuera Servicio' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border whitespace-nowrap transition ${filterType === f.id ? 'bg-sky-700 text-white border-sky-700 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Records Count Badge */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
        <span>Mostrando {filteredSheets.length} de {sheets.length} registros</span>
        {hasSampleData && (
          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
            Contiene datos de muestra
          </span>
        )}
      </div>

      {/* Table & Cards */}
      {filteredSheets.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            No se encontraron hojas de servicio
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? 'No hay registros que coincidan con los criterios de búsqueda.'
              : 'El sistema no tiene hojas registradas. Crea una nueva hoja oficial con el botón superior.'}
          </p>
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition"
          >
            <Wrench className="w-3.5 h-3.5" />
            Crear Primera Hoja
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredSheets.map((sheet) => {
            const isSample = !!sheet.esMuestra;

            return (
              <div
                key={sheet.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:border-sky-300 transition-all space-y-3"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-black text-sky-950 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                      O.S. {sheet.ordenServicio}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {sheet.equipos || 'IZQ / DER'}
                    </span>
                    {isSample && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        Ejemplo Foto
                      </span>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {sheet.equipoFuncionando ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Operando
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        <XCircle className="w-3 h-3" /> Detenido
                      </span>
                    )}

                    {sheet.riesgoFueraServicio && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                        <AlertTriangle className="w-3 h-3" /> Riesgo Crítico
                      </span>
                    )}

                    {sheet.necesarioReparacion && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        Requiere Piezas
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Cliente / Edificio
                    </span>
                    <span className="font-bold text-slate-900 block truncate">
                      {sheet.nombreCliente || '---'}
                    </span>
                    <span className="text-slate-500 text-[11px] block truncate">
                      {sheet.direccionCliente || '---'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Periodo & Tipos
                    </span>
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      <span>{sheet.periodoMeses?.join(', ') || 'N/A'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {sheet.tiposTrabajo?.map((t) => (t === 'mantto_preventivo' ? 'Preventivo' : t === 'reparacion' ? 'Reparación' : 'Falla')).join(' • ')}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Técnico & Recepción
                    </span>
                    <span className="font-bold text-slate-800 block">
                      Téc. {sheet.tecnicoNombre || 'E. Casas'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Recepción: {sheet.clienteNombre || 'Sin firmar'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Comentarios Clave
                    </span>
                    <span className="text-[11px] font-mono text-slate-700 block truncate">
                      {sheet.reparacionesAdicionalesTexto || sheet.comentariosMantenimiento || 'Sin observaciones'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400 font-mono">
                    ID: {sheet.id}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* View preview */}
                    <button
                      type="button"
                      onClick={() => setSelectedSheetForView(sheet)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      title="Ver hoja completa oficial"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      Ver Hoja
                    </button>

                    {/* Export PDF */}
                    <button
                      type="button"
                      onClick={() => handleExportPdf(sheet)}
                      disabled={isExportingPdf === sheet.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs disabled:opacity-50"
                      title="Descargar PDF oficial con firmas"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      {isExportingPdf === sheet.id ? 'Generando...' : 'Exportar PDF'}
                    </button>

                    {/* Print */}
                    <button
                      type="button"
                      onClick={() => handlePrint(sheet)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      title="Imprimir documento"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      Imprimir
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => onEdit(sheet)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition"
                      title="Modificar campos de esta hoja"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Editar
                    </button>

                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={() => onDuplicate(sheet)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                      title="Crear copia para otro mes"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    {deleteConfirmId === sheet.id ? (
                      <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-300 p-0.5 rounded-lg">
                        <button
                          type="button"
                          onClick={() => {
                            onDelete(sheet.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded transition"
                        >
                          Confirmar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 rounded"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(sheet.id)}
                        className="inline-flex items-center gap-1 p-1.5 text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal View for Inspection / PDF Export */}
      {selectedSheetForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-300">
            {/* Modal Header */}
            <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm">
                  Documento Oficial: O.S. {selectedSheetForView.ordenServicio}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedSheetForView.nombreCliente}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExportPdf(selectedSheetForView)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
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

            {/* Modal Body with Preview */}
            <div className="p-3 sm:p-6 overflow-y-auto bg-slate-100 flex-1">
              <ServiceSheetPreview sheet={selectedSheetForView} id="modal-sheet-preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
