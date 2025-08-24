import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { PatientData } from '../types/firstForm/PatientData';
import { MedidasVIData } from '../types/secondForm/MedidasVIData';
import { VentriculosAuriculasData } from '../types/thirdForm/VentriculosAuriculasData';
import { ValvulasData } from '../types/fourthForm/ValvulasData';
import { DopplerVasosVenasData } from '../types/fifthForm/DopplerTisularData';
import { calcVL, calcFETeich, calcFA, calcFE_Simpson } from './secondForm/medidasVI';
import { calcMasaVI, calcIMVI } from './thirdForm/ventriculosAuriculasCalculos';
import { calcRelEePrime, calcRelSD } from './fifthForm/calculos';

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
  
  const relEePrime = calcRelEePrime(valvulasData.mitral.ondaE, dopplerData.tisularMitral.ePrime);
  const relSD = calcRelSD(dopplerData.venasPulmonares.ondaS, dopplerData.venasPulmonares.ondaD);

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
    ddfvi: medidasVIData.ddfvi,
    dsfvi: medidasVIData.dsfvi,
    gdsept: medidasVIData.gdsept,
    gdpil: medidasVIData.gdpil,
    rao: medidasVIData.rao,
    vdfLineal: medidasVIData.vdfLineal,
    vsfLineal: medidasVIData.vsfLineal,
    vlLineal,
    feTeich,
    fa,
    vdfSimpson: medidasVIData.vdfSimpson,
    vsfSimpson: medidasVIData.vsfSimpson,
    vlSimpson,
    feSimpson,

    // Ventrículos y Aurículas
    masaVI,
    imvi,
    grp: ventriculosAuriculasData.grp,
    mapse: ventriculosAuriculasData.mapse,
    dpdt: ventriculosAuriculasData.dpdt,
    basal: ventriculosAuriculasData.basal,
    medio: ventriculosAuriculasData.medio,
    long: ventriculosAuriculasData.long,
    caf,
    ie: ventriculosAuriculasData.ie,
    relacionVdVi: ventriculosAuriculasData.relacionVdVi,
    tapse: ventriculosAuriculasData.tapse,
    dai: ventriculosAuriculasData.dai,
    areaAi: ventriculosAuriculasData.areaAi,
    volAi: ventriculosAuriculasData.volAi,
    volIndexAi: ventriculosAuriculasData.volIndexAi,
    dmAd: ventriculosAuriculasData.dmAd,
    areaAd: ventriculosAuriculasData.areaAd,

    // Válvulas - Mitral
    mitral_ondaE: valvulasData.mitral.ondaE,
    mitral_itv: valvulasData.mitral.itv,
    mitral_ondaA: valvulasData.mitral.ondaA,
    mitral_ore: valvulasData.mitral.ore,
    mitral_relEA: valvulasData.mitral.relEA,
    mitral_vr: valvulasData.mitral.vr,
    mitral_durA: valvulasData.mitral.durA,
    mitral_vc: valvulasData.mitral.vc,
    mitral_tde: valvulasData.mitral.tde,
    mitral_thp: valvulasData.mitral.thp,
    mitral_reg: valvulasData.mitral.reg,
    mitral_avm: valvulasData.mitral.avm,
    mitral_vmax: valvulasData.mitral.vmax,
    mitral_gradMax: valvulasData.mitral.gradMax,
    mitral_radio: valvulasData.mitral.radio,
    mitral_gradMed: valvulasData.mitral.gradMed,
    mitral_ny: valvulasData.mitral.ny,

    // Válvulas - Tricúspide
    tricuspide_ondaE: valvulasData.tricuspide.ondaE,
    tricuspide_ondaA: valvulasData.tricuspide.ondaA,
    tricuspide_relEA: valvulasData.tricuspide.relEA,
    tricuspide_reg: valvulasData.tricuspide.reg,
    tricuspide_vmax: valvulasData.tricuspide.vmax,
    tricuspide_grpMax: valvulasData.tricuspide.grpMax,
    tricuspide_psvd: valvulasData.tricuspide.psvd,
    tricuspide_thp: valvulasData.tricuspide.thp,
    tricuspide_avt: valvulasData.tricuspide.avt,
    tricuspide_vc: valvulasData.tricuspide.vc,

    // Válvulas - Aorta
    aorta_vmax: valvulasData.aorta.vmax,
    aorta_gpMax: valvulasData.aorta.gpMax,
    aorta_gradMed: valvulasData.aorta.gradMed,
    aorta_avac: valvulasData.aorta.avac,
    aorta_reg: valvulasData.aorta.reg,
    aorta_thp: valvulasData.aorta.thp,
    aorta_vc: valvulasData.aorta.vc,
    aorta_flujoHolodiastolicoReverso: valvulasData.aorta.flujoHolodiastolicoReverso,

    // Válvulas - Pulmonar
    pulmonar_vmax: valvulasData.pulmonar.vmax,
    pulmonar_gpMax: valvulasData.pulmonar.gpMax,
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
    vci_dt: dopplerData.vci.dt,
    vci_colapso: dopplerData.vci.colapso,

    // Venas Pulmonares
    venasPulmonares_ondaS: dopplerData.venasPulmonares.ondaS,
    venasPulmonares_ondaD: dopplerData.venasPulmonares.ondaD,
    venasPulmonares_ondaARev: dopplerData.venasPulmonares.ondaARev,
    venasPulmonares_durAr: dopplerData.venasPulmonares.durAr,
    venasPulmonares_relSD: relSD,

    // Modo M Color
    modoMColor_vpOndaE: dopplerData.modoMColor.vpOndaE,

    // Hallazgos
    pericardio: dopplerData.hallazgos.pericardio,
    tabiqueIA: dopplerData.hallazgos.tabiqueIA,
    otros: dopplerData.hallazgos.otros,
  };
}

