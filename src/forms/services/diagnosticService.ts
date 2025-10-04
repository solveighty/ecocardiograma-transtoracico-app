import { evaluarParametro, evaluarVCI } from '../../lib/diagnosticRangeUtils';

// Tipos para clasificaciones
type Severidad = 'NORMAL' | 'LEVEMENTE ANORMAL' | 'MODERADAMENTE ANORMAL' | 'SEVERAMENTE ANORMAL';
type TipoHipertrofia = 'Normal' | 'Hipertrofia Fisiológica' | 'Remodelación Concéntrica' | 'Remodelación Excéntrica' | 
                       'Hipertrofia Concéntrica' | 'Hipertrofia Mixta' | 'Hipertrofia Dilatada' | 'Hipertrofia Excéntrica';

// Función para evaluar diámetros del VI
export function evaluarDiametrosVI(
  ddfvi: number, 
  dsfvi: number, 
  gdsept: number, 
  gdpil: number, 
  sexo: string
): string {
  const sexoParam = sexo.toLowerCase() === 'femenino' || sexo.toLowerCase() === 'mujer' ? 'mujer' : 'hombre';
  
  // Evaluar cada parámetro con el JSON
  const ddfviResult = evaluarParametro('diametrosVI', 'ddfvi', ddfvi, sexoParam);
  const dsfviResult = evaluarParametro('diametrosVI', 'dsfvi', dsfvi, sexoParam);
  const gseptResult = evaluarParametro('diametrosVI', 'gdsept', gdsept, sexoParam);
  const gdpilResult = evaluarParametro('diametrosVI', 'gdpil', gdpil, sexoParam);
  
  // Mapear clasificaciones a Severidad
  const mapSeveridad = (clasificacion: string): Severidad => {
    switch (clasificacion) {
      case 'normal': return 'NORMAL';
      case 'levemente anormal': return 'LEVEMENTE ANORMAL';
      case 'moderadamente anormal': return 'MODERADAMENTE ANORMAL';
      case 'severamente anormal': return 'SEVERAMENTE ANORMAL';
      default: return 'NORMAL';
    }
  };
  
  const ddfviStatus = mapSeveridad(ddfviResult.clasificacion);
  const dsfviStatus = mapSeveridad(dsfviResult.clasificacion);
  const gseptStatus = mapSeveridad(gseptResult.clasificacion);
  const gpilStatus = mapSeveridad(gdpilResult.clasificacion);
  
  let diagnosticos: string[] = [];
  
  // Generar diagnóstico
  if (ddfviStatus === 'NORMAL' && dsfviStatus === 'NORMAL' && gseptStatus === 'NORMAL' && gpilStatus === 'NORMAL') {
    return 'Diámetros del ventrículo izquierdo dentro de parámetros normales.';
  }
  
  // Evaluar dilatación
  if (ddfviStatus !== 'NORMAL') {
    if (ddfviStatus === 'LEVEMENTE ANORMAL') {
      diagnosticos.push('Dilatación leve del ventrículo izquierdo');
    } else if (ddfviStatus === 'MODERADAMENTE ANORMAL') {
      diagnosticos.push('Dilatación moderada del ventrículo izquierdo');
    } else if (ddfviStatus === 'SEVERAMENTE ANORMAL') {
      diagnosticos.push('Dilatación severa del ventrículo izquierdo');
    }
  }
  
  // Evaluar hipertrofia parietal
  if (gseptStatus !== 'NORMAL' || gpilStatus !== 'NORMAL') {
    const maxSeveridad = Math.max(
      gseptStatus === 'LEVEMENTE ANORMAL' ? 1 : gseptStatus === 'MODERADAMENTE ANORMAL' ? 2 : gseptStatus === 'SEVERAMENTE ANORMAL' ? 3 : 0,
      gpilStatus === 'LEVEMENTE ANORMAL' ? 1 : gpilStatus === 'MODERADAMENTE ANORMAL' ? 2 : gpilStatus === 'SEVERAMENTE ANORMAL' ? 3 : 0
    );
    
    if (maxSeveridad === 1) {
      diagnosticos.push('Hipertrofia parietal leve');
    } else if (maxSeveridad === 2) {
      diagnosticos.push('Hipertrofia parietal moderada');
    } else if (maxSeveridad === 3) {
      diagnosticos.push('Hipertrofia parietal severa');
    }
  }
  
  return diagnosticos.length > 0 ? diagnosticos.join('. ') + '.' : 'Diámetros del ventrículo izquierdo dentro de parámetros normales.';
}

