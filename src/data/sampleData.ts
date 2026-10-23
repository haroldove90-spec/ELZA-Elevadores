import { ChecklistItem, ServiceSheet } from '../types/serviceSheet';

export const CHECKLIST_TEMPLATE: Omit<ChecklistItem, 'izq' | 'der' | 'completado'>[] = [
  // Cliente / Cabina
  {
    id: 'cabina-1',
    seccion: 'Cliente / Cabina',
    descripcion: 'Contactar al cliente, solicitar retroalimentación al llegar y retirarse de la instalación. (entregar llaves al retirarse)',
  },
  {
    id: 'cabina-2',
    seccion: 'Cliente / Cabina',
    descripcion: 'Revisar alarma o intercomunicador de emergencia, Validar iluminacion de emergencia en cabina',
  },
  {
    id: 'cabina-3',
    seccion: 'Cliente / Cabina',
    descripcion: 'Revisar cortina o sistema de apertura por obstruccion de puerta (boton de cierre y apertura de puerta)',
  },
  // Cuarto de Maquinas / Tablero de Control
  {
    id: 'maquinas-1',
    seccion: 'Cuarto de Maquinas / Tablero de Control',
    descripcion: 'Revisar condiciones generales (temperatura y humedad) y acceso a cuarto de máquinas (si aplica).',
  },
  {
    id: 'maquinas-2',
    seccion: 'Cuarto de Maquinas / Tablero de Control',
    descripcion: 'Verificar registro de errores, contador de viajes, limpieza de tablero e inspeccion (sopleteado y aspirado).',
  },
  {
    id: 'maquinas-3',
    seccion: 'Cuarto de Maquinas / Tablero de Control',
    descripcion: 'Limpieza de máquina, caja de engranes, niveles de aceite, estado de polea tractora y desvio.',
  },
  {
    id: 'maquinas-4',
    seccion: 'Cuarto de Maquinas / Tablero de Control',
    descripcion: 'Limpieza del limitador de velocidad, verificar calibracion de micro de seguridad (verificar oring).',
  },
  {
    id: 'maquinas-5',
    seccion: 'Cuarto de Maquinas / Tablero de Control',
    descripcion: 'Verificar que el manual o sistema evacuacion y dispositivos funcionen y esten a la vista.',
  },
  // Cubo
  {
    id: 'cubo-1',
    seccion: 'Cubo',
    descripcion: 'Revisar condiciones generales del cubo, limpieza, aspirado, lubricacion, verificar iluminación.',
  },
  {
    id: 'cubo-2',
    seccion: 'Cubo',
    descripcion: 'Verificar puntos de fijacion bandas o cables tractores, verificar instalacion de tolvas de cabina, pasillo.',
  },
  {
    id: 'cubo-3',
    seccion: 'Cubo',
    descripcion: 'Limpieza y lubricación de las puertas de pasillo, cabezales y sardineles (aspirado).',
  },
  {
    id: 'cubo-4',
    seccion: 'Cubo',
    descripcion: 'Limpieza y calibración de información de cubo, contrapeso y poleas.',
  },
  {
    id: 'cubo-5',
    seccion: 'Cubo',
    descripcion: 'Relleno de aceite en guías de cabina y contrapeso (recuperar niveles).',
  },
  // Fosa
  {
    id: 'fosa-1',
    seccion: 'Fosa',
    descripcion: 'Revisar condiciones generales, escalera de acceso a fosa, iluminación y aspirado de fosa.',
  },
  {
    id: 'fosa-2',
    seccion: 'Fosa',
    descripcion: 'Limpieza y verificación de los dispositivos de seguridad de fosa y recoleccion de aceite.',
  },
  {
    id: 'fosa-3',
    seccion: 'Fosa',
    descripcion: 'Limpieza y verificación de polea tensora de limitador de velocidad (calibracion de micro de seguridad).',
  },
  {
    id: 'fosa-4',
    seccion: 'Fosa',
    descripcion: 'Limpieza y verificación de amortiguadores, rieles, poleas y sistema de cuñas.',
  },
];

export function getDefaultChecklist(): ChecklistItem[] {
  return CHECKLIST_TEMPLATE.map((item) => ({
    ...item,
    izq: false,
    der: false,
    completado: false,
  }));
}

// Sample SVG signature for the demo record (matching the cursive stroke in the photo)
export const SAMPLE_CLIENT_SIGNATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="260" height="70" viewBox="0 0 260 70"><path d="M 20 45 Q 40 10 60 50 Q 80 15 110 35 T 160 40 Q 190 20 220 50 L 250 30" fill="none" stroke="%231E3E62" stroke-width="2.5" stroke-linecap="round"/><path d="M 50 60 L 240 25" fill="none" stroke="%231E3E62" stroke-width="1.8"/></svg>';
export const SAMPLE_TECH_SIGNATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="260" height="70" viewBox="0 0 260 70"><path d="M 30 35 Q 60 15 80 50 L 110 20 Q 140 45 170 30" fill="none" stroke="%231E3E62" stroke-width="2.5" stroke-linecap="round"/><line x1="25" y1="48" x2="190" y2="35" stroke="%231E3E62" stroke-width="2"/></svg>';

export const SAMPLE_SERVICE_SHEET: ServiceSheet = {
  id: 'sample-247016-1842',
  ordenServicio: '247016 1842',
  equipos: 'IZQ / DER',
  tiposTrabajo: ['mantto_preventivo', 'reparacion'],
  periodoMeses: ['AGO', 'SEP', 'OCT'],
  direccionCliente: 'JUSTO SIERRA',
  nombreCliente: 'SAN VICENTE LIVING',
  fechaCreacion: '2026-01-14T10:30:00.000Z',
  
  actividades: CHECKLIST_TEMPLATE.map((item) => ({
    ...item,
    izq: true,
    der: true,
    completado: true,
  })),

  equipoFuncionando: true,
  riesgoFueraServicio: false,
  necesarioReparacion: true,
  reparacSeguridad: false,
  reparacionesAdicionalesTexto: 'INDICADORES DE NIVEL DE PB',

  comentariosMantenimiento: 'MANTTO BIMESTRAL LIMPIEZA / LUBRICACIÓN / INSP.\nSE CAMBIARON 2 HOJAS CHAPAS D/PTA CABINA ELEV IZQ.',

  motivosAtencion: {
    relativoAlEquipo: false,
    influenciaExterna: false,
    malUso: false,
    reporteReparacionPendiente: false,
  },

  causaFalla: 'Equipo referenciado',
  componenteAfectado: '',
  detalleDanio: 'Fin de vida util',

  clienteNombre: 'Jorge Martinez Flores',
  clienteFecha: '14/01/26',
  clienteFirmaUrl: SAMPLE_CLIENT_SIGNATURE,

  tecnicoNombre: 'E. Casas',
  tecnicoFecha: '14/01/26',
  tecnicoFirmaUrl: SAMPLE_TECH_SIGNATURE,

  telefonoContacto: '5540930972',
  esMuestra: true,
};
