import { useState, useEffect } from 'react';
import './App.css';

// Define the type for the window.electronAPI
declare global {
  interface Window {
    electronAPI?: {
      onUpdateMessage: (callback: (event: any, message: string) => void) => void;
      sendMessage: (message: string) => void;
    };
  }
}

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Add listener for messages from the main process
    if (window.electronAPI) {
      const cleanup = window.electronAPI.onUpdateMessage((event, message) => {
        setMessage(message);
      });
      
      // Send a message to the main process
      window.electronAPI.sendMessage('Hello from React!');
      
      // Cleanup listener on unmount
      return cleanup;
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">Ecocardiograma Transtorácico App</h1>
        <p className="mt-2 text-lg text-gray-600">
          Una aplicación para la gestión de ecocardiogramas transtorácicos
        </p>
        {message && (
          <div className="mt-4 rounded bg-blue-100 p-2 text-sm text-blue-800">
            Mensaje del proceso principal: {message}
          </div>
        )}
      </header>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 text-center">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700"
          >
            Contador: {count}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded border border-gray-200 p-4">
            <h3 className="mb-2 text-xl font-semibold">Pacientes</h3>
            <p className="text-gray-600">Gestión de información de pacientes</p>
          </div>
          <div className="rounded border border-gray-200 p-4">
            <h3 className="mb-2 text-xl font-semibold">Estudios</h3>
            <p className="text-gray-600">Registro y visualización de estudios</p>
          </div>
          <div className="rounded border border-gray-200 p-4">
            <h3 className="mb-2 text-xl font-semibold">Informes</h3>
            <p className="text-gray-600">Generación de informes médicos</p>
          </div>
          <div className="rounded border border-gray-200 p-4">
            <h3 className="mb-2 text-xl font-semibold">Configuración</h3>
            <p className="text-gray-600">Ajustes de la aplicación</p>
          </div>
        </div>
      </div>

      <footer className="mt-auto text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Ecocardiograma Transtorácico App</p>
      </footer>
    </div>
  );
}

export default App;
