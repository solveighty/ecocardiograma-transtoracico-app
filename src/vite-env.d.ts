/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Force TypeScript to reload types
declare global {
  interface Window {
    electronAPI: {
      savePaciente: (data: any) => Promise<{ success: boolean; id?: number; error?: string }>;
      updatePaciente: (id: number, data: any) => Promise<{ success: boolean; error?: string }>;
      getPacienteById: (id: number) => Promise<{ success: boolean; data?: any; error?: string }>;
      getPacienteByCi: (ci: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      getAllPacientes: () => Promise<{ success: boolean; data?: any[]; error?: string }>;
      getPacientes: (filtros: any) => Promise<{ success: boolean; data?: any[]; error?: string }>;
      saveExamen: (data: any) => Promise<{ success: boolean; id?: number; error?: string }>;
      updateExamen: (id: number, data: any) => Promise<{ success: boolean; error?: string }>;
      deleteExamen: (id: number) => Promise<{ success: boolean; error?: string }>;
      getExamenes: (filtros: any) => Promise<{ success: boolean; data?: any[]; error?: string }>;
      getExamenesPorEstado: () => Promise<{ success: boolean; data?: any[]; error?: string }>;
      getExamenesByEstado: (estado: string) => Promise<{ success: boolean; data?: any[]; error?: string }>;
      getExamenesPorMes: (meses: number) => Promise<{ success: boolean; data?: any[]; error?: string }>;
      getExamenesHoy: () => Promise<{ success: boolean; data?: any[]; error?: string }>;
      getExamenesCompletadosHoy: () => Promise<{ success: boolean; data?: any[]; error?: string }>;
      getResumenMensual: (year: number, month: number) => Promise<{ success: boolean; data?: any[]; error?: string }>;
      getEstadisticasDashboard: () => Promise<{ success: boolean; data?: any; error?: string }>;
      getDbInfo: () => Promise<{ success: boolean; data?: any; error?: string }>;
      createBackup: (backupPath: string) => Promise<{ success: boolean; error?: string }>;
      guardarPaciente: (data: any) => Promise<any>;
    };
  }
}
