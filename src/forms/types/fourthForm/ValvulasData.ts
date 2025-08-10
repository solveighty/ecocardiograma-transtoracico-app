export interface MitralData {
  ondaE: string;
  itv: string;
  ondaA: string;
  ore: string;
  relEA: string;
  vr: string;
  durA: string;
  vc: string;
  tde: string;
  thp: string;
  reg: string;
  avm: string;
  vmax: string;
  gradMax: string;
  radio: string;
  gradMed: string;
  ny: string;
}

export interface TricuspideData {
  ondaE: string;
  ondaA: string;
  relEA: string;
  reg: string;
  vmax: string;
  grpMax: string;
  psvd: string;
  rap: string;
  thp: string;
  avt: string;
  vc: string;
}

export interface AortaData {
  vmax: string;
  gpMax: string;
  gradMed: string;
  avac: string;
  reg: string;
  thp: string;
  vc: string;
  flujoHolodiastolicoReverso: string;
}

export interface PulmonarData {
  vmax: string;
  gpMax: string;
  tam: string;
  reg: string;
  pmap: string;
  pdvd: string;
  vc: string;
}

export interface ValvulasData {
  mitral: MitralData;
  tricuspide: TricuspideData;
  aorta: AortaData;
  pulmonar: PulmonarData;
}
