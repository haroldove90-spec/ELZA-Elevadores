import React from 'react';
import { ServiceSheet } from '../types/serviceSheet';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ShieldAlert,
  ArrowUpRight,
  Building,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MetricsDashboardProps {
  sheets: ServiceSheet[];
  onViewSheet: (sheet: ServiceSheet) => void;
  onCreateNew: () => void;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  sheets,
  onViewSheet,
  onCreateNew,
}) => {
  const totalSheets = sheets.length;
  const operatingCount = sheets.filter((s) => s.equipoFuncionando).length;
  const repairNeededCount = sheets.filter((s) => s.necesarioReparacion).length;
  const riskCriticalCount = sheets.filter((s) => s.riesgoFueraServicio).length;

  const preventiveCount = sheets.filter((s) => s.tiposTrabajo?.includes('mantto_preventivo')).length;
  const repairsCount = sheets.filter((s) => s.tiposTrabajo?.includes('reparacion')).length;
  const failureCount = sheets.filter((s) => s.tiposTrabajo?.includes('falla')).length;

  const sheetsWithRepairs = sheets.filter((s) => s.necesarioReparacion || s.reparacionesAdicionalesTexto);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-20">
      {/* Title */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            Métricas y Estado de Transporte Vertical
          </h2>
          <p className="text-xs text-slate-500">
            Resumen en tiempo real del parque de elevadores y cumplimiento de hojas de servicio.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition"
        >
          <Wrench className="w-4 h-4" />
          Nueva Hoja
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Hojas */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Hojas de Servicio</span>
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {totalSheets}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">
              Registros en base de datos
            </div>
          </div>
        </div>

        {/* Card 2: Operando con Normalidad */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
            <span>Equipos Operando</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              {operatingCount}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
              {totalSheets > 0 ? `${Math.round((operatingCount / totalSheets) * 100)}% de operatividad` : '100%'}
            </div>
          </div>
        </div>

        {/* Card 3: Requiere Reparación */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold">
            <span>Requieren Reparación</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              {repairNeededCount}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">
              Refacciones o calibraciones
            </div>
          </div>
        </div>

        {/* Card 4: Riesgo Fuera de Servicio */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-700 text-xs font-bold">
            <span>Riesgo Crítico</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">
              {riskCriticalCount}
            </div>
            <div className="text-[11px] text-rose-700 font-medium mt-0.5">
              Atención inmediata de seguridad
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Tipos de Trabajo & Reparaciones Pendientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tipos de Trabajo */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Wrench className="w-4 h-4 text-sky-600" />
            Distribución por Tipo de Trabajo
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Mantenimiento Preventivo</span>
                <span className="font-mono text-sky-900">{preventiveCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-sky-600 rounded-full"
                  style={{ width: `${totalSheets ? (preventiveCount / totalSheets) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Reparaciones / Ajustes</span>
                <span className="font-mono text-amber-700">{repairsCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${totalSheets ? (repairsCount / totalSheets) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Atención de Fallas</span>
                <span className="font-mono text-rose-700">{failureCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${totalSheets ? (failureCount / totalSheets) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
            ELZE ELEVADORES realiza protocolos de inspección bajo normas oficiales de seguridad de transporte vertical.
          </div>
        </div>

        {/* Elevadores con requerimientos adicionales */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Equipos con Reparaciones Solicitadas
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
              {sheetsWithRepairs.length}
            </span>
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {sheetsWithRepairs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No hay equipos con reparaciones adicionales pendientes.
              </div>
            ) : (
              sheetsWithRepairs.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onViewSheet(s)}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-sky-400 bg-slate-50 hover:bg-white cursor-pointer transition flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black font-mono text-sky-950">
                        O.S. {s.ordenServicio}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.2 rounded">
                        {s.equipos}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {s.nombreCliente}
                    </div>
                    <div className="text-[11px] text-amber-800 font-mono font-medium truncate">
                      {s.reparacionesAdicionalesTexto || s.comentariosMantenimiento}
                    </div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
