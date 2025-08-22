// Tipos del quinto formulario: Doppler tisular, Grandes vasos y Venas pulmonares

export interface TisularMitralData {
  ePrime: string; // e'
  aPrime: string; // a'
  sPrime: string; // S
  triv: string;   // ms
}

export interface TisularTricuspideData {
  ePrime: string;
  aPrime: string;
  sPrime: string;
}

export interface GrandesVasosAortaData {
  rao: string;
  anillo: string;
  unionST: string;
  cayado: string;
  aoDesc: string;
  aoAbd: string;
}

export interface VCIData {
  dt: string;        // diámetro transversal (mm)
  colapso: string;   // %
}

export interface VenasPulmonaresData {
  ondaS: string;
  ondaD: string;
  ondaARev: string;
  durAr: string; // m/s o ms según medición del usuario
}

export interface ModoMColorData {
  // VP onda E en cm/s (medida manual en Doppler color tisular)
  vpOndaE: string;
}

export interface HallazgosCualitativosData {
  // Campos de texto libre (manual)
  pericardio: string; // derrame, engrosamiento, etc.
  tabiqueIA: string;  // DSA, aneurisma, FOP, etc.
  otros: string;      // observaciones complementarias
}

export interface DopplerVasosVenasData {
  tisularMitral: TisularMitralData;
  tisularTricuspide: TisularTricuspideData;
  grandesVasosAorta: GrandesVasosAortaData;
  vci: VCIData;
  venasPulmonares: VenasPulmonaresData;
  modoMColor: ModoMColorData;
  hallazgos: HallazgosCualitativosData;
}
