import React from 'react';
import { UserRole } from '../types/serviceSheet';
import {
  LayoutDashboard,
  PlusCircle,
  FileSpreadsheet,
  Clock,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';

export type ActiveModule = 'dashboard' | 'nueva_hoja_servicio' | 'registros' | 'historial' | 'ajustes';

interface SidebarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  activeRole: UserRole;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  hasSampleData: boolean;
  onClearSampleData: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  activeRole,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  hasSampleData,
  onClearSampleData,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveModule,
      label: 'Dashboard',
      badge: 'Principal',
      icon: LayoutDashboard,
    },
    {
      id: 'nueva_hoja_servicio' as ActiveModule,
      label: 'Nueva hoja de servicio',
      badge: 'Oficial',
      icon: PlusCircle,
    },
    {
      id: 'registros' as ActiveModule,
      label: 'Registros',
      badge: 'Hojas',
      icon: FileSpreadsheet,
    },
    {
      id: 'historial' as ActiveModule,
      label: 'Historial',
      badge: 'Auditoría',
      icon: Clock,
    },
    {
      id: 'ajustes' as ActiveModule,
      label: 'Configuración',
      badge: 'Sistema',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 transition-all duration-300 flex flex-col justify-between select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isOpenMobile ? 'left-0' : '-left-full md:left-0'}`}
      >
        {/* Top: Menu Items */}
        <div className="p-3 space-y-2 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Módulos del Sistema
            </div>
          )}

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectModule(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 shadow-xs border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  title={item.label}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between text-left">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${isActive ? 'bg-sky-200/60 text-sky-800' : 'bg-slate-100 text-slate-500'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Clear Sample Data banner in sidebar if active */}
          {!isCollapsed && hasSampleData && (
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Trash2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Datos de Muestra</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-tight">
                Hay datos de prueba activos. Puedes borrarlos permanentemente.
              </p>
              <button
                type="button"
                onClick={onClearSampleData}
                className="w-full text-center py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] transition"
              >
                Borrar Ahora
              </button>
            </div>
          )}
        </div>

        {/* Bottom: Collapse toggle & Session info */}
        <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-50/50">
          <div className={`flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
              {activeRole.slice(0, 2)}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 truncate capitalize">
                  {activeRole}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Conectado
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex w-full items-center justify-center py-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
