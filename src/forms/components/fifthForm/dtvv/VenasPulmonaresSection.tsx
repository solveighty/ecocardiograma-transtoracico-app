import React from 'react';
import SectionGroup from '@/components/options/SectionGroup';
import InputWithUnit from '@/components/options/InputWithUnit';
import ReadOnlyWithUnit from '@/components/options/ReadOnlyWithUnit';
import { VenasPulmonaresData } from '../../../types/fifthForm/DopplerTisularData';

interface Props {
  data: VenasPulmonaresData;
  onChange: (field: keyof VenasPulmonaresData, value: string) => void;
  relSD: string;
}

const VenasPulmonaresSection: React.FC<Props> = ({ data, onChange, relSD }) => (
  <SectionGroup title="Venas Pulmonares">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit id="vp-s" label="Onda S" value={data.ondaS} onChange={v => onChange('ondaS', v)} unit="cm/s" />
      <InputWithUnit id="vp-d" label="Onda D" value={data.ondaD} onChange={v => onChange('ondaD', v)} unit="cm/s" />
      <ReadOnlyWithUnit label="Rel. S/D" value={relSD} unit="" />
      <InputWithUnit id="vp-arev" label="Onda A Rev." value={data.ondaARev} onChange={v => onChange('ondaARev', v)} unit="cm/s" />
      <InputWithUnit id="vp-durar" label="Dur. Ar." value={data.durAr} onChange={v => onChange('durAr', v)} unit="ms" />
    </div>
  </SectionGroup>
);

export default VenasPulmonaresSection;
