// Utilidad: convierte string con coma o punto a número; devuelve 0 si no es válido
function toNum(val: string) {
  const n = parseFloat(val.replace(",", "."));
  return isNaN(n) ? 0 : n;
}

// Masa ventricular izquierda (g)
// Fórmula: Masa VI = 0.8 × {1.04 × [(DDFVI + GDSept + GDPIL)^3 − (DDFVI)^3]} + 0.6
// Unidades: DDFVI, GDSept y GDPIL en cm (se convierten desde mm aquí). Resultado en gramos.
type MasaVIParams = { ddfvi: string; gdsept: string; gdpil: string };
export function calcMasaVI({ ddfvi, gdsept, gdpil }: MasaVIParams): string {
  const d = toNum(ddfvi) / 10; // mm a cm
  const s = toNum(gdsept) / 10;
  const p = toNum(gdpil) / 10;
  if (!d || !s || !p) return "";
  const masa = 0.8 * (1.04 * (Math.pow(d + s + p, 3) - Math.pow(d, 3))) + 0.6;
  return masa > 0 ? masa.toFixed(1) : "";
}

// Índice de masa ventricular izquierda (g/m²)
// Fórmula: IMVI = Masa VI / SC
// Unidades: Masa en g, SC en m². Resultado en g/m².
type IMVIParams = { masaVI: string; superficieCorporal: string };
export function calcIMVI({ masaVI, superficieCorporal }: IMVIParams): string {
  const masa = toNum(masaVI);
  const sc = toNum(superficieCorporal);
  if (!masa || !sc) return "";
  const imvi = masa / sc;
  return imvi > 0 ? imvi.toFixed(1) : "";
}

// Grosor relativo de pared (adimensional)
// Fórmula: GRP = (GDSept + GDPIL) / DDFVI
// Unidades: misma unidad para numerador y denominador (se normaliza a mm aquí).
export function calcGRP(gdsept: string, gdpil: string, ddfvi: string): string {
  // Convertir a mm si vienen en cm (si el valor es < 10 asumimos cm)
  const s = toNum(gdsept) < 10 ? toNum(gdsept) * 10 : toNum(gdsept);
  const p = toNum(gdpil) < 10 ? toNum(gdpil) * 10 : toNum(gdpil);
  const d = toNum(ddfvi) < 10 ? toNum(ddfvi) * 10 : toNum(ddfvi);
  if (!s || !p || !d) return "";
  const grp = (s + p) / d;
  return grp > 0 ? grp.toFixed(2) : "";
}

// Cambio fraccional del área del VD (CAF, %)
// Fórmula: CAF = ((VDdiastólico − VDsistólico) / VDdiastólico) × 100
// Unidades: áreas en cm² (o la misma unidad). Resultado en %.
export function calcCAF(vdDiast: string, vdSist: string): string {
  const d = toNum(vdDiast);
  const s = toNum(vdSist);
  if (!d || !s) return "";
  const caf = ((d - s) / d) * 100;
  return caf.toFixed(1);
}

// Índice de esfericidad del VD (adimensional)
// Fórmula: IE = Diámetro basal / Longitud
export function calcIE(basal: string, long: string): string {
  const b = toNum(basal);
  const l = toNum(long);
  if (!b || !l) return "";
  const ie = b / l;
  return ie > 0 ? ie.toFixed(2) : "";
}

// Relación de diámetros VD/VI (adimensional)
// Fórmula: Relación VD/VI = Basal VD / Basal VI
export function calcRelacionVDVI(basalVD: string, basalVI: string): string {
  const vd = toNum(basalVD);
  const vi = toNum(basalVI);
  if (!vd || !vi) return "";
  const rel = vd / vi;
  return rel > 0 ? rel.toFixed(2) : "";
}

// Volumen de aurícula izquierda (ml) por método área-longitud biplano
// Fórmula: Vol AI = 0.85 × Área4C × Área2C / Longitud
// Unidades: áreas en cm², longitud en cm. Resultado en ml.
export function calcVolAI(area4C: string, area2C: string, long: string): string {
  const a4 = toNum(area4C);
  const a2 = toNum(area2C);
  const l = toNum(long);
  if (!a4 || !a2 || !l) return "";
  const vol = 0.85 * a4 * a2 / l;
  return vol > 0 ? vol.toFixed(1) : "";
}

// Índice de volumen AI (ml/m²)
// Fórmula: Volumen Index = Volumen / SC
// Unidades: volumen en ml, SC en m². Resultado en ml/m².
export function calcVolIndex(volumen: string, superficieCorporal: string): string {
  const v = toNum(volumen);
  const sc = toNum(superficieCorporal);
  if (!v || !sc) return "";
  const idx = v / sc;
  return idx > 0 ? idx.toFixed(1) : "";
}
