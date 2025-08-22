import React from "react";
import SectionGroup from "@/components/options/SectionGroup";
import { Label } from "@/components/ui/label";
import type { HallazgosCualitativosData } from "../../../types/fifthForm/DopplerTisularData";

interface Props {
  data: HallazgosCualitativosData;
  onChange: (field: keyof HallazgosCualitativosData, value: string) => void;
}

const TextArea: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ id, label, value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <textarea
      id={id}
      className="w-full rounded-md border border-gray-300 p-2 min-h-[80px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const HallazgosSection: React.FC<Props> = ({ data, onChange }) => (
  <SectionGroup title="Hallazgos Cualitativos">
    <div className="grid grid-cols-1 gap-4">
      <TextArea id="obs-pericardio" label="Pericardio" value={data.pericardio} onChange={(v) => onChange("pericardio", v)} />
      <TextArea id="obs-tabique-ia" label="Tabique IA" value={data.tabiqueIA} onChange={(v) => onChange("tabiqueIA", v)} />
      <TextArea id="obs-otros" label="Otros" value={data.otros} onChange={(v) => onChange("otros", v)} />
    </div>
  </SectionGroup>
);

export default HallazgosSection;
