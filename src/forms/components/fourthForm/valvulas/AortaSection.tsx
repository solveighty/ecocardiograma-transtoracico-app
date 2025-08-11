import React from "react";
import SectionGroup from "@/components/options/SectionGroup";
import InputWithUnit from "@/components/options/InputWithUnit";
import PresenciaSelect from "../../ui/PresenciaSelect";
import RegurgitacionSelect from "../../ui/RegurgitacionSelect";
import ReadOnlyWithUnit from "@/components/options/ReadOnlyWithUnit";
import { AortaData } from "../../../types/fourthForm/ValvulasData";

interface Props {
  data: AortaData;
  onChange: (field: keyof AortaData, value: string) => void;
  gpMax: string;
}

const AortaSection: React.FC<Props> = ({ data, onChange, gpMax }) => (
  <SectionGroup title="AORTA">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit
        id="ao-vmax"
        label="Vmax"
        value={data.vmax}
        onChange={(v) => onChange("vmax", v)}
        unit="cm/s"
      />
      <ReadOnlyWithUnit label="GP Max" value={gpMax} unit="mmHg" />
      <InputWithUnit
        id="ao-gradMed"
        label="Grad. Med"
        value={data.gradMed}
        onChange={(v) => onChange("gradMed", v)}
        unit="mmHg"
      />
      <InputWithUnit
        id="ao-avac"
        label="AVAC / AVA"
        value={data.avac}
        onChange={(v) => onChange("avac", v)}
        unit="cm²"
      />
      <InputWithUnit
        id="ao-thp"
        label="PHT"
        value={data.thp}
        onChange={(v) => onChange("thp", v)}
        unit="ms"
      />
      <InputWithUnit
        id="ao-vc"
        label="VC"
        value={data.vc}
        onChange={(v) => onChange("vc", v)}
        unit="mm"
      />
      <RegurgitacionSelect
        id="ao-reg"
        value={data.reg}
        onChange={(v) => onChange("reg", v)}
      />
      <PresenciaSelect
        id="ao-fhdr"
        label="Flujo holodiastólico reverso"
        value={data.flujoHolodiastolicoReverso}
        onChange={(v) => onChange("flujoHolodiastolicoReverso", v)}
      />
    </div>
  </SectionGroup>
);

export default AortaSection;
