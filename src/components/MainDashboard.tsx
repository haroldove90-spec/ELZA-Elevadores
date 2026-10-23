import React from 'react';
import { ServiceSheet } from '../types/serviceSheet';
import {
  LayoutDashboard,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles,
  PhoneCall,
  Clock,
  Wrench,
  Gauge,
  ArrowUp,
  Square,
  Building,
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
    <div className="space-y-5 max-w-7xl mx-auto pb-24 md:pb-12 animate-fade-in">
      {/* 1. Header del Dashboard / Panel de Control */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-sky-700 font-mono">
              PANEL DE CONTROL ACTIVO • ROL ADMIN
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-sky-600 shrink-0" />
            Dashboard General de Elevadores
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-0.5">
            Monitoreo en tiempo real de transporte vertical, parque de elevadores y gestión de hojas de servicio técnico ELZE.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('nueva_hoja_servicio')}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Nueva Hoja de Servicio</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('registros')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition border border-slate-200 flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Ver Registros</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Hojas Registradas */}
        <div
          onClick={() => onNavigate('registros')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-1 text-slate-500 text-xs font-bold">
            <span>Hojas Registradas</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {totalSheets}
            </div>
            <div className="text-[11px] text-sky-600 font-bold flex items-center gap-1 mt-1">
              Abrir registros <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Equipos Operando */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1 text-emerald-700 text-xs font-bold">
            <span>Equipos Operando</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              {operatingCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
              {totalSheets > 0 ? `${Math.round((operatingCount / totalSheets) * 100)}% operatividad normal` : '100%'}
            </div>
          </div>
        </div>

        {/* Requieren Reparación */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1 text-amber-700 text-xs font-bold">
            <span>Requieren Reparación</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              {repairNeededCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
              Piezas / ajuste técnico
            </div>
          </div>
        </div>

        {/* Riesgo Crítico */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1 text-rose-700 text-xs font-bold">
            <span>Riesgo Fuera Servicio</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">
              {riskCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
              Atención inmediata de seguridad
            </div>
          </div>
        </div>
      </div>

      {/* 3. Panel de Monitoreo de Elevadores en Vivo (Elevator Fleet Status) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-sky-600" />
              Estado en Vivo del Parque de Elevadores (ELZE)
            </h2>
            <p className="text-xs text-slate-500">
              Telemetría y condición operativa por instalación y equipo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
              ACTUALIZADO: {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Elevator Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Elevador IZQ */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-xs text-sky-950 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                ELEVADOR IZQ
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Operando
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-800">
                San Vicente Living
              </div>
              <div className="text-[11px] text-slate-500">
                Calle Justo Sierra • Torre Principal
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block font-semibold">NIVEL / PISO</span>
                <span className="font-mono font-black text-slate-900 flex items-center gap-1 text-xs">
                  Piso 4 <ArrowUp className="w-3 h-3 text-sky-600" />
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">PUERTAS</span>
                <span className="font-semibold text-emerald-700">Cerradas / Ok</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
              Última intervención: <strong>14/01/26 (Téc. E. Casas)</strong>
            </div>
          </div>

          {/* Elevador DER */}
          <div className="border border-amber-200 rounded-xl p-3.5 bg-amber-50/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-xs text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                ELEVADOR DER
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Requiere Piezas
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-800">
                San Vicente Living
              </div>
              <div className="text-[11px] text-slate-500">
                Calle Justo Sierra • Torre Principal
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-amber-200">
              <div>
                <span className="text-slate-400 block font-semibold">NIVEL / PISO</span>
                <span className="font-mono font-black text-slate-900 flex items-center gap-1 text-xs">
                  Planta Baja <Square className="w-2.5 h-2.5 text-amber-600" />
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">OBSERVACIÓN</span>
                <span className="font-semibold text-amber-800">Indicadores PB</span>
              </div>
            </div>

            <div className="text-[10px] text-amber-900 font-medium pt-1 border-t border-amber-200">
              Nota: <strong>Se cambiaron 2 hojas chapas d/pta cabina</strong>
            </div>
          </div>

          {/* Montacargas Justo Sierra */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-xs text-sky-950 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                MONTACARGAS / CARGA
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Operando
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-800">
                Edificio Justo Sierra
              </div>
              <div className="text-[11px] text-slate-500">
                Acceso Carga y Sótano
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-2 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block font-semibold">NIVEL / PISO</span>
                <span className="font-mono font-black text-slate-900 text-xs">
                  Sótano 1 (S1)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">CAPACIDAD</span>
                <span className="font-semibold text-slate-700">1,250 kg</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
              Protocolo de lubricación y fosa al 100%
            </div>
          </div>
        </div>
      </div>

      {/* 4. Grid: Recent Service Sheets & System Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left 2 Cols: Recent Service Sheets */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                Hojas de Servicio Registradas
              </h2>
              <p className="text-[11px] text-slate-500">
                Historial de mantenimientos guardados en la base de datos.
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

        {/* Right 1 Col: Quick Modules & Contact */}
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
                    Bitácora cronológica y auditoría técnica
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition" />
              </button>
            </div>
          </div>

          {/* Contacto 24/7 Hotline */}
          <div className="bg-[#0B192C] text-white rounded-2xl p-4 space-y-1.5 shadow-sm">
            <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Central de Emergencias 24/7
            </div>
            <div className="text-lg font-black font-mono text-white tracking-wider">
              5540930972
            </div>
            <p className="text-[10px] text-slate-300">
              Atención inmediata de técnicos certificados ELZE Elevadores.
            </p>
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
