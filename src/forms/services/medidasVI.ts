export function calcVL(vdf: string, vsf: string): string {
  const vdfNum = parseFloat(vdf);
  const vsfNum = parseFloat(vsf);
  if (!isNaN(vdfNum) && !isNaN(vsfNum)) {
    return (vdfNum - vsfNum).toFixed(2);
  }
  return "";
}

export function calcFETeich(ddfvi: string, dsfvi: string): string {
  const d = parseFloat(ddfvi);
  const s = parseFloat(dsfvi);
  if (!isNaN(d) && !isNaN(s) && d > 0) {
    return (((Math.pow(d, 3) - Math.pow(s, 3)) / Math.pow(d, 3)) * 100).toFixed(2);
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
