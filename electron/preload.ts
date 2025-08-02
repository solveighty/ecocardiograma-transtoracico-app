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
  }
});
