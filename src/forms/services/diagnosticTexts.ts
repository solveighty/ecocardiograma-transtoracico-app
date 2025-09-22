// Función para generar todos los textos de diagnóstico específicos para la plantilla
export function generateDiagnosticTexts(data: any, sexo: string): any {
  const esMujer = sexo.toLowerCase() === 'femenino' || sexo.toLowerCase() === 'mujer';
  
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
  const aorta_avac = safe(data.aorta_avac);
  const aorta_vmax = safe(data.aorta_vmax);
  const vci_dt = safe(data.vci_dt);
  const vci_colapso = safe(data.vci_colapso);
  
  return {
    // 1. Diámetros VI
    diag_diametrosVI: (() => {
      if (esMujer) {
        if (ddfvi >= 39 && ddfvi <= 53) return 'normales';
        if (ddfvi >= 54 && ddfvi <= 57) return 'levemente aumentados';
        if (ddfvi >= 58 && ddfvi <= 61) return 'moderadamente aumentados';
        if (ddfvi >= 62) return 'severamente aumentados';
      } else {
        if (ddfvi >= 42 && ddfvi <= 59) return 'normales';
        if (ddfvi >= 60 && ddfvi <= 63) return 'levemente aumentados';
        if (ddfvi >= 64 && ddfvi <= 68) return 'moderadamente aumentados';
        if (ddfvi >= 69) return 'severamente aumentados';
      }
      return 'normales';
    })(),
    
    // 2. Volumen sistólico VI
    diag_volumenSistolicoVI: (() => {
      if (esMujer) {
        if (vsfSimpson >= 19 && vsfSimpson <= 49) return 'normales';
        if (vsfSimpson >= 50 && vsfSimpson <= 59) return 'levemente aumentados';
        if (vsfSimpson >= 60 && vsfSimpson <= 69) return 'moderadamente aumentados';
        if (vsfSimpson >= 70) return 'severamente aumentados';
      } else {
        if (vsfSimpson >= 22 && vsfSimpson <= 58) return 'normales';
        if (vsfSimpson >= 59 && vsfSimpson <= 70) return 'levemente aumentados';
        if (vsfSimpson >= 71 && vsfSimpson <= 82) return 'moderadamente aumentados';
        if (vsfSimpson >= 83) return 'severamente aumentados';
      }
      return 'normales';
    })(),
    
    // 3. Volumen diastólico VI
    diag_volumenDiastolicoVI: (() => {
      if (esMujer) {
        if (vdfSimpson >= 56 && vdfSimpson <= 104) return 'normales';
        if (vdfSimpson >= 105 && vdfSimpson <= 117) return 'levemente aumentados';
        if (vdfSimpson >= 118 && vdfSimpson <= 130) return 'moderadamente aumentados';
        if (vdfSimpson >= 131) return 'severamente aumentados';
      } else {
        if (vdfSimpson >= 57 && vdfSimpson <= 155) return 'normales';
        if (vdfSimpson >= 156 && vdfSimpson <= 178) return 'levemente aumentados';
        if (vdfSimpson >= 179 && vdfSimpson <= 201) return 'moderadamente aumentados';
        if (vdfSimpson >= 202) return 'severamente aumentados';
      }
      return 'normales';
    })(),
    
    // 4. Grosor del septum
    diag_gdsept: (() => {
      if (esMujer) {
        if (gdsept >= 6 && gdsept <= 9) return 'normal';
        if (gdsept >= 10 && gdsept <= 12) return 'levemente aumentado';
        if (gdsept >= 13 && gdsept <= 15) return 'moderadamente aumentado';
        if (gdsept >= 16) return 'severamente aumentado';
      } else {
        if (gdsept >= 6 && gdsept <= 10) return 'normal';
        if (gdsept >= 11 && gdsept <= 13) return 'levemente aumentado';
        if (gdsept >= 14 && gdsept <= 16) return 'moderadamente aumentado';
        if (gdsept >= 17) return 'severamente aumentado';
      }
      return 'normal';
    })(),
    
    // 5. Grosor pared posterior
    diag_gdpil: (() => {
      if (esMujer) {
        if (gdpil >= 6 && gdpil <= 9) return 'normal';
        if (gdpil >= 10 && gdpil <= 12) return 'levemente aumentado';
        if (gdpil >= 13 && gdpil <= 15) return 'moderadamente aumentado';
        if (gdpil >= 16) return 'severamente aumentado';
      } else {
        if (gdpil >= 6 && gdpil <= 10) return 'normal';
        if (gdpil >= 11 && gdpil <= 13) return 'levemente aumentado';
        if (gdpil >= 14 && gdpil <= 16) return 'moderadamente aumentado';
        if (gdpil >= 17) return 'severamente aumentado';
      }
      return 'normal';
    })(),
    
    // 6. Función VI
    diag_funcionVI: (() => {
      if (feSimpson >= 55) return 'normal';
      if (feSimpson >= 45 && feSimpson <= 54) return 'levemente deprimida';
      if (feSimpson >= 30 && feSimpson <= 44) return 'moderadamente deprimida';
      if (feSimpson < 30) return 'severamente deprimida';
      return 'normal';
    })(),
    
    // 7. IMVI y GRP
    diag_imvi_grp: (() => {
      const imviNormal = esMujer ? imvi <= 95 : imvi <= 115;
      const grpNormal = grp >= 0.32 && grp <= 0.42;
      
      if (imviNormal && grpNormal) return 'dentro de parámetros normales';
      if (!imviNormal && grpNormal) return 'IMVI aumentado con GRP normal';
      if (imviNormal && !grpNormal) return 'IMVI normal con GRP alterado';
      return 'ambos parámetros alterados';
    })(),
    
    // 8. Tipo de hipertrofia
    tipoHipertrofia: (() => {
      const imviAlto = esMujer ? imvi > 95 : imvi > 115;
      const volumenAlto = false; // Asumir normal por ahora
      const rwtAlto = grp > 0.42;
      const rwtBajo = grp < 0.32;
      const rwtNormal = grp >= 0.32 && grp <= 0.42;
      
      if (!volumenAlto && !imviAlto && rwtNormal) return 'Normal';
      if (!volumenAlto && !imviAlto && rwtAlto) return 'Remodelación Concéntrica';
      if (!volumenAlto && imviAlto && rwtAlto) return 'Hipertrofia Concéntrica';
      if (volumenAlto && !imviAlto && rwtBajo) return 'Remodelación Excéntrica';
      if (volumenAlto && imviAlto && rwtBajo) return 'Hipertrofia Excéntrica';
      return 'Patrón indeterminado';
    })(),
    
    // 9. Disfunción diastólica
    diag_disfuncionDiastolica: (() => {
      if (relEePrime < 8) return 'función diastólica normal';
      if (relEePrime >= 8 && relEePrime <= 14) return 'disfunción diastólica grado I (alteración de la relajación)';
      if (relEePrime > 14) return 'disfunción diastólica grado II-III (presiones de llenado elevadas)';
      return 'función diastólica normal';
    })(),
    
    // 10. Aurícula izquierda
    diag_ai: (() => {
      if (esMujer) {
        if (dai >= 27 && dai <= 38 && areaAi <= 20 && volIndexAi < 35) return 'normales';
        if (dai >= 39 && dai <= 42 || areaAi >= 20 && areaAi <= 30 || volIndexAi >= 29 && volIndexAi <= 33) return 'levemente aumentados';
        if (dai >= 43 && dai <= 46 || areaAi >= 30 && areaAi <= 40 || volIndexAi >= 34 && volIndexAi <= 39) return 'moderadamente aumentados';
        if (dai >= 47 || areaAi > 40 || volIndexAi >= 40) return 'severamente aumentados';
      } else {
        if (dai >= 30 && dai <= 40 && areaAi <= 20 && volIndexAi < 35) return 'normales';
        if (dai >= 41 && dai <= 46 || areaAi >= 20 && areaAi <= 30 || volIndexAi >= 29 && volIndexAi <= 33) return 'levemente aumentados';
        if (dai >= 47 && dai <= 52 || areaAi >= 30 && areaAi <= 40 || volIndexAi >= 34 && volIndexAi <= 39) return 'moderadamente aumentados';
        if (dai >= 52 || areaAi > 40 || volIndexAi >= 40) return 'severamente aumentados';
      }
      return 'normales';
    })(),
    
    // 11. Aurícula derecha
    diag_ad: (() => {
      if (dmAd >= 29 && dmAd <= 45 && areaAd <= 18) return 'normales';
      if (dmAd >= 46 && dmAd <= 49) return 'levemente aumentados';
      if (dmAd >= 50 && dmAd <= 54) return 'moderadamente aumentados';
      if (dmAd >= 55) return 'severamente aumentados';
      return 'normales';
    })(),
    
    // 12. Ventrículo derecho
    diag_vd: (() => {
      if (basal >= 20 && basal <= 28 && tapse > 17) return 'normales con función sistólica preservada';
      if (basal >= 29 && basal <= 33) return 'levemente dilatado';
      if (basal >= 34 && basal <= 38) return 'moderadamente dilatado';
      if (basal >= 39) return 'severamente dilatado';
      if (tapse <= 17) return 'con función sistólica deprimida';
      return 'normales';
    })(),
    
    // 13. Válvula mitral
    diag_valvulaMitral: (() => {
      const reg = evaluarRegurgitacion(data.mitral_reg || '');
      return `${reg}`;
    })(),
    
    // 14. Doppler mitral
    diag_dopplerMitral: (() => {
      if (mitral_relEA >= 1 && mitral_relEA <= 2) return 'patrón normal de llenado';
      if (mitral_relEA < 1) return 'patrón de alteración de la relajación';
      if (mitral_relEA > 2) return 'patrón restrictivo';
      return 'patrón indeterminado';
    })(),
    
    // 15. VP onda E
    diag_vpOndaE: (() => {
      const vpOndaE = safe(data.modoMColor_vpOndaE);
      if (vpOndaE > 45) return 'normal';
      return 'disminuida, sugiere disfunción diastólica';
    })(),
    
    // 16. Venas pulmonares
    diag_venasPulmonares: (() => {
      const relSD = safe(data.venasPulmonares_relSD);
      if (relSD >= 1) return 'con patrón normal (S≥D)';
      return 'con patrón anormal (S<D), sugiere disfunción diastólica';
    })(),
    
    // 17. Raíz aórtica
    diag_raizAortica: (() => {
      const rao = safe(data.gvAorta_rao);
      if (rao < 40) return 'de dimensiones normales';
      return 'dilatada';
    })(),
    
    // 18. Válvula aórtica
    diag_valvulaAortica: (() => {
      const reg = evaluarRegurgitacion(data.aorta_reg || '');
      const vmax = aorta_vmax / 100; // convertir a m/s
      
      if (vmax >= 2.6 && vmax <= 3.0 && aorta_avac > 1.5) {
        return `estenosis leve con ${reg}`;
      } else if (vmax >= 3.0 && vmax <= 4.0 && aorta_avac >= 1.0 && aorta_avac <= 1.5) {
        return `estenosis moderada con ${reg}`;
      } else if (vmax > 4.0 && aorta_avac < 1.0) {
        return `estenosis severa con ${reg}`;
      } else {
        return `sin estenosis significativa, ${reg}`;
      }
    })(),
    
    // 19. Aorta torácica
    diag_aortaToracica: (() => {
      const unionST = safe(data.gvAorta_unionST);
      const cayado = safe(data.gvAorta_cayado);
      const aoDesc = safe(data.gvAorta_aoDesc);
      
      if (unionST <= 35 && cayado <= 35 && aoDesc <= 25) return 'sin dilatación';
      return 'con dilatación';
    })(),
    
    // 20. Aorta abdominal
    diag_aortaAbdominal: (() => {
      const aoAbd = safe(data.gvAorta_aoAbd);
      if (aoAbd <= 20) return 'sin dilatación';
      return 'con dilatación';
    })(),
    
    // 21. Arteria pulmonar
    diag_pulmonar: (() => {
      const reg = evaluarRegurgitacion(data.pulmonar_reg || '');
      const pmap = safe(data.pulmonar_pmap);
      
      if (pmap <= 25) return `presiones normales con ${reg}`;
      if (pmap > 25 && pmap <= 40) return `hipertensión pulmonar leve con ${reg}`;
      return `hipertensión pulmonar significativa con ${reg}`;
    })(),
    
    // 22. Válvula tricúspide
    diag_valvulaTricuspide: (() => {
      const reg = evaluarRegurgitacion(data.tricuspide_reg || '');
      if (tricuspide_psvd < 35) return `${reg}, baja probabilidad de hipertensión pulmonar`;
      if (tricuspide_psvd >= 35 && tricuspide_psvd <= 50) return `${reg}, probabilidad intermedia de hipertensión pulmonar`;
      return `${reg}, alta probabilidad de hipertensión pulmonar`;
    })(),
    
    // 23. VCI
    diag_vci: (() => {
      if (vci_dt <= 21 && vci_colapso >= 50) return 'normal';
      if (vci_dt >= 21 && vci_colapso >= 50) return 'dilatada con colapso preservado';
      if (vci_dt >= 21 && vci_colapso < 50) return 'dilatada con colapso disminuido';
      return 'dilatada sin colapso';
    })(),
    
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
      if (feSimpson >= 55) return 'Función sistólica del ventrículo izquierdo normal.';
      if (feSimpson >= 45) return 'Disfunción sistólica leve del ventrículo izquierdo.';
      if (feSimpson >= 30) return 'Disfunción sistólica moderada del ventrículo izquierdo.';
      return 'Disfunción sistólica severa del ventrículo izquierdo.';
    })(),
    
    // 27. Hipertrofia VI
    conclusion_hipertrofiaVI: (() => {
      const imviAlto = esMujer ? imvi > 95 : imvi > 115;
      if (!imviAlto) return 'Masa ventricular izquierda normal.';
      
      const rwtAlto = grp > 0.42;
      if (rwtAlto) return 'Hipertrofia concéntrica del ventrículo izquierdo.';
      return 'Hipertrofia excéntrica del ventrículo izquierdo.';
    })(),
    
    // 28. Disfunción VI
    conclusion_disfuncionVI: (() => {
      if (relEePrime < 8) return 'Función diastólica normal.';
      if (relEePrime <= 14) return 'Disfunción diastólica grado I.';
      return 'Disfunción diastólica grado II-III.';
    })(),
    
    // 29. Disfunción VD
    conclusion_disfuncionVD: (() => {
      if (tapse > 17) return 'Función sistólica del ventrículo derecho normal.';
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
      if (tricuspide_psvd < 35) return 'Baja probabilidad de hipertensión pulmonar.';
      if (tricuspide_psvd <= 50) return 'Probabilidad intermedia de hipertensión pulmonar.';
      return 'Alta probabilidad de hipertensión pulmonar.';
    })()
  };
}
