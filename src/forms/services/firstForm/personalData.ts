// Tipos de fórmulas disponibles para superficie corporal
export type BSAFormula = 'dubois' | 'mosteller';

// Fórmula de Du Bois: SC = 0.007184 × talla^0.725 × peso^0.425 (talla en cm, peso en kg)
export function calcularSuperficieCorporalDuBois(peso: string, talla: string): string {
  const pesoNum = Number.parseFloat(peso);
  const tallaNum = Number.parseFloat(talla);
  if (pesoNum > 0 && tallaNum > 0) {
    const sc = 0.007184 * Math.pow(tallaNum, 0.725) * Math.pow(pesoNum, 0.425);
    return sc.toFixed(2);
  }
  return "";
}

// Fórmula de Mosteller: SC = √((talla × peso) / 3600) (talla en cm, peso en kg)
export function calcularSuperficieCorporalMosteller(peso: string, talla: string): string {
  const pesoNum = Number.parseFloat(peso);
  const tallaNum = Number.parseFloat(talla);
  if (pesoNum > 0 && tallaNum > 0) {
    const sc = Math.sqrt((tallaNum * pesoNum) / 3600);
    return sc.toFixed(2);
  }
  return "";
}

// Función principal que permite elegir la fórmula
export function calcularSuperficieCorporal(peso: string, talla: string, formula: BSAFormula = 'dubois'): string {
  switch (formula) {
    case 'mosteller':
      return calcularSuperficieCorporalMosteller(peso, talla);
    case 'dubois':
    default:
      return calcularSuperficieCorporalDuBois(peso, talla);
  }
}

// Mantener retrocompatibilidad - usa Du Bois por defecto
export function calcularSuperficieCorporalDefault(peso: string, talla: string): string {
  return calcularSuperficieCorporalDuBois(peso, talla);
}

export function calcularEdad(fechaNacimiento: Date | undefined, fechaReferencia: Date = new Date()): string {
  if (!fechaNacimiento) return "";
  const today = fechaReferencia;
  const birthDate = new Date(fechaNacimiento);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age.toString();
}
