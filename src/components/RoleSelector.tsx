import React from 'react';
import { UserRole } from '../types/serviceSheet';
import { ShieldCheck, Wrench, Eye, Building2 } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const roles: { id: UserRole; name: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'admin',
      name: 'Admin',
      icon: ShieldCheck,
    },
    {
      id: 'tecnico',
      name: 'Técnico',
      icon: Wrench,
    },
    {
      id: 'supervisor',
      name: 'Supervisor',
      icon: Eye,
    },
    {
      id: 'cliente',
      name: 'Cliente',
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Logo del sistema sin encapsular (sin marco, sin tarjeta envolvente, nítido y libre) */}
      <div className="flex flex-col items-center justify-center mb-10 select-none">
        <img
          src="/icon.svg"
          alt="ELZE Elevadores"
          className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
        />
        <div className="mt-3 text-2xl sm:text-3xl font-black tracking-widest text-[#0B192C]">
          ELZE
        </div>
        <div className="text-[11px] sm:text-xs font-bold tracking-[0.3em] text-sky-600 uppercase">
          ELEVADORES
        </div>
      </div>

      {/* Cuadrícula: 2 Columnas Móvil / 4 Columnas Escritorio */}
      <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              onClick={() => onSelectRole(r.id)}
              className="group flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-500 hover:-translate-y-1 transition-all duration-200 cursor-pointer text-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-50 group-hover:bg-sky-600 flex items-center justify-center text-sky-700 group-hover:text-white transition-colors duration-200 mb-3 shadow-inner">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110 duration-200" />
              </div>
              <span className="text-base sm:text-lg font-black text-slate-800 group-hover:text-sky-700 tracking-tight transition-colors">
                {r.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
