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
import ModoMColorSection from "./components/fifthForm/dtvv/ModoMColorSection";
import HallazgosSection from "./components/fifthForm/dtvv/HallazgosSection";

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
  const handleModoM = (field: keyof DopplerVasosVenasData["modoMColor"], value: string) =>
    setData((prev) => ({ ...prev, modoMColor: { ...prev.modoMColor, [field]: value } }));
  const handleHall = (field: keyof DopplerVasosVenasData["hallazgos"], value: string) =>
    setData((prev) => ({ ...prev, hallazgos: { ...prev.hallazgos, [field]: value } }));

  const relEe = useMemo(
    () => calcRelEePrime(mitralE, data.tisularMitral.ePrime),
    [mitralE, data.tisularMitral.ePrime]
  );
  const relSD = useMemo(
    () => calcRelSD(data.venasPulmonares.ondaS, data.venasPulmonares.ondaD),
    [data.venasPulmonares.ondaS, data.venasPulmonares.ondaD]
  );

  // Interpretación simple de VP onda E (opcional)
  const vpInterpretacion = useMemo(() => {
    const n = parseFloat((data?.modoMColor?.vpOndaE ?? '').toString().replace(',', '.'));
    if (!Number.isFinite(n)) return '';
    if (n < 45) return 'Sugerente de relajación anormal (baja propagación)';
    if (n <= 65) return 'Dentro de referencia (aprox. 45–65 cm/s)';
    return 'Elevada (considere contexto clínico)';
  }, [data?.modoMColor?.vpOndaE]);

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
        {import.meta.env.DEV && (
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                const snapshot = {
                  form: 'Doppler Tisular / Vasos / Venas',
                  inputs: { ...data, mitralE },
                  calculados: {
                    relEePrime: relEe,
                    relSD,
                  },
                  timestamp: new Date().toISOString(),
                };
                const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const ts = new Date().toISOString().replace(/[:.]/g, '-');
                a.href = url;
                a.download = `echocardio-dtvv-${ts}.json`;
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
        <ModoMColorSection
          data={data.modoMColor}
          onChange={handleModoM}
          interpretacion={vpInterpretacion}
        />
        <HallazgosSection
          data={data.hallazgos}
          onChange={handleHall}
        />
        <FormNavigationButtons onBack={onBack} onNext={onNext} />
      </CardContent>
    </Card>
  );
};

export default DopplerTisularVasosVenasForm;
