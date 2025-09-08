// Volumen Diastólico Final por Teichholz
// Fórmula: VDF = 7.0 × DDFVI³ / (2.4 + DDFVI)
// Unidades: DDFVI en mm (se convierte a cm). Resultado en ml.
export function calcVDFTeich(ddfvi: string): string {
  const d = parseFloat(ddfvi) / 10; // mm a cm
  if (!isNaN(d) && d > 0) {
    const vdf = 7.0 * Math.pow(d, 3) / (2.4 + d);
    return vdf.toFixed(2);
  }
  return "";
}

// Volumen Sistólico Final por Teichholz
// Fórmula: VSF = 7.0 × DSFVI³ / (2.4 + DSFVI)
// Unidades: DSFVI en mm (se convierte a cm). Resultado en ml.
export function calcVSFTeich(dsfvi: string): string {
  const s = parseFloat(dsfvi) / 10; // mm a cm
  if (!isNaN(s) && s >= 0) {
    const vsf = 7.0 * Math.pow(s, 3) / (2.4 + s);
    return vsf.toFixed(2);
  }
  return "";
}

// Diferencia de volúmenes (VL)
// Fórmula: VL = VDF − VSF
// Unidades esperadas: VDF y VSF en ml -> resultado en ml
export function calcVL(vdf: string, vsf: string): string {
  const vdfNum = parseFloat(vdf);
  const vsfNum = parseFloat(vsf);
  if (!isNaN(vdfNum) && !isNaN(vsfNum)) {
    return (vdfNum - vsfNum).toFixed(2);
  }
  return "";
}

// Fracción de eyección a partir de volúmenes (genérico)
// Fórmula: FE = ((VDF − VSF) / VDF) × 100
// Unidades esperadas: VDF y VSF en ml -> resultado en %
export function calcFE_Vol(vdf: string, vsf: string): string {
  const vdfNum = parseFloat(vdf);
  const vsfNum = parseFloat(vsf);
  if (!isNaN(vdfNum) && !isNaN(vsfNum) && vdfNum > 0) {
    return (((vdfNum - vsfNum) / vdfNum) * 100).toFixed(2);
  }
  return "";
}

// Fracción de eyección por Teichholz
// Fórmulas:
//  - FE = ((VDF − VSF) / VDF) × 100
//  - VDF = 7.0 × DDFVI³ / (2.4 + DDFVI)
//  - VSF = 7.0 × DSFVI³ / (2.4 + DSFVI)
// Unidades: DDFVI y DSFVI en mm (se convierten aquí a cm). Volúmenes en ml. Resultado FE en %.
export function calcFETeich(ddfvi: string, dsfvi: string): string {
  const d = parseFloat(ddfvi) / 10; // mm a cm
  const s = parseFloat(dsfvi) / 10;
  if (!isNaN(d) && !isNaN(s) && d > 0 && s >= 0) {
    const vdf = 7.0 * Math.pow(d, 3) / (2.4 + d);
    const vsf = 7.0 * Math.pow(s, 3) / (2.4 + s);
    if (vdf > 0) {
      return (((vdf - vsf) / vdf) * 100).toFixed(2);
    }
  }
  return "";
}

// Fracción de acortamiento (FA)
// Fórmula: FA = ((DDFVI − DSFVI) / DDFVI) × 100
// Unidades: DDFVI y DSFVI en mm -> resultado en %
export function calcFA(ddfvi: string, dsfvi: string): string {
  const d = parseFloat(ddfvi);
  const s = parseFloat(dsfvi);
  if (!isNaN(d) && !isNaN(s) && d > 0) {
    return (((d - s) / d) * 100).toFixed(2);
  }
  return "";
}

// Fracción de eyección por Simpson biplano
// Fórmula: FE = ((VDF − VSF) / VDF) × 100
// Unidades esperadas: VDF y VSF en ml -> resultado en %
export function calcFE_Simpson(vdf: string, vsf: string): string {
  const vdfNum = parseFloat(vdf);
  const vsfNum = parseFloat(vsf);
  if (!isNaN(vdfNum) && !isNaN(vsfNum) && vdfNum > 0) {
    return (((vdfNum - vsfNum) / vdfNum) * 100).toFixed(2);
  }
  return "";
}
