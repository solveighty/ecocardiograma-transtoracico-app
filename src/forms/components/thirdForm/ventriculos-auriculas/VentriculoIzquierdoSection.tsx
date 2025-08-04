import React from "react";
import SectionGroup from "../../../../components/options/SectionGroup";
import ReadOnlyWithUnit from "../../../../components/options/ReadOnlyWithUnit";
import InputWithUnit from "../../../../components/options/InputWithUnit";
import type { VentriculosAuriculasData } from "../../../types/thirdForm/VentriculosAuriculasData";

interface Props {
  data: VentriculosAuriculasData;
  masa: string;
  imvi: string;
  grp: string;
  handleChange: (field: keyof VentriculosAuriculasData, value: string) => void;
}

const VentriculoIzquierdoSection: React.FC<Props> = ({ data, masa, imvi, grp, handleChange }) => (
  <SectionGroup title="Ventrículo Izquierdo">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ReadOnlyWithUnit label="Masa" value={masa} unit="gr" />
      <ReadOnlyWithUnit label="IMVI" value={imvi} unit="gr/m²" />
      <ReadOnlyWithUnit label="GRP" value={grp} unit="" />
      <InputWithUnit id="mapse" label="MAPSE" value={data.mapse} onChange={(v: string) => handleChange("mapse", v)} unit="mm" />
      <InputWithUnit id="dpdt" label="dP/dt" value={data.dpdt} onChange={(v: string) => handleChange("dpdt", v)} unit="mmHg/seg" />
    </div>
  </SectionGroup>
);

export default VentriculoIzquierdoSection;
