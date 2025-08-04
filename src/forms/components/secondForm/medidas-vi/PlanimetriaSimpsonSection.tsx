import React from "react";
import SectionGroup from "../../../../components/options/SectionGroup";
import InputWithUnit from "../../../../components/options/InputWithUnit";
import ReadOnlyWithUnit from "../../../../components/options/ReadOnlyWithUnit";
import type { MedidasVIData } from "../../../types/secondForm/MedidasVIData";

interface Props {
  medidasVIData: MedidasVIData;
  handleChange: (field: keyof MedidasVIData, value: string) => void;
  calcVL: (vdf: string, vsf: string) => string;
  calcFE_Simpson: (vdf: string, vsf: string) => string;
}

const PlanimetriaSimpsonSection: React.FC<Props> = ({ medidasVIData, handleChange, calcVL, calcFE_Simpson }) => (
  <SectionGroup title="Planimetría (Simpson Modificado)">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit id="vdfSimpson" label="VDF Simpson" value={medidasVIData.vdfSimpson} onChange={(v: string) => handleChange("vdfSimpson", v)} unit="ml" />
      <InputWithUnit id="vsfSimpson" label="VSF Simpson" value={medidasVIData.vsfSimpson} onChange={(v: string) => handleChange("vsfSimpson", v)} unit="ml" />
      <ReadOnlyWithUnit label="VL" value={calcVL(medidasVIData.vdfSimpson, medidasVIData.vsfSimpson)} unit="ml" />
      <ReadOnlyWithUnit label="FE (Simpson)" value={calcFE_Simpson(medidasVIData.vdfSimpson, medidasVIData.vsfSimpson)} unit="%" />
    </div>
  </SectionGroup>
);

export default PlanimetriaSimpsonSection;
