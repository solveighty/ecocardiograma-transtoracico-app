import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MitralSection from "./components/fourthForm/valvulas/MitralSection";
import FormNavigationButtons from "./components/ui/FormNavigationButtons";
import TricuspideSection from "./components/fourthForm/valvulas/TricuspideSection";
import AortaSection from "./components/fourthForm/valvulas/AortaSection";
import PulmonarSection from "./components/fourthForm/valvulas/PulmonarSection";
import {
  ValvulasData,
  MitralData,
  TricuspideData,
  AortaData,
  PulmonarData,
} from "./types/fourthForm/ValvulasData";
import {
  calcAVMFromPHT,
  calcERO_PISA,
  calcGradPicoFromVmaxCm,
  calcPSVD,
  calcRelEA,
  calcVR,
} from "./services/fourthForm/valvulasCalculos";

const initialMitral: MitralData = {
  ondaE: "",
  itv: "",
  ondaA: "",
  ore: "",
  relEA: "",
  vr: "",
  durA: "",
  vc: "",
  tde: "",
  thp: "",
  reg: "",
  avm: "",
  vmax: "",
  gradMax: "",
  radio: "",
  gradMed: "",
  ny: "",
};
const initialTricuspide: TricuspideData = {
  ondaE: "",
  ondaA: "",
  relEA: "",
  reg: "",
  vmax: "",
  grpMax: "",
  psvd: "",
  rap: "3",
  thp: "",
  avt: "",
  vc: "",
};
const initialAorta: AortaData = {
  vmax: "",
  gpMax: "",
  gradMed: "",
  avac: "",
  reg: "",
  thp: "",
  vc: "",
  flujoHolodiastolicoReverso: "",
};
const initialPulmonar: PulmonarData = {
  vmax: "",
  gpMax: "",
  tam: "",
  reg: "",
  pmap: "",
  pdvd: "",
  vc: "",
};

interface Props {
  data: ValvulasData;
  setData: React.Dispatch<React.SetStateAction<ValvulasData>>;
  onNext: () => void;
  onBack: () => void;
}

export const getInitialValvulasData = (): ValvulasData => ({
  mitral: initialMitral,
  tricuspide: initialTricuspide,
  aorta: initialAorta,
  pulmonar: initialPulmonar,
});

export default function ValvulasForm({ data, setData, onNext, onBack }: Props) {
  const handleMitral = (field: keyof MitralData, value: string) =>
    setData((prev) => ({
      ...prev,
      mitral: { ...prev.mitral, [field]: value },
    }));
  const handleTricuspide = (field: keyof TricuspideData, value: string) =>
    setData((prev) => ({
      ...prev,
      tricuspide: { ...prev.tricuspide, [field]: value },
    }));
  const handleAorta = (field: keyof AortaData, value: string) =>
    setData((prev) => ({ ...prev, aorta: { ...prev.aorta, [field]: value } }));
  const handlePulmonar = (field: keyof PulmonarData, value: string) =>
    setData((prev) => ({
      ...prev,
      pulmonar: { ...prev.pulmonar, [field]: value },
    }));

  // Cálculos derivados
  const relEA_Mitral = useMemo(
    () => calcRelEA(data.mitral.ondaE, data.mitral.ondaA),
    [data.mitral.ondaE, data.mitral.ondaA]
  );
  const gradMax_Mitral = useMemo(
    () => calcGradPicoFromVmaxCm(data.mitral.vmax),
    [data.mitral.vmax]
  );
  const avm_fromPHT = useMemo(
    () => calcAVMFromPHT(data.mitral.thp),
    [data.mitral.thp]
  );
  const ero_fromPISA = useMemo(
    () => calcERO_PISA(data.mitral.radio, data.mitral.ny, data.mitral.vmax),
    [data.mitral.radio, data.mitral.ny, data.mitral.vmax]
  );
  const vr_calc = useMemo(
    () => calcVR(data.mitral.ore || ero_fromPISA, data.mitral.itv),
    [data.mitral.ore, ero_fromPISA, data.mitral.itv]
  );

  const relEA_Tric = useMemo(
    () => calcRelEA(data.tricuspide.ondaE, data.tricuspide.ondaA),
    [data.tricuspide.ondaE, data.tricuspide.ondaA]
  );
  const grpMax_Tric = useMemo(
    () => calcGradPicoFromVmaxCm(data.tricuspide.vmax),
    [data.tricuspide.vmax]
  );
  const psvd_Tric = useMemo(
    () => calcPSVD(data.tricuspide.vmax, data.tricuspide.rap),
    [data.tricuspide.vmax, data.tricuspide.rap]
  );

  const gpMax_Ao = useMemo(
    () => calcGradPicoFromVmaxCm(data.aorta.vmax),
    [data.aorta.vmax]
  );
  const gpMax_Pulm = useMemo(
    () => calcGradPicoFromVmaxCm(data.pulmonar.vmax),
    [data.pulmonar.vmax]
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Válvulas</CardTitle>
        <CardDescription>
          Ingrese parámetros para MITRAL, TRICÚSPIDE, AORTA y PULMONAR. Los
          campos calculados se actualizan automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {import.meta.env.DEV && (
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                const snapshot = {
                  form: 'Válvulas',
                  inputs: {
                    mitral: data.mitral,
                    tricuspide: { ...data.tricuspide },
                    aorta: data.aorta,
                    pulmonar: data.pulmonar,
                  },
                  calculados: {
                    mitral: {
                      relEA: relEA_Mitral,
                      gradMax: gradMax_Mitral,
                      avm_fromPHT,
                      ero_fromPISA,
                      vr: vr_calc,
                    },
                    tricuspide: {
                      relEA: relEA_Tric,
                      grpMax: grpMax_Tric,
                      psvd: psvd_Tric,
                    },
                    aorta: { gpMax: gpMax_Ao },
                    pulmonar: { gpMax: gpMax_Pulm },
                  },
                  timestamp: new Date().toISOString(),
                };
                const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const ts = new Date().toISOString().replace(/[:.]/g, '-');
                a.href = url;
                a.download = `echocardio-valvulas-${ts}.json`;
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
        <MitralSection
          data={data.mitral}
          onChange={handleMitral}
          relEA={relEA_Mitral}
          gradMax={gradMax_Mitral}
          avmFromPHT={avm_fromPHT}
          eroFromPISA={ero_fromPISA}
          vrCalc={vr_calc}
        />
        <TricuspideSection
          data={data.tricuspide}
          onChange={handleTricuspide}
          relEA={relEA_Tric}
          grpMax={grpMax_Tric}
          psvd={psvd_Tric}
          rap={data.tricuspide.rap}
          setRap={(v) => handleTricuspide("rap", v)}
        />
        <AortaSection
          data={data.aorta}
          onChange={handleAorta}
          gpMax={gpMax_Ao}
        />
        <PulmonarSection
          data={data.pulmonar}
          onChange={handlePulmonar}
          gpMax={gpMax_Pulm}
        />

        <FormNavigationButtons onBack={onBack} onNext={onNext} />
      </CardContent>
    </Card>
  );
}
