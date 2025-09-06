import { useState, useCallback } from 'react';

export interface RefreshCallbacks {
  refreshStats?: () => void;
  refreshExamenesPendientes?: () => void;
  refreshExamenesCompletados?: () => void;
  refreshResumenMensual?: () => void;
  refreshPacientes?: () => void;
}

export const useGlobalRefresh = () => {
  const [callbacks, setCallbacks] = useState<RefreshCallbacks>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const registerCallbacks = useCallback((newCallbacks: RefreshCallbacks) => {
    setCallbacks(prev => ({ ...prev, ...newCallbacks }));
  }, []);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      // Ejecutar todas las funciones de actualización en paralelo
      const refreshPromises = Object.entries(callbacks)
        .filter(([, callback]) => typeof callback === 'function')
        .map(([key, callback]) => {
          try {
            const result = callback();
            // Si la función retorna una promesa, la esperamos
            return Promise.resolve(result);
          } catch (error) {
            console.error(`Error en callback ${key}:`, error);
            return Promise.resolve(); // No fallar si uno falla
          }
        });

      await Promise.allSettled(refreshPromises);
    } catch (error) {
      console.error('Error durante refresh global:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [callbacks]);

  return {
    registerCallbacks,
    refreshAll,
    isRefreshing
  };
};
