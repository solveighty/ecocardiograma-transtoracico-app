import { useEffect } from "react";
import { calcMasaVI, calcIMVI, calcGRP } from "../services/thirdForm/ventriculosAuriculasCalculos";

export function useAutoMasaImviGrp(ventriculosAuriculasData: any, setVentriculosAuriculasData: (updater: any) => void) {
  useEffect(() => {
    const masa = calcMasaVI({
      ddfvi: ventriculosAuriculasData.ddfvi,
      gdsept: ventriculosAuriculasData.gdsept,
      gdpil: ventriculosAuriculasData.gdpil,
    });
    const imvi = calcIMVI({
      masaVI: masa,
      superficieCorporal: ventriculosAuriculasData.superficieCorporal,
    });
    const grp = calcGRP(
      ventriculosAuriculasData.gdsept,
      ventriculosAuriculasData.gdpil,
      ventriculosAuriculasData.ddfvi
    );
    setVentriculosAuriculasData((prev: any) => ({
      ...prev,
      masa,
      imvi,
      grp,
    }));
  }, [ventriculosAuriculasData.ddfvi, ventriculosAuriculasData.gdsept, ventriculosAuriculasData.gdpil, ventriculosAuriculasData.superficieCorporal]);
}
