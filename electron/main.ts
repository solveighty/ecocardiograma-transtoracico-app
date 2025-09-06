import { app, BrowserWindow, shell, ipcMain } from 'electron';
import * as path from 'path';
import DatabaseManager from '../src/services/databaseManager';
import { Paciente, Examen } from '../src/types/database';
import './electron-env';

// Workaround: Some Windows setups crash the GPU process and render a blank screen.
// Disable hardware acceleration as early as possible in the main process.
// See: https://www.electronjs.org/docs/latest/api/app#appdisablehardwareacceleration
app.disableHardwareAcceleration();
if (process.platform === 'win32') {
  // Extra guard for problematic GPUs/drivers
  app.commandLine.appendSwitch('disable-gpu');
}

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

ipcMain.handle('db-get-paciente-by-ci', async (_event, ci: string) => {
  try {
    const db = await DatabaseManager.getInstance();
    const pacientes = await db.getPacientes({ ci: ci });
    const paciente = pacientes.length > 0 ? pacientes[0] : null;
    return { success: true, data: paciente };
  } catch (error: any) {
    console.error('Error getting paciente by CI:', error);
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

ipcMain.handle('db-get-examenes-by-estado', async (_event, estado: string) => {
  try {
    const db = await DatabaseManager.getInstance();
    const examenes = await db.getExamenesByEstado(estado);
    return { success: true, data: examenes };
  } catch (error: any) {
    console.error('Error getting examenes by estado:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-examenes-completados-hoy', async () => {
  try {
    const db = await DatabaseManager.getInstance();
    const examenes = await db.getExamenesCompletadosHoy();
    return { success: true, data: examenes };
  } catch (error: any) {
    console.error('Error getting examenes completados hoy:', error);
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

// Detección más robusta del entorno
// En el ejecutable empaquetado, NODE_ENV puede no estar definido o ser 'development'
// Usar la presencia del servidor de desarrollo como indicador principal
const isDevServer = !!process.env.VITE_DEV_SERVER_URL;
const isPackaged = app.isPackaged; // true cuando está empaquetado por electron-builder
const isDev = !isPackaged && process.env.NODE_ENV === 'development' && !isDevServer;
const isProduction = isPackaged || process.env.NODE_ENV === 'production';

console.log('🔧 Environment check:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   VITE_DEV_SERVER_URL:', process.env.VITE_DEV_SERVER_URL);
console.log('   __dirname:', __dirname);
console.log('   app.isPackaged:', isPackaged);
console.log('   isDev:', isDev);
console.log('   isDevServer:', isDevServer);
console.log('   isProduction:', isProduction);

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  console.log('🚀 Creating main window...');
  console.log('📁 __dirname:', __dirname);
  console.log('🔧 isDev:', isDev);
  console.log('📂 Current working directory:', process.cwd());
  
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false, // No mostrar hasta que esté listo
  backgroundColor: '#ffffff', // Avoid flicker/black screen when GPU is off
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/logo_app.png')
  });

  console.log('🖼️ Window created successfully');

  // Mostrar la ventana cuando esté lista para prevenir flash blanco
  mainWindow.once('ready-to-show', () => {
    console.log('✅ Window ready to show');
    mainWindow?.show();
  });

  // Load the app
  if (isDevServer) {
    // Modo desarrollo con servidor Vite
    const port = process.env.VITE_DEV_SERVER_URL?.split(':')[2]?.split('/')[0] || 5173;
    const devUrl = `http://localhost:${port}`;
    console.log('🌐 Development server mode - loading URL:', devUrl);
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools();
  } else {
    // Modo producción o desarrollo sin servidor - cargar desde archivo local
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('📄 Production/file mode - loading file from:', indexPath);
    console.log('✅ File exists:', require('fs').existsSync(indexPath));
    
    // Verificar contenido del directorio
    const distDir = path.join(__dirname, '../dist');
    console.log('📂 Dist directory exists:', require('fs').existsSync(distDir));
    if (require('fs').existsSync(distDir)) {
      console.log('📁 Dist directory contents:', require('fs').readdirSync(distDir));
    }
    
    console.log('🔄 Attempting to load file:', indexPath);
    mainWindow.loadFile(indexPath).then(() => {
      console.log('✅ File loaded successfully');
    }).catch((error) => {
      console.error('❌ Failed to load file:', error);
    });
    
    // Solo abrir DevTools en producción si hay problemas (comentar en release)
    if (process.env.DEBUG_PROD || !isPackaged) {
      mainWindow.webContents.openDevTools();
    }
    
    // Manejar errores de carga
    mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
      console.error('❌ Failed to load:', errorCode, errorDescription, validatedURL);
    });
    
    // Log cuando la página se carga exitosamente
    mainWindow.webContents.on('did-finish-load', () => {
      console.log('✅ Page loaded successfully');
    });
    
    // Log cuando el DOM está listo
    mainWindow.webContents.on('dom-ready', () => {
      console.log('✅ DOM ready');
    });
    
    // Logs de consola del renderer
    mainWindow.webContents.on('console-message', (_event, level, message) => {
      console.log(`🖥️ Renderer console [${level}]:`, message);
    });
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
  console.log('🎯 Electron app is ready');
  createWindow();

  app.on('activate', () => {
    console.log('🔄 App activated');
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  console.log('🚪 All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Log cuando la app se va a cerrar
app.on('before-quit', () => {
  console.log('👋 App is about to quit');
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
