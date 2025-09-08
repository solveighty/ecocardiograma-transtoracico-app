import { useEffect } from "react";
import type { VentriculosAuriculasData } from "../types/thirdForm/VentriculosAuriculasData";

/**
 * Hook para calcular automáticamente el Volumen Index de Aurícula Izquierda
 * Fórmula: Volumen Index = Volumen AI / SC
 */
export function useAuriculaIzquierdaVolumeIndex(
  data: VentriculosAuriculasData,
  setData: React.Dispatch<React.SetStateAction<VentriculosAuriculasData>>
) {
  useEffect(() => {
    const volAi = parseFloat(data.volAi);
    const sc = parseFloat(data.superficieCorporal);
    
    let volIndexAi = "";
    
    // Solo calcular si ambos valores son válidos y mayores a 0
    if (!isNaN(volAi) && !isNaN(sc) && volAi > 0 && sc > 0) {
      volIndexAi = (volAi / sc).toFixed(1);
    }
    
    setData((prev) => ({ ...prev, volIndexAi }));
  }, [data.volAi, data.superficieCorporal, setData]);
}
