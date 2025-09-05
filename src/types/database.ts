export interface Paciente {
  id?: number;
  nombres: string;
  edad: number;
  sexo: 'M' | 'F';
  ci: string;
  fechaNacimiento: string; // ISO date string
  peso: number;
  talla: number;
  superficieCorporal: number;
}

export interface Examen {
  id?: number;
  pacienteId: number;
  estado: 'pendiente' | 'completado' | 'cancelado';
  fecha: string; // ISO date string
  diagnostico: string;
  datos: any; // JSON data from forms
  paciente?: Paciente; // Optional, for joined queries
}

export interface ResumenMensual {
  mes: number;
  total: number;
}

export interface EstadisticasDashboard {
  examenesHoy: number;
  examenesPendientes: number;
  examenesCompletados: number;
  pacientesAtendidos: number;
}