// Función para evaluar función del VI
export function evaluarFuncionVI(fe: number, fa: number): string {
  let diagnosticos: string[] = [];
  
  // Evaluar FE usando JSON
  const feResult = evaluarParametro('funcionVI', 'fevi', fe, 'hombre');
  
  if (feResult.clasificacion === 'normal') {
    diagnosticos.push('Función sistólica del ventrículo izquierdo normal');
  } else if (feResult.clasificacion === 'levemente disminuida') {
    diagnosticos.push('Disfunción sistólica leve del ventrículo izquierdo');
  } else if (feResult.clasificacion === 'moderadamente disminuida') {
    diagnosticos.push('Disfunción sistólica moderada del ventrículo izquierdo');
  } else if (feResult.clasificacion === 'severamente disminuida') {
    diagnosticos.push('Disfunción sistólica severa del ventrículo izquierdo');
  }
  
  // Evaluar FA usando JSON
  const faResult = evaluarParametro('funcionVI', 'fac', fa, 'hombre');
  
  if (faResult.clasificacion !== 'normal') {
    if (faResult.clasificacion === 'levemente disminuida' && !diagnosticos[0]?.includes('leve')) {
      diagnosticos.push('Fracción de acortamiento levemente disminuida');
    } else if (faResult.clasificacion === 'moderadamente disminuida' && !diagnosticos[0]?.includes('moderada')) {
      diagnosticos.push('Fracción de acortamiento moderadamente disminuida');
    } else if (faResult.clasificacion === 'severamente disminuida' && !diagnosticos[0]?.includes('severa')) {
      diagnosticos.push('Fracción de acortamiento severamente disminuida');
    }
  }
  
  return diagnosticos.join('. ') + '.';
}

// Función para determinar tipo de hipertrofia
export function determinarTipoHipertrofia(
  imvi: number,
  grp: number,
  sexo: string,
  vdfIndex?: number
): TipoHipertrofia {
  const sexoParam = sexo.toLowerCase() === 'femenino' || sexo.toLowerCase() === 'mujer' ? 'mujer' : 'hombre';
  
  // Evaluar IMVI usando JSON
  const imviResult = evaluarParametro('masaImviGrp', 'imvi', imvi, sexoParam);
  const imviAlto = imviResult.clasificacion !== 'normal';
  
  // Usar VDF indexado si está disponible, sino asumir <= 75
  const lvVolumeIndex = vdfIndex || 75;
  const volumenAlto = lvVolumeIndex > 75;
  
  // Evaluar RWT usando JSON
  const grpResult = evaluarParametro('masaImviGrp', 'grp', grp, sexoParam);
  const rwtNormal = grpResult.clasificacion === 'normal';
  const rwtAlto = grpResult.clasificacion === 'remodelación concéntrica';
  const rwtBajo = grpResult.clasificacion === 'remodelación excéntrica';
  
  if (!volumenAlto && !imviAlto && rwtNormal) {
    return 'Normal';
  } else if (volumenAlto && imviAlto && rwtNormal) {
    return 'Hipertrofia Fisiológica';
  } else if (!volumenAlto && !imviAlto && rwtAlto) {
    return 'Remodelación Concéntrica';
  } else if (volumenAlto && !imviAlto && rwtBajo) {
    return 'Remodelación Excéntrica';
  } else if (!volumenAlto && imviAlto && rwtAlto) {
    return 'Hipertrofia Concéntrica';
  } else if (volumenAlto && imviAlto && rwtAlto) {
    return 'Hipertrofia Mixta';
  } else if (volumenAlto && imviAlto && rwtNormal) {
    return 'Hipertrofia Dilatada';
  } else if (volumenAlto && imviAlto && rwtBajo) {
    return 'Hipertrofia Excéntrica';
  }
  
  return 'Normal';
}

