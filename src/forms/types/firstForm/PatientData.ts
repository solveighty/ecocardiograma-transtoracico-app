import { BSAFormula } from '../../services/firstForm/personalData';

export interface PatientData {
  nombresApellidos: string;
  edad: string;
  sexo: string;
  ci: string;
  hcl: string; // Historia Clínica
  fechaNacimiento: Date | undefined;
  peso: string;
  talla: string;
  superficieCorporal: string;
  bsaFormula: BSAFormula; // Fórmula elegida para superficie corporal
  ventanas: string[];
  ritmo: string;
  frecuenciaCardiaca: string;
  fechaExamen: Date | undefined;
}
