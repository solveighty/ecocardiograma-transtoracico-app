export function calcVL(vdf: string, vsf: string): string {
  const vdfNum = parseFloat(vdf);
  const vsfNum = parseFloat(vsf);
  if (!isNaN(vdfNum) && !isNaN(vsfNum)) {
    return (vdfNum - vsfNum).toFixed(2);
  }
  return "";
}

// FE Teichholz: FE = ((VDF − VSF) / VDF) × 100
// VDF = 7.0 × DDFVI³ / (2.4 + DDFVI), VSF = 7.0 × DSFVI³ / (2.4 + DSFVI)
// DDFVI y DSFVI en mm, convertir a cm
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

export function calcFA(ddfvi: string, dsfvi: string): string {
  const d = parseFloat(ddfvi);
  const s = parseFloat(dsfvi);
  if (!isNaN(d) && !isNaN(s) && d > 0) {
    return (((d - s) / d) * 100).toFixed(2);
  }
  return "";
}

export function calcFE_Simpson(vdf: string, vsf: string): string {
  const vdfNum = parseFloat(vdf);
  const vsfNum = parseFloat(vsf);
  if (!isNaN(vdfNum) && !isNaN(vsfNum) && vdfNum > 0) {
    return (((vdfNum - vsfNum) / vdfNum) * 100).toFixed(2);
  }
  return "";
}
