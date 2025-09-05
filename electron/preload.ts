import { contextBridge, ipcRenderer } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  // From main to renderer
  onUpdateMessage: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on('main-process-message', callback);
    return () => {
      ipcRenderer.removeListener('main-process-message', callback);
    };
  },
  // From renderer to main
  sendMessage: (message: string) => {
    ipcRenderer.send('message-from-renderer', message);
  },
  
  // ===== DATABASE APIs =====
  
  // Pacientes
  savePaciente: (data: any) => ipcRenderer.invoke('db-save-paciente', data),
  updatePaciente: (id: number, data: any) => ipcRenderer.invoke('db-update-paciente', id, data),
  getPacienteById: (id: number) => ipcRenderer.invoke('db-get-paciente-by-id', id),
  getPacienteByCi: (ci: string) => ipcRenderer.invoke('db-get-paciente-by-ci', ci),
  getAllPacientes: () => ipcRenderer.invoke('db-get-all-pacientes'),

  // Exámenes
  saveExamen: (pacienteId: number, estado: string, diagnostico: string, datos: any) => 
    ipcRenderer.invoke('db-save-examen', pacienteId, estado, diagnostico, datos),
  updateExamen: (id: number, data: any) => ipcRenderer.invoke('db-update-examen', id, data),
  getExamenesPorEstado: (estado: string) => ipcRenderer.invoke('db-get-examenes-por-estado', estado),
  getExamenesPorMes: (mes: number, anio: number) => ipcRenderer.invoke('db-get-examenes-por-mes', mes, anio),
  getExamenesHoy: () => ipcRenderer.invoke('db-get-examenes-hoy'),
  getResumenMensual: (anio: number) => ipcRenderer.invoke('db-get-resumen-mensual', anio),
  getEstadisticasDashboard: () => ipcRenderer.invoke('db-get-estadisticas-dashboard'),

  // Utilidades
  getDbInfo: () => ipcRenderer.invoke('db-get-info'),
  createBackup: (backupPath: string) => ipcRenderer.invoke('db-backup', backupPath),

  // Compatibilidad - Guardar paciente en archivo JSON
  guardarPaciente: (data: any) => ipcRenderer.invoke('guardar-paciente', data)
});
