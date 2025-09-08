import FormNavigationButtons from "./components/ui/FormNavigationButtons";
import type { VentriculosAuriculasData } from "./types/thirdForm/VentriculosAuriculasData";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import VentriculoIzquierdoSection from "./components/thirdForm/ventriculos-auriculas/VentriculoIzquierdoSection";
import VentriculoDerechoSection from "./components/thirdForm/ventriculos-auriculas/VentriculoDerechoSection";
import AuriculaIzquierdaSection from "./components/thirdForm/ventriculos-auriculas/AuriculaIzquierdaSection";
import AuriculaDerechaSection from "./components/thirdForm/ventriculos-auriculas/AuriculaDerechaSection";
import {
  calcMasaVI,
  calcIMVI,
  calcGRP,
  calcCAF,
  calcIE,
  calcRelacionVDVI,
} from "./services/thirdForm/ventriculosAuriculasCalculos";
import { useAuriculaIzquierdaVolumeIndex } from "./hooks/useAuriculaIzquierdaVolumeIndex";

interface Props {
  data: VentriculosAuriculasData;
  setData: React.Dispatch<React.SetStateAction<VentriculosAuriculasData>>;
  onNext: () => void;
  onBack: () => void;
}

const VentriculosAuriculasForm: React.FC<Props> = ({
  data,
  setData,
  onNext,
  onBack,
}) => {
  const handleChange = (
    field: keyof VentriculosAuriculasData,
    value: string
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Cálculos automáticos en render
  const masa = calcMasaVI({
    ddfvi: data.ddfvi,
    gdsept: data.gdsept,
    gdpil: data.gdpil,
  });
  const imvi = calcIMVI({
    masaVI: masa,
    superficieCorporal: data.superficieCorporal,
  });
  const grp = calcGRP(data.gdsept, data.gdpil, data.ddfvi); // sin unidad
  const ie = calcIE(data.basal, data.long);
  const caf = calcCAF(data.basal, data.basalSistolico); // requiere basal sistólico
  const relacionVdVi = calcRelacionVDVI(data.basal, data.ddfvi);
  
  // Cálculo automático del Volumen Index de Aurícula Izquierda
  useAuriculaIzquierdaVolumeIndex(data, setData);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ventrículos y Aurículas</CardTitle>
        <CardDescription>
          Ingrese los parámetros de ventrículos y aurículas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <VentriculoIzquierdoSection
          data={data}
          masa={masa}
          imvi={imvi}
          grp={grp}
          handleChange={handleChange}
        />
        <VentriculoDerechoSection
          data={data}
          caf={caf}
          ie={ie}
          relacionVdVi={relacionVdVi}
          handleChange={handleChange}
        />
        <AuriculaIzquierdaSection data={data} handleChange={handleChange} />
        <AuriculaDerechaSection data={data} handleChange={handleChange} />
        <FormNavigationButtons onBack={onBack} onNext={onNext} />
      </CardContent>
    </Card>
  );
};

export default VentriculosAuriculasForm;
