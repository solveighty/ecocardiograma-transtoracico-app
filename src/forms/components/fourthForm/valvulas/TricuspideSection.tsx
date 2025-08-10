import React from 'react';
import SectionGroup from '@/components/options/SectionGroup';
import InputWithUnit from '@/components/options/InputWithUnit';
import ReadOnlyWithUnit from '@/components/options/ReadOnlyWithUnit';
import { TricuspideData } from '../../../types/fourthForm/ValvulasData';

interface Props {
  data: TricuspideData;
  onChange: (field: keyof TricuspideData, value: string) => void;
  relEA: string;
  grpMax: string;
  psvd: string;
  rap: string;
  setRap: (v: string) => void;
}

const TricuspideSection: React.FC<Props> = ({ data, onChange, relEA, grpMax, psvd, rap, setRap }) => (
  <SectionGroup title="TRICÚSPIDE">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit id="tric-ondaE" label="Onda E" value={data.ondaE} onChange={v => onChange('ondaE', v)} unit="cm/s" />
      <InputWithUnit id="tric-ondaA" label="Onda A" value={data.ondaA} onChange={v => onChange('ondaA', v)} unit="cm/s" />
      <ReadOnlyWithUnit label="Rel. E/A" value={relEA} unit="" />
      <InputWithUnit id="tric-vmax" label="Vmax (TR)" value={data.vmax} onChange={v => onChange('vmax', v)} unit="cm/s" />
      <ReadOnlyWithUnit label="GrP Max" value={grpMax} unit="mmHg" />
      <InputWithUnit id="tric-rap" label="RAP (estimada)" value={rap} onChange={setRap} unit="mmHg" />
      <ReadOnlyWithUnit label="PSVD / RVSP" value={psvd} unit="mmHg" />
      <InputWithUnit id="tric-thp" label="THP" value={data.thp} onChange={v => onChange('thp', v)} unit="ms" />
      <InputWithUnit id="tric-avt" label="AVT" value={data.avt} onChange={v => onChange('avt', v)} unit="cm²" />
      <InputWithUnit id="tric-vc" label="VC" value={data.vc} onChange={v => onChange('vc', v)} unit="mm" />
      <InputWithUnit id="tric-reg" label="Reg (grado)" value={data.reg} onChange={v => onChange('reg', v)} unit="" />
    </div>
  </SectionGroup>
);

export default TricuspideSection;
