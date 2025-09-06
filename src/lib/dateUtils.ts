/**
 * Utilidades para manejo de fechas locales
 * Evita problemas de zona horaria al usar toISOString()
 */

/**
 * Obtiene la fecha local actual en formato YYYY-MM-DD
 * sin problemas de zona horaria
 */
export const getFechaLocalHoy = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtiene una fecha local específica en formato YYYY-MM-DD
 * @param date - Objeto Date
 */
export const getFechaLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Convierte una fecha local YYYY-MM-DD a Date object
 * @param fechaLocal - string en formato YYYY-MM-DD
 */
export const parseFechaLocal = (fechaLocal: string): Date => {
  const [year, month, day] = fechaLocal.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Formatea una fecha para mostrar en la UI
 * @param fecha - string en formato YYYY-MM-DD o Date object
 */
export const formatearFechaParaUI = (fecha: string | Date): string => {
  let date: Date;
  
  if (typeof fecha === 'string') {
    // Si es un string, asumimos que está en formato YYYY-MM-DD local
    date = parseFechaLocal(fecha);
  } else {
    // Si es un Date object, extraemos los componentes locales directamente
    // para evitar problemas de zona horaria
    const year = fecha.getFullYear();
    const month = fecha.getMonth();
    const day = fecha.getDate();
    date = new Date(year, month, day);
  }
  
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Obtiene la hora actual en formato HH:MM
 */
export const getHoraLocal = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};
