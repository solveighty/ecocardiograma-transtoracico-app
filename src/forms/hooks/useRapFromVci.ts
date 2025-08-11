import { useEffect } from "react";
import type { DopplerVasosVenasData } from "../types/fifthForm/DopplerTisularData";
import type { ValvulasData } from "../types/fourthForm/ValvulasData";

// Derives suggested RAP (mmHg) from VCI diameter and collapse and syncs into tricuspide.rap
export function useRapFromVci(
  dtvvData: DopplerVasosVenasData,
  setValvulasData: React.Dispatch<React.SetStateAction<ValvulasData>>
) {
  useEffect(() => {
    const toNum = (v?: string) => {
      const n = parseFloat((v ?? "").toString().replace(",", "."));
      return Number.isFinite(n) ? n : undefined;
    };
    const dt = toNum(dtvvData?.vci?.dt);
    const col = toNum(dtvvData?.vci?.colapso);
    if (dt === undefined || col === undefined) return;
    // ASE-like criteria
    // IVC < 21 mm and collapse > 50% => RAP 3 mmHg
    // IVC > 21 mm and collapse < 50% => RAP 15 mmHg
    // Otherwise => RAP 8 mmHg
    let rapSuggested = 8;
    if (dt < 21 && col >= 50) rapSuggested = 3;
    else if (dt > 21 && col < 50) rapSuggested = 15;
    setValvulasData((prev) => ({
      ...prev,
      tricuspide: { ...prev.tricuspide, rap: String(rapSuggested) },
    }));
  }, [dtvvData?.vci?.dt, dtvvData?.vci?.colapso, setValvulasData]);
}
