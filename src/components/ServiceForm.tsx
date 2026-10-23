import React, { useState } from 'react';
import {
  ServiceSheet,
  ChecklistItem,
  MonthKey,
  WorkType,
} from '../types/serviceSheet';
import { getDefaultChecklist } from '../data/sampleData';
import { SignaturePad } from './SignaturePad';
import { ServiceSheetPreview } from './ServiceSheetPreview';
import {
  Save,
  FileCheck,
  RotateCcw,
  Eye,
  Edit3,
  Wrench,
  Building,
  Calendar,
  CheckSquare,
  AlertTriangle,
  UserCheck,
  FileDown,
  Sparkles,
} from 'lucide-react';

interface ServiceFormProps {
  initialData?: ServiceSheet | null;
  onSave: (sheet: ServiceSheet, andExportPdf?: boolean) => void;
  onCancel?: () => void;
}

const MONTHS: MonthKey[] = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

export const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<'formulario' | 'preview'>('formulario');

  const [formData, setFormData] = useState<ServiceSheet>(() => {
    if (initialData) return initialData;

    return {
      id: `os-${Date.now().toString().slice(-6)}`,
      ordenServicio: `${Math.floor(100000 + Math.random() * 900000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      equipos: 'IZQ / DER',
      tiposTrabajo: ['mantto_preventivo'],
      periodoMeses: ['OCT', 'NOV'],
      direccionCliente: '',
      nombreCliente: '',
      fechaCreacion: new Date().toISOString(),
      actividades: getDefaultChecklist(),
      equipoFuncionando: true,
      riesgoFueraServicio: false,
      necesarioReparacion: false,
      reparacSeguridad: false,
      reparacionesAdicionalesTexto: '',
      comentariosMantenimiento: 'MANTTO PREVENTIVO RUTINARIO REALIZADO.',
      motivosAtencion: {
        relativoAlEquipo: false,
        influenciaExterna: false,
        malUso: false,
        reporteReparacionPendiente: false,
      },
      causaFalla: '',
      componenteAfectado: '',
      detalleDanio: '',
      clienteNombre: '',
      clienteFecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      clienteFirmaUrl: '',
      tecnicoNombre: 'E. Casas',
      tecnicoFecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      tecnicoFirmaUrl: '',
      telefonoContacto: '5540930972',
      esMuestra: false,
    };
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // Handlers
  const handleToggleWorkType = (type: WorkType) => {
    setFormData((prev) => {
      const exists = prev.tiposTrabajo.includes(type);
      return {
        ...prev,
        tiposTrabajo: exists
          ? prev.tiposTrabajo.filter((t) => t !== type)
          : [...prev.tiposTrabajo, type],
      };
    });
  };

  const handleToggleMonth = (month: MonthKey) => {
    setFormData((prev) => {
      const exists = prev.periodoMeses.includes(month);
      return {
        ...prev,
        periodoMeses: exists
          ? prev.periodoMeses.filter((m) => m !== month)
          : [...prev.periodoMeses, month],
      };
    });
  };

  const handleChecklistChange = (id: string, side: 'izq' | 'der') => {
    setFormData((prev) => {
      const updated = prev.actividades.map((item) => {
        if (item.id === id) {
          const nextVal = !item[side];
          const bothDone = side === 'izq' ? nextVal && item.der : item.izq && nextVal;
          return {
            ...item,
            [side]: nextVal,
            completado: bothDone,
          };
        }
        return item;
      });
      return { ...prev, actividades: updated };
    });
  };

  const handleMarkAllSection = (seccion: string, side: 'izq' | 'der', checked: boolean) => {
    setFormData((prev) => {
      const updated = prev.actividades.map((item) => {
        if (item.seccion === seccion) {
          const nextVal = checked;
          const other = side === 'izq' ? item.der : item.izq;
          return {
            ...item,
            [side]: nextVal,
            completado: nextVal && other,
          };
        }
        return item;
      });
      return { ...prev, actividades: updated };
    });
  };

  const handleSave = (andExportPdf = false) => {
    if (!formData.ordenServicio.trim()) {
      setValidationError('Por favor ingresa la Orden de Servicio.');
      return;
    }
    if (!formData.nombreCliente.trim()) {
      setValidationError('Por favor ingresa el Nombre del Cliente / Edificio.');
      return;
    }

    setValidationError(null);
    onSave(formData, andExportPdf);
  };

  const handlePrefillWithDemo = () => {
    setFormData((prev) => ({
      ...prev,
      ordenServicio: '247016 1842',
      equipos: 'IZQ / DER',
      tiposTrabajo: ['mantto_preventivo', 'reparacion'],
      periodoMeses: ['AGO', 'SEP', 'OCT'],
      direccionCliente: 'JUSTO SIERRA',
      nombreCliente: 'SAN VICENTE LIVING',
      equipoFuncionando: true,
      riesgoFueraServicio: false,
      necesarioReparacion: true,
      reparacSeguridad: false,
      reparacionesAdicionalesTexto: 'INDICADORES DE NIVEL DE PB',
      comentariosMantenimiento: 'MANTTO BIMESTRAL LIMPIEZA / LUBRICACIÓN / INSP.\nSE CAMBIARON 2 HOJAS CHAPAS D/PTA CABINA ELEV IZQ.',
      causaFalla: 'Equipo referenciado',
      detalleDanio: 'Fin de vida util',
      clienteNombre: 'Jorge Martinez Flores',
      tecnicoNombre: 'E. Casas',
      actividades: prev.actividades.map((it) => ({
        ...it,
        izq: true,
        der: true,
        completado: true,
      })),
    }));
  };

  const sections = [
    'Cliente / Cabina',
    'Cuarto de Maquinas / Tablero de Control',
    'Cubo',
    'Fosa',
  ] as const;

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-sky-600" />
            {initialData ? 'Editar Hoja de Servicio' : 'Nueva Hoja de Servicio Oficial'}
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            ELZE ELEVADORES • {formData.ordenServicio || 'Borrador'}
          </p>
        </div>

        {/* View Toggle & Save buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handlePrefillWithDemo}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition border border-sky-200"
            title="Llenar con los datos exactos de la foto de muestra"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Ejemplo Foto
          </button>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('formulario')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${activeTab === 'formulario' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Formulario
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${activeTab === 'preview' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Eye className="w-3.5 h-3.5" /> Vista Previa
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleSave(false)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-sky-700 text-white hover:bg-sky-800 transition shadow-sm"
          >
            <Save className="w-3.5 h-3.5" /> Guardar
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
            title="Guardar y descargar en PDF inmediatamente"
          >
            <FileDown className="w-3.5 h-3.5" /> Guardar + PDF
          </button>
        </div>
      </div>

      {validationError && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Form or Live Preview Tab */}
      {activeTab === 'preview' ? (
        <div className="bg-slate-100 p-2 sm:p-6 rounded-2xl border border-slate-200">
          <div className="text-center mb-3">
            <span className="text-xs font-bold bg-sky-100 text-sky-800 px-3 py-1 rounded-full uppercase tracking-wider">
              Vista Previa en Tiempo Real (Lista para Impresión o PDF)
            </span>
          </div>
          <ServiceSheetPreview sheet={formData} id="preview-active-sheet" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Card 1: Identificación y Datos Generales */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Building className="w-4 h-4 text-sky-600" />
                1. Datos de la Orden y Cliente
              </h3>
              <span className="text-[11px] font-mono text-slate-400">ELZE MANTTO</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Orden de Servicio *
                </label>
                <input
                  type="text"
                  value={formData.ordenServicio}
                  onChange={(e) => setFormData({ ...formData, ordenServicio: e.target.value })}
                  placeholder="ej. 247016 1842"
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Equipos / Ubicación
                </label>
                <input
                  type="text"
                  value={formData.equipos}
                  onChange={(e) => setFormData({ ...formData, equipos: e.target.value })}
                  placeholder="ej. IZQ / DER"
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre del Cliente / Edificio *
                </label>
                <input
                  type="text"
                  value={formData.nombreCliente}
                  onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                  placeholder="ej. SAN VICENTE LIVING"
                  className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dirección del Cliente
                </label>
                <input
                  type="text"
                  value={formData.direccionCliente}
                  onChange={(e) => setFormData({ ...formData, direccionCliente: e.target.value })}
                  placeholder="ej. JUSTO SIERRA"
                  className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 uppercase"
                />
              </div>
            </div>

            {/* Tipo de Trabajo & Periodo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              {/* Tipo de Trabajo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tipo de Trabajo
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'mantto_preventivo' as WorkType, label: 'Mantto Preventivo' },
                    { id: 'falla' as WorkType, label: 'Falla' },
                    { id: 'reparacion' as WorkType, label: 'Reparación' },
                  ].map((t) => {
                    const active = formData.tiposTrabajo.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleWorkType(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border ${active ? 'bg-sky-700 text-white border-sky-800' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                      >
                        <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${active ? 'bg-white text-sky-800 border-white' : 'border-slate-400'}`}>
                          {active ? '✓' : ''}
                        </span>
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Periodo de Meses */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Periodo (Meses)</span>
                  <span className="text-[10px] text-slate-400">Selecciona los meses activos</span>
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {MONTHS.map((m) => {
                    const active = formData.periodoMeses.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleToggleMonth(m)}
                        className={`py-1 text-[10px] font-black rounded border transition text-center ${active ? 'bg-sky-800 text-white border-sky-900 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Checklist de Mantenimiento / Actividades */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-sky-600" />
                  2. Checklist de Mantenimiento / Actividades
                </h3>
                <p className="text-xs text-slate-500">
                  Verificación de cabina, cuarto de máquinas, cubo y fosa para equipos IZQ y DER.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {sections.map((seccion) => {
                const items = formData.actividades.filter((a) => a.seccion === seccion);
                const allIzq = items.every((i) => i.izq);
                const allDer = items.every((i) => i.der);

                return (
                  <div key={seccion} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
                    <div className="bg-sky-900 text-white px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase tracking-wider">
                        {seccion}
                      </span>
                      {/* Batch actions for section */}
                      <div className="flex items-center gap-2 text-[10px]">
                        <button
                          type="button"
                          onClick={() => handleMarkAllSection(seccion, 'izq', !allIzq)}
                          className="px-2 py-0.5 rounded bg-sky-800 hover:bg-sky-700 text-white transition font-medium"
                        >
                          {allIzq ? 'Desmarcar IZQ' : 'Marcar todo IZQ'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkAllSection(seccion, 'der', !allDer)}
                          className="px-2 py-0.5 rounded bg-sky-800 hover:bg-sky-700 text-white transition font-medium"
                        >
                          {allDer ? 'Desmarcar DER' : 'Marcar todo DER'}
                        </button>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-200 bg-white">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition"
                        >
                          <span className="text-xs text-slate-800 font-medium sm:max-w-xl">
                            {item.descripcion}
                          </span>

                          <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
                            {/* IZQ checkbox */}
                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={item.izq}
                                onChange={() => handleChecklistChange(item.id, 'izq')}
                                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                              />
                              <span className="text-xs font-bold text-slate-700 font-mono">
                                IZQ
                              </span>
                            </label>

                            {/* DER checkbox */}
                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={item.der}
                                onChange={() => handleChecklistChange(item.id, 'der')}
                                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                              />
                              <span className="text-xs font-bold text-slate-700 font-mono">
                                DER
                              </span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Evaluaciones y Reparaciones Adicionales */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              3. Estado Operativo y Reparaciones Adicionales
            </h3>

            {/* Switches */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex flex-col gap-1 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <span className="text-[11px] font-bold text-slate-700">Equipo funcionando</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={formData.equipoFuncionando}
                    onChange={(e) => setFormData({ ...formData, equipoFuncionando: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className={`text-xs font-black ${formData.equipoFuncionando ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {formData.equipoFuncionando ? 'SÍ (Operando)' : 'NO'}
                  </span>
                </div>
              </label>

              <label className="flex flex-col gap-1 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <span className="text-[11px] font-bold text-slate-700">Riesgo Fuera Servicio</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={formData.riesgoFueraServicio}
                    onChange={(e) => setFormData({ ...formData, riesgoFueraServicio: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className={`text-xs font-black ${formData.riesgoFueraServicio ? 'text-rose-700' : 'text-slate-500'}`}>
                    {formData.riesgoFueraServicio ? 'SÍ (Riesgo Crítico)' : 'NO'}
                  </span>
                </div>
              </label>

              <label className="flex flex-col gap-1 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <span className="text-[11px] font-bold text-slate-700">Necesario Reparación</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={formData.necesarioReparacion}
                    onChange={(e) => setFormData({ ...formData, necesarioReparacion: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span className={`text-xs font-black ${formData.necesarioReparacion ? 'text-amber-700' : 'text-slate-500'}`}>
                    {formData.necesarioReparacion ? 'SÍ (Requiere Piezas)' : 'NO'}
                  </span>
                </div>
              </label>

              <label className="flex flex-col gap-1 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <span className="text-[11px] font-bold text-slate-700">Reparac. Seguridad</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={formData.reparacSeguridad}
                    onChange={(e) => setFormData({ ...formData, reparacSeguridad: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className={`text-xs font-black ${formData.reparacSeguridad ? 'text-rose-700' : 'text-slate-500'}`}>
                    {formData.reparacSeguridad ? 'SÍ (Seguridad)' : 'NO'}
                  </span>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Si es necesario reparaciones adicionales describa aquí:
              </label>
              <input
                type="text"
                value={formData.reparacionesAdicionalesTexto}
                onChange={(e) => setFormData({ ...formData, reparacionesAdicionalesTexto: e.target.value })}
                placeholder="ej. INDICADORES DE NIVEL DE PB"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 uppercase font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Comentarios del Mantto o si es una reparación describa aquí:
              </label>
              <textarea
                rows={3}
                value={formData.comentariosMantenimiento}
                onChange={(e) => setFormData({ ...formData, comentariosMantenimiento: e.target.value })}
                placeholder="ej. MANTTO BIMESTRAL LIMPIEZA / LUBRICACIÓN / INSP. SE CAMBIARON 2 HOJAS CHAPAS D/PTA CABINA ELEV IZQ."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 uppercase font-mono"
              />
            </div>
          </div>

          {/* Card 4: Reporte de Falla / Reparación Pendiente */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-4 h-4 text-sky-600" />
              4. Si es una Falla o Reporte de Reparación Pendiente
            </h3>

            {/* Motivos de la atención */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Motivos de la Atención:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'relativoAlEquipo', label: 'Relativo al equipo' },
                  { key: 'influenciaExterna', label: 'Influencia externa' },
                  { key: 'malUso', label: 'Mal uso' },
                  { key: 'reporteReparacionPendiente', label: 'Reporte Reparación Pendiente' },
                ].map((m) => (
                  <label key={m.key} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData.motivosAtencion as any)[m.key]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          motivosAtencion: {
                            ...formData.motivosAtencion,
                            [m.key]: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-sky-600"
                    />
                    <span className="text-[11px] font-semibold">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Causa de la falla */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Causa de la Falla
                </label>
                <select
                  value={formData.causaFalla}
                  onChange={(e) => setFormData({ ...formData, causaFalla: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-sky-500 bg-white"
                >
                  <option value="">-- Seleccionar Causa --</option>
                  <option value="Equipo referenciado">Equipo referenciado</option>
                  <option value="Instalacion funcionando al llegar">Instalación funcionando al llegar</option>
                  <option value="Vandalismo">Vandalismo</option>
                  <option value="Uso inadecuado del equipo">Uso inadecuado del equipo</option>
                  <option value="Influencia externa (corte de energia)">Influencia externa (corte de energía)</option>
                  <option value="Disponibilidad del cliente">Disponibilidad del cliente</option>
                </select>
              </div>

              {/* Componentes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Componente Afectado
                </label>
                <select
                  value={formData.componenteAfectado}
                  onChange={(e) => setFormData({ ...formData, componenteAfectado: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-sky-500 bg-white"
                >
                  <option value="">-- Ninguno / Seleccionar --</option>
                  <option value="General">General</option>
                  <option value="Cuarto maquinas">Cuarto de máquinas</option>
                  <option value="Sist. hidráulico">Sistema hidráulico</option>
                  <option value="Sist. eléctrico">Sistema eléctrico</option>
                  <option value="Mecánico hueco">Sistema mecánico hueco</option>
                  <option value="Eléctrico hueco">Sistema eléctrico hueco</option>
                  <option value="Puerta pasillo">Puerta pasillo</option>
                  <option value="Puerta cabina">Puerta cabina</option>
                  <option value="Operador puerta">Operador de puerta</option>
                  <option value="Sist. seguridad">Sistema de seguridad</option>
                  <option value="Fosa/componentes">Fosa y componentes</option>
                  <option value="Sistema cuñas">Sistema de cuñas</option>
                </select>
              </div>

              {/* Detalles del daño */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detalles del Daño
                </label>
                <select
                  value={formData.detalleDanio}
                  onChange={(e) => setFormData({ ...formData, detalleDanio: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-sky-500 bg-white"
                >
                  <option value="">-- Ninguno / Seleccionar --</option>
                  <option value="Desajustado / Desalineado">Desajustado / Desalineado</option>
                  <option value="Aflojado">Aflojado</option>
                  <option value="Doblado / Roto">Doblado / Roto</option>
                  <option value="Mal contacto">Mal contacto</option>
                  <option value="Fin de vida util">Fin de vida útil</option>
                  <option value="Otra causa">Otra causa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 5: Recepción de Trabajos por el Cliente y Firmas Digitales */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              5. Recepción de Trabajos por el Cliente y Firmas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cliente */}
              <div className="space-y-3 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-black text-slate-800 uppercase flex items-center justify-between">
                  <span>Receptor del Trabajo (Cliente)</span>
                  <span className="text-[10px] text-slate-400">Firma en pantalla</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Cliente / Representante
                  </label>
                  <input
                    type="text"
                    value={formData.clienteNombre}
                    onChange={(e) => setFormData({ ...formData, clienteNombre: e.target.value })}
                    placeholder="ej. Jorge Martinez Flores"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha de Recepción
                  </label>
                  <input
                    type="text"
                    value={formData.clienteFecha}
                    onChange={(e) => setFormData({ ...formData, clienteFecha: e.target.value })}
                    placeholder="DD/MM/AA"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-sky-500 bg-white font-mono"
                  />
                </div>

                <SignaturePad
                  label="Firma del Cliente"
                  initialValue={formData.clienteFirmaUrl}
                  onSave={(dataUrl) => setFormData((prev) => ({ ...prev, clienteFirmaUrl: dataUrl }))}
                />
              </div>

              {/* Técnico */}
              <div className="space-y-3 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-black text-slate-800 uppercase flex items-center justify-between">
                  <span>Servicio / Técnico Responsable</span>
                  <span className="text-[10px] text-slate-400">Firma técnica</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Técnico / Especialista
                  </label>
                  <input
                    type="text"
                    value={formData.tecnicoNombre}
                    onChange={(e) => setFormData({ ...formData, tecnicoNombre: e.target.value })}
                    placeholder="ej. E. Casas"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha del Servicio
                  </label>
                  <input
                    type="text"
                    value={formData.tecnicoFecha}
                    onChange={(e) => setFormData({ ...formData, tecnicoFecha: e.target.value })}
                    placeholder="DD/MM/AA"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-sky-500 bg-white font-mono"
                  />
                </div>

                <SignaturePad
                  label="Firma del Técnico"
                  initialValue={formData.tecnicoFirmaUrl}
                  onSave={(dataUrl) => setFormData((prev) => ({ ...prev, tecnicoFirmaUrl: dataUrl }))}
                />
              </div>
            </div>

            {/* Teléfono de Contacto 24/7 */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contacto Servicio 24/7
              </label>
              <input
                type="text"
                value={formData.telefonoContacto}
                onChange={(e) => setFormData({ ...formData, telefonoContacto: e.target.value })}
                className="w-full sm:w-64 px-3 py-1.5 text-xs font-mono font-bold border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Todos los cambios se guardan localmente y pueden exportarse en formato PDF oficial.
            </div>

            <div className="flex items-center gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSave(false)}
                className="px-5 py-2 text-xs font-bold bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition shadow flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Guardar Registro
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow flex items-center gap-1.5"
              >
                <FileDown className="w-4 h-4" /> Guardar y Exportar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
