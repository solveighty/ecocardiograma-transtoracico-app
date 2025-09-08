import { useEffect, useState } from "react";
import { calcVolIndex } from "../services/thirdForm/ventriculosAuriculasCalculos";

export function useAutoAuriculaIzquierda(ventriculosAuriculasData: any, setVentriculosAuriculasData: (updater: any) => void) {
  const [volAiMode, setVolAiMode] = useState<'auto' | 'manual'>('auto');

  // Función para alternar el modo del volumen AI
  const toggleVolAiMode = () => {
    setVolAiMode(prev => prev === 'auto' ? 'manual' : 'auto');
  };

  useEffect(() => {
    // Calcular volumen AI automáticamente solo si está en modo automático
    // y tenemos área AI y longitud AI
    let calculatedVolAi = "";
    if (volAiMode === 'auto' && ventriculosAuriculasData.areaAi && ventriculosAuriculasData.longitudAi) {
      // Usamos la fórmula simplificada: Vol AI = 0.85 × Área × Longitud
      // (adaptada para un solo área en lugar del método biplano)
      const area = parseFloat(ventriculosAuriculasData.areaAi.replace(",", "."));
      const longitud = parseFloat(ventriculosAuriculasData.longitudAi.replace(",", "."));
      
      if (area > 0 && longitud > 0) {
        calculatedVolAi = (0.85 * area * longitud).toFixed(1);
      }
    }

    // Calcular volumen index siempre que tengamos volumen AI y superficie corporal
    const volIndex = calcVolIndex(
      volAiMode === 'auto' ? calculatedVolAi : ventriculosAuriculasData.volAi,
      ventriculosAuriculasData.superficieCorporal
    );

    setVentriculosAuriculasData((prev: any) => ({
      ...prev,
      volAi: volAiMode === 'auto' ? calculatedVolAi : prev.volAi,
      volIndexAi: volIndex,
    }));
  }, [
    ventriculosAuriculasData.areaAi, 
    ventriculosAuriculasData.longitudAi, 
    ventriculosAuriculasData.volAi,
    ventriculosAuriculasData.superficieCorporal,
    volAiMode
  ]);

  // Función para obtener el valor calculado del volumen AI
  const getCalculatedVolAi = () => {
    if (ventriculosAuriculasData.areaAi && ventriculosAuriculasData.longitudAi) {
      const area = parseFloat(ventriculosAuriculasData.areaAi.replace(",", "."));
      const longitud = parseFloat(ventriculosAuriculasData.longitudAi.replace(",", "."));
      
      if (area > 0 && longitud > 0) {
        return (0.85 * area * longitud).toFixed(1);
      }
    }
    return "";
  };

  return {
    volAiMode,
    toggleVolAiMode,
    calculatedVolAi: getCalculatedVolAi(),
    canCalculateVolAi: !!(ventriculosAuriculasData.areaAi && ventriculosAuriculasData.longitudAi)
  };
}
