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
  getAllPacientes: () => ipcRenderer.invoke('db-get-pacientes'),
  getPacientes: (filtros: any) => ipcRenderer.invoke('db-get-pacientes', filtros),

  // Exámenes
  saveExamen: (data: any) => ipcRenderer.invoke('db-save-examen', data),
  updateExamen: (id: number, data: any) => ipcRenderer.invoke('db-update-examen', id, data),
  getExamenes: (filtros: any) => ipcRenderer.invoke('db-get-examenes', filtros),
  getExamenesPorEstado: () => ipcRenderer.invoke('db-get-examenes-por-estado'),
  getExamenesPorMes: (meses: number) => ipcRenderer.invoke('db-get-examenes-por-mes', meses),
  getExamenesHoy: () => ipcRenderer.invoke('db-get-examenes-hoy'),
  getResumenMensual: (year: number, month: number) => ipcRenderer.invoke('db-get-resumen-mensual', year, month),
  getEstadisticasDashboard: () => ipcRenderer.invoke('db-get-estadisticas-dashboard'),

  // Utilidades
  getDbInfo: () => ipcRenderer.invoke('db-get-info'),
  createBackup: (backupPath: string) => ipcRenderer.invoke('db-backup', backupPath),

  // Compatibilidad - Guardar paciente en archivo JSON
  guardarPaciente: (data: any) => ipcRenderer.invoke('guardar-paciente', data)
});