// Función para evaluar válvula aórtica
export function evaluarValvulaAortica(vmax: number, gradMedio: number, avac: number): string {
  // Evaluar con JSON
  const vmaxResult = evaluarParametro('valvulas', 'aorta_vmax', vmax, 'hombre');
  const gradResult = evaluarParametro('valvulas', 'aorta_gm', gradMedio, 'hombre');
  const avacResult = evaluarParametro('valvulas', 'aorta_avac', avac, 'hombre');
  
  // Priorizar la clasificación más severa
  if (vmaxResult.clasificacion === 'estenosis aórtica severa' || 
      gradResult.clasificacion === 'estenosis aórtica severa' || 
      avacResult.clasificacion === 'estenosis aórtica severa') {
    return 'Estenosis aórtica severa.';
  } else if (vmaxResult.clasificacion === 'estenosis aórtica moderada' || 
             gradResult.clasificacion === 'estenosis aórtica moderada' || 
             avacResult.clasificacion === 'estenosis aórtica moderada') {
    return 'Estenosis aórtica moderada.';
  } else if (vmaxResult.clasificacion === 'estenosis aórtica leve' || 
             gradResult.clasificacion === 'estenosis aórtica leve' || 
             avacResult.clasificacion === 'estenosis aórtica leve') {
    return 'Estenosis aórtica leve.';
  } else {
    return 'Válvula aórtica sin estenosis significativa.';
  }
}

// Función para evaluar válvula mitral
export function evaluarValvulaMitral(gradMedio: number): string {
  const result = evaluarParametro('valvulas', 'mitral_gm', gradMedio, 'hombre');
  return result.texto + '.';
}

// Función para evaluar disfunción diastólica
export function evaluarDisfuncionDiastolica(
  relacionEA: number,
  tde: number,
  triv: number,
  relacionSD: number,
  ondaAr: number,
  relacionEePrime: number
): string {
  // Criterios para DD leve (Trastornos de la relajación)
  if (relacionEA < 1 && tde > 220 && triv > 100 && relacionSD > 1 && ondaAr < 35) {
    return 'Disfunción diastólica leve (trastornos de la relajación).';
  }
  
  // Criterios para DD moderada (Patrón pseudonormal)
  if (relacionEA >= 1 && relacionEA <= 2 && tde >= 150 && tde <= 220 && triv >= 60 && triv <= 100 && relacionSD <= 1 && ondaAr > 35) {
    return 'Disfunción diastólica moderada (patrón pseudonormal).';
  }
  
  // Criterios para DD severa (Patrón restrictivo)
  if (relacionEA > 2 && tde < 150 && triv < 60 && relacionSD < 1 && ondaAr >= 25) {
    return 'Disfunción diastólica severa (patrón restrictivo).';
  }
  
  // Evaluación adicional con E/e'
  if (relacionEePrime > 14) {
    return 'Presiones de llenado del ventrículo izquierdo elevadas.';
  } else if (relacionEePrime < 8) {
    return 'Presiones de llenado del ventrículo izquierdo normales.';
  }
  
  return 'Función diastólica dentro de parámetros normales.';
}

// Función para evaluar presiones pulmonares
export function evaluarPresionPulmonar(psvd: number, pmap: number): string {
  let diagnosticos: string[] = [];
  
  const psvdResult = evaluarParametro('hipertensionPulmonar', 'psvd', psvd, 'hombre');
  
  if (psvdResult.clasificacion !== 'normal') {
    diagnosticos.push(psvdResult.texto);
  }
  
  const pmapResult = evaluarParametro('hipertensionPulmonar', 'pmap', pmap, 'hombre');
  
  if (pmapResult.clasificacion !== 'normal' && !diagnosticos.length) {
    diagnosticos.push(pmapResult.texto);
  }
  
  return diagnosticos.length > 0 
    ? diagnosticos.join('. ') + '.'
    : 'Presiones pulmonares dentro de parámetros normales.';
}

// Función para evaluar VCI y estimar PAD
export function evaluarVCIyPAD(vciDT: number, colapso: number): string {
  const result = evaluarVCI(vciDT, colapso);
  return result.texto;
}
