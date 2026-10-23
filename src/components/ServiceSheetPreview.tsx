import React from 'react';
import { ServiceSheet, MonthKey } from '../types/serviceSheet';
import { Check, QrCode, PhoneCall } from 'lucide-react';

interface ServiceSheetPreviewProps {
  sheet: ServiceSheet;
  id?: string;
}

const MONTHS: MonthKey[] = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

export const ServiceSheetPreview: React.FC<ServiceSheetPreviewProps> = ({
  sheet,
  id = 'service-sheet-document',
}) => {
  const isMonthActive = (m: MonthKey) => sheet.periodoMeses?.includes(m);
  const hasWorkType = (t: string) => sheet.tiposTrabajo?.includes(t as any);

  // Group checklist by section
  const sections = [
    'Cliente / Cabina',
    'Cuarto de Maquinas / Tablero de Control',
    'Cubo',
    'Fosa',
  ] as const;

  return (
    <div
      id={id}
      className="bg-white text-slate-900 mx-auto p-4 sm:p-6 rounded-lg shadow-md border border-slate-300 font-sans max-w-[850px] print:shadow-none print:border-none print:p-2 print:m-0 print:max-w-none text-[11px] leading-tight select-text"
      style={{ minHeight: '1050px' }}
    >
      {/* 1. Header with Logos and Titles */}
      <div className="flex items-center justify-between border-b-2 border-sky-600 pb-2 mb-2">
        <div>
          <div className="text-[15px] font-black tracking-tight text-sky-800 uppercase">
            Hoja de Servicio
          </div>
          <div className="text-xl font-black text-slate-900 tracking-wider">
            ELZE ELEVADORES
          </div>
        </div>

        <div className="text-center hidden sm:block">
          <span className="text-xs font-bold text-sky-700 tracking-wide border-b border-sky-200 pb-0.5">
            Especialistas en Transporte Vertical
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* QR Code graphic */}
          <div className="border border-slate-300 p-1 rounded bg-slate-50 flex items-center justify-center">
            <QrCode className="w-8 h-8 text-slate-800" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-black tracking-widest text-sky-700 leading-none">
              ELZE
            </div>
            <div className="text-[9px] font-bold text-slate-500 uppercase">
              Elevadores
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Info Grid: Orden, Equipos, Tipo de Trabajo, Periodo */}
      <div className="grid grid-cols-12 gap-1 mb-2 border border-sky-500 bg-sky-50/40 rounded overflow-hidden">
        {/* Orden de Servicio */}
        <div className="col-span-12 sm:col-span-3 p-1.5 border-b sm:border-b-0 sm:border-r border-sky-300">
          <div className="text-[9px] font-bold uppercase text-sky-900 text-center bg-sky-200/80 py-0.5 rounded-sm">
            Orden de Servicio
          </div>
          <div className="text-sm font-black text-sky-950 text-center tracking-wider py-1 font-mono">
            {sheet.ordenServicio || '---'}
          </div>
        </div>

        {/* Equipos */}
        <div className="col-span-12 sm:col-span-3 p-1.5 border-b sm:border-b-0 sm:border-r border-sky-300">
          <div className="text-[9px] font-bold uppercase text-sky-900 text-center bg-sky-200/80 py-0.5 rounded-sm">
            Equipos
          </div>
          <div className="text-sm font-black text-sky-950 text-center tracking-wider py-1 font-mono">
            {sheet.equipos || 'IZQ / DER'}
          </div>
        </div>

        {/* Tipo de Trabajo */}
        <div className="col-span-12 sm:col-span-3 p-1.5 border-b sm:border-b-0 sm:border-r border-sky-300">
          <div className="text-[9px] font-bold uppercase text-sky-900 text-center bg-sky-200/80 py-0.5 rounded-sm mb-1">
            Tipo de Trabajo
          </div>
          <div className="space-y-0.5 text-[10px]">
            <label className="flex items-center gap-1.5 cursor-default">
              <span className={`w-3.5 h-3.5 border rounded flex items-center justify-center font-bold text-[10px] ${hasWorkType('mantto_preventivo') ? 'bg-sky-700 text-white border-sky-700' : 'border-slate-400 bg-white'}`}>
                {hasWorkType('mantto_preventivo') ? '✓' : ''}
              </span>
              <span className="font-semibold text-slate-800">MANTTO PREVENTIVO</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 cursor-default">
                <span className={`w-3.5 h-3.5 border rounded flex items-center justify-center font-bold text-[10px] ${hasWorkType('falla') ? 'bg-sky-700 text-white border-sky-700' : 'border-slate-400 bg-white'}`}>
                  {hasWorkType('falla') ? '✓' : ''}
                </span>
                <span>FALLA</span>
              </label>
              <label className="flex items-center gap-1 cursor-default">
                <span className={`w-3.5 h-3.5 border rounded flex items-center justify-center font-bold text-[10px] ${hasWorkType('reparacion') ? 'bg-sky-700 text-white border-sky-700' : 'border-slate-400 bg-white'}`}>
                  {hasWorkType('reparacion') ? '✓' : ''}
                </span>
                <span className="font-semibold text-sky-900">REPARACIÓN</span>
              </label>
            </div>
          </div>
        </div>

        {/* Periodo */}
        <div className="col-span-12 sm:col-span-3 p-1.5">
          <div className="text-[9px] font-bold uppercase text-sky-900 text-center bg-sky-200/80 py-0.5 rounded-sm mb-1">
            Periodo
          </div>
          <div className="grid grid-cols-6 gap-0.5 text-center text-[9px] font-semibold text-slate-700">
            {MONTHS.slice(0, 6).map((m) => (
              <span
                key={m}
                className={`py-0.5 rounded ${isMonthActive(m) ? 'bg-sky-800 text-white font-black underline' : 'bg-white border border-slate-200'}`}
              >
                {m}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-0.5 text-center text-[9px] font-semibold text-slate-700 mt-0.5">
            {MONTHS.slice(6, 12).map((m) => (
              <span
                key={m}
                className={`py-0.5 rounded ${isMonthActive(m) ? 'bg-sky-800 text-white font-black underline' : 'bg-white border border-slate-200'}`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Direccion y Nombre del Cliente */}
      <div className="grid grid-cols-12 gap-1 mb-2 border border-slate-300 rounded overflow-hidden">
        <div className="col-span-12 sm:col-span-6 p-1.5 border-b sm:border-b-0 sm:border-r border-slate-300">
          <span className="text-[9px] font-bold text-slate-500 uppercase block">
            Dirección del Cliente
          </span>
          <div className="font-bold text-slate-900 text-[12px] uppercase">
            {sheet.direccionCliente || 'JUSTO SIERRA'}
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 p-1.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase block">
            Nombre del Cliente
          </span>
          <div className="font-bold text-slate-900 text-[12px] uppercase">
            {sheet.nombreCliente || 'SAN VICENTE LIVING'}
          </div>
        </div>
      </div>

      {/* 4. Tabla de Mantenimiento / Actividades */}
      <div className="border border-sky-600 rounded overflow-hidden mb-2">
        <div className="grid grid-cols-12 bg-sky-700 text-white font-bold text-[10px] py-1 px-2 uppercase tracking-wide">
          <div className="col-span-9 sm:col-span-10">MANTENIMIENTO</div>
          <div className="col-span-3 sm:col-span-2 text-center flex justify-around">
            <span>IZQ</span>
            <span>DER</span>
          </div>
        </div>

        <div className="divide-y divide-slate-200 text-[10px]">
          {sections.map((secName) => {
            const items = (sheet.actividades || []).filter((a) => a.seccion === secName);
            return (
              <div key={secName} className="bg-slate-50/50">
                <div className="bg-sky-100/70 px-2 py-0.5 font-bold text-sky-900 text-[10px] flex items-center justify-between border-t border-sky-300 first:border-t-0">
                  <span>{secName}</span>
                  <span className="text-[9px] text-sky-800 font-mono tracking-widest hidden sm:inline">
                    ACTIVIDADES VERIFICADAS
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="grid grid-cols-12 px-2 py-1 items-center hover:bg-sky-50/30 transition-colors"
                    >
                      <div className="col-span-9 sm:col-span-10 pr-2 text-slate-800">
                        {it.descripcion}
                      </div>
                      <div className="col-span-3 sm:col-span-2 flex justify-around items-center">
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center font-black text-[11px] ${it.izq ? 'bg-sky-700 text-white border-sky-800' : 'bg-white border-slate-300 text-transparent'}`}
                        >
                          ✓
                        </span>
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center font-black text-[11px] ${it.der ? 'bg-sky-700 text-white border-sky-800' : 'bg-white border-slate-300 text-transparent'}`}
                        >
                          ✓
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Si es necesario reparaciones adicionales */}
      <div className="border border-sky-600 rounded p-2 mb-2 bg-slate-50/50">
        <div className="text-[9px] font-bold uppercase text-sky-900 border-b border-sky-300 pb-1 mb-1.5 flex flex-wrap items-center justify-between">
          <span>SI ES NECESARIO REPARACIONES ADICIONALES DESCRIBA AQUÍ</span>
        </div>

        {/* Switches / checks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-1.5 text-[10px] font-semibold text-slate-800">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded border border-slate-200">
            <span>Equipo funcionando:</span>
            <span className={`px-1.5 py-0.2 rounded font-black text-[10px] ${sheet.equipoFuncionando ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-500'}`}>
              {sheet.equipoFuncionando ? 'SÍ' : 'NO'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded border border-slate-200">
            <span>Riesgo Fuera Servicio:</span>
            <span className={`px-1.5 py-0.2 rounded font-black text-[10px] ${sheet.riesgoFueraServicio ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-600'}`}>
              {sheet.riesgoFueraServicio ? 'SÍ' : 'NO'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded border border-slate-200">
            <span>Necesario Reparac.:</span>
            <span className={`px-1.5 py-0.2 rounded font-black text-[10px] ${sheet.necesarioReparacion ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-600'}`}>
              {sheet.necesarioReparacion ? 'SÍ' : 'NO'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded border border-slate-200">
            <span>Reparac. Seguridad:</span>
            <span className={`px-1.5 py-0.2 rounded font-black text-[10px] ${sheet.reparacSeguridad ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-600'}`}>
              {sheet.reparacSeguridad ? 'SÍ' : 'NO'}
            </span>
          </div>
        </div>

        {/* Text note for additional repairs */}
        <div className="bg-white p-1.5 rounded border border-slate-300 font-mono text-[11px] text-sky-950 font-bold min-h-[28px] uppercase">
          {sheet.reparacionesAdicionalesTexto ? (
            <span>➔ {sheet.reparacionesAdicionalesTexto}</span>
          ) : (
            <span className="text-slate-400 font-normal italic">Sin reparaciones adicionales requeridas</span>
          )}
        </div>
      </div>

      {/* 6. Comentarios del Mantenimiento */}
      <div className="border border-sky-600 rounded p-2 mb-2 bg-slate-50/50">
        <div className="text-[9px] font-bold uppercase text-sky-900 border-b border-sky-300 pb-1 mb-1">
          COMENTARIOS DEL MANTTO O SI ES UNA REPARACIÓN DESCRIBA AQUÍ
        </div>
        <div className="bg-white p-2 rounded border border-slate-300 font-mono text-[11px] text-sky-950 font-bold whitespace-pre-line min-h-[48px] uppercase">
          {sheet.comentariosMantenimiento || 'MANTENIMIENTO REALIZADO CONFORME A PROTOCOLO TÉCNICO.'}
        </div>
      </div>

      {/* 7. Si es una falla o reporte de reparación pendiente */}
      <div className="border border-sky-600 rounded p-2 mb-2 bg-slate-50/50 text-[10px]">
        <div className="text-[9px] font-bold uppercase text-sky-900 border-b border-sky-300 pb-1 mb-1">
          SI ES UNA FALLA O UN REPORTE DE REPARACIÓN PENDIENTE DESCRIBA AQUÍ
        </div>

        {/* Motivos de la atención */}
        <div className="flex flex-wrap items-center gap-3 text-[9px] font-semibold text-slate-700 bg-sky-50 p-1 rounded mb-1.5">
          <span className="font-bold text-sky-900">Motivos de la atención:</span>
          <span>( {sheet.motivosAtencion?.relativoAlEquipo ? '✓' : ' '} ) Relativo al equipo</span>
          <span>( {sheet.motivosAtencion?.influenciaExterna ? '✓' : ' '} ) Influencia externa</span>
          <span>( {sheet.motivosAtencion?.malUso ? '✓' : ' '} ) Mal uso</span>
          <span>( {sheet.motivosAtencion?.reporteReparacionPendiente ? '✓' : ' '} ) Reporte Reparación Pendiente</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Causa de la Falla */}
          <div className="border border-slate-200 rounded p-1.5 bg-white">
            <span className="font-bold text-sky-900 text-[9px] uppercase block border-b border-slate-100 pb-0.5 mb-1">
              Causa de la Falla
            </span>
            <div className="space-y-0.5 text-[9px]">
              {[
                'Equipo referenciado',
                'Instalacion funcionando al llegar',
                'Vandalismo',
                'Uso inadecuado del equipo',
                'Influencia externa (corte de energia)',
                'Disponibilidad del cliente',
              ].map((c) => (
                <div key={c} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center ${sheet.causaFalla === c ? 'bg-sky-600 border-sky-600' : 'border-slate-400'}`}>
                    {sheet.causaFalla === c && <span className="w-1 h-1 bg-white rounded-full"></span>}
                  </span>
                  <span className={sheet.causaFalla === c ? 'font-bold text-sky-950' : 'text-slate-600'}>
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Componentes */}
          <div className="border border-slate-200 rounded p-1.5 bg-white">
            <span className="font-bold text-sky-900 text-[9px] uppercase block border-b border-slate-100 pb-0.5 mb-1">
              Componentes
            </span>
            <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-[8.5px]">
              {[
                'General',
                'Puerta pasillo',
                'Cuarto maquinas',
                'Puerta cabina',
                'Sist. hidráulico',
                'Operador puerta',
                'Sist. eléctrico',
                'Sist. seguridad',
                'Mecánico hueco',
                'Fosa/componentes',
                'Eléctrico hueco',
                'Sistema cuñas',
              ].map((comp) => (
                <div key={comp} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full border ${sheet.componenteAfectado === comp ? 'bg-sky-600 border-sky-600' : 'border-slate-300'}`} />
                  <span className={sheet.componenteAfectado === comp ? 'font-bold text-sky-950' : 'text-slate-600'}>
                    {comp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detalles del Daño */}
          <div className="border border-slate-200 rounded p-1.5 bg-white">
            <span className="font-bold text-sky-900 text-[9px] uppercase block border-b border-slate-100 pb-0.5 mb-1">
              Detalles del Daño
            </span>
            <div className="space-y-0.5 text-[9px]">
              {[
                'Desajustado / Desalineado',
                'Aflojado',
                'Doblado / Roto',
                'Mal contacto',
                'Fin de vida util',
                'Otra causa',
              ].map((d) => (
                <div key={d} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center ${sheet.detalleDanio === d ? 'bg-sky-600 border-sky-600' : 'border-slate-400'}`}>
                    {sheet.detalleDanio === d && <span className="w-1 h-1 bg-white rounded-full"></span>}
                  </span>
                  <span className={sheet.detalleDanio === d ? 'font-bold text-sky-950' : 'text-slate-600'}>
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 8. Recepción de Trabajos por el Cliente & Firmas */}
      <div className="border border-sky-600 rounded p-2 mb-2 bg-white">
        <div className="text-[9px] font-bold uppercase text-sky-900 border-b border-sky-300 pb-0.5 mb-2 text-center bg-sky-100 py-0.5 rounded">
          RECEPCIÓN DE TRABAJOS POR EL CLIENTE
        </div>

        <div className="grid grid-cols-12 gap-3">
          {/* Left Column: Names and Dates */}
          <div className="col-span-12 sm:col-span-7 space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase min-w-[90px]">
                Nombre y Fecha:
              </span>
              <div className="flex-1 font-bold text-slate-900 font-mono text-xs">
                {sheet.clienteNombre || 'Jorge Martinez Flores'} &nbsp;
                <span className="text-slate-500 font-normal">({sheet.clienteFecha || '14/01/26'})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase min-w-[90px]">
                Servicio / Técnico:
              </span>
              <div className="flex-1 font-bold text-slate-900 font-mono text-xs">
                {sheet.tecnicoNombre || 'E. Casas'} &nbsp;
                <span className="text-slate-500 font-normal">({sheet.tecnicoFecha || '14/01/26'})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[10px] text-sky-900 font-bold">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>CONTACTO SERVICIO 24/7:</span>
              <span className="font-mono text-slate-900 font-black">
                {sheet.telefonoContacto || '5540930972'}
              </span>
            </div>
          </div>

          {/* Right Column: Digital Signatures */}
          <div className="col-span-12 sm:col-span-5 grid grid-cols-2 gap-2">
            {/* Cliente Firma */}
            <div className="border border-slate-300 rounded p-1 text-center bg-slate-50 flex flex-col justify-between">
              <div className="h-14 flex items-center justify-center overflow-hidden">
                {sheet.clienteFirmaUrl ? (
                  <img
                    src={sheet.clienteFirmaUrl}
                    alt="Firma del Cliente"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[9px] text-slate-400 italic">Sin firma cliente</span>
                )}
              </div>
              <div className="border-t border-slate-300 pt-0.5 text-[8.5px] font-bold text-slate-600 uppercase">
                Firma Cliente
              </div>
            </div>

            {/* Técnico Firma */}
            <div className="border border-slate-300 rounded p-1 text-center bg-slate-50 flex flex-col justify-between">
              <div className="h-14 flex items-center justify-center overflow-hidden">
                {sheet.tecnicoFirmaUrl ? (
                  <img
                    src={sheet.tecnicoFirmaUrl}
                    alt="Firma del Técnico"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[9px] text-slate-400 italic">Sin firma técnico</span>
                )}
              </div>
              <div className="border-t border-slate-300 pt-0.5 text-[8.5px] font-bold text-slate-600 uppercase">
                Firma Servicio
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9. Brand logos footer */}
      <div className="border-t border-slate-300 pt-1.5 mt-2 flex flex-wrap items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-wider px-1 opacity-80">
        <span>OTIS</span>
        <span>KONE</span>
        <span>TKE</span>
        <span>Schindler</span>
        <span>MITSUBISHI ELECTRIC</span>
        <span>BLT BRILLIANT</span>
        <span>MP</span>
        <span>CANNY ELEVATOR</span>
        <span>Orona</span>
        <span>FUJI</span>
      </div>
    </div>
  );
};
