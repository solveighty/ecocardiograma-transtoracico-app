export function toNumber(v?: string): number | undefined {
  const n = parseFloat((v ?? '').toString().replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}

export function calcRelEePrime(eMitralCmSeg?: string, ePrimeCmSeg?: string): string {
  const e = toNumber(eMitralCmSeg);
  const ep = toNumber(ePrimeCmSeg);
  if (e === undefined || ep === undefined || ep === 0) return '';
  return (e / ep).toFixed(2);
}

export function calcRelSD(s?: string, d?: string): string {
  const sv = toNumber(s);
  const dv = toNumber(d);
  if (sv === undefined || dv === undefined || dv === 0) return '';
  return (sv / dv).toFixed(2);
}
