import { useState, useEffect } from 'react';
import { DatabaseService } from '../services/databaseService';
import { EstadisticasDashboard } from '../types/database';

export const useDashboardStats = () => {
  const [stats, setStats] = useState<EstadisticasDashboard>({
    examenesHoy: 0,
    examenesPendientes: 0,
    examenesCompletados: 0,
    pacientesAtendidos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const estadisticas = await DatabaseService.getEstadisticasDashboard();
      setStats(estadisticas);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: loadStats
  };
};
