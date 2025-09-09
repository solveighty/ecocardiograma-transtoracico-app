import { useMemo } from "react";

interface UseAutoAvacParams {
  diametroTsvi: string; // en mm
  itvTsvi: string; // en cm
  itvAorta: string; // en cm
}

export function useAutoAvac({ diametroTsvi, itvTsvi, itvAorta }: UseAutoAvacParams) {
  const avac = useMemo(() => {
    const diametroTsviNum = parseFloat(diametroTsvi);
    const itvTsviNum = parseFloat(itvTsvi);
    const itvAortaNum = parseFloat(itvAorta);

    if (isNaN(diametroTsviNum) || isNaN(itvTsviNum) || isNaN(itvAortaNum) || 
        diametroTsviNum <= 0 || itvTsviNum <= 0 || itvAortaNum <= 0) {
      return "";
    }

    // Convertir diámetro de mm a cm
    const diametroTsviCm = diametroTsviNum / 10;
    
    // Área TSVI (cm²) = 0.785 × (diámetro en cm)²
    const areaTsvi = 0.785 * Math.pow(diametroTsviCm, 2);
    
    // AVAC = (Área TSVI × ITV TSVI) / ITV Aorta
    const avacCalculado = (areaTsvi * itvTsviNum) / itvAortaNum;

    return avacCalculado.toFixed(2);
  }, [diametroTsvi, itvTsvi, itvAorta]);

  return { avac };
}
