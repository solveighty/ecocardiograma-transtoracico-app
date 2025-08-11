import { useEffect } from "react";
import { MedidasVIData } from "../types/secondForm/MedidasVIData";
import type { PatientData } from "../types/firstForm/PatientData";
import type { VentriculosAuriculasData } from "../types/thirdForm/VentriculosAuriculasData";

export function useSyncVentriculosAuriculasData(
  medidasVIData: MedidasVIData,
  patientData: PatientData,
  setVentriculosAuriculasData: React.Dispatch<React.SetStateAction<VentriculosAuriculasData>>
) {
  useEffect(() => {
    setVentriculosAuriculasData((prev: any) => ({
      ...prev,
      ddfvi: medidasVIData.ddfvi,
      gdsept: medidasVIData.gdsept,
      gdpil: medidasVIData.gdpil,
      superficieCorporal: patientData.superficieCorporal,
    }));
  }, [medidasVIData.ddfvi, medidasVIData.gdsept, medidasVIData.gdpil, patientData.superficieCorporal]);
}
