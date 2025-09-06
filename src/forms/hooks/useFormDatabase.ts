import { useState, useCallback } from 'react';
import { FormDatabaseService, FormData } from '../services/formDatabaseService';
import { PatientData } from '../types/firstForm/PatientData';

export const useFormDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedExamenId, setLastSavedExamenId] = useState<number | null>(null);
  const [lastSavedPacienteId, setLastSavedPacienteId] = useState<number | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Buscar paciente por CI
  const buscarPaciente = useCallback(async (ci: string): Promise<PatientData | null> => {
    if (!ci.trim()) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const pacienteData = await FormDatabaseService.buscarPacientePorCI(ci.trim());
      return pacienteData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar paciente';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar borrador del examen
  const guardarBorrador = useCallback(async (formData: FormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await FormDatabaseService.guardarBorrador(formData);
      if (result.success) {
        setLastSavedExamenId(result.examenId || null);
        setLastSavedPacienteId(result.pacienteId || null);
        return true;
      } else {
        setError(result.error || 'Error al guardar borrador');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar borrador';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Finalizar y guardar examen
  const finalizarExamen = useCallback(async (formData: FormData, diagnostico: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await FormDatabaseService.finalizarExamen(formData, diagnostico);
      if (result.success) {
        setLastSavedExamenId(result.examenId || null);
        setLastSavedPacienteId(result.pacienteId || null);
        return true;
      } else {
        setError(result.error || 'Error al finalizar examen');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al finalizar examen';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Exportar y guardar (compatible con sistema anterior)
  const exportarYGuardar = useCallback(async (formData: FormData, diagnostico: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await FormDatabaseService.exportarYGuardar(formData, diagnostico);
      if (result.success) {
        return true;
      } else {
        setError(result.error || 'Error al exportar y guardar');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al exportar y guardar';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Validar datos del formulario
  const validarDatos = useCallback((formData: FormData) => {
    return FormDatabaseService.validarDatos(formData);
  }, []);

  return {
    // Estado
    loading,
    error,
    lastSavedExamenId,
    lastSavedPacienteId,
    
    // Acciones
    buscarPaciente,
    guardarBorrador,
    finalizarExamen,
    exportarYGuardar,
    validarDatos,
    clearError
  };
};
