import FormNavigationButtons from "./components/ui/FormNavigationButtons";
import React from "react";
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
          {import.meta.env.DEV && (
            <div className="flex justify-end">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  const snapshot = {
                    form: 'Medidas VI',
                    inputs: {
                      ddfvi: medidasVIData.ddfvi,
                      dsfvi: medidasVIData.dsfvi,
                      gdsept: medidasVIData.gdsept,
                      gdpil: medidasVIData.gdpil,
                      rao: medidasVIData.rao,
                      vdfLineal: medidasVIData.vdfLineal,
                      vsfLineal: medidasVIData.vsfLineal,
                      vdfSimpson: medidasVIData.vdfSimpson,
                      vsfSimpson: medidasVIData.vsfSimpson,
                    },
                    calculados: {
                      VL_lineal: calcVL(medidasVIData.vdfLineal, medidasVIData.vsfLineal),
                      FE_Teich: calcFETeich(medidasVIData.ddfvi, medidasVIData.dsfvi),
                      FA: calcFA(medidasVIData.ddfvi, medidasVIData.dsfvi),
                      VL_Simpson: calcVL(medidasVIData.vdfSimpson, medidasVIData.vsfSimpson),
                      FE_Simpson: calcFE_Simpson(medidasVIData.vdfSimpson, medidasVIData.vsfSimpson),
                    },
                    timestamp: new Date().toISOString(),
                  };
                  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  const ts = new Date().toISOString().replace(/[:.]/g, '-');
                  a.href = url;
                  a.download = `echocardio-medidas-vi-${ts}.json`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
              >
                Exportar JSON (dev)
              </button>
            </div>
          )}
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
        <FormNavigationButtons onBack={onBack} onNext={onNext} />
      </CardContent>
    </Card>
  );
};

export default MedidasVIForm;
