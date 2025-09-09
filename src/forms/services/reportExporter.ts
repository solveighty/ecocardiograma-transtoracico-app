import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { PatientData } from '../types/firstForm/PatientData';
import { MedidasVIData } from '../types/secondForm/MedidasVIData';
import { VentriculosAuriculasData } from '../types/thirdForm/VentriculosAuriculasData';
import { ValvulasData } from '../types/fourthForm/ValvulasData';
import { DopplerVasosVenasData } from '../types/fifthForm/DopplerTisularData';
import { calcVL, calcFETeich, calcFA, calcFE_Simpson } from './secondForm/medidasVI';
import { calcMasaVI, calcIMVI, calcIE, calcRelacionVDVI } from './thirdForm/ventriculosAuriculasCalculos';
import { calcRelEePrime, calcRelSD } from './fifthForm/calculos';
import { calcRelEA, calcGradPicoFromVmaxCm, calcPSVD, calcVR, calcERO_PISA } from './fourthForm/valvulasCalculos';
import { generateDiagnosticTexts } from './diagnosticTexts';
import { validateFormData, formatValidationErrors } from './validation';

// Interfaz para el objeto de datos que se enviará al template
interface ReportData {
  // Datos personales
  nombresApellidos: string;
  edad: string;
  sexo: string;
  ci: string;
  hcl: string;
  fechaNacimiento: string;
  peso: string;
  talla: string;
  superficieCorporal: string;
  ventanas: string;
  ritmo: string;
  frecuenciaCardiaca: string;
  fechaExamen: string;

  // Medidas VI
  ddfvi: string;
  dsfvi: string;
  gdsept: string;
  gdpil: string;
  rao: string;
  vdfLineal: string;
  vsfLineal: string;
  vlLineal: string; // calculado
  feTeich: string; // calculado
  fa: string; // calculado
  vdfSimpson: string;
  vsfSimpson: string;
  vlSimpson: string; // calculado
  feSimpson: string; // calculado

  // Ventrículos y Aurículas
  masaVI: string; // calculado
  imvi: string; // calculado
  grp: string;
  mapse: string;
  dpdt: string;
  basal: string;
  medio: string;
  long: string;
  caf: string; // calculado
  ie: string;
  relacionVdVi: string;
  tapse: string;
  dai: string;
  areaAi: string;
  volAi: string;
  volIndexAi: string;
  dmAd: string;
  areaAd: string;

  // Válvulas - Mitral
  mitral_ondaE: string;
  mitral_itv: string;
  mitral_ondaA: string;
  mitral_ore: string;
  mitral_relEA: string;
  mitral_vr: string;
  mitral_durA: string;
  mitral_vc: string;
  mitral_tde: string;
  mitral_thp: string;
  mitral_reg: string;
  mitral_avm: string;
  mitral_vmax: string;
  mitral_gradMax: string;
  mitral_radio: string;
  mitral_gradMed: string;
  mitral_ny: string;

  // Válvulas - Tricúspide
  tricuspide_ondaE: string;
  tricuspide_ondaA: string;
  tricuspide_relEA: string;
  tricuspide_reg: string;
  tricuspide_vmax: string;
  tricuspide_grpMax: string;
  tricuspide_psvd: string;
  tricuspide_thp: string;
  tricuspide_avt: string;
  tricuspide_vc: string;

  // Válvulas - Aorta
  aorta_vmax: string;
  aorta_gpMax: string;
  aorta_gradMed: string;
  aorta_avac: string;
  aorta_reg: string;
  aorta_thp: string;
  aorta_vc: string;
  aorta_flujoHolodiastolicoReverso: string;
  aorta_diametroTsvi: string;
  aorta_itvTsvi: string;
  aorta_itvAorta: string;

  // Válvulas - Pulmonar
  pulmonar_vmax: string;
  pulmonar_gpMax: string;
  pulmonar_tam: string;
  pulmonar_reg: string;
  pulmonar_pmap: string;
  pulmonar_pdvd: string;
  pulmonar_vc: string;

