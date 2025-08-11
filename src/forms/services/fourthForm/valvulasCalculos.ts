export function toNumber(v?: string): number | undefined {
  const n = parseFloat((v ?? "").toString().replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

// E/A ratio
export function calcRelEA(e?: string, a?: string): string {
  const ev = toNumber(e);
  const av = toNumber(a);
  if (ev === undefined || av === undefined || av === 0) return "";
  return (ev / av).toFixed(2);
}

// Gradiente pico (mmHg) usando V en cm/s: Grad = 4 * (V[m/s])^2
export function calcGradPicoFromVmaxCm(vmaxCm?: string): string {
  const v = toNumber(vmaxCm);
  if (v === undefined) return "";
  const vms = v / 100; // cm/s -> m/s
  return (4 * vms * vms).toFixed(1);
}

// AVM por PHT (cm²)
export function calcAVMFromPHT(phtMs?: string): string {
  const pht = toNumber(phtMs);
  if (pht === undefined || pht === 0) return "";
  return (220 / pht).toFixed(2);
}

// ERO por PISA: (2π r^2 Va) / Vmax_regurg
// Unidades esperadas: r en cm, Va (Nyquist) en cm/s, Vmax_reg en cm/s -> resultado en cm²
// Nota: si se usan Va o Vmax en m/s, conviértalos a cm/s (1 m/s = 100 cm/s) antes de aplicar esta función.
export function calcERO_PISA(radioCm?: string, nyquistCmSeg?: string, vmaxRegCmSeg?: string): string {
  const r = toNumber(radioCm);
  const va = toNumber(nyquistCmSeg);
  const vmax = toNumber(vmaxRegCmSeg);
  if (r === undefined || va === undefined || vmax === undefined || vmax === 0) return "";
  const ero = (2 * Math.PI * r * r * va) / vmax;
  return ero.toFixed(2);
}

// Volumen regurgitante (ml): ERO (cm²) * VTI_regurg (cm)
export function calcVR(eroCm2?: string, vtiCm?: string): string {
  const ero = toNumber(eroCm2);
  const vti = toNumber(vtiCm);
  if (ero === undefined || vti === undefined) return "";
  return (ero * vti).toFixed(1);
}

// PSVD/RVSP (mmHg) por TR: 4 * V_TR[m/s]^2 + RAP
export function calcPSVD(vtrCm?: string, rapMmHg?: string): string {
  const v = toNumber(vtrCm);
  if (v === undefined) return "";
  const vms = v / 100;
  const base = 4 * vms * vms;
  const rap = toNumber(rapMmHg) ?? 0;
  return (base + rap).toFixed(1);
}
