import { useState, useEffect } from 'react';
import { DatabaseService } from '../services/databaseService';
import { Examen } from '../types/database';

export const useExamenes = () => {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExamenesPorEstado = async (estado: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getExamenesPorEstado(estado);
      setExamenes(data);
    } catch (err) {
      console.error('Error loading examenes:', err);
      setError('Error al cargar exámenes');
    } finally {
      setLoading(false);
    }
  };

  const loadExamenesHoy = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getExamenesHoy();
      setExamenes(data);
    } catch (err) {
      console.error('Error loading examenes hoy:', err);
      setError('Error al cargar exámenes de hoy');
    } finally {
      setLoading(false);
    }
  };

  const loadExamenesPorMes = async (mes: number, anio: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getExamenesPorMes(mes, anio);
      setExamenes(data);
    } catch (err) {
      console.error('Error loading examenes por mes:', err);
      setError('Error al cargar exámenes del mes');
    } finally {
      setLoading(false);
    }
  };

  const saveExamen = async (pacienteId: number, estado: string, diagnostico: string, datos: any) => {
    try {
      const result = await DatabaseService.saveExamen(pacienteId, estado, diagnostico, datos);
      if (result.success) {
        // Recargar la lista actual
        return result.id;
      } else {
        throw new Error(result.error || 'Error al guardar examen');
      }
    } catch (err) {
      console.error('Error saving examen:', err);
      setError('Error al guardar examen');
      throw err;
    }
  };

  const updateExamen = async (id: number, data: Partial<Examen>) => {
    try {
      const result = await DatabaseService.updateExamen(id, data);
      if (result.success) {
        // Actualizar el examen en la lista local
        setExamenes(prev => prev.map(exam => 
          exam.id === id ? { ...exam, ...data } : exam
        ));
        return true;
      } else {
        throw new Error(result.error || 'Error al actualizar examen');
      }
    } catch (err) {
      console.error('Error updating examen:', err);
      setError('Error al actualizar examen');
      throw err;
    }
  };

  return {
    examenes,
    loading,
    error,
    loadExamenesPorEstado,
    loadExamenesHoy,
    loadExamenesPorMes,
    saveExamen,
    updateExamen,
    clearError: () => setError(null)
  };
};

export const useExamenesPendientes = () => {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getExamenesPendientes();
      setExamenes(data);
    } catch (err) {
      console.error('Error loading examenes pendientes:', err);
      setError('Error al cargar exámenes pendientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    examenes,
    loading,
    error,
    refresh: loadData
  };
};

export const useExamenesCompletados = () => {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getExamenesCompletados();
      setExamenes(data);
    } catch (err) {
      console.error('Error loading examenes completados:', err);
      setError('Error al cargar exámenes completados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    examenes,
    loading,
    error,
    refresh: loadData
  };
};

export const useExamenesHoy = () => {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getExamenesHoy();
      setExamenes(data);
    } catch (err) {
      console.error('Error loading examenes hoy:', err);
      setError('Error al cargar exámenes de hoy');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    examenes,
    loading,
    error,
    refresh: loadData
  };
};
