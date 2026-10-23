import React from 'react';
import { ActiveModule } from './Sidebar';
import {
  LayoutDashboard,
  PlusCircle,
  FileSpreadsheet,
  Clock,
  Settings,
} from 'lucide-react';

interface BottomNavProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onSelectModule,
}) => {
  const items = [
    {
      id: 'dashboard' as ActiveModule,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'nueva_hoja_servicio' as ActiveModule,
      label: 'Nueva Hoja de Servicio',
      icon: PlusCircle,
    },
    {
      id: 'registros' as ActiveModule,
      label: 'Registros',
      icon: FileSpreadsheet,
    },
    {
      id: 'historial' as ActiveModule,
      label: 'Historial',
      icon: Clock,
    },
    {
      id: 'ajustes' as ActiveModule,
      label: 'Ajustes',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B192C] border-t border-slate-800 md:hidden pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.35)]">
      <div className="grid grid-cols-5 h-16 px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectModule(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all select-none relative ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-slate-300 hover:text-white font-medium opacity-80 hover:opacity-100'
              }`}
            >
              {/* Active top line highlight */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              )}

              {/* White Icon */}
              <div className="relative mt-1">
                <Icon
                  className={`w-5 h-5 text-white transition-transform ${
                    isActive ? 'scale-115 text-sky-300' : ''
                  }`}
                />
              </div>

              {/* Text label */}
              <span
                className={`text-[8.5px] sm:text-[9px] mt-1 tracking-tight text-center leading-none px-0.5 truncate max-w-full ${
                  isActive ? 'text-sky-300 font-black' : 'text-slate-200'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
