import { useEffect } from "react";
import { calcularEdad } from "../services/firstForm/personalData";

export function useAutoEdad(patientData: any, setPatientData: (updater: any) => void) {
  useEffect(() => {
    // Solo calcular edad automáticamente si:
    // 1. Hay fecha de nacimiento
    // 2. Y la edad está vacía (usuario no ha ingresado manualmente)
    if (patientData.fechaNacimiento && (!patientData.edad || patientData.edad === '')) {
      const edad = calcularEdad(patientData.fechaNacimiento);
      setPatientData((prev: any) => ({
        ...prev,
        edad,
      }));
    }
  }, [patientData.fechaNacimiento]);
}
