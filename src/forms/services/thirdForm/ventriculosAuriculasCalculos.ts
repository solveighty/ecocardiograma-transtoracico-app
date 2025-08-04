function toNum(val: string) {
  const n = parseFloat(val.replace(",", "."));
  return isNaN(n) ? 0 : n;
}

// Masa VI = 0.8 × {1.04 × [(DDFVI + GDSept + GDPIL)^3 − (DDFVI)^3]} + 0.6
type MasaVIParams = { ddfvi: string; gdsept: string; gdpil: string };
export function calcMasaVI({ ddfvi, gdsept, gdpil }: MasaVIParams): string {
  const d = toNum(ddfvi) / 10; // mm a cm
  const s = toNum(gdsept) / 10;
  const p = toNum(gdpil) / 10;
  if (!d || !s || !p) return "";
  const masa = 0.8 * (1.04 * (Math.pow(d + s + p, 3) - Math.pow(d, 3))) + 0.6;
  return masa > 0 ? masa.toFixed(1) : "";
}

// IMVI = Masa VI / SC
type IMVIParams = { masaVI: string; superficieCorporal: string };
export function calcIMVI({ masaVI, superficieCorporal }: IMVIParams): string {
  const masa = toNum(masaVI);
  const sc = toNum(superficieCorporal);
  if (!masa || !sc) return "";
  const imvi = masa / sc;
  return imvi > 0 ? imvi.toFixed(1) : "";
}

// GRP = (GDSept + GDPIL) / DDFVI
// Todos los valores deben estar en la misma unidad (mm recomendado)
export function calcGRP(gdsept: string, gdpil: string, ddfvi: string): string {
  // Convertir a mm si vienen en cm (si el valor es < 10 asumimos cm)
  const s = toNum(gdsept) < 10 ? toNum(gdsept) * 10 : toNum(gdsept);
  const p = toNum(gdpil) < 10 ? toNum(gdpil) * 10 : toNum(gdpil);
  const d = toNum(ddfvi) < 10 ? toNum(ddfvi) * 10 : toNum(ddfvi);
  if (!s || !p || !d) return "";
  const grp = (s + p) / d;
  return grp > 0 ? grp.toFixed(2) : "";
}

// CAF = ((VDdiastólico − VDsistólico) / VDdiastólico) × 100
export function calcCAF(vdDiast: string, vdSist: string): string {
  const d = toNum(vdDiast);
  const s = toNum(vdSist);
  if (!d || !s) return "";
  const caf = ((d - s) / d) * 100;
  return caf.toFixed(1);
}

// IE = Diámetro basal / Longitud
export function calcIE(basal: string, long: string): string {
  const b = toNum(basal);
  const l = toNum(long);
  if (!b || !l) return "";
  const ie = b / l;
  return ie > 0 ? ie.toFixed(2) : "";
}

// Relación VD/VI = Basal VD / Basal VI
export function calcRelacionVDVI(basalVD: string, basalVI: string): string {
  const vd = toNum(basalVD);
  const vi = toNum(basalVI);
  if (!vd || !vi) return "";
  const rel = vd / vi;
  return rel > 0 ? rel.toFixed(2) : "";
}

// Volumen AI = 0.85 × Área4C × Área2C / Longitud
export function calcVolAI(area4C: string, area2C: string, long: string): string {
  const a4 = toNum(area4C);
  const a2 = toNum(area2C);
  const l = toNum(long);
  if (!a4 || !a2 || !l) return "";
  const vol = 0.85 * a4 * a2 / l;
  return vol > 0 ? vol.toFixed(1) : "";
}

// Volumen Index = Volumen / SC
export function calcVolIndex(volumen: string, superficieCorporal: string): string {
  const v = toNum(volumen);
  const sc = toNum(superficieCorporal);
  if (!v || !sc) return "";
  const idx = v / sc;
  return idx > 0 ? idx.toFixed(1) : "";
}
