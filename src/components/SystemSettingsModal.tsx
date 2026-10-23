import React, { useState, useEffect } from 'react';
import { SupabaseConfig } from '../types/serviceSheet';
import { storageService } from '../services/storageService';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  X,
  Database,
  Trash2,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertTriangle,
  Building,
  Key,
  Globe,
  Save,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface SystemSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  hasSampleData: boolean;
}

export const SystemSettingsModal: React.FC<SystemSettingsModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  hasSampleData,
}) => {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();

  // Supabase state
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() =>
    storageService.getSupabaseConfig()
  );
  const [isSavingSupabase, setIsSavingSupabase] = useState(false);
  const [supabaseMessage, setSupabaseMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Sample data status
  const [isSampleHidden, setIsSampleHidden] = useState<boolean>(() =>
    storageService.isSampleDataHidden()
  );
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSupabaseConfig(storageService.getSupabaseConfig());
      setIsSampleHidden(storageService.isSampleDataHidden());
      setActionFeedback(null);
      setSupabaseMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Clear Sample Data
  const handleClearSampleData = () => {
    storageService.clearSampleData();
    setIsSampleHidden(true);
    onDataChanged();
    setActionFeedback('✓ Datos de muestra eliminados. El navegador no los volverá a mostrar.');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Restore Sample Data
  const handleRestoreSampleData = () => {
    storageService.restoreSampleData();
    setIsSampleHidden(false);
    onDataChanged();
    setActionFeedback('✓ Hoja de ejemplo de la foto restaurada exitosamente.');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Clear ALL records
  const handleClearAllRecords = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar TODOS los registros del historial? Esta acción no se puede deshacer.')) {
      storageService.clearAllRecords();
      setIsSampleHidden(true);
      onDataChanged();
      setActionFeedback('✓ Todos los registros han sido borrados de la memoria local.');
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  // Save Supabase Config
  const handleSaveSupabase = () => {
    setIsSavingSupabase(true);
    storageService.saveSupabaseConfig(supabaseConfig);
    setTimeout(() => {
      setIsSavingSupabase(false);
      setSupabaseMessage({
        text: 'Configuración de Supabase guardada correctamente.',
        success: true,
      });
      setTimeout(() => setSupabaseMessage(null), 4000);
    }, 400);
  };

  // Clear Supabase Records
  const handleClearSupabase = async () => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      setSupabaseMessage({
        text: 'Configura primero la URL y Anon Key de Supabase.',
        success: false,
      });
      return;
    }

    if (window.confirm('¿Deseas enviar la instrucción de borrado a la tabla de Supabase configurada?')) {
      const ok = await storageService.clearAllSupabaseRecords();
      if (ok) {
        setSupabaseMessage({
          text: '✓ Solicitud de borrado enviada a Supabase con éxito.',
          success: true,
        });
      } else {
        setSupabaseMessage({
          text: 'No se pudo completar el borrado en Supabase. Verifica tus credenciales y permisos RLS.',
          success: false,
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto border border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Ajustes del Sistema & Persistencia
              </h3>
              <p className="text-[11px] text-slate-500">
                Invernadero ELZE • Elevadores y Transporte Vertical
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {actionFeedback && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl flex items-center gap-2 font-medium animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* Section 1: Borrado de datos de muestra */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-amber-600" />
                  Control de Datos de Muestra
                </h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Elimina los datos precargados y bloquea su reaparición permanente en este navegador.
                </p>
              </div>

              <div className="text-right">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSampleHidden ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-800'}`}>
                  {isSampleHidden ? 'Muestra Oculta' : 'Muestra Activa'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleClearSampleData}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Borrar Datos de Muestra del Todo el Sistema
              </button>

              {isSampleHidden && (
                <button
                  type="button"
                  onClick={handleRestoreSampleData}
                  className="px-3 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 font-semibold rounded-lg transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  Restaurar Ejemplo de Foto
                </button>
              )}

              <button
                type="button"
                onClick={handleClearAllRecords}
                className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold rounded-lg transition ml-auto"
                title="Vaciar todo el historial"
              >
                Vaciar Todo a 0
              </button>
            </div>
          </div>

          {/* Section 2: Conexión con Supabase */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-sky-600" />
                  Sincronización y Borrado en Supabase
                </h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Configura tus credenciales de Supabase para respaldar y borrar registros en la nube cuando se configure.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[11px] font-bold text-slate-600">Activar</span>
                <input
                  type="checkbox"
                  checked={supabaseConfig.habilitado}
                  onChange={(e) =>
                    setSupabaseConfig({
                      ...supabaseConfig,
                      habilitado: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-sky-600 rounded"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-sky-600" /> URL del Proyecto Supabase
                </label>
                <input
                  type="text"
                  placeholder="https://xyzabcdef.supabase.co"
                  value={supabaseConfig.url}
                  onChange={(e) => setSupabaseConfig({ ...supabaseConfig, url: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Key className="w-3 h-3 text-sky-600" /> Supabase Anon Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOi..."
                  value={supabaseConfig.anonKey}
                  onChange={(e) => setSupabaseConfig({ ...supabaseConfig, anonKey: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-sky-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nombre de la Tabla
                </label>
                <input
                  type="text"
                  placeholder="hojas_servicio"
                  value={supabaseConfig.tableName}
                  onChange={(e) => setSupabaseConfig({ ...supabaseConfig, tableName: e.target.value })}
                  className="w-full sm:w-64 px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-sky-500"
                />
              </div>
            </div>

            {supabaseMessage && (
              <div className={`p-2.5 rounded-lg text-[11px] font-semibold flex items-center gap-2 ${supabaseMessage.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                {supabaseMessage.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                <span>{supabaseMessage.text}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveSupabase}
                disabled={isSavingSupabase}
                className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                {isSavingSupabase ? 'Guardando...' : 'Guardar Configuración'}
              </button>

              <button
                type="button"
                onClick={handleClearSupabase}
                className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-rose-700 border border-slate-200 hover:border-rose-300 font-bold rounded-lg transition flex items-center gap-1.5"
                title="Borrar registros en Supabase"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                Borrar Registros en Supabase
              </button>
            </div>
          </div>

          {/* Section 3: PWA Info */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-sky-600" />
                  Aplicación Instalable (PWA)
                </h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Nombre registrado: <strong>Invernadero ELZE</strong>
                </p>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isInstalled ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>
                {isInstalled ? '✓ Instalada' : 'Disponible para Instalar'}
              </span>
            </div>

            {!isInstalled && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (isInstallable) install();
                    else alert('En iOS Safari: Toca el botón Compartir y selecciona "Agregar a inicio". En Chrome/Edge: Haz clic en el botón de instalación en la barra de direcciones.');
                  }}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Instalar en este Dispositivo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg text-xs hover:bg-slate-900 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
