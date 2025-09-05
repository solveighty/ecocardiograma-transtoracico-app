import { app, BrowserWindow, shell, ipcMain } from 'electron';
import * as path from 'path';
import DatabaseManager from '../src/services/databaseManager';
import { Paciente, Examen } from '../src/types/database';
import './electron-env';

// ===== IPC HANDLERS PARA BASE DE DATOS =====

// Pacientes
ipcMain.handle('db-save-paciente', async (_event, data: Paciente) => {
  try {
    const db = await DatabaseManager.getInstance();
    const id = await db.savePaciente(data);
    return { success: true, id };
  } catch (error: any) {
    console.error('Error saving paciente:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-update-paciente', async (_event, id: number, data: Partial<Paciente>) => {
  try {
    const db = await DatabaseManager.getInstance();
    await db.updatePaciente(id, data);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating paciente:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-paciente-by-id', async (_event, id: number) => {
  try {
    const db = await DatabaseManager.getInstance();
    const paciente = await db.getPaciente(id);
    return { success: true, data: paciente };
  } catch (error: any) {
    console.error('Error getting paciente:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-pacientes', async (_event, filtros?: any) => {
  try {
    const db = await DatabaseManager.getInstance();
    const pacientes = await db.getPacientes(filtros);
    return { success: true, data: pacientes };
  } catch (error: any) {
    console.error('Error getting pacientes:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-delete-paciente', async (_event, id: number) => {
  try {
    const db = await DatabaseManager.getInstance();
    await db.deletePaciente(id);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting paciente:', error);
    return { success: false, error: error.message };
  }
});

// Exámenes
ipcMain.handle('db-save-examen', async (_event, data: Examen) => {
  try {
    const db = await DatabaseManager.getInstance();
    const id = await db.saveExamen(data);
    return { success: true, id };
  } catch (error: any) {
    console.error('Error saving examen:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-update-examen', async (_event, id: number, data: Partial<Examen>) => {
  try {
    const db = await DatabaseManager.getInstance();
    await db.updateExamen(id, data);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating examen:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-examen-by-id', async (_event, id: number) => {
  try {
    const db = await DatabaseManager.getInstance();
    const examen = await db.getExamen(id);
    return { success: true, data: examen };
  } catch (error: any) {
    console.error('Error getting examen:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-examenes', async (_event, filtros?: any) => {
  try {
    const db = await DatabaseManager.getInstance();
    const examenes = await db.getExamenes(filtros);
    return { success: true, data: examenes };
  } catch (error: any) {
    console.error('Error getting examenes:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-delete-examen', async (_event, id: number) => {
  try {
    const db = await DatabaseManager.getInstance();
    await db.deleteExamen(id);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting examen:', error);
    return { success: false, error: error.message };
  }
});

// Estadísticas
ipcMain.handle('db-get-estadisticas-dashboard', async () => {
  try {
    const db = await DatabaseManager.getInstance();
    const estadisticas = await db.getEstadisticasDashboard();
    return { success: true, data: estadisticas };
  } catch (error: any) {
    console.error('Error getting estadisticas dashboard:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-examenes-hoy', async () => {
  try {
    const db = await DatabaseManager.getInstance();
    const examenes = await db.getExamenesHoy();
    return { success: true, data: examenes };
  } catch (error: any) {
    console.error('Error getting examenes hoy:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-examenes-por-estado', async () => {
  try {
    const db = await DatabaseManager.getInstance();
    const examenes = await db.getExamenesPorEstado();
    return { success: true, data: examenes };
  } catch (error: any) {
    console.error('Error getting examenes por estado:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-examenes-por-mes', async (_event, meses: number = 12) => {
  try {
    const db = await DatabaseManager.getInstance();
    const examenes = await db.getExamenesPorMes(meses);
    return { success: true, data: examenes };
  } catch (error: any) {
    console.error('Error getting examenes por mes:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-resumen-mensual', async (_event, _year: number, _month: number) => {
  try {
    const db = await DatabaseManager.getInstance();
    const resumen = await db.getExamenesPorMes(12); // Adaptar según necesidades
    return { success: true, data: resumen };
  } catch (error: any) {
    console.error('Error getting resumen mensual:', error);
    return { success: false, error: error.message };
  }
});

// ===== ELECTRON APP CONFIGURATION =====

const isDev = process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/vite.svg')
  });

  // Load the app
  if (isDev) {
    const port = process.env.PORT || 5173;
    mainWindow.loadURL(`http://localhost:${port}`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Remove menu bar
  mainWindow.setMenuBarVisibility(false);
};

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent navigation to external URLs
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (navigationEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'file://') {
      navigationEvent.preventDefault();
    }
  });
});

// Clean up database connection on app quit
app.on('before-quit', async () => {
  try {
    await DatabaseManager.closeInstance();
  } catch (error) {
    console.error('Error closing database:', error);
  }
});
