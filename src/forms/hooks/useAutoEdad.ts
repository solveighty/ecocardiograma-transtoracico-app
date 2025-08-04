import { useEffect } from "react";
import { calcularEdad } from "../services/firstForm/personalData";

export function useAutoEdad(patientData: any, setPatientData: (updater: any) => void) {
  useEffect(() => {
    if (patientData.fechaNacimiento) {
      const edad = calcularEdad(patientData.fechaNacimiento);
      setPatientData((prev: any) => ({
        ...prev,
        edad,
      }));
    }
  }, [patientData.fechaNacimiento]);
}
