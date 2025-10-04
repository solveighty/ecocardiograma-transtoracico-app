import diagnosticRanges from './diagnosticRanges.json';

/**
 * Función utilitaria para evaluar un valor médico según rangos de referencia
 * @param categoria - Categoría del parámetro (ej: 'diametrosVI', 'funcionVI')
 * @param parametro - Nombre del parámetro (ej: 'ddfvi', 'feSimpson')
 * @param valor - Valor numérico a evaluar
 * @param sexo - Sexo del paciente ('M' | 'F' | 'masculino' | 'femenino') - opcional
 * @returns Objeto con clasificación y texto descriptivo
 */
export function evaluarParametro(
  categoria: string,
  parametro: string,
  valor: number,
  sexo?: string
): { clasificacion: string; texto: string } {
  // Obtener la categoría del JSON
  const cat = (diagnosticRanges as any)[categoria];
  if (!cat) {
    return { clasificacion: 'desconocido', texto: 'parámetro no encontrado' };
  }

  // Obtener el parámetro
  const param = cat[parametro];
  if (!param) {
    return { clasificacion: 'desconocido', texto: 'parámetro no encontrado' };
  }

  // Determinar si necesita diferenciación por sexo
  const esMujer = sexo && (sexo.toLowerCase() === 'f' || sexo.toLowerCase() === 'femenino' || sexo.toLowerCase() === 'mujer');

  // Si tiene diferenciación por sexo
  if (param.mujer && param.hombre) {
    const rangos = esMujer ? param.mujer : param.hombre;
    return evaluarContraRangos(valor, rangos);
  }

  // Si no tiene diferenciación por sexo
  return evaluarContraRangos(valor, param);
}

/**
 * Evalúa un valor contra un conjunto de rangos
 */
function evaluarContraRangos(valor: number, rangos: any): { clasificacion: string; texto: string } {
  // Ordenar las clasificaciones por prioridad (normal, leve, moderado, severo, etc.)
  const clasificaciones = Object.keys(rangos);
  
  for (const clasificacion of clasificaciones) {
    const rango = rangos[clasificacion];
    
    if (rango.min !== undefined && rango.max !== undefined) {
      if (valor >= rango.min && valor <= rango.max) {
        return {
          clasificacion,
          texto: rango.texto
        };
      }
    }
  }

  // Si no se encuentra en ningún rango, retornar el primero como default
  const defaultClasif = clasificaciones[0];
  return {
    clasificacion: defaultClasif,
    texto: rangos[defaultClasif]?.texto || 'indeterminado'
  };
}

/**
 * Evalúa VCI (caso especial con dos parámetros)
 */
export function evaluarVCI(dt: number, colapso: number): { clasificacion: string; texto: string } {
  const vciRangos = (diagnosticRanges as any).vci;

  if (dt <= vciRangos.normal.dt.max && colapso >= vciRangos.normal.colapso.min) {
    return { clasificacion: 'normal', texto: vciRangos.normal.texto };
  }

  if (dt >= vciRangos.dilatadaColapsoPreservado.dt.min && 
      colapso >= vciRangos.dilatadaColapsoPreservado.colapso.min) {
    return { clasificacion: 'dilatadaColapsoPreservado', texto: vciRangos.dilatadaColapsoPreservado.texto };
  }

  if (dt >= vciRangos.dilatadaColapsoDisminuido.dt.min && 
      colapso <= vciRangos.dilatadaColapsoDisminuido.colapso.max) {
    return { clasificacion: 'dilatadaColapsoDisminuido', texto: vciRangos.dilatadaColapsoDisminuido.texto };
  }

  return { clasificacion: 'dilatada', texto: 'dilatada sin colapso' };
}

/**
 * Evalúa válvula aórtica (caso especial con múltiples parámetros)
 */
