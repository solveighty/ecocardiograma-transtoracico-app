import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import DiametrosSection from "./components/secondForm/medidas-vi/DiametrosSection";
import VolumenesLinealesSection from "./components/secondForm/medidas-vi/VolumenesLinealesSection";
import PlanimetriaSimpsonSection from "./components/secondForm/medidas-vi/PlanimetriaSimpsonSection";
import { calcVL, calcFETeich, calcFA, calcFE_Simpson } from "./services/secondForm/medidasVI";
import { MedidasVIData } from "./types/secondForm/MedidasVIData";
interface Props {
  medidasVIData: MedidasVIData;
  setMedidasVIData: React.Dispatch<React.SetStateAction<MedidasVIData>>;
  onNext: () => void;
  onBack: () => void;
}

const MedidasVIForm: React.FC<Props> = ({ medidasVIData, setMedidasVIData, onNext, onBack }) => {
  // No side effects needed for calculations, as they are derived in render
  const handleChange = (field: keyof MedidasVIData, value: string) => {
    setMedidasVIData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Medidas VI y Volúmenes</CardTitle>
        <CardDescription>Ingrese los diámetros, volúmenes y planimetría del VI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DiametrosSection
          medidasVIData={medidasVIData}
          handleChange={handleChange}
        />
        <VolumenesLinealesSection
          medidasVIData={medidasVIData}
          handleChange={handleChange}
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
        <div className="flex justify-between mt-6">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Volver
          </button>
          <button type="button" className="btn btn-primary" onClick={onNext}>
            Siguiente
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedidasVIForm;
