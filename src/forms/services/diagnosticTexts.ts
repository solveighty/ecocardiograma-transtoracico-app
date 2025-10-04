import { evaluarParametro, evaluarVCI, evaluarAuriculaIzquierda } from '../../lib/diagnosticRangeUtils';

// Función para generar todos los textos de diagnóstico específicos para la plantilla
export function generateDiagnosticTexts(data: any, sexo: string): any {
  const esMujer = sexo.toLowerCase() === 'femenino' || sexo.toLowerCase() === 'mujer';
  const sexoParam = esMujer ? 'F' : 'M';
  
  // Función auxiliar para evaluar regurgitación
  const evaluarRegurgitacion = (reg: string): string => {
    if (!reg || reg.trim() === '') return 'sin regurgitación significativa';
    
    const regLower = reg.toLowerCase().trim();
    if (regLower === '+' || regLower === 'leve') return 'insuficiencia leve';
    if (regLower === '++' || regLower === 'moderada') return 'insuficiencia moderada';
    if (regLower === '+++' || regLower === 'severa') return 'insuficiencia severa';
    if (regLower === '++++' || regLower === 'grave') return 'insuficiencia grave';
    return reg;
  };
  
  // Función auxiliar para convertir valores de forma segura
  const safe = (value: any, defaultValue: number = 0): number => {
    if (value === undefined || value === null || value === '') return defaultValue;
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(parsed) ? defaultValue : parsed;
  };
  
  const ddfvi = safe(data.ddfvi);
  const gdsept = safe(data.gdsept);
  const gdpil = safe(data.gdpil);
  const vdfSimpson = safe(data.vdfSimpson);
  const vsfSimpson = safe(data.vsfSimpson);
  const feSimpson = safe(data.feSimpson);
  const imvi = safe(data.imvi);
  const grp = safe(data.grp);
  const dai = safe(data.dai);
  const areaAi = safe(data.areaAi);
  const volIndexAi = safe(data.volIndexAi);
  const dmAd = safe(data.dmAd);
  const areaAd = safe(data.areaAd);
  const basal = safe(data.basal);
  const tapse = safe(data.tapse);
  const mitral_relEA = safe(data.mitral_relEA);
  const relEePrime = safe(data.relEePrime);
  const tricuspide_psvd = safe(data.tricuspide_psvd);
  const aorta_vmax = safe(data.aorta_vmax);
  const vci_dt = safe(data.vci_dt);
  const vci_colapso = safe(data.vci_colapso);
  
  return {
    // 1. Diámetros VI - Usando JSON centralizado
    diag_diametrosVI: evaluarParametro('diametrosVI', 'ddfvi', ddfvi, sexoParam).texto,
    
    // 2. Volumen sistólico VI
    diag_volumenSistolicoVI: evaluarParametro('volumenesVI', 'vsfSimpson', vsfSimpson, sexoParam).texto,
    
    // 3. Volumen diastólico VI
    diag_volumenDiastolicoVI: evaluarParametro('volumenesVI', 'vdfSimpson', vdfSimpson, sexoParam).texto,
    
    // 4. Grosor del septum
    diag_gdsept: evaluarParametro('grosoresPared', 'gdsept', gdsept, sexoParam).texto,
    
    // 5. Grosor pared posterior
    diag_gdpil: evaluarParametro('grosoresPared', 'gdpil', gdpil, sexoParam).texto,
    
    // 6. Función VI
    diag_funcionVI: evaluarParametro('funcionVI', 'feSimpson', feSimpson).texto,
    
    // 7. IMVI y GRP
    diag_imvi_grp: (() => {
      const imviEval = evaluarParametro('masaVI', 'imvi', imvi, sexoParam);
      const grpEval = evaluarParametro('masaVI', 'grp', grp);
      
      const imviNormal = imviEval.clasificacion === 'normal';
      const grpNormal = grpEval.clasificacion === 'normal';
      
      if (imviNormal && grpNormal) return 'dentro de parámetros normales';
      if (!imviNormal && grpNormal) return 'IMVI aumentado con GRP normal';
      if (imviNormal && !grpNormal) return 'IMVI normal con GRP alterado';
      return 'ambos parámetros alterados';
    })(),
    
    // 8. Tipo de hipertrofia
    tipoHipertrofia: (() => {
      const imviEval = evaluarParametro('masaVI', 'imvi', imvi, sexoParam);
      const grpEval = evaluarParametro('masaVI', 'grp', grp);
      
      const imviAlto = imviEval.clasificacion === 'aumentado';
      const volumenAlto = false; // Asumir normal por ahora
      const rwtAlto = grpEval.clasificacion === 'alto';
      const rwtBajo = grpEval.clasificacion === 'bajo';
      const rwtNormal = grpEval.clasificacion === 'normal';
      
      if (!volumenAlto && !imviAlto && rwtNormal) return 'Normal';
      if (!volumenAlto && !imviAlto && rwtAlto) return 'Remodelación Concéntrica';
      if (!volumenAlto && imviAlto && rwtAlto) return 'Hipertrofia Concéntrica';
      if (volumenAlto && !imviAlto && rwtBajo) return 'Remodelación Excéntrica';
      if (volumenAlto && imviAlto && rwtBajo) return 'Hipertrofia Excéntrica';
      return 'Patrón indeterminado';
    })(),
    
    // 9. Disfunción diastólica
    diag_disfuncionDiastolica: evaluarParametro('disfuncionDiastolica', 'relEePrime', relEePrime).texto,
    
    // 10. Aurícula izquierda - Evaluación combinada
    diag_ai: evaluarAuriculaIzquierda(dai, areaAi, volIndexAi, sexoParam).texto,
    
    // 11. Aurícula derecha
    diag_ad: (() => {
      const dmAdEval = evaluarParametro('auriculaDerecha', 'dmAd', dmAd);
      const areaAdEval = evaluarParametro('auriculaDerecha', 'areaAd', areaAd);
      
      if (dmAdEval.clasificacion === 'normal' && areaAdEval.clasificacion === 'normal') {
        return 'normales';
      }
      return dmAdEval.texto;
    })(),
    
    // 12. Ventrículo derecho
    diag_vd: (() => {
      const basalEval = evaluarParametro('ventriculoDerecho', 'basal', basal);
      const tapseEval = evaluarParametro('ventriculoDerecho', 'tapse', tapse);
      
      if (basalEval.clasificacion === 'normal' && tapseEval.clasificacion === 'normal') {
        return 'normales con función sistólica preservada';
      }
      if (tapseEval.clasificacion === 'deprimida') {
        return 'con función sistólica deprimida';
      }
      return basalEval.texto;
    })(),
    
    // 13. Válvula mitral
    diag_valvulaMitral: (() => {
      const reg = evaluarRegurgitacion(data.mitral_reg || '');
      return `${reg}`;
    })(),
    
    // 14. Doppler mitral
    diag_dopplerMitral: evaluarParametro('disfuncionDiastolica', 'mitral_relEA', mitral_relEA).texto,
    
    // 15. VP onda E
    diag_vpOndaE: evaluarParametro('dopplerModoMColor', 'vpOndaE', safe(data.modoMColor_vpOndaE)).texto,
    
    // 16. Venas pulmonares
    diag_venasPulmonares: evaluarParametro('venasPulmonares', 'relSD', safe(data.venasPulmonares_relSD)).texto,
    
    // 17. Raíz aórtica
    diag_raizAortica: evaluarParametro('aorta', 'rao', safe(data.gvAorta_rao)).texto,
    
    // 18. Válvula aórtica
    diag_valvulaAortica: (() => {
      const reg = evaluarRegurgitacion(data.aorta_reg || '');
      const vmax = aorta_vmax / 100; // convertir a m/s
      
      const vmaxEval = evaluarParametro('aorta', 'vmax', vmax);
      
      if (vmaxEval.clasificacion === 'normal') {
        return `sin estenosis significativa, ${reg}`;
      }
      
      return `${vmaxEval.texto} con ${reg}`;
    })(),
    
    // 19. Aorta torácica
    diag_aortaToracica: (() => {
      const unionST = safe(data.gvAorta_unionST);
      const cayado = safe(data.gvAorta_cayado);
      const aoDesc = safe(data.gvAorta_aoDesc);
      
      const unionEval = evaluarParametro('aorta', 'unionST', unionST);
      const cayadoEval = evaluarParametro('aorta', 'cayado', cayado);
      const aoDescEval = evaluarParametro('aorta', 'aoDesc', aoDesc);
      
      if (unionEval.clasificacion === 'normal' && 
          cayadoEval.clasificacion === 'normal' && 
          aoDescEval.clasificacion === 'normal') {
        return 'sin dilatación';
      }
      return 'con dilatación';
    })(),
    
    // 20. Aorta abdominal
    diag_aortaAbdominal: evaluarParametro('aorta', 'aoAbd', safe(data.gvAorta_aoAbd)).texto,
    
    // 21. Arteria pulmonar
    diag_pulmonar: (() => {
      const reg = evaluarRegurgitacion(data.pulmonar_reg || '');
      const pmapEval = evaluarParametro('arteriasPulmonares', 'pmap', safe(data.pulmonar_pmap));
      return `${pmapEval.texto} con ${reg}`;
    })(),
    
    // 22. Válvula tricúspide
    diag_valvulaTricuspide: (() => {
      const reg = evaluarRegurgitacion(data.tricuspide_reg || '');
      const psvdEval = evaluarParametro('tricuspide', 'psvd', tricuspide_psvd);
      return `${reg}, ${psvdEval.texto}`;
    })(),
    
    // 23. VCI
    diag_vci: evaluarVCI(vci_dt, vci_colapso).texto,
    
    // 24. Tabique IA
    diag_tabiqueIA: (() => {
      const tabique = data.tabiqueIA || '';
      if (tabique.toLowerCase().includes('normal') || tabique.toLowerCase().includes('íntegro')) {
        return 'íntegro';
      }
      return tabique || 'con alteraciones menores';
    })(),
    
    // 25. Pericardio
    diag_pericardio: (() => {
      const pericardio = data.pericardio || '';
      if (pericardio.toLowerCase().includes('normal') || pericardio.toLowerCase().includes('sin')) {
        return 'sin derrame pericárdico';
      }
      return pericardio || 'sin alteraciones significativas';
    })(),
    
    // CONCLUSIONES
    // 26. Miocardio
    conclusion_miocardio: (() => {
      const feEval = evaluarParametro('funcionVI', 'feSimpson', feSimpson);
      if (feEval.clasificacion === 'normal') return 'Función sistólica del ventrículo izquierdo normal.';
      if (feEval.clasificacion === 'leve') return 'Disfunción sistólica leve del ventrículo izquierdo.';
      if (feEval.clasificacion === 'moderado') return 'Disfunción sistólica moderada del ventrículo izquierdo.';
      return 'Disfunción sistólica severa del ventrículo izquierdo.';
    })(),
    
    // 27. Hipertrofia VI
    conclusion_hipertrofiaVI: (() => {
      const imviEval = evaluarParametro('masaVI', 'imvi', imvi, sexoParam);
      const grpEval = evaluarParametro('masaVI', 'grp', grp);
      
      if (imviEval.clasificacion === 'normal') {
        return 'Masa ventricular izquierda normal.';
      }
      
      if (grpEval.clasificacion === 'alto') {
        return 'Hipertrofia concéntrica del ventrículo izquierdo.';
      }
      return 'Hipertrofia excéntrica del ventrículo izquierdo.';
    })(),
    
    // 28. Disfunción VI
    conclusion_disfuncionVI: (() => {
      const relEePrimeEval = evaluarParametro('disfuncionDiastolica', 'relEePrime', relEePrime);
      if (relEePrimeEval.clasificacion === 'normal') return 'Función diastólica normal.';
      if (relEePrimeEval.clasificacion === 'gradoI') return 'Disfunción diastólica grado I.';
      return 'Disfunción diastólica grado II-III.';
    })(),
    
    // 29. Disfunción VD
    conclusion_disfuncionVD: (() => {
      const tapseEval = evaluarParametro('ventriculoDerecho', 'tapse', tapse);
      if (tapseEval.clasificacion === 'normal') {
        return 'Función sistólica del ventrículo derecho normal.';
      }
      return 'Disfunción sistólica del ventrículo derecho.';
    })(),
    
    // 30. Insuficiencia tricúspide
    conclusion_insufTricuspide: (() => {
      const reg = data.tricuspide_reg || '';
      if (!reg || reg.trim() === '') return 'Sin insuficiencia tricúspide significativa.';
      return `Insuficiencia tricúspide ${evaluarRegurgitacion(reg)}.`;
    })(),
    
    // 31. Insuficiencia mitral
    conclusion_insufMitral: (() => {
      const reg = data.mitral_reg || '';
      if (!reg || reg.trim() === '') return 'Sin insuficiencia mitral significativa.';
      return `Insuficiencia mitral ${evaluarRegurgitacion(reg)}.`;
    })(),
    
    // 32. Insuficiencia pulmonar
    conclusion_insufPulmonar: (() => {
      const reg = data.pulmonar_reg || '';
      if (!reg || reg.trim() === '') return 'Sin insuficiencia pulmonar significativa.';
      return `Insuficiencia pulmonar ${evaluarRegurgitacion(reg)}.`;
    })(),
    
    // 33. Hipertensión pulmonar
    conclusion_hipertensionPulmonar: (() => {
      const psvdEval = evaluarParametro('tricuspide', 'psvd', tricuspide_psvd);
      if (psvdEval.clasificacion === 'baja') {
        return 'Baja probabilidad de hipertensión pulmonar.';
      }
      if (psvdEval.clasificacion === 'intermedia') {
        return 'Probabilidad intermedia de hipertensión pulmonar.';
      }
      return 'Alta probabilidad de hipertensión pulmonar.';
    })()
  };
}
