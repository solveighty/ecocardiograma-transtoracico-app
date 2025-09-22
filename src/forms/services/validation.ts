import { PatientData } from '../types/firstForm/PatientData';
import { MedidasVIData } from '../types/secondForm/MedidasVIData';
import { VentriculosAuriculasData } from '../types/thirdForm/VentriculosAuriculasData';
import { ValvulasData } from '../types/fourthForm/ValvulasData';
import { DopplerVasosVenasData } from '../types/fifthForm/DopplerTisularData';

export interface ValidationError {
  field: string;
  message: string;
  section: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Función auxiliar para validar que un campo no esté vacío
function isFieldEmpty(value: string | undefined | null): boolean {
  return !value || value.trim() === '';
}

// Validar datos personales
function validatePatientData(data: PatientData): ValidationError[] {
  const errors: ValidationError[] = [];
  const section = "Datos Personales";

  // Solo campos básicos obligatorios según requisitos
  if (isFieldEmpty(data.nombresApellidos)) {
    errors.push({
      field: 'nombresApellidos',
      message: 'El campo "Nombres y apellidos" es obligatorio',
      section
    });
  }

  if (isFieldEmpty(data.ci)) {
    errors.push({
      field: 'ci',
      message: 'El campo "CI (Cédula de Identidad)" es obligatorio',
      section
    });
  }

  if (!data.fechaExamen) {
    errors.push({
      field: 'fechaExamen',
      message: 'La "Fecha del examen" es obligatoria',
      section
    });
  }

  return errors;
}

// Validar mediciones VI - Ahora opcional
function validateMedidasVI(_data: MedidasVIData): ValidationError[] {
  // Todos los campos son opcionales
  return [];
}

// Validar ventrículos y aurículas
// Validar ventrículos y aurículas - Ahora opcional
function validateVentriculosAuriculas(_data: VentriculosAuriculasData): ValidationError[] {
  // Todos los campos son opcionales
  return [];
}

// Validar válvulas - Ahora opcional
function validateValvulas(_data: ValvulasData): ValidationError[] {
  // Todos los campos son opcionales
  return [];
}

// Validar Doppler tisular - Ahora opcional
function validateDopplerTisular(_data: DopplerVasosVenasData): ValidationError[] {
  // Todos los campos son opcionales
  return [];
}

// Función principal de validación
export function validateFormData(
  patientData: PatientData,
  medidasVIData: MedidasVIData,
  ventriculosAuriculasData: VentriculosAuriculasData,
  valvulasData: ValvulasData,
  dopplerData: DopplerVasosVenasData
): ValidationResult {
  const allErrors: ValidationError[] = [
    ...validatePatientData(patientData),
    ...validateMedidasVI(medidasVIData),
    ...validateVentriculosAuriculas(ventriculosAuriculasData),
    ...validateValvulas(valvulasData),
    ...validateDopplerTisular(dopplerData)
  ];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}

// Función para formatear errores para mostrar al usuario
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';

  const errorsBySection = errors.reduce((acc, error) => {
    if (!acc[error.section]) {
      acc[error.section] = [];
    }
    acc[error.section].push(error.message);
    return acc;
  }, {} as Record<string, string[]>);

  let message = '⚠️ CAMPOS OBLIGATORIOS FALTANTES\n\n';
  message += 'Para generar el reporte médico, debe completar los siguientes campos obligatorios:\n\n';

  Object.entries(errorsBySection).forEach(([section, sectionErrors]) => {
    message += `📋 ${section}:\n`;
    sectionErrors.forEach(error => {
      message += `   • ${error}\n`;
    });
    message += '\n';
  });

  message += '💡 Los campos marcados como opcionales pueden dejarse vacíos y aparecerán como "No evaluado" en el reporte.\n\n';
  message += '✅ Complete los campos obligatorios y vuelva a intentar generar el reporte.';

  return message;
}
