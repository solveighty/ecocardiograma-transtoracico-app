import { useState, useEffect } from 'react';
import { DatabaseService } from '../services/databaseService';
import { Paciente } from '../types/database';

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getAllPacientes();
      setPacientes(data);
    } catch (err) {
      console.error('Error loading pacientes:', err);
      setError('Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const savePaciente = async (data: Paciente) => {
    try {
      const result = await DatabaseService.savePaciente(data);
      if (result.success && result.id) {
        const newPaciente = { ...data, id: result.id };
        setPacientes(prev => [...prev, newPaciente]);
        return result.id;
      } else {
        throw new Error(result.error || 'Error al guardar paciente');
      }
    } catch (err) {
      console.error('Error saving paciente:', err);
      setError('Error al guardar paciente');
      throw err;
    }
  };

  const updatePaciente = async (id: number, data: Partial<Paciente>) => {
    try {
      const result = await DatabaseService.updatePaciente(id, data);
      if (result.success) {
        setPacientes(prev => prev.map(p => 
          p.id === id ? { ...p, ...data } : p
        ));
        return true;
      } else {
        throw new Error(result.error || 'Error al actualizar paciente');
      }
    } catch (err) {
      console.error('Error updating paciente:', err);
      setError('Error al actualizar paciente');
      throw err;
    }
  };

  const getPacienteByCi = async (ci: string): Promise<Paciente | null> => {
    try {
      return await DatabaseService.getPacienteByCi(ci);
    } catch (err) {
      console.error('Error getting paciente by CI:', err);
      return null;
    }
  };

  const getPacienteById = async (id: number): Promise<Paciente | null> => {
    try {
      return await DatabaseService.getPacienteById(id);
    } catch (err) {
      console.error('Error getting paciente by ID:', err);
      return null;
    }
  };

  useEffect(() => {
    loadPacientes();
  }, []);

  return {
    pacientes,
    loading,
    error,
    savePaciente,
    updatePaciente,
    getPacienteByCi,
    getPacienteById,
    refresh: loadPacientes,
    clearError: () => setError(null)
  };
};

export const usePacienteByCi = (ci: string | null) => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPaciente = async (ciNumber: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await DatabaseService.getPacienteByCi(ciNumber);
      setPaciente(data);
    } catch (err) {
      console.error('Error loading paciente by CI:', err);
      setError('Error al cargar paciente');
      setPaciente(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ci) {
      loadPaciente(ci);
    } else {
      setPaciente(null);
      setError(null);
    }
  }, [ci]);

  return {
    paciente,
    loading,
    error,
    refresh: () => ci && loadPaciente(ci)
  };
};
