import { PatientData } from "../types/firstForm/PatientData";
import { MedidasVIData } from "../types/secondForm/MedidasVIData";
import type { ValvulasData } from "../types/fourthForm/ValvulasData";
import type { DopplerVasosVenasData } from "../types/fifthForm/DopplerTisularData";
import type { VentriculosAuriculasData } from "../types/thirdForm/VentriculosAuriculasData";
import { getFechaLocalHoy, parseFechaLocal } from "../../lib/dateUtils";

export function getInitialPatientData(): PatientData {
  return {
    nombresApellidos: "",
    edad: "",
    sexo: "",
    ci: "",
    hcl: "",
    fechaNacimiento: undefined,
    peso: "",
    talla: "",
    superficieCorporal: "",
    ventanas: [],
    ritmo: "",
    frecuenciaCardiaca: "",
    fechaExamen: parseFechaLocal(getFechaLocalHoy()),
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

export function getInitialVentriculosAuriculasData(
  medidasVIData: MedidasVIData,
  patientData: PatientData
): VentriculosAuriculasData {
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
    volAi: "",
    volIndexAi: "",
    superficieCorporal: patientData.superficieCorporal,
    // Aurícula Derecha
    dmAd: "",
    areaAd: "",
  };
}

// Centralized initial states for Valvulas
export function getInitialValvulasData(): ValvulasData {
  return {
    mitral: {
      ondaE: "",
      itv: "",
      ondaA: "",
      relEA: "",
      vr: "",
      durA: "",
      vc: "",
      tde: "",
      thp: "",
      reg: "",
      avm: "",
      vmax: "",
      gradMax: "",
      radio: "",
      gradMed: "",
      ny: "",
    },
    tricuspide: {
      ondaE: "",
      ondaA: "",
      relEA: "",
      reg: "",
      vmax: "",
      grpMax: "",
      psvd: "",
      rap: "3",
      thp: "",
      avt: "",
      vc: "",
    },
    aorta: {
      vmax: "",
      gpMax: "",
      gradMed: "",
      avac: "",
      reg: "",
      thp: "",
      vc: "",
      flujoHolodiastolicoReverso: "",
    },
    pulmonar: {
      vmax: "",
      gpMax: "",
      tam: "",
      reg: "",
      pmap: "",
      pdvd: "",
      vc: "",
    },
  };
}

// Centralized initial states for Doppler Tisular / Vasos / Venas
export function getInitialDopplerVasosVenasData(): DopplerVasosVenasData {
  return {
    tisularMitral: {
      ePrime: "",
      aPrime: "",
      sPrime: "",
      triv: "",
    },
    tisularTricuspide: {
      ePrime: "",
      aPrime: "",
      sPrime: "",
    },
    grandesVasosAorta: {
      rao: "",
      anillo: "",
      unionST: "",
      cayado: "",
      aoDesc: "",
      aoAbd: "",
    },
    vci: { dt: "", colapso: "" },
    venasPulmonares: {
      ondaS: "",
      ondaD: "",
      ondaARev: "",
      durAr: "",
    },
  modoMColor: { vpOndaE: "" },
  hallazgos: { pericardio: "", tabiqueIA: "", otros: "" },
  };
}
