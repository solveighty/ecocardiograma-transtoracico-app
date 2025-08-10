import React from "react";
import SectionGroup from "@/components/options/SectionGroup";
import InputWithUnit from "@/components/options/InputWithUnit";
import { VCIData } from "../../../types/fifthForm/DopplerTisularData";

interface Props {
  data: VCIData;
  onChange: (field: keyof VCIData, value: string) => void;
}

const VCISection: React.FC<Props> = ({ data, onChange }) => (
  <SectionGroup title="VCI">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit
        id="vci-dt"
        label="DT"
        value={data.dt}
        onChange={(v) => onChange("dt", v)}
        unit="mm"
      />
      <InputWithUnit
        id="vci-colapso"
        label="Colapso"
        value={data.colapso}
        onChange={(v) => onChange("colapso", v)}
        unit="%"
      />
    </div>
  </SectionGroup>
);

export default VCISection;
