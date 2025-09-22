import { useEffect } from "react";
import { calcularSuperficieCorporal } from "../services/firstForm/personalData";

export function useAutoSuperficieCorporal(patientData: any, setPatientData: (updater: any) => void, setVentriculosAuriculasData: (updater: any) => void) {
  useEffect(() => {
    const sc = calcularSuperficieCorporal(patientData.peso, patientData.talla, patientData.bsaFormula || 'dubois');
    setPatientData((prev: any) => ({
      ...prev,
      superficieCorporal: sc || "",
    }));
    setVentriculosAuriculasData((prev: any) => {
      // Recalcular IMVI y Vol Index si hay masa y volAi
      // Puedes ajustar aquí si necesitas más cálculos
      return {
        ...prev,
        superficieCorporal: sc || "",
      };
    });
  }, [patientData.peso, patientData.talla, patientData.bsaFormula]);
}
