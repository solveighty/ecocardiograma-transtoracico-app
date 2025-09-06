import { DatabaseService } from '../../services/databaseService';
import { Paciente, Examen } from '../../types/database';
import { PatientData } from '../types/firstForm/PatientData';
import { MedidasVIData } from '../types/secondForm/MedidasVIData';
import { ValvulasData } from '../types/fourthForm/ValvulasData';
import { DopplerVasosVenasData } from '../types/fifthForm/DopplerTisularData';
import { getFechaLocalHoy, getFechaLocal } from '../../lib/dateUtils';

export interface FormData {
  patientData: PatientData;
  medidasVIData: MedidasVIData;
  ventriculosAuriculasData: any;
  valvulasData: ValvulasData;
  dtvvData: DopplerVasosVenasData;
}

export interface ExamenCompleto {
  paciente: Paciente;
  examen: Examen;
}

export class FormDatabaseService {
  
  // Convertir PatientData a Paciente para la base de datos
  static patientDataToPaciente(patientData: PatientData): Paciente {
    return {
      nombres: patientData.nombresApellidos,
      edad: parseInt(patientData.edad) || 0,
      sexo: patientData.sexo as 'M' | 'F',
      ci: patientData.ci,
      fechaNacimiento: patientData.fechaNacimiento ? getFechaLocal(patientData.fechaNacimiento) : getFechaLocalHoy(),
      peso: parseFloat(patientData.peso) || 0,
      talla: parseFloat(patientData.talla) || 0,
      superficieCorporal: parseFloat(patientData.superficieCorporal) || 0
    };
  }

  // Convertir Paciente de la base de datos a PatientData
  static pacienteToPatientData(paciente: Paciente): PatientData {
    return {
      nombresApellidos: paciente.nombres,
      edad: paciente.edad.toString(),
      sexo: paciente.sexo,
      ci: paciente.ci,
      fechaNacimiento: new Date(paciente.fechaNacimiento),
      peso: paciente.peso.toString(),
      talla: paciente.talla.toString(),
      superficieCorporal: paciente.superficieCorporal.toString(),
      ventanas: [],
      ritmo: '',
      frecuenciaCardiaca: '',
      fechaExamen: undefined
    };
  }

  // Buscar paciente por CI y cargar datos en el formulario
  static async buscarPacientePorCI(ci: string): Promise<PatientData | null> {
    try {
      const result = await DatabaseService.getPacienteByCi(ci);
      if (result.success && result.data) {
        return this.pacienteToPatientData(result.data);
      }
      return null;
    } catch (error) {
      console.error('Error buscando paciente por CI:', error);
      return null;
    }
  }

  // Guardar o actualizar paciente
  static async guardarPaciente(patientData: PatientData): Promise<{ success: boolean; pacienteId?: number; error?: string }> {
    try {
      const paciente = this.patientDataToPaciente(patientData);
      
      // Verificar si ya existe un paciente con esta CI
      const resultPacienteExistente = await DatabaseService.getPacienteByCi(paciente.ci);
      
      if (resultPacienteExistente.success && resultPacienteExistente.data) {
        // Actualizar paciente existente
        const result = await DatabaseService.updatePaciente(resultPacienteExistente.data.id!, paciente);
        if (result.success) {
          return { success: true, pacienteId: resultPacienteExistente.data.id };
        } else {
          return { success: false, error: result.error || 'Error al actualizar paciente' };
        }
      } else {
        // Crear nuevo paciente
        const result = await DatabaseService.savePaciente(paciente);
        if (result.success && result.id) {
          return { success: true, pacienteId: result.id };
        } else {
          return { success: false, error: result.error || 'Error al crear paciente' };
        }
      }
    } catch (error) {
      console.error('Error guardando paciente:', error);
      return { success: false, error: String(error) };
    }
  }

  // Guardar examen completo
  static async guardarExamenCompleto(
    formData: FormData,
    diagnostico: string = '',
    estado: 'pendiente' | 'completado' = 'completado'
  ): Promise<{ success: boolean; examenId?: number; pacienteId?: number; error?: string }> {
    try {
      // Primero guardar/actualizar el paciente
      const pacienteResult = await this.guardarPaciente(formData.patientData);
      
      if (!pacienteResult.success || !pacienteResult.pacienteId) {
        return { 
          success: false, 
          error: pacienteResult.error || 'Error al guardar paciente' 
        };
      }

      // Preparar los datos del examen
      const datosExamen = {
        patientData: formData.patientData,
        medidasVI: formData.medidasVIData,
        ventriculosAuriculas: formData.ventriculosAuriculasData,
        valvulas: formData.valvulasData,
        dopplerTisular: formData.dtvvData,
        fechaCreacion: getFechaLocalHoy()
      };

      // Guardar el examen
      const examenData = {
        pacienteId: pacienteResult.pacienteId,
        estado,
        diagnostico,
        datos: datosExamen,
        fecha: getFechaLocalHoy()
      };
      const examenResult = await DatabaseService.saveExamen(examenData);

      if (examenResult.success && examenResult.id) {
        return {
          success: true,
          examenId: examenResult.id,
          pacienteId: pacienteResult.pacienteId
        };
      } else {
        return {
          success: false,
          error: examenResult.error || 'Error al guardar examen'
        };
      }

    } catch (error) {
      console.error('Error guardando examen completo:', error);
      return { success: false, error: String(error) };
    }
  }

