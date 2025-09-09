// Utilidad: parsea string con coma o punto a número; devuelve undefined si no es válido
export function toNumber(v?: string): number | undefined {
  const n = parseFloat((v ?? "").toString().replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

// Utilidad: convierte velocidad a cm/s automáticamente
// Si el valor es < 10, asume que está en m/s y lo convierte a cm/s (×100)
// Si el valor es >= 10, asume que ya está en cm/s
export function normalizeVelocityToCmS(velocity?: string): number | undefined {
  const v = toNumber(velocity);
  if (v === undefined) return undefined;
  
  // Si el valor es menor a 10, probablemente está en m/s, convertir a cm/s
  if (v < 10) {
    return v * 100;
  }
  
  // Si el valor es >= 10, asumir que ya está en cm/s
  return v;
}

// Relación E/A (adimensional)
// Fórmula: RelEA = E / A
// Unidades: velocidades en cm/s (o misma unidad). Resultado adimensional.
export function calcRelEA(e?: string, a?: string): string {
  const ev = toNumber(e);
  const av = toNumber(a);
  if (ev === undefined || av === undefined || av === 0) return "";
  return (ev / av).toFixed(2);
}

// Gradiente pico (mmHg) a partir de velocidad
// Fórmula: Grad = 4 × (V[m/s])² = 4 × (V[cm/s]/100)²
// Nota: Vmax se convierte automáticamente de m/s a cm/s si es necesario.
export function calcGradPicoFromVmaxCm(vmaxCm?: string): string {
  const vCmS = normalizeVelocityToCmS(vmaxCm);
  if (vCmS === undefined) return "";
  const vms = vCmS / 100; // cm/s -> m/s
  return (4 * vms * vms).toFixed(1);
}

// Área valvular mitral por PHT (cm²)
// Fórmula: AVM = 220 / PHT
// Unidades: PHT en ms. Resultado en cm².
export function calcAVMFromPHT(phtMs?: string): string {
  const pht = toNumber(phtMs);
  if (pht === undefined || pht === 0) return "";
  return (220 / pht).toFixed(2);
}

// Orificio regurgitante efectivo (ERO) por PISA (cm²)
// Fórmula: ERO = (2π r² × Va) / Vmax_regurg
// Unidades: r en cm, Va en cm/s, Vmax en cm/s. Resultado en cm².
// Nota: Vmax se convierte automáticamente de m/s a cm/s si es necesario.
export function calcERO_PISA(radioCm?: string, nyquistCmSeg?: string, vmaxRegCmSeg?: string): string {
  const r = toNumber(radioCm);
  const va = toNumber(nyquistCmSeg);
  const vmaxNormalized = normalizeVelocityToCmS(vmaxRegCmSeg);
  if (r === undefined || va === undefined || vmaxNormalized === undefined || vmaxNormalized === 0) return "";
  const ero = (2 * Math.PI * r * r * va) / vmaxNormalized;
  return ero.toFixed(2);
}

// Volumen regurgitante (ml)
// Fórmula: VR = ERO (cm²) × VTI_regurg (cm)
export function calcVR(eroCm2?: string, vtiCm?: string): string {
  const ero = toNumber(eroCm2);
  const vti = toNumber(vtiCm);
  if (ero === undefined || vti === undefined) return "";
  return (ero * vti).toFixed(1);
}

// PSVD / RVSP (mmHg) a partir de insuficiencia tricuspídea
// Fórmula: PSVD = 4 × (V_TR[m/s])² + RAP
// Unidades: V_TR en cm/s (se convierte a m/s aquí), RAP en mmHg. Resultado en mmHg.
// Nota: V_TR se convierte automáticamente de m/s a cm/s si es necesario.
export function calcPSVD(vtrCm?: string, rapMmHg?: string): string {
  const vCmS = normalizeVelocityToCmS(vtrCm);
  if (vCmS === undefined) return "";
  const vms = vCmS / 100;
  const base = 4 * vms * vms;
  const rap = toNumber(rapMmHg) ?? 0;
  return (base + rap).toFixed(1);
}
