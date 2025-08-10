import React from "react";
import SectionGroup from "../../../../components/options/SectionGroup";
import InputWithUnit from "../../../../components/options/InputWithUnit";
import ReadOnlyWithUnit from "../../../../components/options/ReadOnlyWithUnit";
import type { MedidasVIData } from "../../../types/secondForm/MedidasVIData";

interface Props {
  medidasVIData: MedidasVIData;
  handleChange: (field: keyof MedidasVIData, value: string) => void;
  calcVL: (vdf: string, vsf: string) => string;
  calcFETeich: (ddfvi: string, dsfvi: string) => string;
  calcFA: (ddfvi: string, dsfvi: string) => string;
}

const VolumenesLinealesSection: React.FC<Props> = ({
  medidasVIData,
  handleChange,
  calcVL,
  calcFETeich,
  calcFA,
}) => (
  <SectionGroup title="Volúmenes (lineales)">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit
        id="vdfLineal"
        label="VDF"
        value={medidasVIData.vdfLineal}
        onChange={(v: string) => handleChange("vdfLineal", v)}
        unit="ml"
      />
      <InputWithUnit
        id="vsfLineal"
        label="VSF"
        value={medidasVIData.vsfLineal}
        onChange={(v: string) => handleChange("vsfLineal", v)}
        unit="ml"
      />
      <ReadOnlyWithUnit
        label="VL"
        value={calcVL(medidasVIData.vdfLineal, medidasVIData.vsfLineal)}
        unit="ml"
      />
      <ReadOnlyWithUnit
        label="FE Teich (de diámetros)"
        value={calcFETeich(medidasVIData.ddfvi, medidasVIData.dsfvi)}
        unit="%"
      />
      <ReadOnlyWithUnit
        label="FA"
        value={calcFA(medidasVIData.ddfvi, medidasVIData.dsfvi)}
        unit="%"
      />
    </div>
  </SectionGroup>
);

export default VolumenesLinealesSection;
