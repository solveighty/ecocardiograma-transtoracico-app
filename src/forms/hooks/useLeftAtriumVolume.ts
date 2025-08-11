import { useEffect } from "react";
import type { VentriculosAuriculasData } from "../types/thirdForm/VentriculosAuriculasData";

// Computes left atrial volume (biplane area-length) and indexed volume.
export function useLeftAtriumVolume(
  data: VentriculosAuriculasData,
  setData: React.Dispatch<React.SetStateAction<VentriculosAuriculasData>>
) {
  useEffect(() => {
    const area4C = parseFloat(data.areaAi);
    const area2C = parseFloat(data.areaAi2C);
    const longCm = parseFloat(data.long) / 10; // mm -> cm
    let volAi = "";
    if (!isNaN(area4C) && !isNaN(area2C) && !isNaN(longCm) && longCm > 0) {
      volAi = ((0.85 * area4C * area2C) / longCm).toFixed(1);
    }
    let volIndexAi = "";
    const sc = parseFloat(data.superficieCorporal);
    if (volAi && !isNaN(sc) && sc > 0) {
      volIndexAi = (parseFloat(volAi) / sc).toFixed(1);
    }
    setData((prev) => ({ ...prev, volAi, volIndexAi }));
  }, [data.areaAi, data.areaAi2C, data.long, data.superficieCorporal, setData]);
}
