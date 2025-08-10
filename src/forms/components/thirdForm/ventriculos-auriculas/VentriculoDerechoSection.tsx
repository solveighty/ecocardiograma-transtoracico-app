import React from "react";
import SectionGroup from "../../../../components/options/SectionGroup";
import ReadOnlyWithUnit from "../../../../components/options/ReadOnlyWithUnit";
import InputWithUnit from "../../../../components/options/InputWithUnit";
import type { VentriculosAuriculasData } from "../../../types/thirdForm/VentriculosAuriculasData";

interface Props {
  data: VentriculosAuriculasData;
  caf: string;
  ie: string;
  relacionVdVi: string;
  handleChange: (field: keyof VentriculosAuriculasData, value: string) => void;
}

const VentriculoDerechoSection: React.FC<Props> = ({
  data,
  caf,
  ie,
  relacionVdVi,
  handleChange,
}) => (
  <SectionGroup title="Ventrículo Derecho">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit
        id="basal"
        label="Basal (diástole)"
        value={data.basal}
        onChange={(v: string) => handleChange("basal", v)}
        unit="mm"
      />
      <InputWithUnit
        id="basalSistolico"
        label="Basal (sístole)"
        value={data.basalSistolico}
        onChange={(v: string) => handleChange("basalSistolico", v)}
        unit="mm"
      />
      <ReadOnlyWithUnit label="CAF" value={caf} unit="%" />
      <InputWithUnit
        id="medio"
        label="Medio"
        value={data.medio}
        onChange={(v: string) => handleChange("medio", v)}
        unit="mm"
      />
      <ReadOnlyWithUnit label="IE" value={ie} unit="" />
      <InputWithUnit
        id="long"
        label="Long"
        value={data.long}
        onChange={(v: string) => handleChange("long", v)}
        unit="mm"
      />
      <ReadOnlyWithUnit label="Relación VD/VI" value={relacionVdVi} unit="" />
      <InputWithUnit
        id="tapse"
        label="TAPSE"
        value={data.tapse}
        onChange={(v: string) => handleChange("tapse", v)}
        unit="mm"
      />
    </div>
  </SectionGroup>
);

export default VentriculoDerechoSection;
