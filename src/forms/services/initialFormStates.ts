import { PatientData } from "../types/firstForm/PatientData";
import { MedidasVIData } from "../types/secondForm/MedidasVIData";

export function getInitialPatientData(): PatientData {
  return {
    nombresApellidos: "",
    edad: "",
    sexo: "",
    ci: "",
    fechaNacimiento: undefined,
    peso: "",
    talla: "",
    superficieCorporal: "",
    ventana: "",
    ritmo: "",
    frecuenciaCardiaca: "",
    fechaExamen: new Date(),
  };
}

export function getInitialMedidasVIData(): MedidasVIData {
  return {
    ddfvi: "",
    dsfvi: "",
    gdsept: "",
    gdpil: "",
    rao: "",
    vdfLineal: "",
    vsfLineal: "",
    vdfSimpson: "",
    vsfSimpson: "",
  };
}

export function getInitialVentriculosAuriculasData(medidasVIData: MedidasVIData, patientData: PatientData) {
  return {
    // Ventrículo Izquierdo
    ddfvi: medidasVIData.ddfvi,
    gdsept: medidasVIData.gdsept,
    gdpil: medidasVIData.gdpil,
    masa: "",
    imvi: "",
    grp: "",
    mapse: "",
    tiempoDPDT: "",
    dpdt: "",
    // Ventrículo Derecho
    basal: "",
    basalSistolico: "",
    caf: "",
    medio: "",
    ie: "",
    long: "",
    relacionVdVi: "",
    tapse: "",
    medidaVI: "",
    // Aurícula Izquierda
    dai: "",
    areaAi: "",
    areaAi2C: "",
    volAi: "",
    volIndexAi: "",
    superficieCorporal: patientData.superficieCorporal,
    // Aurícula Derecha
    dmAd: "",
    areaAd: "",
  };
}
