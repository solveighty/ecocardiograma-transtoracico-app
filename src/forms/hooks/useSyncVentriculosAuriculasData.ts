import { useEffect } from "react";
import { MedidasVIData } from "../types/secondForm/MedidasVIData";

export function useSyncVentriculosAuriculasData(
  medidasVIData: MedidasVIData,
  patientData: any,
  setVentriculosAuriculasData: (updater: any) => void
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
