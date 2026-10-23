import React from 'react';
import { ServiceSheet } from '../types/serviceSheet';
import {
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MainDashboardProps {
  sheets: ServiceSheet[];
  onNavigate: (module: 'nueva_hoja_servicio' | 'registros' | 'historial') => void;
  onViewSheet: (sheet: ServiceSheet) => void;
  onClearSampleData: () => void;
  hasSampleData: boolean;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  sheets,
  onNavigate,
  onViewSheet,
  onClearSampleData,
  hasSampleData,
}) => {
  const totalSheets = sheets.length;
  const operatingCount = sheets.filter((s) => s.equipoFuncionando).length;
  const repairNeededCount = sheets.filter((s) => s.necesarioReparacion).length;
  const riskCount = sheets.filter((s) => s.riesgoFueraServicio).length;

  const recentSheets = sheets.slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* 1. Welcome Banner & Quick Action Header */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0F2C59] text-white rounded-2xl p-4 sm:p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold tracking-widest bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full uppercase">
                Panel Central • Admin
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Dashboard de Elevadores
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Sistema integral de transporte vertical, registro de hojas de servicio técnico y control de mantenimiento.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('nueva_hoja_servicio')}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Nueva Hoja de Servicio</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('registros')}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition border border-white/20 flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-sky-300 shrink-0" />
              <span>Ver Registros</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics KPIs - Grid responsive 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Hojas */}
        <div
          onClick={() => onNavigate('registros')}
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition cursor-pointer flex flex-col justify-between min-h-[115px] sm:min-h-[130px]"
        >
          <div className="flex items-start justify-between gap-1 text-slate-500 text-[11px] sm:text-xs font-bold">
            <span className="leading-tight">Hojas Registradas</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {totalSheets}
            </div>
            <div className="text-[10px] sm:text-[11px] text-sky-600 font-semibold flex items-center gap-1 mt-0.5">
              Ver registros <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Equipos Operando */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[115px] sm:min-h-[130px]">
          <div className="flex items-start justify-between gap-1 text-emerald-700 text-[11px] sm:text-xs font-bold">
            <span className="leading-tight">Equipos Operando</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              {operatingCount}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 truncate">
              {totalSheets > 0 ? `${Math.round((operatingCount / totalSheets) * 100)}% en servicio` : '100%'}
            </div>
          </div>
        </div>

        {/* Requieren Reparación */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[115px] sm:min-h-[130px]">
          <div className="flex items-start justify-between gap-1 text-amber-700 text-[11px] sm:text-xs font-bold">
            <span className="leading-tight">Requieren Piezas</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              {repairNeededCount}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 truncate">
              Refacciones pendientes
            </div>
          </div>
        </div>

        {/* Riesgo Crítico */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[115px] sm:min-h-[130px]">
          <div className="flex items-start justify-between gap-1 text-rose-700 text-[11px] sm:text-xs font-bold">
            <span className="leading-tight">Riesgo Crítico</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">
              {riskCount}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 truncate">
              Atención urgente
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Recent Sheets + Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left 2 Cols: Recent Service Sheets */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                Hojas de Servicio Recientes
              </h2>
              <p className="text-[11px] text-slate-500">
                Últimos mantenimientos registrados en el sistema.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('registros')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 transition flex items-center gap-1 shrink-0"
            >
              Ver todos ({sheets.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentSheets.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs text-slate-400">No hay hojas registradas actualmente.</p>
                <button
                  type="button"
                  onClick={() => onNavigate('nueva_hoja_servicio')}
                  className="px-3.5 py-1.5 text-xs font-bold bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition"
                >
                  Crear Primera Hoja de Servicio
                </button>
              </div>
            ) : (
              recentSheets.map((sheet) => (
                <div
                  key={sheet.id}
                  className="py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 p-2 rounded-xl transition"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-black text-[11px] text-sky-950 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        O.S. {sheet.ordenServicio}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
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
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => onViewSheet(sheet)}
                      className="px-3 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition border border-sky-200"
                    >
                      Ver Hoja
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Module Navigation Shortcuts */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-2.5">
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
                    Formulario oficial con firmas digitales
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
                    Gestión, edición y descarga PDF
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
                    Bitácora cronológica y auditoría
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
              </button>
            </div>
          </div>

          {/* Sample Data Warning & Quick Clear */}
          {hasSampleData && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Datos de Muestra Activos</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-tight">
                Puedes borrar los registros de prueba precargados permanentemente.
              </p>
              <button
                type="button"
                onClick={onClearSampleData}
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
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
