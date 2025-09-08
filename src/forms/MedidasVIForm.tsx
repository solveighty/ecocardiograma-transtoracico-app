import FormNavigationButtons from "./components/ui/FormNavigationButtons";
import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import DiametrosSection from "./components/secondForm/medidas-vi/DiametrosSection";
import VolumenesLinealesSection from "./components/secondForm/medidas-vi/VolumenesLinealesSection";
import PlanimetriaSimpsonSection from "./components/secondForm/medidas-vi/PlanimetriaSimpsonSection";
import {
  calcVL,
  calcFETeich,
  calcFA,
  calcFE_Simpson,
  calcVDFTeich,
  calcVSFTeich,
} from "./services/secondForm/medidasVI";
import { MedidasVIData } from "./types/secondForm/MedidasVIData";
interface Props {
  medidasVIData: MedidasVIData;
  setMedidasVIData: React.Dispatch<React.SetStateAction<MedidasVIData>>;
  onNext: () => void;
  onBack: () => void;
}

const MedidasVIForm: React.FC<Props> = ({
  medidasVIData,
  setMedidasVIData,
  onNext,
  onBack,
}) => {
  // Cálculo automático de VDF y VSF usando Teichholz cuando cambien DDFVI o DSFVI
  useEffect(() => {
    const { ddfvi, dsfvi } = medidasVIData;
    let needsUpdate = false;
    const updates: Partial<MedidasVIData> = {};
    
    // Calcular VDF automáticamente si hay DDFVI
    if (ddfvi && parseFloat(ddfvi) > 0) {
      const calculatedVDF = calcVDFTeich(ddfvi);
      if (calculatedVDF && calculatedVDF !== medidasVIData.vdfLineal) {
        updates.vdfLineal = calculatedVDF;
        needsUpdate = true;
      }
    } else if (medidasVIData.vdfLineal && (!ddfvi || parseFloat(ddfvi) <= 0)) {
      // Limpiar VDF si no hay DDFVI válido
      updates.vdfLineal = "";
      needsUpdate = true;
    }
    
    // Calcular VSF automáticamente si hay DSFVI
    if (dsfvi && parseFloat(dsfvi) >= 0) {
      const calculatedVSF = calcVSFTeich(dsfvi);
      if (calculatedVSF && calculatedVSF !== medidasVIData.vsfLineal) {
        updates.vsfLineal = calculatedVSF;
        needsUpdate = true;
      }
    } else if (medidasVIData.vsfLineal && (!dsfvi || parseFloat(dsfvi) < 0)) {
      // Limpiar VSF si no hay DSFVI válido
      updates.vsfLineal = "";
      needsUpdate = true;
    }

    // Solo actualizar si hay cambios
    if (needsUpdate) {
      setMedidasVIData((prev) => ({ ...prev, ...updates }));
    }
  }, [medidasVIData.ddfvi, medidasVIData.dsfvi]);

  // No side effects needed for calculations, as they are derived in render
  const handleChange = (field: keyof MedidasVIData, value: string) => {
    setMedidasVIData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Medidas VI y Volúmenes</CardTitle>
        <CardDescription>
          Ingrese los diámetros, volúmenes y planimetría del VI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DiametrosSection
          medidasVIData={medidasVIData}
          handleChange={handleChange}
        />
        <VolumenesLinealesSection
          medidasVIData={medidasVIData}
          calcVL={calcVL}
          calcFETeich={calcFETeich}
          calcFA={calcFA}
        />
        <PlanimetriaSimpsonSection
          medidasVIData={medidasVIData}
          handleChange={handleChange}
          calcVL={calcVL}
          calcFE_Simpson={calcFE_Simpson}
        />
        <FormNavigationButtons onBack={onBack} onNext={onNext} />
      </CardContent>
    </Card>
  );
};

export default MedidasVIForm;
