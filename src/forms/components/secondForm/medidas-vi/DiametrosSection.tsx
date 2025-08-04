import React from "react";
import SectionGroup from "../../options/SectionGroup";
import InputWithUnit from "../../options/InputWithUnit";
import type { MedidasVIData } from "../../../types/secondForm/MedidasVIData";

interface Props {
  medidasVIData: MedidasVIData;
  handleChange: (field: keyof MedidasVIData, value: string) => void;
}

const DiametrosSection: React.FC<Props> = ({ medidasVIData, handleChange }) => (
  <SectionGroup title="DIÁMETROS">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit id="ddfvi" label="DDFVI" value={medidasVIData.ddfvi} onChange={(v: string) => handleChange("ddfvi", v)} unit="mm" />
      <InputWithUnit id="dsfvi" label="DSFVI" value={medidasVIData.dsfvi} onChange={(v: string) => handleChange("dsfvi", v)} unit="mm" />
      <InputWithUnit id="gdsept" label="GDSept" value={medidasVIData.gdsept} onChange={(v: string) => handleChange("gdsept", v)} unit="mm" />
      <InputWithUnit id="gdpil" label="GDPIL" value={medidasVIData.gdpil} onChange={(v: string) => handleChange("gdpil", v)} unit="mm" />
      <InputWithUnit id="rao" label="Rao" value={medidasVIData.rao} onChange={(v: string) => handleChange("rao", v)} unit="mm" />
    </div>
  </SectionGroup>
);

export default DiametrosSection;
