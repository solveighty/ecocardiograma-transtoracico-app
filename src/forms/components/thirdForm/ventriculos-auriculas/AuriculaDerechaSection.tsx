import React from "react";
import SectionGroup from "../../../../components/options/SectionGroup";
import InputWithUnit from "../../../../components/options/InputWithUnit";
import type { VentriculosAuriculasData } from "../../../types/thirdForm/VentriculosAuriculasData";

interface Props {
  data: VentriculosAuriculasData;
  handleChange: (field: keyof VentriculosAuriculasData, value: string) => void;
}

const AuriculaDerechaSection: React.FC<Props> = ({ data, handleChange }) => (
  <SectionGroup title="Aurícula Derecha">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit
        id="dmAd"
        label="Dm"
        value={data.dmAd}
        onChange={(v: string) => handleChange("dmAd", v)}
        unit="mm"
      />
      <InputWithUnit
        id="areaAd"
        label="Área"
        value={data.areaAd}
        onChange={(v: string) => handleChange("areaAd", v)}
        unit="cm²"
      />
    </div>
  </SectionGroup>
);

export default AuriculaDerechaSection;
