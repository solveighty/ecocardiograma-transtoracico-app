export interface VentriculosAuriculasData {
  // Ventrículo Izquierdo
  ddfvi: string; // Diámetro Diastólico Final VI (mm)
  gdsept: string; // Grosor Septo Interventricular (mm)
  gdpil: string; // Grosor Pared Inferior (mm)
  masa: string;
  imvi: string;
  grp: string;
  mapse: string;
  tiempoDPDT: string; // tiempo en segundos para dP/dt
  dpdt: string;
  // Ventrículo Derecho
  basal: string;
  basalSistolico: string; // Nuevo campo para CAF
  caf: string;
  medio: string;
  ie: string;
  long: string;
  relacionVdVi: string;
  tapse: string;
  medidaVI: string; // para Relación VD/VI
  // Aurícula Izquierda
  dai: string;
  areaAi: string; // Área 4C
  areaAi2C: string; // Área 2C (nuevo campo)
  volAi: string;
  volIndexAi: string;
  // Aurícula Derecha
  dmAd: string;
  areaAd: string;
  superficieCorporal: string; // para IMVI y Vol Index
}
