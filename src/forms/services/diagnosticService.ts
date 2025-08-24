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
  const esMujer = sexo.toLowerCase() === 'femenino' || sexo.toLowerCase() === 'mujer';
  
  let diagnosticos: string[] = [];
  
  // Evaluar DDFVI
  let ddfviStatus: Severidad;
  if (esMujer) {
    if (ddfvi >= 39 && ddfvi <= 53) ddfviStatus = 'NORMAL';
    else if (ddfvi >= 54 && ddfvi <= 57) ddfviStatus = 'LEVEMENTE ANORMAL';
    else if (ddfvi >= 58 && ddfvi <= 61) ddfviStatus = 'MODERADAMENTE ANORMAL';
    else if (ddfvi >= 62) ddfviStatus = 'SEVERAMENTE ANORMAL';
    else ddfviStatus = 'NORMAL'; // Por debajo del rango
  } else {
    if (ddfvi >= 42 && ddfvi <= 59) ddfviStatus = 'NORMAL';
    else if (ddfvi >= 60 && ddfvi <= 63) ddfviStatus = 'LEVEMENTE ANORMAL';
    else if (ddfvi >= 64 && ddfvi <= 68) ddfviStatus = 'MODERADAMENTE ANORMAL';
    else if (ddfvi >= 69) ddfviStatus = 'SEVERAMENTE ANORMAL';
    else ddfviStatus = 'NORMAL'; // Por debajo del rango
  }
  
  // Evaluar DSFVI
  let dsfviStatus: Severidad;
  if (dsfvi >= 28 && dsfvi <= 38) {
    dsfviStatus = 'NORMAL';
  } else {
    dsfviStatus = 'SEVERAMENTE ANORMAL';
  }
  
  // Evaluar Grosor del Septum
  let gseptStatus: Severidad;
  if (esMujer) {
    if (gdsept >= 6 && gdsept <= 9) gseptStatus = 'NORMAL';
    else if (gdsept >= 10 && gdsept <= 12) gseptStatus = 'LEVEMENTE ANORMAL';
    else if (gdsept >= 13 && gdsept <= 15) gseptStatus = 'MODERADAMENTE ANORMAL';
    else if (gdsept >= 16) gseptStatus = 'SEVERAMENTE ANORMAL';
    else gseptStatus = 'NORMAL';
  } else {
    if (gdsept >= 6 && gdsept <= 10) gseptStatus = 'NORMAL';
    else if (gdsept >= 11 && gdsept <= 13) gseptStatus = 'LEVEMENTE ANORMAL';
    else if (gdsept >= 14 && gdsept <= 16) gseptStatus = 'MODERADAMENTE ANORMAL';
    else if (gdsept >= 17) gseptStatus = 'SEVERAMENTE ANORMAL';
    else gseptStatus = 'NORMAL';
  }
  
  // Evaluar Grosor Pared Posterior
  let gpilStatus: Severidad;
  if (esMujer) {
    if (gdpil >= 6 && gdpil <= 9) gpilStatus = 'NORMAL';
    else if (gdpil >= 10 && gdpil <= 12) gpilStatus = 'LEVEMENTE ANORMAL';
    else if (gdpil >= 13 && gdpil <= 15) gpilStatus = 'MODERADAMENTE ANORMAL';
    else if (gdpil >= 16) gpilStatus = 'SEVERAMENTE ANORMAL';
    else gpilStatus = 'NORMAL';
  } else {
    if (gdpil >= 6 && gdpil <= 10) gpilStatus = 'NORMAL';
    else if (gdpil >= 11 && gdpil <= 13) gpilStatus = 'LEVEMENTE ANORMAL';
    else if (gdpil >= 14 && gdpil <= 16) gpilStatus = 'MODERADAMENTE ANORMAL';
    else if (gdpil >= 17) gpilStatus = 'SEVERAMENTE ANORMAL';
    else gpilStatus = 'NORMAL';
  }
  
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
  
  // Evaluar FE
  if (fe >= 55) {
    diagnosticos.push('Función sistólica del ventrículo izquierdo normal');
  } else if (fe >= 45 && fe <= 54) {
    diagnosticos.push('Disfunción sistólica leve del ventrículo izquierdo');
  } else if (fe >= 30 && fe <= 44) {
    diagnosticos.push('Disfunción sistólica moderada del ventrículo izquierdo');
  } else if (fe < 30) {
    diagnosticos.push('Disfunción sistólica severa del ventrículo izquierdo');
  }
  
  // Evaluar FA
  if (fa >= 27 && fa <= 45) {
    // Normal, ya incluido en FE
  } else if (fa >= 22 && fa <= 26) {
    if (!diagnosticos[0].includes('leve')) {
      diagnosticos.push('Fracción de acortamiento levemente disminuida');
    }
  } else if (fa >= 17 && fa <= 21) {
    if (!diagnosticos[0].includes('moderada')) {
      diagnosticos.push('Fracción de acortamiento moderadamente disminuida');
    }
  } else if (fa <= 16) {
    if (!diagnosticos[0].includes('severa')) {
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
  const esMujer = sexo.toLowerCase() === 'femenino' || sexo.toLowerCase() === 'mujer';
  
  // Determinar si IMVI es alto
  const imviAlto = esMujer ? imvi > 95 : imvi > 115;
  
  // Usar VDF indexado si está disponible, sino asumir <= 75
  const lvVolumeIndex = vdfIndex || 75;
  const volumenAlto = lvVolumeIndex > 75;
  
  // Evaluar RWT
  const rwtNormal = grp >= 0.32 && grp <= 0.42;
  const rwtAlto = grp > 0.42;
  const rwtBajo = grp < 0.32;
  
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
  if (vmax >= 2.6 && vmax <= 3.0 && gradMedio < 20 && avac > 1.5) {
    return 'Estenosis aórtica leve.';
  } else if (vmax >= 3.0 && vmax <= 4.0 && gradMedio >= 20 && gradMedio <= 40 && avac >= 1.0 && avac <= 1.5) {
    return 'Estenosis aórtica moderada.';
  } else if (vmax > 4.0 && gradMedio > 40 && avac < 1.0) {
    return 'Estenosis aórtica severa.';
  } else {
    return 'Válvula aórtica sin estenosis significativa.';
  }
}

// Función para evaluar válvula mitral
export function evaluarValvulaMitral(gradMedio: number): string {
  if (gradMedio < 5) {
    return 'Válvula mitral sin estenosis significativa.';
  } else if (gradMedio >= 5 && gradMedio <= 10) {
    return 'Estenosis mitral leve.';
  } else if (gradMedio > 10) {
    return 'Estenosis mitral grave.';
  }
  return 'Válvula mitral sin estenosis significativa.';
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
  
  if (psvd > 35) {
    if (psvd <= 45) {
      diagnosticos.push('Hipertensión pulmonar leve');
    } else if (psvd <= 60) {
      diagnosticos.push('Hipertensión pulmonar moderada');
    } else {
      diagnosticos.push('Hipertensión pulmonar severa');
    }
  }
  
  if (pmap > 25) {
    if (!diagnosticos.length) {
      diagnosticos.push('Presión media de arteria pulmonar elevada');
    }
  }
  
  return diagnosticos.length > 0 
    ? diagnosticos.join('. ') + '.'
    : 'Presiones pulmonares dentro de parámetros normales.';
}

// Función para evaluar VCI y estimar PAD
export function evaluarVCIyPAD(vciDT: number, colapso: number): string {
  let pad: string;
  let descripcion: string;
  
  if (vciDT <= 21 && colapso >= 50) {
    pad = '0-5 mmHg';
    descripcion = 'VCI normal con colapso inspiratorio adecuado';
  } else if (vciDT >= 21 && colapso >= 50) {
    pad = '6-10 mmHg';
    descripcion = 'VCI dilatada con colapso inspiratorio preservado';
  } else if (vciDT >= 21 && colapso < 50) {
    pad = '10-15 mmHg';
    descripcion = 'VCI dilatada con colapso inspiratorio disminuido';
  } else {
    pad = '15-20 mmHg';
    descripcion = 'VCI dilatada sin colapso inspiratorio';
  }
  
  return `${descripcion}. Presión estimada de aurícula derecha: ${pad}.`;
}
