import React from 'react';
import { ActiveModule } from './Sidebar';
import {
  PlusCircle,
  Clock,
  BarChart3,
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
      id: 'nueva_hoja' as ActiveModule,
      label: 'Nueva Hoja',
      icon: PlusCircle,
    },
    {
      id: 'historial' as ActiveModule,
      label: 'Historial',
      icon: Clock,
    },
    {
      id: 'metricas' as ActiveModule,
      label: 'Métricas',
      icon: BarChart3,
    },
    {
      id: 'ajustes' as ActiveModule,
      label: 'Ajustes',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-4 h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectModule(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-colors select-none ${
                isActive ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-sky-600' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[70px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