  // Guardar como borrador (examen pendiente)
  static async guardarBorrador(formData: FormData): Promise<{ success: boolean; examenId?: number; pacienteId?: number; error?: string }> {
    return this.guardarExamenCompleto(formData, 'Borrador - En proceso', 'pendiente');
  }

  // Finalizar y guardar examen
  static async finalizarExamen(
    formData: FormData, 
    diagnostico: string
  ): Promise<{ success: boolean; examenId?: number; pacienteId?: number; error?: string }> {
    return this.guardarExamenCompleto(formData, diagnostico, 'completado');
  }

  // Cargar examen existente
  static async cargarExamen(_examenId: number): Promise<{ success: boolean; formData?: FormData; error?: string }> {
    try {
      // Este método necesitaría ser implementado en DatabaseService
      // Por ahora, retornamos un error
      return {
        success: false,
        error: 'Funcionalidad de carga de exámenes no implementada aún'
      };
    } catch (error) {
      console.error('Error cargando examen:', error);
      return { success: false, error: String(error) };
    }
  }

  // Obtener historial de exámenes de un paciente
  static async obtenerHistorialPaciente(ci: string): Promise<{ success: boolean; examenes?: Examen[]; error?: string }> {
    try {
      const resultPaciente = await DatabaseService.getPacienteByCi(ci);
      if (!resultPaciente.success || !resultPaciente.data || !resultPaciente.data.id) {
        return { success: false, error: 'Paciente no encontrado' };
      }

      // Aquí necesitarías un método en DatabaseService para obtener exámenes por pacienteId
      // Por ahora, usamos getExamenesPorEstado como ejemplo
      const examenes = await DatabaseService.getExamenesPorEstado('completado');
      const examenesPaciente = examenes.filter((e: Examen) => e.pacienteId === resultPaciente.data!.id);

      return { success: true, examenes: examenesPaciente };
    } catch (error) {
      console.error('Error obteniendo historial del paciente:', error);
      return { success: false, error: String(error) };
    }
  }

  // Validar datos antes de guardar
  static validarDatos(formData: FormData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar datos del paciente
    if (!formData.patientData.nombresApellidos.trim()) {
      errors.push('El nombre del paciente es requerido');
    }
    if (!formData.patientData.ci.trim()) {
      errors.push('La cédula de identidad es requerida');
    }
    if (!formData.patientData.sexo) {
      errors.push('El sexo del paciente es requerido');
    }
    if (!formData.patientData.fechaNacimiento) {
      errors.push('La fecha de nacimiento es requerida');
    }

    // Validar datos numéricos
    const peso = parseFloat(formData.patientData.peso);
    if (isNaN(peso) || peso <= 0) {
      errors.push('El peso debe ser un número válido mayor que 0');
    }

    const talla = parseFloat(formData.patientData.talla);
    if (isNaN(talla) || talla <= 0) {
      errors.push('La talla debe ser un número válido mayor que 0');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Exportar datos compatibles con el sistema actual de Word
  static async exportarYGuardar(formData: FormData, diagnostico: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Primero validar los datos
      const validacion = this.validarDatos(formData);
      if (!validacion.valid) {
        return {
          success: false,
          error: `Errores de validación: ${validacion.errors.join(', ')}`
        };
      }

      // Guardar en la base de datos
      const dbResult = await this.finalizarExamen(formData, diagnostico);
      if (!dbResult.success) {
        return {
          success: false,
          error: `Error guardando en base de datos: ${dbResult.error}`
        };
      }

      // También mantener compatibilidad con el sistema JSON anterior
      const todosLosDatos = {
        paciente: formData.patientData,
        medidas: formData.medidasVIData,
        ventriculos: formData.ventriculosAuriculasData,
        valvulas: formData.valvulasData,
        doppler: formData.dtvvData,
        diagnostico,
        fechaGuardado: getFechaLocalHoy(),
        examenId: dbResult.examenId,
        pacienteId: dbResult.pacienteId
      };

      // Guardar también como JSON (para compatibilidad)
      await DatabaseService.guardarPacienteJSON(todosLosDatos);
      
      return { success: true };
    } catch (error) {
      console.error('Error en exportar y guardar:', error);
      return { success: false, error: String(error) };
    }
  }
}
