import React, { useState } from 'react';
import { ActiveModule } from './Sidebar';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  ShieldCheck,
  Database,
  Trash2,
  LayoutDashboard,
  PlusCircle,
  FileSpreadsheet,
  Clock,
} from 'lucide-react';

interface HeaderProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  onOpenSettings: () => void;
  onOpenSampleDataModal: () => void;
  hasSampleData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  onOpenSettings,
  onOpenSampleDataModal,
  hasSampleData,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else {
      setShowIOSModal(true);
    }
  };

  const navLinks = [
    { id: 'dashboard' as ActiveModule, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'nueva_hoja_servicio' as ActiveModule, label: 'Nueva hoja de servicio', icon: PlusCircle },
    { id: 'registros' as ActiveModule, label: 'Registros', icon: FileSpreadsheet },
    { id: 'historial' as ActiveModule, label: 'Historial', icon: Clock },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0B192C] text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Brand Identity (Clicking logo goes directly to Dashboard) */}
          <div
            onClick={() => onSelectModule('dashboard')}
            className="flex items-center gap-2 sm:gap-2.5 min-w-0 cursor-pointer select-none group"
            title="Ir al Dashboard Principal"
          >
            <img
              src="/icon.svg"
              alt="ELZE"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="leading-tight min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-wider text-white">
                  ELZE
                </span>
                <span className="text-[9px] sm:text-[10px] bg-sky-600 text-white font-bold px-1.5 py-0.2 rounded uppercase shrink-0">
                  Elevadores
                </span>
              </div>
              <div className="text-[9px] text-slate-400 font-medium hidden sm:block truncate">
                Invernadero ELZE • Transporte Vertical
              </div>
            </div>
          </div>

          {/* Center: Quick Navigation for Tablet & Desktop */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeModule === link.id;

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onSelectModule(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Rol Admin + Install + Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Rol Admin Badge */}
            <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 px-2 sm:px-2.5 py-1 rounded-lg text-sky-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
                Admin
              </span>
            </div>

            {/* Quick Sample Data Clean trigger if active */}
            {hasSampleData && (
              <button
                type="button"
                onClick={onOpenSampleDataModal}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition"
                title="Borrar datos de muestra del navegador"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Borrar Muestra</span>
              </button>
            )}

            {/* Quick PWA Install button */}
            {!isInstalled && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition"
                title="Instalar Invernadero ELZE en este dispositivo"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Instalar</span>
              </button>
            )}

            {/* Settings & Supabase */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-750 text-xs font-semibold flex items-center gap-1 transition"
              title="Ajustes de sistema y Supabase"
            >
              <Database className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="hidden sm:inline">Ajustes</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal Guía iOS para PWA */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-center text-slate-900">
              Instalar Invernadero ELZE
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed text-center">
              Para agregar la aplicación a la pantalla de inicio de tu iPhone, iPad o computadora:
            </p>
            <ol className="mt-3 text-xs text-slate-700 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <li className="flex items-start gap-2">
                <span className="font-bold text-sky-600">1.</span>
                <span>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-sky-600">2.</span>
                <span>Desliza y selecciona <strong>Agregar a inicio</strong> (o Instalar en Chrome/Edge).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-sky-600">3.</span>
                <span>¡Listo! Se abrirá como aplicación nativa rápida y offline.</span>
              </li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full rounded-xl bg-sky-700 py-2.5 text-xs font-bold text-white hover:bg-sky-800 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
