import React from "react";
import SectionGroup from "../../../../components/options/SectionGroup";
import InputWithUnit from "../../../../components/options/InputWithUnit";
import ReadOnlyWithUnit from "../../../../components/options/ReadOnlyWithUnit";
import type { VentriculosAuriculasData } from "../../../types/thirdForm/VentriculosAuriculasData";

interface Props {
  data: VentriculosAuriculasData;
  handleChange: (field: keyof VentriculosAuriculasData, value: string) => void;
}

const AuriculaIzquierdaSection: React.FC<Props> = ({ data, handleChange }) => (
  <SectionGroup title="Aurícula Izquierda">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputWithUnit
        id="dai"
        label="DAI"
        value={data.dai}
        onChange={(v: string) => handleChange("dai", v)}
        unit="mm"
      />
      <InputWithUnit
        id="areaAi"
        label="Área AI"
        value={data.areaAi}
        onChange={(v: string) => handleChange("areaAi", v)}
        unit="cm²"
      />
      <InputWithUnit
        id="volAi"
        label="Volumen AI"
        value={data.volAi}
        onChange={(v: string) => handleChange("volAi", v)}
        unit="ml"
      />
      <ReadOnlyWithUnit
        label="Volumen Index"
        value={data.volIndexAi}
        unit="ml/m²"
      />
    </div>
  </SectionGroup>
);

export default AuriculaIzquierdaSection;
