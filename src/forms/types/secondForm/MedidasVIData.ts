export interface MedidasVIData {
  // DIÁMETROS
  ddfvi: string; // Diámetro Diastólico Final VI (mm)
  dsfvi: string; // Diámetro Sistólico Final VI (mm)
  gdsept: string; // Grosor Septo Interventricular (mm)
  gdpil: string; // Grosor Pared Inferior (mm)
  rao: string; // Radio aórtico (mm)
  // VOLÚMENES (lineales)
  vdfLineal: string; // Volumen Diastólico Final (ml)
  vsfLineal: string; // Volumen Sistólico Final (ml)
  // PLANIMETRÍA (Simpson)
  vdfSimpson: string; // Volumen Diastólico Final (ml)
  vsfSimpson: string; // Volumen Sistólico Final (ml)
}
