import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormNavigationButtons from "./components/ui/FormNavigationButtons";
import {
  DopplerVasosVenasData,
  TisularMitralData,
  TisularTricuspideData,
  GrandesVasosAortaData,
  VCIData,
  VenasPulmonaresData,
} from "./types/fifthForm/DopplerTisularData";
import { calcRelEePrime, calcRelSD } from "./services/fifthForm/calculos";
import TisularMitralSection from "./components/fifthForm/dtvv/TisularMitralSection";
import TisularTricuspideSection from "./components/fifthForm/dtvv/TisularTricuspideSection";
import GV_AortaSection from "./components/fifthForm/dtvv/GV_AortaSection";
import VCISection from "./components/fifthForm/dtvv/VCISection";
import VenasPulmonaresSection from "./components/fifthForm/dtvv/VenasPulmonaresSection";

const initialTisularMitral: TisularMitralData = {
  ePrime: "",
  aPrime: "",
  sPrime: "",
  triv: "",
};
const initialTisularTricuspide: TisularTricuspideData = {
  ePrime: "",
  aPrime: "",
  sPrime: "",
};
const initialGV_Aorta: GrandesVasosAortaData = {
  rao: "",
  anillo: "",
  unionST: "",
  cayado: "",
  aoDesc: "",
  aoAbd: "",
};
const initialVCI: VCIData = { dt: "", colapso: "" };
const initialVenasPulmonares: VenasPulmonaresData = {
  ondaS: "",
  ondaD: "",
  ondaARev: "",
  durAr: "",
};

export const getInitialDopplerVasosVenasData = (): DopplerVasosVenasData => ({
  tisularMitral: initialTisularMitral,
  tisularTricuspide: initialTisularTricuspide,
  grandesVasosAorta: initialGV_Aorta,
  vci: initialVCI,
  venasPulmonares: initialVenasPulmonares,
});

interface Props {
  data: DopplerVasosVenasData;
  setData: React.Dispatch<React.SetStateAction<DopplerVasosVenasData>>;
  mitralE: string; // Viene del formulario de Válvulas
  onNext: () => void;
  onBack: () => void;
}

const DopplerTisularVasosVenasForm: React.FC<Props> = ({
  data,
  setData,
  mitralE,
  onNext,
  onBack,
}) => {
  const handleTM = (field: keyof TisularMitralData, value: string) =>
    setData((prev) => ({
      ...prev,
      tisularMitral: { ...prev.tisularMitral, [field]: value },
    }));
  const handleTT = (field: keyof TisularTricuspideData, value: string) =>
    setData((prev) => ({
      ...prev,
      tisularTricuspide: { ...prev.tisularTricuspide, [field]: value },
    }));
  const handleAO = (field: keyof GrandesVasosAortaData, value: string) =>
    setData((prev) => ({
      ...prev,
      grandesVasosAorta: { ...prev.grandesVasosAorta, [field]: value },
    }));
  const handleVCI = (field: keyof VCIData, value: string) =>
    setData((prev) => ({ ...prev, vci: { ...prev.vci, [field]: value } }));
  const handleVP = (field: keyof VenasPulmonaresData, value: string) =>
    setData((prev) => ({
      ...prev,
      venasPulmonares: { ...prev.venasPulmonares, [field]: value },
    }));

  const relEe = useMemo(
    () => calcRelEePrime(mitralE, data.tisularMitral.ePrime),
    [mitralE, data.tisularMitral.ePrime]
  );
  const relSD = useMemo(
    () => calcRelSD(data.venasPulmonares.ondaS, data.venasPulmonares.ondaD),
    [data.venasPulmonares.ondaS, data.venasPulmonares.ondaD]
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Doppler Tisular, Grandes Vasos y Venas Pulmonares</CardTitle>
        <CardDescription>
          Complete los parámetros solicitados. Algunos campos se calculan
          automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TisularMitralSection
          data={data.tisularMitral}
          onChange={handleTM}
          relEePrime={relEe}
        />
        <TisularTricuspideSection
          data={data.tisularTricuspide}
          onChange={handleTT}
        />
        <GV_AortaSection data={data.grandesVasosAorta} onChange={handleAO} />
        <VCISection data={data.vci} onChange={handleVCI} />
        <VenasPulmonaresSection
          data={data.venasPulmonares}
          onChange={handleVP}
          relSD={relSD}
        />
        <FormNavigationButtons onBack={onBack} onNext={onNext} />
      </CardContent>
    </Card>
  );
};

export default DopplerTisularVasosVenasForm;
