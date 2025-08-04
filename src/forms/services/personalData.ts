// Fórmula de Du Bois: SC = 0.007184 × talla^0.725 × peso^0.425 (talla en cm, peso en kg)
export function calcularSuperficieCorporal(peso: string, talla: string): string {
  const pesoNum = Number.parseFloat(peso);
  const tallaNum = Number.parseFloat(talla);
  if (pesoNum > 0 && tallaNum > 0) {
    const sc = 0.007184 * Math.pow(tallaNum, 0.725) * Math.pow(pesoNum, 0.425);
    return sc.toFixed(2);
  }
  return "";
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
