import React from "react";
import SectionGroup from "@/components/options/SectionGroup";
import InputWithUnit from "@/components/options/InputWithUnit";
import { TisularTricuspideData } from "../../../types/fifthForm/DopplerTisularData";

interface Props {
  data: TisularTricuspideData;
  onChange: (field: keyof TisularTricuspideData, value: string) => void;
}

const TisularTricuspideSection: React.FC<Props> = ({ data, onChange }) => (
  <SectionGroup title="Doppler Tisular - Tricúspide">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit
        id="dtv-tric-eprime"
        label="Onda e'"
        value={data.ePrime}
        onChange={(v) => onChange("ePrime", v)}
        unit="cm/s"
      />
      <InputWithUnit
        id="dtv-tric-aprime"
        label="Onda a'"
        value={data.aPrime}
        onChange={(v) => onChange("aPrime", v)}
        unit="cm/s"
      />
      <InputWithUnit
        id="dtv-tric-sprime"
        label="Onda S"
        value={data.sPrime}
        onChange={(v) => onChange("sPrime", v)}
        unit="cm/s"
      />
    </div>
  </SectionGroup>
);

export default TisularTricuspideSection;
