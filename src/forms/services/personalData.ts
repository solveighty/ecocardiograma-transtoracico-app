export function calcularSuperficieCorporal(peso: string, talla: string): string {
  const pesoNum = Number.parseFloat(peso);
  const tallaNum = Number.parseFloat(talla);
  if (pesoNum > 0 && tallaNum > 0) {
    const sc = Math.sqrt((pesoNum * tallaNum) / 3600);
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
