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

// Función auxiliar para validar que un número sea válido
function isValidNumber(value: string | undefined | null): boolean {
  if (isFieldEmpty(value)) return false;
  const num = parseFloat(value!);
  return !isNaN(num) && num > 0;
}

// Validar datos personales
function validatePatientData(data: PatientData): ValidationError[] {
  const errors: ValidationError[] = [];
  const section = "Datos Personales";

  // Campos obligatorios
  if (isFieldEmpty(data.nombresApellidos)) {
    errors.push({
      field: 'nombresApellidos',
      message: 'El campo "Nombres y apellidos" es obligatorio',
      section
    });
  }

  if (isFieldEmpty(data.edad)) {
    errors.push({
      field: 'edad',
      message: 'El campo "Edad" es obligatorio',
      section
    });
  }

  if (isFieldEmpty(data.sexo)) {
    errors.push({
      field: 'sexo',
      message: 'El campo "Sexo" es obligatorio',
      section
    });
  }

  if (!isValidNumber(data.peso)) {
    errors.push({
      field: 'peso',
      message: 'El campo "Peso" es obligatorio y debe ser un número válido',
      section
    });
  }

  if (!isValidNumber(data.talla)) {
    errors.push({
      field: 'talla',
      message: 'El campo "Talla" es obligatorio y debe ser un número válido',
      section
    });
  }

  if (!isValidNumber(data.superficieCorporal)) {
    errors.push({
      field: 'superficieCorporal',
      message: 'La "Superficie Corporal" es obligatoria (se calcula automáticamente si peso y talla están completos)',
      section
    });
  }

  if (!data.ventanas || data.ventanas.length === 0) {
    errors.push({
      field: 'ventanas',
      message: 'Debe seleccionar al menos una ventana de evaluación',
      section
    });
  }

  if (isFieldEmpty(data.ritmo)) {
    errors.push({
      field: 'ritmo',
      message: 'El campo "Ritmo" es obligatorio',
      section
    });
  }

  if (!isValidNumber(data.frecuenciaCardiaca)) {
    errors.push({
      field: 'frecuenciaCardiaca',
      message: 'El campo "Frecuencia Cardíaca" es obligatorio y debe ser un número válido',
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

// Validar mediciones VI
function validateMedidasVI(data: MedidasVIData): ValidationError[] {
  const errors: ValidationError[] = [];
  const section = "Mediciones VI";

  // Diámetros obligatorios
  if (!isValidNumber(data.ddfvi)) {
    errors.push({
      field: 'ddfvi',
      message: 'El "DDFVI" es obligatorio para calcular la función ventricular',
      section
    });
  }

  if (!isValidNumber(data.dsfvi)) {
    errors.push({
      field: 'dsfvi',
      message: 'El "DSFVI" es obligatorio para calcular la función ventricular',
      section
    });
  }

  if (!isValidNumber(data.gdsept)) {
    errors.push({
      field: 'gdsept',
      message: 'El "Grosor del Septum" es obligatorio para calcular la masa VI',
      section
    });
  }

  if (!isValidNumber(data.gdpil)) {
    errors.push({
      field: 'gdpil',
      message: 'El "Grosor de la Pared Posterior" es obligatorio para calcular la masa VI',
      section
    });
  }

  // Validar que al menos uno de los métodos de volumen esté completo
  const hasLinearVolumes = isValidNumber(data.vdfLineal) && isValidNumber(data.vsfLineal);
  const hasSimpsonVolumes = isValidNumber(data.vdfSimpson) && isValidNumber(data.vsfSimpson);

  if (!hasLinearVolumes && !hasSimpsonVolumes) {
    errors.push({
      field: 'volumes',
      message: 'Debe completar al menos VDF y VSF (método lineal o Simpson) para calcular la FE',
      section
    });
  }

  return errors;
}

// Validar ventrículos y aurículas
function validateVentriculosAuriculas(data: VentriculosAuriculasData): ValidationError[] {
  const errors: ValidationError[] = [];
  const section = "Ventrículos y Aurículas";

  // Los campos de masa VI e IMVI se calculan automáticamente, pero necesitamos GRP
  if (!isValidNumber(data.grp)) {
    errors.push({
      field: 'grp',
      message: 'El "GRP" es obligatorio para determinar el tipo de hipertrofia',
      section
    });
  }

  return errors;
}

// Validar válvulas (campos críticos para función diastólica)
function validateValvulas(data: ValvulasData): ValidationError[] {
  const errors: ValidationError[] = [];
  const section = "Válvulas";

  // Ondas mitrales obligatorias para función diastólica
  if (!isValidNumber(data.mitral.ondaE)) {
    errors.push({
      field: 'mitral_ondaE',
      message: 'La "Onda E mitral" es obligatoria para evaluar función diastólica',
      section
    });
  }

  if (!isValidNumber(data.mitral.ondaA)) {
    errors.push({
      field: 'mitral_ondaA',
      message: 'La "Onda A mitral" es obligatoria para calcular la relación E/A',
      section
    });
  }

  return errors;
}

// Validar Doppler tisular
function validateDopplerTisular(data: DopplerVasosVenasData): ValidationError[] {
  const errors: ValidationError[] = [];
  const section = "Doppler Tisular";

  // e' mitral es crítico para E/e'
  if (!isValidNumber(data.tisularMitral.ePrime)) {
    errors.push({
      field: 'tisularMitral_ePrime',
      message: 'La "e\' mitral" es obligatoria para calcular la relación E/e\'',
      section
    });
  }

  return errors;
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
