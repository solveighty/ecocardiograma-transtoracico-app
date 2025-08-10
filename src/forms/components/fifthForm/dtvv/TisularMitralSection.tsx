import React from "react";
import SectionGroup from "@/components/options/SectionGroup";
import InputWithUnit from "@/components/options/InputWithUnit";
import ReadOnlyWithUnit from "@/components/options/ReadOnlyWithUnit";
import { TisularMitralData } from "../../../types/fifthForm/DopplerTisularData";

interface Props {
  data: TisularMitralData;
  onChange: (field: keyof TisularMitralData, value: string) => void;
  relEePrime: string;
}

const TisularMitralSection: React.FC<Props> = ({
  data,
  onChange,
  relEePrime,
}) => (
  <SectionGroup title="Doppler Tisular - Mitral">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit
        id="dtv-mitral-eprime"
        label="Onda e'"
        value={data.ePrime}
        onChange={(v) => onChange("ePrime", v)}
        unit="cm/s"
      />
      <InputWithUnit
        id="dtv-mitral-aprime"
        label="Onda a'"
        value={data.aPrime}
        onChange={(v) => onChange("aPrime", v)}
        unit="cm/s"
      />
      <InputWithUnit
        id="dtv-mitral-sprime"
        label="Onda S"
        value={data.sPrime}
        onChange={(v) => onChange("sPrime", v)}
        unit="cm/s"
      />
      <InputWithUnit
        id="dtv-mitral-triv"
        label="TRIV"
        value={data.triv}
        onChange={(v) => onChange("triv", v)}
        unit="ms"
      />
      <ReadOnlyWithUnit label="Rel. E/e'" value={relEePrime} unit="" />
    </div>
  </SectionGroup>
);

export default TisularMitralSection;