  // Doppler Tisular - Mitral
  tisularMitral_ePrime: string;
  tisularMitral_aPrime: string;
  tisularMitral_sPrime: string;
  tisularMitral_triv: string;
  relEePrime: string; // calculado

  // Doppler Tisular - Tricúspide
  tisularTricuspide_ePrime: string;
  tisularTricuspide_aPrime: string;
  tisularTricuspide_sPrime: string;

  // Grandes Vasos - Aorta
  gvAorta_rao: string;
  gvAorta_anillo: string;
  gvAorta_unionST: string;
  gvAorta_cayado: string;
  gvAorta_aoDesc: string;
  gvAorta_aoAbd: string;

  // VCI
  vci_dt: string;
  vci_colapso: string;

  // Venas Pulmonares
  venasPulmonares_ondaS: string;
  venasPulmonares_ondaD: string;
  venasPulmonares_ondaARev: string;
  venasPulmonares_durAr: string;
  venasPulmonares_relSD: string; // calculado

  // Modo M Color
  modoMColor_vpOndaE: string;

  // Hallazgos
  pericardio: string;
  tabiqueIA: string;
  otros: string;

  // Diagnósticos automáticos
  diag_diametrosVI: string;
  diag_volumenSistolicoVI: string;
  diag_volumenDiastolicoVI: string;
  diag_gdsept: string;
  diag_gdpil: string;
  diag_funcionVI: string;
  diag_imvi_grp: string;
  tipoHipertrofia: string;
  diag_disfuncionDiastolica: string;
  diag_ai: string;
  diag_ad: string;
  diag_vd: string;
  diag_valvulaMitral: string;
  diag_dopplerMitral: string;
  diag_vpOndaE: string;
  diag_venasPulmonares: string;
  diag_raizAortica: string;
  diag_valvulaAortica: string;
  diag_aortaToracica: string;
  diag_aortaAbdominal: string;
  diag_pulmonar: string;
  diag_valvulaTricuspide: string;
  diag_vci: string;
  diag_tabiqueIA: string;
  diag_pericardio: string;
  conclusion_miocardio: string;
  conclusion_hipertrofiaVI: string;
  conclusion_disfuncionVI: string;
  conclusion_disfuncionVD: string;
  conclusion_insufTricuspide: string;
  conclusion_insufMitral: string;
  conclusion_insufPulmonar: string;
  conclusion_hipertensionPulmonar: string;
}

