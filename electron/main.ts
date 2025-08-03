import { app, BrowserWindow, shell } from 'electron';
import * as path from 'path';
import './electron-env';

// Disable GPU Acceleration for Windows 7
if (process.platform === 'win32') {
  app.disableHardwareAcceleration();
}

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {
  app.setAppUserModelId(app.getName());
}

// Check if the app is packaged or in development
const isDev = process.env.NODE_ENV !== 'production';

// Add special macOS handling
if (process.platform === 'darwin') {
  app.dock.setIcon(path.join(__dirname, '../../public/icon.png'));
}

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'Ecocardiograma Transtorácico App',
    icon: path.join(__dirname, '../../public/icon.png'),
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Test active push message to Renderer
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // Open app in development mode or production
  if (isDev) {
    // In development mode, load from the Vite dev server
    await mainWindow.loadURL('http://localhost:5173/');
    mainWindow.webContents.openDevTools();
  } else {
    // In production mode, load the built index.html
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    mainWindow = null;
  }
});

app.on('activate', () => {
  // On macOS, re-create a window when dock icon is clicked
  if (mainWindow === null) {
    createWindow();
  }
});

// Create window when Electron is ready
app.whenReady().then(createWindow);
