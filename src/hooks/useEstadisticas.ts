import { useState, useEffect } from 'react';
import { DatabaseService } from '../services/databaseService';
import { ResumenMensual } from '../types/database';

export const useResumenMensual = (anio: number = new Date().getFullYear()) => {
  const [resumen, setResumen] = useState<ResumenMensual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResumen = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getResumenMensual(anio);
      setResumen(data);
    } catch (err) {
      console.error('Error loading resumen mensual:', err);
      setError('Error al cargar resumen mensual');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumen();
  }, [anio]);

  // Crear un resumen completo con todos los meses (rellena con 0 los meses sin datos)
  const resumenCompleto = Array.from({ length: 12 }, (_, index) => {
    const mes = index + 1;
    const mesData = resumen.find(r => r.mes === mes);
    return {
      mes,
      total: mesData?.total || 0
    };
  });

  return {
    resumen: resumenCompleto,
    loading,
    error,
    refresh: loadResumen
  };
};

export const useEstadisticasMesActual = () => {
  const [estadisticas, setEstadisticas] = useState({
    mes: 0,
    anio: 0,
    total: 0,
    completados: 0,
    pendientes: 0,
    pacientesUnicos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getEstadisticasMesActual();
      setEstadisticas(data);
    } catch (err) {
      console.error('Error loading estadisticas mes actual:', err);
      setError('Error al cargar estadísticas del mes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstadisticas();
  }, []);

  return {
    estadisticas,
    loading,
    error,
    refresh: loadEstadisticas
  };
};