// Función para formatear fecha
function formatDate(date: Date | undefined): string {
  if (!date) return '';
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Función auxiliar para obtener valores con fallback
function safeValue(value: string | undefined, fallback: string = 'no evaluado'): string {
  if (!value || value.trim() === '') return fallback;
  return value;
}

// Función auxiliar para formatear las ventanas seleccionadas
function formatVentanas(ventanas: string[]): string {
  if (!ventanas || ventanas.length === 0) {
    return "no evaluado";
  }
  
  // Mapear valores internos a nombres amigables
  const ventanaLabels: { [key: string]: string } = {
    optima: "Ventana óptima",
    suboptima: "Ventana subóptima",
    // Mantener compatibilidad con valores antiguos
    paraesternal: "Paraesternal",
    apical: "Apical",
    subcostal: "Subcostal",
    supraesternal: "Supraesternal"
  };
  
  const formattedVentanas = ventanas.map(v => ventanaLabels[v] || v);
  
  if (formattedVentanas.length === 1) {
    return formattedVentanas[0];
  }
  
  if (formattedVentanas.length === 2) {
    return `${formattedVentanas[0]} y ${formattedVentanas[1]}`;
  }
  
  // Para 3 o más ventanas: "A, B y C"
  const allButLast = formattedVentanas.slice(0, -1);
  const last = formattedVentanas[formattedVentanas.length - 1];
  return `${allButLast.join(", ")} y ${last}`;
}

// Función auxiliar para valores opcionales que pueden no estar evaluados
function optionalValue(value: string | undefined): string {
  return safeValue(value, 'no evaluado');
}

// Función auxiliar para valores numéricos opcionales
function optionalNumericValue(value: string | undefined): string {
  if (!value || value.trim() === '' || isNaN(parseFloat(value))) {
    return 'no evaluado';
  }
  return value;
}

// Función auxiliar para valores calculados que pueden estar vacíos
function calculatedValue(value: string): string {
  if (!value || value.trim() === '') {
    return 'no evaluado';
  }
  return value;
}

// Función para compilar todos los datos en el formato requerido por el template
export function compileReportData(
  patientData: PatientData,
  medidasVIData: MedidasVIData,
  ventriculosAuriculasData: VentriculosAuriculasData,
  valvulasData: ValvulasData,
  dopplerData: DopplerVasosVenasData
): ReportData {
  // Cálculos automáticos
  const vlLineal = calcVL(medidasVIData.vdfLineal, medidasVIData.vsfLineal);
  const feTeich = calcFETeich(medidasVIData.ddfvi, medidasVIData.dsfvi);
  const fa = calcFA(medidasVIData.ddfvi, medidasVIData.dsfvi);
  const vlSimpson = calcVL(medidasVIData.vdfSimpson, medidasVIData.vsfSimpson);
  const feSimpson = calcFE_Simpson(medidasVIData.vdfSimpson, medidasVIData.vsfSimpson);
  
  const masaVI = calcMasaVI({
    ddfvi: ventriculosAuriculasData.ddfvi,
    gdsept: ventriculosAuriculasData.gdsept,
    gdpil: ventriculosAuriculasData.gdpil
  });
  const imvi = calcIMVI({
    masaVI,
    superficieCorporal: ventriculosAuriculasData.superficieCorporal
  });
  
  // Calcular CAF si los valores están disponibles
  const caf = (() => {
    const basalNum = parseFloat(ventriculosAuriculasData.basal || '0');
    const basalSistolicoNum = parseFloat(ventriculosAuriculasData.basalSistolico || '0');
    if (basalNum > 0 && basalSistolicoNum >= 0) {
      return (((basalNum - basalSistolicoNum) / basalNum) * 100).toFixed(1);
    }
    return '';
  })();
  
  // Calcular IE y relación VD/VI
  const ie = calcIE(ventriculosAuriculasData.basal, ventriculosAuriculasData.long);
  const relacionVdVi = calcRelacionVDVI(ventriculosAuriculasData.basal, ventriculosAuriculasData.medidaVI);
  
  // Cálculos de válvulas automáticos
  const mitral_relEA = calcRelEA(valvulasData.mitral.ondaE, valvulasData.mitral.ondaA);
  const mitral_gradMax = calcGradPicoFromVmaxCm(valvulasData.mitral.vmax);
  const mitral_ero_pisa = calcERO_PISA(valvulasData.mitral.radio, valvulasData.mitral.ny, valvulasData.mitral.vmax);
  const mitral_vr = calcVR(mitral_ero_pisa, valvulasData.mitral.itv);
  
  const tricuspide_relEA = calcRelEA(valvulasData.tricuspide.ondaE, valvulasData.tricuspide.ondaA);
  const tricuspide_grpMax = calcGradPicoFromVmaxCm(valvulasData.tricuspide.vmax);
  const tricuspide_psvd = calcPSVD(valvulasData.tricuspide.vmax, valvulasData.tricuspide.rap);
  
  const aorta_gpMax = calcGradPicoFromVmaxCm(valvulasData.aorta.vmax);
  const pulmonar_gpMax = calcGradPicoFromVmaxCm(valvulasData.pulmonar.vmax);
  
  const relEePrime = calcRelEePrime(valvulasData.mitral.ondaE, dopplerData.tisularMitral.ePrime);
  const relSD = calcRelSD(dopplerData.venasPulmonares.ondaS, dopplerData.venasPulmonares.ondaD);

  // Crear objeto temporal con todos los datos para generar diagnósticos
  const tempData = {
    // Datos básicos
    ddfvi: medidasVIData.ddfvi,
    dsfvi: medidasVIData.dsfvi,
    gdsept: medidasVIData.gdsept,
    gdpil: medidasVIData.gdpil,
    vdfSimpson: medidasVIData.vdfSimpson,
    vsfSimpson: medidasVIData.vsfSimpson,
    feSimpson,
    imvi,
    grp: ventriculosAuriculasData.grp,
    
    // Aurículas
    dai: ventriculosAuriculasData.dai,
    areaAi: ventriculosAuriculasData.areaAi,
    volAi: ventriculosAuriculasData.volAi,
    volIndexAi: ventriculosAuriculasData.volIndexAi,
    dmAd: ventriculosAuriculasData.dmAd,
    areaAd: ventriculosAuriculasData.areaAd,
    
    // Ventrículo derecho
    basal: ventriculosAuriculasData.basal,
    tapse: ventriculosAuriculasData.tapse,
    
    // Válvulas
    mitral_relEA,
    mitral_reg: valvulasData.mitral.reg,
    relEePrime,
    tricuspide_psvd,
    tricuspide_reg: valvulasData.tricuspide.reg,
    aorta_avac: valvulasData.aorta.avac,
    aorta_vmax: valvulasData.aorta.vmax,
    aorta_reg: valvulasData.aorta.reg,
    pulmonar_vmax: valvulasData.pulmonar.vmax,
    pulmonar_reg: valvulasData.pulmonar.reg,
    pulmonar_pmap: valvulasData.pulmonar.pmap,
    
    // VCI
    vci_dt: dopplerData.vci.dt,
    vci_colapso: dopplerData.vci.colapso,
    
    // Grandes vasos
    gvAorta_rao: dopplerData.grandesVasosAorta.rao,
    gvAorta_unionST: dopplerData.grandesVasosAorta.unionST,
    gvAorta_cayado: dopplerData.grandesVasosAorta.cayado,
    gvAorta_aoDesc: dopplerData.grandesVasosAorta.aoDesc,
    gvAorta_aoAbd: dopplerData.grandesVasosAorta.aoAbd,
    
    // Venas pulmonares
    venasPulmonares_relSD: relSD,
    
    // Modo M Color
    modoMColor_vpOndaE: dopplerData.modoMColor.vpOndaE,
    
    // Hallazgos
    pericardio: dopplerData.hallazgos.pericardio,
    tabiqueIA: dopplerData.hallazgos.tabiqueIA,
    otros: dopplerData.hallazgos.otros
  };

  // Generar todos los textos de diagnóstico
  const diagnosticTexts = generateDiagnosticTexts(tempData, patientData.sexo);

  return {
    // Datos personales
    nombresApellidos: patientData.nombresApellidos,
    edad: patientData.edad,
    sexo: patientData.sexo,
    ci: patientData.ci,
    hcl: patientData.hcl,
    fechaNacimiento: formatDate(patientData.fechaNacimiento),
    peso: patientData.peso,
    talla: patientData.talla,
    superficieCorporal: patientData.superficieCorporal,
    ventanas: formatVentanas(patientData.ventanas),
    ritmo: patientData.ritmo,
    frecuenciaCardiaca: patientData.frecuenciaCardiaca,
    fechaExamen: formatDate(patientData.fechaExamen),

    // Medidas VI
    ddfvi: optionalNumericValue(medidasVIData.ddfvi),
    dsfvi: optionalNumericValue(medidasVIData.dsfvi),
    gdsept: optionalNumericValue(medidasVIData.gdsept),
    gdpil: optionalNumericValue(medidasVIData.gdpil),
    rao: optionalNumericValue(medidasVIData.rao),
    vdfLineal: optionalNumericValue(medidasVIData.vdfLineal),
    vsfLineal: optionalNumericValue(medidasVIData.vsfLineal),
    vlLineal: calculatedValue(vlLineal),
    feTeich: calculatedValue(feTeich),
    fa: calculatedValue(fa),
    vdfSimpson: optionalNumericValue(medidasVIData.vdfSimpson),
    vsfSimpson: optionalNumericValue(medidasVIData.vsfSimpson),
    vlSimpson: calculatedValue(vlSimpson),
    feSimpson: calculatedValue(feSimpson),

    // Ventrículos y Aurículas
    masaVI: calculatedValue(masaVI),
    imvi: calculatedValue(imvi),
    grp: optionalNumericValue(ventriculosAuriculasData.grp),
    mapse: optionalNumericValue(ventriculosAuriculasData.mapse),
    dpdt: optionalNumericValue(ventriculosAuriculasData.dpdt),
    basal: optionalNumericValue(ventriculosAuriculasData.basal),
    medio: optionalNumericValue(ventriculosAuriculasData.medio),
    long: optionalNumericValue(ventriculosAuriculasData.long),
    caf: calculatedValue(caf),
    ie: calculatedValue(ie),
    relacionVdVi: calculatedValue(relacionVdVi),
    tapse: optionalNumericValue(ventriculosAuriculasData.tapse),
    dai: optionalNumericValue(ventriculosAuriculasData.dai),
    areaAi: optionalNumericValue(ventriculosAuriculasData.areaAi),
    volAi: optionalNumericValue(ventriculosAuriculasData.volAi),
    volIndexAi: optionalNumericValue(ventriculosAuriculasData.volIndexAi),
    dmAd: optionalNumericValue(ventriculosAuriculasData.dmAd),
    areaAd: optionalNumericValue(ventriculosAuriculasData.areaAd),

    // Válvulas - Mitral
    mitral_ondaE: optionalNumericValue(valvulasData.mitral.ondaE),
    mitral_itv: optionalNumericValue(valvulasData.mitral.itv),
    mitral_ondaA: optionalNumericValue(valvulasData.mitral.ondaA),
    mitral_ore: calculatedValue(mitral_ero_pisa),
    mitral_relEA: calculatedValue(mitral_relEA),
    mitral_vr: calculatedValue(mitral_vr),
    mitral_durA: optionalNumericValue(valvulasData.mitral.durA),
    mitral_vc: optionalNumericValue(valvulasData.mitral.vc),
    mitral_tde: optionalNumericValue(valvulasData.mitral.tde),
    mitral_thp: optionalNumericValue(valvulasData.mitral.thp),
    mitral_reg: optionalValue(valvulasData.mitral.reg),
    mitral_avm: optionalNumericValue(valvulasData.mitral.avm),
    mitral_vmax: optionalNumericValue(valvulasData.mitral.vmax),
    mitral_gradMax: calculatedValue(mitral_gradMax),
    mitral_radio: optionalNumericValue(valvulasData.mitral.radio),
    mitral_gradMed: optionalNumericValue(valvulasData.mitral.gradMed),
    mitral_ny: optionalNumericValue(valvulasData.mitral.ny),

    // Válvulas - Tricúspide
    tricuspide_ondaE: optionalNumericValue(valvulasData.tricuspide.ondaE),
    tricuspide_ondaA: optionalNumericValue(valvulasData.tricuspide.ondaA),
    tricuspide_relEA: calculatedValue(tricuspide_relEA),
    tricuspide_reg: optionalValue(valvulasData.tricuspide.reg),
    tricuspide_vmax: optionalNumericValue(valvulasData.tricuspide.vmax),
    tricuspide_grpMax: calculatedValue(tricuspide_grpMax),
    tricuspide_psvd: calculatedValue(tricuspide_psvd),
    tricuspide_thp: optionalNumericValue(valvulasData.tricuspide.thp),
    tricuspide_avt: optionalNumericValue(valvulasData.tricuspide.avt),
    tricuspide_vc: optionalNumericValue(valvulasData.tricuspide.vc),

    // Válvulas - Aorta
    aorta_vmax: optionalNumericValue(valvulasData.aorta.vmax),
    aorta_gpMax: calculatedValue(aorta_gpMax),
    aorta_gradMed: optionalNumericValue(valvulasData.aorta.gradMed),
    aorta_avac: optionalNumericValue(valvulasData.aorta.avac),
    aorta_reg: optionalValue(valvulasData.aorta.reg),
    aorta_thp: optionalNumericValue(valvulasData.aorta.thp),
    aorta_vc: optionalNumericValue(valvulasData.aorta.vc),
    aorta_flujoHolodiastolicoReverso: optionalValue(valvulasData.aorta.flujoHolodiastolicoReverso),
    aorta_diametroTsvi: optionalNumericValue(valvulasData.aorta.diametroTsvi),
    aorta_itvTsvi: optionalNumericValue(valvulasData.aorta.itvTsvi),
    aorta_itvAorta: optionalNumericValue(valvulasData.aorta.itvAorta),

    // Válvulas - Pulmonar
    pulmonar_vmax: optionalNumericValue(valvulasData.pulmonar.vmax),
    pulmonar_gpMax: calculatedValue(pulmonar_gpMax),
    pulmonar_tam: optionalNumericValue(valvulasData.pulmonar.tam),
    pulmonar_reg: optionalValue(valvulasData.pulmonar.reg),
    pulmonar_pmap: optionalNumericValue(valvulasData.pulmonar.pmap),
    pulmonar_pdvd: optionalNumericValue(valvulasData.pulmonar.pdvd),
    pulmonar_vc: optionalNumericValue(valvulasData.pulmonar.vc),

    // Doppler Tisular - Mitral
    tisularMitral_ePrime: optionalNumericValue(dopplerData.tisularMitral.ePrime),
    tisularMitral_aPrime: optionalNumericValue(dopplerData.tisularMitral.aPrime),
    tisularMitral_sPrime: optionalNumericValue(dopplerData.tisularMitral.sPrime),
    tisularMitral_triv: optionalNumericValue(dopplerData.tisularMitral.triv),
    relEePrime: calculatedValue(relEePrime),

    // Doppler Tisular - Tricúspide
    tisularTricuspide_ePrime: optionalNumericValue(dopplerData.tisularTricuspide.ePrime),
    tisularTricuspide_aPrime: optionalNumericValue(dopplerData.tisularTricuspide.aPrime),
    tisularTricuspide_sPrime: optionalNumericValue(dopplerData.tisularTricuspide.sPrime),

    // Grandes Vasos - Aorta (opcionales)
    gvAorta_rao: optionalNumericValue(dopplerData.grandesVasosAorta.rao),
    gvAorta_anillo: optionalNumericValue(dopplerData.grandesVasosAorta.anillo),
    gvAorta_unionST: optionalNumericValue(dopplerData.grandesVasosAorta.unionST),
    gvAorta_cayado: optionalNumericValue(dopplerData.grandesVasosAorta.cayado),
    gvAorta_aoDesc: optionalNumericValue(dopplerData.grandesVasosAorta.aoDesc),
    gvAorta_aoAbd: optionalNumericValue(dopplerData.grandesVasosAorta.aoAbd),

    // VCI (opcional)
    vci_dt: optionalNumericValue(dopplerData.vci.dt),
    vci_colapso: optionalNumericValue(dopplerData.vci.colapso),

    // Venas Pulmonares (opcionales)
    venasPulmonares_ondaS: optionalNumericValue(dopplerData.venasPulmonares.ondaS),
    venasPulmonares_ondaD: optionalNumericValue(dopplerData.venasPulmonares.ondaD),
    venasPulmonares_ondaARev: optionalNumericValue(dopplerData.venasPulmonares.ondaARev),
    venasPulmonares_durAr: optionalNumericValue(dopplerData.venasPulmonares.durAr),
    venasPulmonares_relSD: calculatedValue(relSD),

    // Modo M Color (opcional)
    modoMColor_vpOndaE: optionalNumericValue(dopplerData.modoMColor.vpOndaE),

    // Hallazgos (opcionales)
    pericardio: optionalValue(dopplerData.hallazgos.pericardio),
    tabiqueIA: optionalValue(dopplerData.hallazgos.tabiqueIA),
    otros: optionalValue(dopplerData.hallazgos.otros),

    // Diagnósticos automáticos
    ...diagnosticTexts,
  };
}

// Función para generar el documento Word
export async function generateWordReport(
  patientData: PatientData,
  medidasVIData: MedidasVIData,
  ventriculosAuriculasData: VentriculosAuriculasData,
  valvulasData: ValvulasData,
  dopplerData: DopplerVasosVenasData
): Promise<void> {
  try {

    // Validar datos obligatorios antes de exportar
    const validationResult = validateFormData(
      patientData,
      medidasVIData,
      ventriculosAuriculasData,
      valvulasData,
      dopplerData
    );


    if (!validationResult.isValid) {
      console.error('❌ Errores de validación:', validationResult.errors);
      const errorMessage = formatValidationErrors(validationResult.errors);
      alert(errorMessage);
      throw new Error('Validación fallida: Faltan campos obligatorios');
    }


    // Cargar la plantilla - Manejar rutas para desarrollo y producción
    let templatePath = '/informe.docx';
    let response: Response | null = null;
    
    // En aplicaciones Electron empaquetadas, usar diferentes estrategias
    if (window.location.protocol === 'file:') {
      // Intentar múltiples rutas posibles
      const possiblePaths = [
        './informe.docx',
        '../informe.docx',
        '../../informe.docx',
        '/informe.docx'
      ];
      
      
      // Función auxiliar para probar una ruta
      const tryPath = async (path: string): Promise<Response | null> => {
        try {
          console.log(`📂 Probando ruta: ${path}`);
          const resp = await fetch(path);
          if (resp.ok) {
            return resp;
          }
          return null;
        } catch (error) {
          return null;
        }
      };
      
      // Probar cada ruta hasta encontrar una que funcione
      let foundResponse: Response | null = null;
      for (const path of possiblePaths) {
        foundResponse = await tryPath(path);
        if (foundResponse) {
          templatePath = path;
          response = foundResponse;
          break;
        }
      }
      
      if (!foundResponse) {
        throw new Error('No se pudo encontrar el archivo informe.docx en ninguna de las rutas probadas');
      }
      
      
    } else {
      
      response = await fetch(templatePath);
      
      if (!response.ok) {
        throw new Error(`Error al cargar la plantilla: ${response.statusText}`);
      }
    }
    
    // Verificar que tenemos una respuesta válida
    if (!response) {
      throw new Error('No se pudo cargar la plantilla informe.docx');
    }
    
    const templateBuffer = await response.arrayBuffer();
    
    // Crear instancia de PizZip
    const zip = new PizZip(templateBuffer);
    
    // Crear instancia de Docxtemplater con configuración mejorada
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '{{',
        end: '}}'
      }
    });

    // Compilar datos
    const reportData = compileReportData(
      patientData,
      medidasVIData,
      ventriculosAuriculasData,
      valvulasData,
      dopplerData
    );

    // Renderizar documento con los datos
    doc.render(reportData);

    // Generar el archivo
    const output = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Descargar el archivo
    const fileName = `Informe_Ecocardiograma_${patientData.nombresApellidos.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(output);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

  } catch (error: any) {
    console.error('Error detallado al generar el informe:', error);
    
    // Si es un error de docxtemplater, mostrar más detalles
    if (error.name === 'TemplateError') {
      console.error('Errores de plantilla:', error.properties?.errors);
      
      let errorMessage = 'Error en la plantilla del documento:\n';
      if (error.properties?.errors) {
        error.properties.errors.forEach((err: any, index: number) => {
          errorMessage += `${index + 1}. ${err.message}\n`;
          if (err.properties) {
            errorMessage += `   Detalles: ${JSON.stringify(err.properties)}\n`;
          }
        });
      }
      
      throw new Error(errorMessage);
    }
    
    throw error;
  }
}
