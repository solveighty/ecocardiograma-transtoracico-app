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
  ventanas: string[];
  ritmo: string;
  frecuenciaCardiaca: string;
  fechaExamen: Date | undefined;
}
