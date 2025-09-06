import { Paciente, Examen, ResumenMensual, EstadisticasDashboard } from '../types/database';

declare global {
  interface Window {
    electronAPI: {
      // Pacientes
      savePaciente: (data: Paciente) => Promise<{ success: boolean; id?: number; error?: string }>;
      updatePaciente: (id: number, data: Partial<Paciente>) => Promise<{ success: boolean; error?: string }>;
      getPacienteById: (id: number) => Promise<{ success: boolean; data?: Paciente; error?: string }>;
      getPacienteByCi: (ci: string) => Promise<{ success: boolean; data?: Paciente; error?: string }>;
      getAllPacientes: () => Promise<{ success: boolean; data?: Paciente[]; error?: string }>;
      getPacientes: (filtros?: any) => Promise<{ success: boolean; data?: Paciente[]; error?: string }>;

      // Exámenes
      saveExamen: (data: any) => Promise<{ success: boolean; id?: number; error?: string }>;
      updateExamen: (id: number, data: Partial<Examen>) => Promise<{ success: boolean; error?: string }>;
      deleteExamen: (id: number) => Promise<{ success: boolean; error?: string }>;
      getExamenes: (filtros?: any) => Promise<{ success: boolean; data?: Examen[]; error?: string }>;
      getExamenesPorEstado: (estado: string) => Promise<{ success: boolean; data?: Examen[]; error?: string }>;
      getExamenesByEstado: (estado: string) => Promise<{ success: boolean; data?: Examen[]; error?: string }>;
      getExamenesPorMes: (mes: number, anio: number) => Promise<{ success: boolean; data?: Examen[]; error?: string }>;
      getExamenesHoy: () => Promise<{ success: boolean; data?: Examen[]; error?: string }>;
      getResumenMensual: (anio: number) => Promise<{ success: boolean; data?: ResumenMensual[]; error?: string }>;
      getEstadisticasDashboard: () => Promise<{ success: boolean; data?: EstadisticasDashboard; error?: string }>;

      // Utilidades
      getDbInfo: () => Promise<{ success: boolean; data?: any; error?: string }>;
      createBackup: (backupPath: string) => Promise<{ success: boolean; error?: string }>;

      // Compatibilidad
      guardarPaciente: (data: any) => Promise<{ success: boolean; filePath?: string; error?: string }>;
    };
  }
}

export class DatabaseService {
  // ===== PACIENTES =====
  
  static async savePaciente(data: Paciente): Promise<{ success: boolean; id?: number; error?: string }> {
    try {
      return await window.electronAPI.savePaciente(data);
    } catch (error) {
      console.error('Error saving paciente:', error);
      return { success: false, error: String(error) };
    }
  }

  static async updatePaciente(id: number, data: Partial<Paciente>): Promise<{ success: boolean; error?: string }> {
    try {
      return await window.electronAPI.updatePaciente(id, data);
    } catch (error) {
      console.error('Error updating paciente:', error);
      return { success: false, error: String(error) };
    }
  }

  static async getPacienteById(id: number): Promise<{ success: boolean; data?: Paciente; error?: string }> {
    try {
      const result = await window.electronAPI.getPacienteById(id);
      return result;
    } catch (error) {
      console.error('Error getting paciente by id:', error);
      return { success: false, error: String(error) };
    }
  }

  static async getPacienteByCi(ci: string): Promise<{ success: boolean; data?: Paciente; error?: string }> {
    try {
      const result = await window.electronAPI.getPacienteByCi(ci);
      return result;
    } catch (error) {
      console.error('Error getting paciente by CI:', error);
      return { success: false, error: String(error) };
    }
  }

  static async getAllPacientes(): Promise<{ success: boolean; data?: Paciente[]; error?: string }> {
    try {
      return await window.electronAPI.getAllPacientes();
    } catch (error) {
      console.error('Error getting all pacientes:', error);
      return { success: false, error: String(error) };
    }
  }

  static async getPacientes(filtros?: any): Promise<{ success: boolean; data?: Paciente[]; error?: string }> {
    try {
      return await window.electronAPI.getPacientes(filtros);
    } catch (error) {
      console.error('Error getting pacientes:', error);
      return { success: false, error: String(error) };
    }
  }

  // ===== EXÁMENES =====

