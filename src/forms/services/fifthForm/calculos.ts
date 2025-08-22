// Utilidad: parsea string con coma o punto a número; devuelve undefined si no es válido
export function toNumber(v?: string): number | undefined {
  const n = parseFloat((v ?? '').toString().replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

// Relación E/e' (adimensional)
// Fórmula: E/e' = Velocidad E mitral / e' tisular mitral
// Unidades: ambas en cm/s (o misma unidad). Resultado adimensional.
export function calcRelEePrime(eMitralCmSeg?: string, ePrimeCmSeg?: string): string {
  const e = toNumber(eMitralCmSeg);
  const ep = toNumber(ePrimeCmSeg);
  if (e === undefined || ep === undefined || ep === 0) return '';
  return (e / ep).toFixed(2);
}

// Relación S/D en venas pulmonares (adimensional)
// Fórmula: RelSD = S / D
// Unidades: velocidades en cm/s (o misma unidad). Resultado adimensional.
export function calcRelSD(s?: string, d?: string): string {
  const sv = toNumber(s);
  const dv = toNumber(d);
  if (sv === undefined || dv === undefined || dv === 0) return '';
  return (sv / dv).toFixed(2);
}
