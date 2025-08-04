import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import InputWithUnit from "./components/options/InputWithUnit";
import ReadOnlyWithUnit from "./components/options/ReadOnlyWithUnit";
import SectionGroup from "./components/options/SectionGroup";
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
        <SectionGroup title="DIÁMETROS">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithUnit id="ddfvi" label="DDFVI" value={medidasVIData.ddfvi} onChange={v => handleChange("ddfvi", v)} unit="mm" />
            <InputWithUnit id="dsfvi" label="DSFVI" value={medidasVIData.dsfvi} onChange={v => handleChange("dsfvi", v)} unit="mm" />
            <InputWithUnit id="gdsept" label="GDSept" value={medidasVIData.gdsept} onChange={v => handleChange("gdsept", v)} unit="mm" />
            <InputWithUnit id="gdpil" label="GDPIL" value={medidasVIData.gdpil} onChange={v => handleChange("gdpil", v)} unit="mm" />
            <InputWithUnit id="rao" label="Rao" value={medidasVIData.rao} onChange={v => handleChange("rao", v)} unit="mm" />
          </div>
        </SectionGroup>
        {/* VOLÚMENES (lineales) */}
        <SectionGroup title="Volúmenes (lineales)">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithUnit id="vdfLineal" label="VDF" value={medidasVIData.vdfLineal} onChange={v => handleChange("vdfLineal", v)} unit="ml" />
            <InputWithUnit id="vsfLineal" label="VSF" value={medidasVIData.vsfLineal} onChange={v => handleChange("vsfLineal", v)} unit="ml" />
            <ReadOnlyWithUnit label="VL" value={calcVL(medidasVIData.vdfLineal, medidasVIData.vsfLineal)} unit="ml" />
            <ReadOnlyWithUnit label="FE Teich" value={calcFETeich(medidasVIData.ddfvi, medidasVIData.dsfvi)} unit="%" />
            <ReadOnlyWithUnit label="FA" value={calcFA(medidasVIData.ddfvi, medidasVIData.dsfvi)} unit="%" />
          </div>
        </SectionGroup>
        {/* PLANIMETRÍA (Simpson) */}
        <SectionGroup title="Planimetría (Simpson Modificado)">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithUnit id="vdfSimpson" label="VDF Simpson" value={medidasVIData.vdfSimpson} onChange={v => handleChange("vdfSimpson", v)} unit="ml" />
            <InputWithUnit id="vsfSimpson" label="VSF Simpson" value={medidasVIData.vsfSimpson} onChange={v => handleChange("vsfSimpson", v)} unit="ml" />
            <ReadOnlyWithUnit label="VL" value={calcVL(medidasVIData.vdfSimpson, medidasVIData.vsfSimpson)} unit="ml" />
            <ReadOnlyWithUnit label="FE (Simpson)" value={calcFE_Simpson(medidasVIData.vdfSimpson, medidasVIData.vsfSimpson)} unit="%" />
          </div>
        </SectionGroup>
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