// Función para generar reporte en HTML (compatible con Word)
export function generateHTMLReport(
  patientData: PatientData,
  medidasVIData: MedidasVIData,
  ventriculosAuriculasData: VentriculosAuriculasData,
  valvulasData: ValvulasData,
  dopplerData: DopplerVasosVenasData
): void {
  const reportData = compileReportData(
    patientData,
    medidasVIData,
    ventriculosAuriculasData,
    valvulasData,
    dopplerData
  );

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Informe de Ecocardiograma</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section-title { font-weight: bold; font-size: 14px; margin-bottom: 10px; color: #2563eb; }
        .data-row { margin-bottom: 5px; }
        .data-label { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <div class="header">
        <h1>INFORME DE ECOCARDIOGRAMA TRANSTORÁCICO</h1>
    </div>

    <div class="section">
        <div class="section-title">DATOS PERSONALES</div>
        <div class="data-row"><span class="data-label">Nombres y apellidos:</span> ${reportData.nombresApellidos}</div>
        <div class="data-row"><span class="data-label">Edad:</span> ${reportData.edad} años</div>
        <div class="data-row"><span class="data-label">Sexo:</span> ${reportData.sexo}</div>
        <div class="data-row"><span class="data-label">CI:</span> ${reportData.ci}</div>
        <div class="data-row"><span class="data-label">Fecha de Nacimiento:</span> ${reportData.fechaNacimiento}</div>
        <div class="data-row"><span class="data-label">Peso:</span> ${reportData.peso} kg</div>
        <div class="data-row"><span class="data-label">Talla:</span> ${reportData.talla} cm</div>
        <div class="data-row"><span class="data-label">Superficie Corporal:</span> ${reportData.superficieCorporal} m²</div>
        <div class="data-row"><span class="data-label">Ventana:</span> ${reportData.ventana}</div>
        <div class="data-row"><span class="data-label">Ritmo:</span> ${reportData.ritmo}</div>
        <div class="data-row"><span class="data-label">Frecuencia Cardíaca:</span> ${reportData.frecuenciaCardiaca} lpm</div>
        <div class="data-row"><span class="data-label">Fecha del Examen:</span> ${reportData.fechaExamen}</div>
    </div>

    <div class="section">
        <div class="section-title">MEDICIONES LINEALES Y PLANIMETRÍA</div>
        <table>
            <tr>
                <th>DIÁMETROS</th>
                <th>VOLÚMENES (LINEAL)</th>
                <th>SIMPSON MODIFICADO</th>
            </tr>
            <tr>
                <td>DDFVI: ${reportData.ddfvi} mm</td>
                <td>VDF: ${reportData.vdfLineal} ml</td>
                <td>VDF: ${reportData.vdfSimpson} ml</td>
            </tr>
            <tr>
                <td>DSFVI: ${reportData.dsfvi} mm</td>
                <td>VSF: ${reportData.vsfLineal} ml</td>
                <td>VSF: ${reportData.vsfSimpson} ml</td>
            </tr>
            <tr>
                <td>GDSept: ${reportData.gdsept} mm</td>
                <td>VL: ${reportData.vlLineal} ml</td>
                <td>VL: ${reportData.vlSimpson} ml</td>
            </tr>
            <tr>
                <td>GDPIL: ${reportData.gdpil} mm</td>
                <td>FE Teich: ${reportData.feTeich}%</td>
                <td>FE: ${reportData.feSimpson}%</td>
            </tr>
            <tr>
                <td>Rao: ${reportData.rao} mm</td>
                <td>FA: ${reportData.fa}%</td>
                <td></td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">VENTRÍCULOS Y AURÍCULAS</div>
        <table>
            <tr>
                <th>VENTRÍCULO IZQUIERDO</th>
                <th>VENTRÍCULO DERECHO</th>
                <th>AURÍCULA IZQUIERDA</th>
                <th>AURÍCULA DERECHA</th>
            </tr>
            <tr>
                <td>Masa: ${reportData.masaVI} gr</td>
                <td>Basal: ${reportData.basal} mm</td>
                <td>DAI: ${reportData.dai} mm</td>
                <td>Dm: ${reportData.dmAd} mm</td>
            </tr>
            <tr>
                <td>IMVI: ${reportData.imvi} gr/m²</td>
                <td>Medio: ${reportData.medio} mm</td>
                <td>Área: ${reportData.areaAi} cm²</td>
                <td>Área: ${reportData.areaAd} cm²</td>
            </tr>
            <tr>
                <td>GRP: ${reportData.grp} cm</td>
                <td>Long: ${reportData.long} mm</td>
                <td>Vol: ${reportData.volAi} ml</td>
                <td></td>
            </tr>
            <tr>
                <td>MAPSE: ${reportData.mapse} mm</td>
                <td>CAF: ${reportData.caf}%</td>
                <td>Vol. Index: ${reportData.volIndexAi} ml/m²</td>
                <td></td>
            </tr>
            <tr>
                <td>dP/dt: ${reportData.dpdt} mmHg/seg</td>
                <td>IE: ${reportData.ie}</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>TAPSE: ${reportData.tapse} mm</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>Relación VD/VI: ${reportData.relacionVdVi}</td>
                <td></td>
                <td></td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">VÁLVULAS</div>
        <table>
            <tr>
                <th>MITRAL</th>
                <th>TRICÚSPIDE</th>
                <th>AÓRTICA</th>
                <th>PULMONAR</th>
            </tr>
            <tr>
                <td>Onda E: ${reportData.mitral_ondaE} cm/seg</td>
                <td>Onda E: ${reportData.tricuspide_ondaE} cm/seg</td>
                <td>V Max: ${reportData.aorta_vmax} cm/seg</td>
                <td>V Max: ${reportData.pulmonar_vmax} cm/seg</td>
            </tr>
            <tr>
                <td>Onda A: ${reportData.mitral_ondaA} cm/seg</td>
                <td>Onda A: ${reportData.tricuspide_ondaA} cm/seg</td>
                <td>GP Max: ${reportData.aorta_gpMax} mmHg</td>
                <td>GP Max: ${reportData.pulmonar_gpMax} mmHg</td>
            </tr>
            <tr>
                <td>Rel. E/A: ${reportData.mitral_relEA}</td>
                <td>Rel. E/A: ${reportData.tricuspide_relEA}</td>
                <td>Grad Med: ${reportData.aorta_gradMed} mmHg</td>
                <td>TAM: ${reportData.pulmonar_tam} m/seg</td>
            </tr>
            <tr>
                <td>Vmax: ${reportData.mitral_vmax} cm/seg</td>
                <td>Vmax: ${reportData.tricuspide_vmax} cm/seg</td>
                <td>AVAC: ${reportData.aorta_avac} cm²</td>
                <td>Reg: ${reportData.pulmonar_reg}</td>
            </tr>
            <tr>
                <td>Reg: ${reportData.mitral_reg}</td>
                <td>Reg: ${reportData.tricuspide_reg}</td>
                <td>Reg: ${reportData.aorta_reg}</td>
                <td>PMAP: ${reportData.pulmonar_pmap} mmHg</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">DOPPLER TISULAR, GRANDES VASOS Y VENAS PULMONARES</div>
        <table>
            <tr>
                <th>DOPPLER TISULAR MITRAL</th>
                <th>DOPPLER TISULAR TRICÚSPIDE</th>
                <th>GRANDES VASOS</th>
                <th>VENAS PULMONARES</th>
            </tr>
            <tr>
                <td>Onda e': ${reportData.tisularMitral_ePrime} cm/seg</td>
                <td>Onda e': ${reportData.tisularTricuspide_ePrime} cm/seg</td>
                <td>Rao: ${reportData.gvAorta_rao} mm</td>
                <td>Onda S: ${reportData.venasPulmonares_ondaS} cm/seg</td>
            </tr>
            <tr>
                <td>Onda a': ${reportData.tisularMitral_aPrime} cm/seg</td>
                <td>Onda a': ${reportData.tisularTricuspide_aPrime} cm/seg</td>
                <td>Anillo: ${reportData.gvAorta_anillo} mm</td>
                <td>Onda D: ${reportData.venasPulmonares_ondaD} cm/seg</td>
            </tr>
            <tr>
                <td>Onda S: ${reportData.tisularMitral_sPrime} cm/seg</td>
                <td>Onda S: ${reportData.tisularTricuspide_sPrime} cm/seg</td>
                <td>VCI DT: ${reportData.vci_dt} mm</td>
                <td>Rel S/D: ${reportData.venasPulmonares_relSD}</td>
            </tr>
            <tr>
                <td>TRIV: ${reportData.tisularMitral_triv} ms</td>
                <td></td>
                <td>VCI Colapso: ${reportData.vci_colapso}%</td>
                <td></td>
            </tr>
            <tr>
                <td>Rel. E/e': ${reportData.relEePrime}</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">HALLAZGOS ADICIONALES</div>
        <div class="data-row"><span class="data-label">Pericardio:</span> ${reportData.pericardio}</div>
        <div class="data-row"><span class="data-label">Tabique IA:</span> ${reportData.tabiqueIA}</div>
        <div class="data-row"><span class="data-label">Otros:</span> ${reportData.otros}</div>
    </div>

    <div class="section">
        <div class="section-title">MODO M COLOR</div>
        <div class="data-row"><span class="data-label">VP onda E:</span> ${reportData.modoMColor_vpOndaE} cm/seg</div>
    </div>

</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const fileName = `Informe_Ecocardiograma_${patientData.nombresApellidos.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
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
      
      // Como respaldo, generar HTML
      console.log('Generando reporte en formato HTML como respaldo...');
      generateHTMLReport(patientData, medidasVIData, ventriculosAuriculasData, valvulasData, dopplerData);
      
      throw new Error(errorMessage);
    }
    
    throw error;
  }
}
