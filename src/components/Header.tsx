import React, { useState } from 'react';
import { UserRole } from '../types/serviceSheet';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  LogOut,
  Shield,
  Wrench,
  Eye,
  Building,
  Menu,
  Database,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  activeRole: UserRole;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenSampleDataModal: () => void;
  onToggleSidebar?: () => void;
  hasSampleData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onLogout,
  onOpenSettings,
  onOpenSampleDataModal,
  onToggleSidebar,
  hasSampleData,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
    admin: { label: 'Admin', icon: Shield },
    tecnico: { label: 'Técnico', icon: Wrench },
    supervisor: { label: 'Supervisor', icon: Eye },
    cliente: { label: 'Cliente', icon: Building },
  };

  const currentRoleInfo = roleLabels[activeRole] || roleLabels.admin;
  const RoleIcon = currentRoleInfo.icon;

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // In case neither fired yet or already in browser
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0B192C] text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left: Mobile Menu Trigger + ELZE Logo */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 md:hidden transition"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2.5 select-none">
              <img
                src="/icon.svg"
                alt="ELZE"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              />
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base sm:text-lg tracking-wider text-white">
                    ELZE
                  </span>
                  <span className="text-[10px] bg-sky-600 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                    Elevadores
                  </span>
                </div>
                <div className="text-[9px] text-slate-400 font-medium hidden sm:block">
                  Invernadero ELZE • Transporte Vertical
                </div>
              </div>
            </div>
          </div>

          {/* Right: Rol Activo + Instalar + Configuración + Salir */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Indicador de Rol Activo */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold text-sky-300">
              <RoleIcon className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px] uppercase tracking-wide">
                Rol: {currentRoleInfo.label}
              </span>
            </div>

            {/* Quick Sample Data Clean trigger if active */}
            {hasSampleData && (
              <button
                type="button"
                onClick={onOpenSampleDataModal}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition"
                title="Borrar datos de muestra del navegador"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Borrar Muestra</span>
              </button>
            )}

            {/* Botón de Instalación Rápida PWA */}
            {!isInstalled && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition duration-150 animate-pulse-once"
                title="Instalar Invernadero ELZE en este dispositivo"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Instalar</span>
              </button>
            )}

            {/* Configuración / Supabase */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 text-xs font-semibold flex items-center gap-1 transition"
              title="Ajustes de sistema y Supabase"
            >
              <Database className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Ajustes</span>
            </button>

            {/* Botón de Cierre de Sesión */}
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition shadow-xs"
              title="Cambiar de rol o cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
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
