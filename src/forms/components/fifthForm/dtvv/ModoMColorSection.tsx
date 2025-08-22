import React from "react";
import SectionGroup from "@/components/options/SectionGroup";
import InputWithUnit from "@/components/options/InputWithUnit";
import type { ModoMColorData } from "../../../types/fifthForm/DopplerTisularData";

interface Props {
  data: ModoMColorData;
  onChange: (field: keyof ModoMColorData, value: string) => void;
  interpretacion?: string; // opcional: normal/anormal
}

const ModoMColorSection: React.FC<Props> = ({ data, onChange, interpretacion }) => (
  <SectionGroup title="Modo M Color – VP onda E">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit
        id="modo-m-vp-onda-e"
        label="VP onda E"
        value={data.vpOndaE}
        onChange={(v) => onChange("vpOndaE", v)}
        unit="cm/s"
      />
      {interpretacion && (
        <div className="flex items-end text-sm text-gray-600">{interpretacion}</div>
      )}
    </div>
  </SectionGroup>
);

export default ModoMColorSection;