  static async saveExamen(examen: Omit<Examen, 'id'>): Promise<{ success: boolean; id?: number; error?: string }> {
    try {
      return await window.electronAPI.saveExamen(examen);
    } catch (error) {
      console.error('Error saving examen:', error);
      return { success: false, error: String(error) };
    }
  }

  static async getExamenes(filtros?: any): Promise<{ success: boolean; data?: Examen[]; error?: string }> {
    try {
      return await window.electronAPI.getExamenes(filtros);
    } catch (error) {
      console.error('Error getting examenes:', error);
      return { success: false, error: String(error) };
    }
  }

  static async updateExamen(id: number, data: Partial<Examen>): Promise<{ success: boolean; error?: string }> {
    try {
      return await window.electronAPI.updateExamen(id, data);
    } catch (error) {
      console.error('Error updating examen:', error);
      return { success: false, error: String(error) };
    }
  }

  static async deleteExamen(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      return await window.electronAPI.deleteExamen(id);
    } catch (error) {
      console.error('Error deleting examen:', error);
      return { success: false, error: String(error) };
    }
  }

  static async getExamenesPorEstado(estado: string): Promise<Examen[]> {
    try {
      const result = await window.electronAPI.getExamenesByEstado(estado);
      return result.success ? result.data || [] : [];
    } catch (error) {
      console.error('Error getting examenes por estado:', error);
      return [];
    }
  }

  static async getExamenesPendientes(): Promise<Examen[]> {
    return this.getExamenesPorEstado('pendiente');
  }

  static async getExamenesCompletados(): Promise<Examen[]> {
    return this.getExamenesPorEstado('completado');
  }

  static async getExamenesPorMes(mes: number, anio: number): Promise<Examen[]> {
    try {
      const result = await window.electronAPI.getExamenesPorMes(mes, anio);
      return result.success ? result.data || [] : [];
    } catch (error) {
      console.error('Error getting examenes por mes:', error);
      return [];
    }
  }

  static async getExamenesHoy(): Promise<Examen[]> {
    try {
      const result = await window.electronAPI.getExamenesHoy();
      return result.success ? result.data || [] : [];
    } catch (error) {
      console.error('Error getting examenes hoy:', error);
      return [];
    }
  }

  static async getResumenMensual(anio: number): Promise<ResumenMensual[]> {
    try {
      const result = await window.electronAPI.getResumenMensual(anio);
      return result.success ? result.data || [] : [];
    } catch (error) {
      console.error('Error getting resumen mensual:', error);
      return [];
    }
  }

  static async getEstadisticasDashboard(): Promise<EstadisticasDashboard> {
    try {
      const result = await window.electronAPI.getEstadisticasDashboard();
      if (result.success && result.data) {
        return result.data;
      }
      return {
        examenesHoy: 0,
        examenesPendientes: 0,
        examenesCompletados: 0,
        pacientesAtendidos: 0
      };
    } catch (error) {
      console.error('Error getting estadisticas dashboard:', error);
      return {
        examenesHoy: 0,
        examenesPendientes: 0,
        examenesCompletados: 0,
        pacientesAtendidos: 0
      };
    }
  }

  // ===== UTILIDADES =====

  static async getDbInfo() {
    try {
      const result = await window.electronAPI.getDbInfo();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error getting db info:', error);
      return null;
    }
  }

  static async createBackup(backupPath: string): Promise<{ success: boolean; error?: string }> {
    try {
      return await window.electronAPI.createBackup(backupPath);
    } catch (error) {
      console.error('Error creating backup:', error);
      return { success: false, error: String(error) };
    }
  }

  // ===== MÉTODOS DE COMPATIBILIDAD =====

  static async guardarPacienteJSON(data: any): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      return await window.electronAPI.guardarPaciente(data);
    } catch (error) {
      console.error('Error saving paciente JSON:', error);
      return { success: false, error: String(error) };
    }
  }

  // ===== MÉTODOS AUXILIARES =====

  static async migrarDatosDeJSON(): Promise<{ success: boolean; migratedCount?: number; error?: string }> {
    // Aquí podrías implementar lógica para migrar datos existentes desde archivos JSON
    // a la nueva base de datos SQLite
    console.log('Migración de datos JSON no implementada aún');
    return { success: false, error: 'Migración no implementada' };
  }
}
