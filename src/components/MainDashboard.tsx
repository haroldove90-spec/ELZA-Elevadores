import React from 'react';
import { ServiceSheet, UserRole } from '../types/serviceSheet';
import {
  LayoutDashboard,
  PlusCircle,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Wrench,
  Building2,
  ArrowRight,
  TrendingUp,
  FileDown,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MainDashboardProps {
  sheets: ServiceSheet[];
  activeRole: UserRole;
  onNavigate: (module: 'nueva_hoja_servicio' | 'registros' | 'historial') => void;
  onViewSheet: (sheet: ServiceSheet) => void;
  onClearSampleData: () => void;
  hasSampleData: boolean;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  sheets,
  activeRole,
  onNavigate,
  onViewSheet,
  onClearSampleData,
  hasSampleData,
}) => {
  const totalSheets = sheets.length;
  const operatingCount = sheets.filter((s) => s.equipoFuncionando).length;
  const repairNeededCount = sheets.filter((s) => s.necesarioReparacion).length;
  const riskCount = sheets.filter((s) => s.riesgoFueraServicio).length;

  const recentSheets = sheets.slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* 1. Welcome Banner & Quick Action Header */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0F2C59] text-white rounded-2xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <img src="/icon.svg" alt="" className="w-64 h-64" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2.5 py-0.5 rounded-full uppercase">
                Panel Central ELZE
              </span>
              <span className="text-xs text-slate-300">
                Rol: <strong className="text-white uppercase">{activeRole}</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Dashboard de Control de Elevadores
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Sistema integral de transporte vertical, registro técnico de hojas de servicio y trazabilidad de mantenimientos.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('nueva_hoja_servicio')}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Nueva Hoja de Servicio
            </button>

            <button
              type="button"
              onClick={() => onNavigate('registros')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition border border-white/20 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-sky-300" />
              Ver Registros
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Hojas */}
        <div
          onClick={() => onNavigate('registros')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Hojas Registradas</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {totalSheets}
            </div>
            <div className="text-[11px] text-sky-600 font-semibold flex items-center gap-1 mt-1">
              Ver registros guardados <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Elevadores Operando */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
            <span>Equipos Operando</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              {operatingCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              {totalSheets > 0 ? `${Math.round((operatingCount / totalSheets) * 100)}% en servicio normal` : '100%'}
            </div>
          </div>
        </div>

        {/* Requieren Reparación */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold">
            <span>Requieren Piezas / Reparación</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              {repairNeededCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Refacciones pendientes
            </div>
          </div>
        </div>

        {/* Riesgo Fuera de Servicio */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-700 text-xs font-bold">
            <span>Riesgo Crítico</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">
              {riskCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Requiere atención urgente
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Active Interventions & Recent Service Sheets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Service Sheets */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                Hojas de Servicio Recientes
              </h2>
              <p className="text-xs text-slate-500">
                Últimos mantenimientos e intervenciones técnicas registradas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('registros')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 transition flex items-center gap-1"
            >
              Ver todos ({sheets.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentSheets.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <p className="text-xs text-slate-400">No hay hojas registradas actualmente.</p>
                <button
                  type="button"
                  onClick={() => onNavigate('nueva_hoja_servicio')}
                  className="px-3.5 py-1.5 text-xs font-bold bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition"
                >
                  Crear Primera Hoja
                </button>
              </div>
            ) : (
              recentSheets.map((sheet) => (
                <div
                  key={sheet.id}
                  className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-xs text-sky-950 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        O.S. {sheet.ordenServicio}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {sheet.equipos || 'IZQ / DER'}
                      </span>
                      {sheet.equipoFuncionando ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                          Operando
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.2 rounded-full border border-rose-200">
                          Detenido
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {sheet.nombreCliente} • <span className="text-slate-500 font-normal">{sheet.direccionCliente}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Téc: {sheet.tecnicoNombre || 'E. Casas'} • Periodo: {sheet.periodoMeses?.join(', ') || 'N/A'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => onViewSheet(sheet)}
                      className="px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition border border-sky-200"
                    >
                      Ver Hoja
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Access & Status Overview */}
        <div className="space-y-4">
          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-600" />
              Módulos del Sistema
            </h2>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('nueva_hoja_servicio')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-black text-slate-800 group-hover:text-sky-700">
                    Nueva Hoja de Servicio
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Formulario oficial de inspección con firmas
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('registros')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-black text-slate-800 group-hover:text-sky-700">
                    Módulo Registros
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Base de datos, edición y exportar PDF
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('historial')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-black text-slate-800 group-hover:text-sky-700">
                    Módulo Historial
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Línea de tiempo y auditoría de mantenimientos
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
              </button>
            </div>
          </div>

          {/* Sample Data Warning & Quick Clear */}
          {hasSampleData && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Datos de Muestra Activos</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-tight">
                El sistema incluye la hoja de ejemplo de la foto. Puedes borrarla del todo el sistema con un solo clic.
              </p>
              <button
                type="button"
                onClick={onClearSampleData}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Borrar Datos de Muestra
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
