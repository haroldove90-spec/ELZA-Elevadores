import React, { useState } from 'react';
import { ServiceSheet } from '../types/serviceSheet';
import { ServiceSheetPreview } from './ServiceSheetPreview';
import { pdfExportService } from '../services/pdfExportService';
import {
  Clock,
  Calendar,
  Building,
  Wrench,
  FileDown,
  Printer,
  Eye,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface HistoryModuleProps {
  sheets: ServiceSheet[];
  onViewSheet: (sheet: ServiceSheet) => void;
  onCreateNew: () => void;
}

export const HistoryModule: React.FC<HistoryModuleProps> = ({
  sheets,
  onViewSheet,
  onCreateNew,
}) => {
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [inspectingSheet, setInspectingSheet] = useState<ServiceSheet | null>(null);
  const [isExportingHistoryPdf, setIsExportingHistoryPdf] = useState(false);

  // Unique clients
  const clients = Array.from(new Set(sheets.map((s) => s.nombreCliente).filter(Boolean)));

  // Filter sheets chronologically
  const filteredSheets = sheets
    .filter((s) => {
      if (selectedClient !== 'all' && s.nombreCliente !== selectedClient) return false;
      if (selectedEquipment !== 'all') {
        if (!s.equipos.toUpperCase().includes(selectedEquipment.toUpperCase())) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.fechaCreacion || 0).getTime() - new Date(a.fechaCreacion || 0).getTime());

  // Export full historical summary to PDF
  const handleExportHistorySummary = async () => {
    setIsExportingHistoryPdf(true);
    setTimeout(async () => {
      const filename = `ELZE_Historial_Mantenimientos_${selectedClient === 'all' ? 'General' : selectedClient.replace(/\s+/g, '_')}.pdf`;
      await pdfExportService.exportElementToPdf('history-timeline-container', filename);
      setIsExportingHistoryPdf(false);
    }, 200);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            Módulo de Historial y Auditoría Técnica
          </h2>
          <p className="text-xs text-slate-500">
            Trazabilidad cronológica de intervenciones, cambio de refacciones y bitácora técnica de elevadores.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportHistorySummary}
            disabled={isExportingHistoryPdf || filteredSheets.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            {isExportingHistoryPdf ? 'Generando...' : 'Exportar Historial en PDF'}
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-700 shrink-0">Filtrar Historial:</span>
        </div>

        {/* Client filter */}
        <div className="w-full sm:w-auto flex-1">
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:ring-sky-500"
          >
            <option value="all">-- Todos los Edificios / Clientes --</option>
            {clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment filter */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="w-full sm:w-48 px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:ring-sky-500"
          >
            <option value="all">-- Todos los Equipos --</option>
            <option value="IZQ">Elevador IZQ</option>
            <option value="DER">Elevador DER</option>
          </select>
        </div>
      </div>

      {/* Chronological Timeline Container */}
      <div id="history-timeline-container" className="space-y-4 bg-slate-50/50 p-2 sm:p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
          <span>{filteredSheets.length} Eventos Técnicos Registrados</span>
          {selectedClient !== 'all' && (
            <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              Edificio: {selectedClient}
            </span>
          )}
        </div>

        {filteredSheets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No hay eventos en el historial</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No se han registrado visitas técnicas bajo los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-sky-400/60 ml-4 sm:ml-6 pl-4 sm:pl-6 space-y-6 my-2">
            {filteredSheets.map((sheet, index) => {
              const types = sheet.tiposTrabajo || [];
              const isPreventive = types.includes('mantto_preventivo');
              const isRepair = types.includes('reparacion');
              const isFailure = types.includes('falla');

              return (
                <div key={sheet.id} className="relative group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white border-4 border-sky-600 shadow-xs flex items-center justify-center group-hover:scale-125 transition-transform" />

                  {/* Timeline Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 p-4 sm:p-5 transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-sky-950 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          O.S. {sheet.ordenServicio}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {sheet.equipos || 'IZQ / DER'}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-sky-600" />
                          {sheet.periodoMeses?.join(', ') || 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isPreventive && (
                          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                            Preventivo
                          </span>
                        )}
                        {isRepair && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Reparación
                          </span>
                        )}
                        {isFailure && (
                          <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Falla
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Edificio / Instalación
                        </span>
                        <div className="font-bold text-slate-900">
                          {sheet.nombreCliente}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {sheet.direccionCliente}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Técnico y Validación
                        </span>
                        <div className="font-bold text-slate-800">
                          Téc. {sheet.tecnicoNombre || 'E. Casas'}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Recibido por {sheet.clienteNombre || 'Cliente'}
                        </div>
                      </div>
                    </div>

                    {/* Key Technical Log Notes */}
                    {(sheet.reparacionesAdicionalesTexto || sheet.comentariosMantenimiento) && (
                      <div className="bg-sky-50/60 p-3 rounded-xl border border-sky-100 text-xs font-mono space-y-1">
                        <span className="text-[10px] uppercase font-bold text-sky-900 block font-sans">
                          Bitácora de Trabajo e Intervención:
                        </span>
                        {sheet.comentariosMantenimiento && (
                          <div className="text-slate-800 font-semibold whitespace-pre-line">
                            {sheet.comentariosMantenimiento}
                          </div>
                        )}
                        {sheet.reparacionesAdicionalesTexto && (
                          <div className="text-amber-900 font-bold">
                            ⚠️ Piezas/Reparaciones: {sheet.reparacionesAdicionalesTexto}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setInspectingSheet(sheet)}
                        className="px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition border border-sky-200 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver Hoja Oficial
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const filename = `ELZE_Hoja_${sheet.ordenServicio.replace(/\s+/g, '_')}.pdf`;
                          setInspectingSheet(sheet);
                          setTimeout(() => {
                            pdfExportService.exportElementToPdf('modal-history-preview', filename);
                          }, 250);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition border border-emerald-200 flex items-center gap-1.5"
                      >
                        <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal View */}
      {inspectingSheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-300">
            <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm">
                  O.S. {inspectingSheet.ordenServicio} - {inspectingSheet.nombreCliente}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const filename = `ELZE_Hoja_${inspectingSheet.ordenServicio.replace(/\s+/g, '_')}.pdf`;
                    pdfExportService.exportElementToPdf('modal-history-preview', filename);
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
                  onClick={() => setInspectingSheet(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6 overflow-y-auto bg-slate-100 flex-1">
              <ServiceSheetPreview sheet={inspectingSheet} id="modal-history-preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
