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
import { calcRelEA, calcGradPicoFromVmaxCm, calcPSVD, calcVR } from './fourthForm/valvulasCalculos';
import { generateDiagnosticTexts } from './diagnosticTexts';

// Interfaz para el objeto de datos que se enviará al template
interface ReportData {
  // Datos personales
  nombresApellidos: string;
  edad: string;
  sexo: string;
  ci: string;
  fechaNacimiento: string;
  peso: string;
  talla: string;
  superficieCorporal: string;
  ventana: string;
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

// Función auxiliar para convertir string a número de forma segura
function safeParseFloat(value: string | undefined, defaultValue: number = 0): number {
  if (!value || value.trim() === '') return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Función auxiliar para formatear números de forma segura
function safeFormat(value: string | number | undefined, decimals: number = 2): string {
  if (value === undefined || value === null) return '';
  
  if (typeof value === 'string') {
    if (!value || value.trim() === '') return '';
    const parsed = parseFloat(value);
    return isNaN(parsed) ? '' : parsed.toFixed(decimals);
  }
  return isNaN(value) ? '' : value.toFixed(decimals);
}

// Función auxiliar para obtener valores con fallback
function safeValue(value: string | undefined, fallback: string = 'No especificado'): string {
  if (!value || value.trim() === '') return fallback;
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
  const mitral_vr = calcVR(valvulasData.mitral.ore, valvulasData.mitral.itv);
  
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
    fechaNacimiento: formatDate(patientData.fechaNacimiento),
    peso: patientData.peso,
    talla: patientData.talla,
    superficieCorporal: patientData.superficieCorporal,
    ventana: patientData.ventana,
    ritmo: patientData.ritmo,
    frecuenciaCardiaca: patientData.frecuenciaCardiaca,
    fechaExamen: formatDate(patientData.fechaExamen),

    // Medidas VI
    ddfvi: safeValue(medidasVIData.ddfvi, '0'),
    dsfvi: safeValue(medidasVIData.dsfvi, '0'),
    gdsept: safeValue(medidasVIData.gdsept, '0'),
    gdpil: safeValue(medidasVIData.gdpil, '0'),
    rao: safeValue(medidasVIData.rao, '0'),
    vdfLineal: safeValue(medidasVIData.vdfLineal, '0'),
    vsfLineal: safeValue(medidasVIData.vsfLineal, '0'),
    vlLineal,
    feTeich,
    fa,
    vdfSimpson: safeValue(medidasVIData.vdfSimpson, '0'),
    vsfSimpson: safeValue(medidasVIData.vsfSimpson, '0'),
    vlSimpson,
    feSimpson,

    // Ventrículos y Aurículas
    masaVI,
    imvi,
    grp: safeValue(ventriculosAuriculasData.grp, '0'),
    mapse: safeValue(ventriculosAuriculasData.mapse, '0'),
    dpdt: safeValue(ventriculosAuriculasData.dpdt, '0'),
    basal: safeValue(ventriculosAuriculasData.basal, '0'),
    medio: safeValue(ventriculosAuriculasData.medio, '0'),
    long: safeValue(ventriculosAuriculasData.long, '0'),
    caf,
    ie: ie,
    relacionVdVi: relacionVdVi,
    tapse: safeValue(ventriculosAuriculasData.tapse, '0'),
    dai: safeValue(ventriculosAuriculasData.dai, '0'),
    areaAi: safeValue(ventriculosAuriculasData.areaAi, '0'),
    volAi: safeValue(ventriculosAuriculasData.volAi, '0'),
    volIndexAi: safeValue(ventriculosAuriculasData.volIndexAi, '0'),
    dmAd: safeValue(ventriculosAuriculasData.dmAd, '0'),
    areaAd: safeValue(ventriculosAuriculasData.areaAd, '0'),

    // Válvulas - Mitral
    mitral_ondaE: safeValue(valvulasData.mitral.ondaE, '0'),
    mitral_itv: safeValue(valvulasData.mitral.itv, '0'),
    mitral_ondaA: safeValue(valvulasData.mitral.ondaA, '0'),
    mitral_ore: safeValue(valvulasData.mitral.ore, '0'),
    mitral_relEA: mitral_relEA,
    mitral_vr: mitral_vr,
    mitral_durA: safeValue(valvulasData.mitral.durA, '0'),
    mitral_vc: safeValue(valvulasData.mitral.vc, '0'),
    mitral_tde: safeValue(valvulasData.mitral.tde, '0'),
    mitral_thp: safeValue(valvulasData.mitral.thp, '0'),
    mitral_reg: safeValue(valvulasData.mitral.reg, 'Sin regurgitación'),
    mitral_avm: safeValue(valvulasData.mitral.avm, '0'),
    mitral_vmax: safeValue(valvulasData.mitral.vmax, '0'),
    mitral_gradMax: mitral_gradMax,
    mitral_radio: safeValue(valvulasData.mitral.radio, '0'),
    mitral_gradMed: safeValue(valvulasData.mitral.gradMed, '0'),
    mitral_ny: safeValue(valvulasData.mitral.ny, '0'),

    // Válvulas - Tricúspide
    tricuspide_ondaE: valvulasData.tricuspide.ondaE,
    tricuspide_ondaA: valvulasData.tricuspide.ondaA,
    tricuspide_relEA: tricuspide_relEA,
    tricuspide_reg: valvulasData.tricuspide.reg,
    tricuspide_vmax: valvulasData.tricuspide.vmax,
    tricuspide_grpMax: tricuspide_grpMax,
    tricuspide_psvd: tricuspide_psvd,
    tricuspide_thp: valvulasData.tricuspide.thp,
    tricuspide_avt: valvulasData.tricuspide.avt,
    tricuspide_vc: valvulasData.tricuspide.vc,

    // Válvulas - Aorta
    aorta_vmax: safeValue(valvulasData.aorta.vmax, '0'),
    aorta_gpMax: aorta_gpMax,
    aorta_gradMed: safeValue(valvulasData.aorta.gradMed, '0'),
    aorta_avac: safeValue(valvulasData.aorta.avac, '0'),
    aorta_reg: safeValue(valvulasData.aorta.reg, 'Sin regurgitación'),
    aorta_thp: safeValue(valvulasData.aorta.thp, '0'),
    aorta_vc: safeValue(valvulasData.aorta.vc, '0'),
    aorta_flujoHolodiastolicoReverso: safeValue(valvulasData.aorta.flujoHolodiastolicoReverso, '0'),

    // Válvulas - Pulmonar
    pulmonar_vmax: valvulasData.pulmonar.vmax,
    pulmonar_gpMax: pulmonar_gpMax,
    pulmonar_tam: valvulasData.pulmonar.tam,
    pulmonar_reg: valvulasData.pulmonar.reg,
    pulmonar_pmap: valvulasData.pulmonar.pmap,
    pulmonar_pdvd: valvulasData.pulmonar.pdvd,
    pulmonar_vc: valvulasData.pulmonar.vc,

    // Doppler Tisular - Mitral
    tisularMitral_ePrime: dopplerData.tisularMitral.ePrime,
    tisularMitral_aPrime: dopplerData.tisularMitral.aPrime,
    tisularMitral_sPrime: dopplerData.tisularMitral.sPrime,
    tisularMitral_triv: dopplerData.tisularMitral.triv,
    relEePrime,

    // Doppler Tisular - Tricúspide
    tisularTricuspide_ePrime: dopplerData.tisularTricuspide.ePrime,
    tisularTricuspide_aPrime: dopplerData.tisularTricuspide.aPrime,
    tisularTricuspide_sPrime: dopplerData.tisularTricuspide.sPrime,

    // Grandes Vasos - Aorta
    gvAorta_rao: dopplerData.grandesVasosAorta.rao,
    gvAorta_anillo: dopplerData.grandesVasosAorta.anillo,
    gvAorta_unionST: dopplerData.grandesVasosAorta.unionST,
    gvAorta_cayado: dopplerData.grandesVasosAorta.cayado,
    gvAorta_aoDesc: dopplerData.grandesVasosAorta.aoDesc,
    gvAorta_aoAbd: dopplerData.grandesVasosAorta.aoAbd,

    // VCI
    vci_dt: safeValue(dopplerData.vci.dt, '15'),
    vci_colapso: safeValue(dopplerData.vci.colapso, '50'),

    // Venas Pulmonares
    venasPulmonares_ondaS: dopplerData.venasPulmonares.ondaS,
    venasPulmonares_ondaD: dopplerData.venasPulmonares.ondaD,
    venasPulmonares_ondaARev: dopplerData.venasPulmonares.ondaARev,
    venasPulmonares_durAr: dopplerData.venasPulmonares.durAr,
    venasPulmonares_relSD: relSD,

    // Modo M Color
    modoMColor_vpOndaE: dopplerData.modoMColor.vpOndaE,

    // Hallazgos
    pericardio: safeValue(dopplerData.hallazgos.pericardio, 'Normal'),
    tabiqueIA: safeValue(dopplerData.hallazgos.tabiqueIA, 'Normal'),
    otros: safeValue(dopplerData.hallazgos.otros, 'Sin hallazgos adicionales'),

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
    // Cargar la plantilla
    const templatePath = '/informe.docx';
    const response = await fetch(templatePath);
    
    if (!response.ok) {
      throw new Error(`Error al cargar la plantilla: ${response.statusText}`);
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

    console.log('Datos compilados para el reporte:', reportData);

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

    console.log('Informe generado exitosamente:', fileName);
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
