export type UserRole = 'admin' | 'tecnico' | 'supervisor' | 'cliente';

export interface RoleInfo {
  id: UserRole;
  name: string;
  badge: string;
  iconName: string;
  description: string;
}

export type WorkType = 'mantto_preventivo' | 'falla' | 'reparacion';

export type MonthKey = 'ENE' | 'FEB' | 'MAR' | 'ABR' | 'MAY' | 'JUN' | 'JUL' | 'AGO' | 'SEP' | 'OCT' | 'NOV' | 'DIC';

export type ActivityCheckState = {
  izq: boolean; // Elevador Izquierdo / Equipo 1
  der: boolean; // Elevador Derecho / Equipo 2
  completado: boolean;
};

export interface ChecklistItem {
  id: string;
  seccion: 'Cliente / Cabina' | 'Cuarto de Maquinas / Tablero de Control' | 'Cubo' | 'Fosa';
  descripcion: string;
  izq: boolean;
  der: boolean;
  completado: boolean;
}

export interface ServiceSheet {
  id: string;
  ordenServicio: string; // ej: 247016 1842
  equipos: string; // ej: IZQ / DER
  tiposTrabajo: WorkType[]; // [mantto_preventivo, reparacion]
  periodoMeses: MonthKey[]; // [AGO, SEP, OCT]
  direccionCliente: string; // ej: JUSTO SIERRA
  nombreCliente: string; // ej: SAN VICENTE LIVING
  fechaCreacion: string; // ISO string

  // Checklist items
  actividades: ChecklistItem[];

  // Estado de reparaciones adicionales
  equipoFuncionando: boolean; // SI / NO
  riesgoFueraServicio: boolean; // SI / NO
  necesarioReparacion: boolean; // SI / NO
  reparacSeguridad: boolean; // SI / NO
  reparacionesAdicionalesTexto: string; // ej: INDICADORES DE NIVEL DE PB

  // Comentarios generales
  comentariosMantenimiento: string; // ej: MANTTO BIMESTRAL LIMPIEZA / LUBRICACION...

  // Si es falla o reporte de reparación pendiente
  motivosAtencion: {
    relativoAlEquipo: boolean;
    influenciaExterna: boolean;
    malUso: boolean;
    reporteReparacionPendiente: boolean;
  };

  causaFalla: string; // 'Equipo referenciado' | 'Instalacion funcionando al llegar' | 'Vandalismo' | 'Uso inadecuado del equipo' | 'Influencia externa (corte de energia)' | 'Disponibilidad del cliente' | ''
  componenteAfectado: string; // 'General' | 'Cuarto de maquinas' | 'Sistema hidráulico' | 'Sistema eléctrico' | 'Puerta pasillo' | 'Puerta cabina' | 'Operador de puerta' | etc.
  detalleDanio: string; // 'Desajustado / Desalineado' | 'Aflojado' | 'Doblado / Roto' | 'Mal contacto' | 'Fin de vida util' | 'Otra causa' | ''

  // Recepción de trabajos
  clienteNombre: string; // ej: Jorge Martínez Flores
  clienteFecha: string; // ej: 14/01/26
  clienteFirmaUrl: string; // base64 data url
  
  tecnicoNombre: string; // ej: E. Casas
  tecnicoFecha: string; // ej: 14/01/26
  tecnicoFirmaUrl: string; // base64 data url

  telefonoContacto: string; // ej: 5540930972
  esMuestra?: boolean; // si es dato de prueba
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  tableName: string;
  habilitado: boolean;
}