export function evaluarValvulaAortica(vmax: number, avac: number): { clasificacion: string; texto: string } {
  // Convertir vmax de cm/s a m/s si es necesario
  const vmaxMs = vmax > 10 ? vmax / 100 : vmax;

  // Estenosis severa
  if (vmaxMs > 4.0 && avac < 1.0) {
    return { clasificacion: 'severa', texto: 'estenosis severa' };
  }

  // Estenosis moderada
  if (vmaxMs >= 3.0 && vmaxMs <= 4.0 && avac >= 1.0 && avac <= 1.5) {
    return { clasificacion: 'moderada', texto: 'estenosis moderada' };
  }

  // Estenosis leve
  if (vmaxMs >= 2.6 && vmaxMs <= 3.0 && avac > 1.5) {
    return { clasificacion: 'leve', texto: 'estenosis leve' };
  }

  // Normal
  return { clasificacion: 'normal', texto: 'sin estenosis significativa' };
}

/**
 * Evalúa aurícula izquierda (caso especial que combina DAI, Área y Vol Index)
 */
export function evaluarAuriculaIzquierda(
  dai: number, 
  areaAi: number, 
  volIndexAi: number, 
  sexo: string
): { clasificacion: string; texto: string } {
  const esMujer = sexo.toLowerCase() === 'f' || sexo.toLowerCase() === 'femenino' || sexo.toLowerCase() === 'mujer';

  const daiEval = evaluarParametro('auriculaIzquierda', 'dai', dai, sexo);
  const areaEval = evaluarParametro('auriculaIzquierda', 'areaAi', areaAi);
  const volIndexEval = evaluarParametro('auriculaIzquierda', 'volIndexAi', volIndexAi);

  // Lógica combinada (simplificada - ajustar según criterios médicos)
  const daiRangos = esMujer ? 
    (diagnosticRanges as any).auriculaIzquierda.dai.mujer : 
    (diagnosticRanges as any).auriculaIzquierda.dai.hombre;
  
  const areaRangos = (diagnosticRanges as any).auriculaIzquierda.areaAi;
  const volIndexRangos = (diagnosticRanges as any).auriculaIzquierda.volIndexAi;

  // Si todos son normales
  if (dai >= daiRangos.normal.min && dai <= daiRangos.normal.max &&
      areaAi <= areaRangos.normal.max &&
      volIndexAi <= volIndexRangos.normal.max) {
    return { clasificacion: 'normal', texto: 'normales' };
  }

  // Evaluar severidad máxima
  const clasificaciones = [daiEval.clasificacion, areaEval.clasificacion, volIndexEval.clasificacion];
  
  if (clasificaciones.includes('severo')) {
    return { clasificacion: 'severo', texto: 'severamente aumentados' };
  }
  if (clasificaciones.includes('moderado')) {
    return { clasificacion: 'moderado', texto: 'moderadamente aumentados' };
  }
  if (clasificaciones.includes('leve')) {
    return { clasificacion: 'leve', texto: 'levemente aumentados' };
  }

  return { clasificacion: 'normal', texto: 'normales' };
}

/**
 * Determina tipo de hipertrofia basado en IMVI y GRP
 */
export function determinarTipoHipertrofia(
  imvi: number,
  grp: number,
  sexo: string,
  volumenAlto: boolean = false
): string {
  const imviEval = evaluarParametro('masaVI', 'imvi', imvi, sexo);
  const grpEval = evaluarParametro('masaVI', 'grp', grp);

  const imviAumentado = imviEval.clasificacion === 'aumentado';
  const rwtAlto = grpEval.clasificacion === 'alto';
  const rwtBajo = grpEval.clasificacion === 'bajo';
  const rwtNormal = grpEval.clasificacion === 'normal';

  if (!volumenAlto && !imviAumentado && rwtNormal) {
    return 'Normal';
  } else if (!volumenAlto && !imviAumentado && rwtAlto) {
    return 'Remodelación Concéntrica';
  } else if (!volumenAlto && imviAumentado && rwtAlto) {
    return 'Hipertrofia Concéntrica';
  } else if (volumenAlto && !imviAumentado && rwtBajo) {
    return 'Remodelación Excéntrica';
  } else if (volumenAlto && imviAumentado && rwtBajo) {
    return 'Hipertrofia Excéntrica';
  }

  return 'Patrón indeterminado';
}

// Exportar también el JSON completo para casos especiales
export { diagnosticRanges };
