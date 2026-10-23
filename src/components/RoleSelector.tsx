import React from 'react';
import { UserRole } from '../types/serviceSheet';
import { ShieldCheck } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Logo del sistema sin encapsular */}
      <div className="flex flex-col items-center justify-center mb-8 select-none">
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

      {/* Tarjeta única de Rol Admin */}
      <div className="w-full max-w-sm">
        <button
          type="button"
          onClick={() => onSelectRole('admin')}
          className="w-full group flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-500 hover:-translate-y-1 transition-all duration-200 cursor-pointer text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-sky-50 group-hover:bg-sky-600 flex items-center justify-center text-sky-700 group-hover:text-white transition-colors duration-200 mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8 transition-transform group-hover:scale-110 duration-200" />
          </div>
          <span className="text-xl font-black text-slate-800 group-hover:text-sky-700 tracking-tight transition-colors">
            Acceso Administrador (Admin)
          </span>
          <span className="text-xs text-slate-400 mt-1">
            Control integral del sistema
          </span>
        </button>
      </div>
    </div>
  );
};
