import React from 'react';
import SectionGroup from '@/components/options/SectionGroup';
import InputWithUnit from '@/components/options/InputWithUnit';
import ReadOnlyWithUnit from '@/components/options/ReadOnlyWithUnit';
import { AortaData } from '../../../types/fourthForm/ValvulasData';

interface Props {
  data: AortaData;
  onChange: (field: keyof AortaData, value: string) => void;
  gpMax: string;
}

const AortaSection: React.FC<Props> = ({ data, onChange, gpMax }) => (
  <SectionGroup title="AORTA">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit id="ao-vmax" label="Vmax" value={data.vmax} onChange={v => onChange('vmax', v)} unit="cm/s" />
      <ReadOnlyWithUnit label="GP Max" value={gpMax} unit="mmHg" />
      <InputWithUnit id="ao-gradMed" label="Grad. Med" value={data.gradMed} onChange={v => onChange('gradMed', v)} unit="mmHg" />
      <InputWithUnit id="ao-avac" label="AVAC / AVA" value={data.avac} onChange={v => onChange('avac', v)} unit="cm²" />
      <InputWithUnit id="ao-thp" label="THP" value={data.thp} onChange={v => onChange('thp', v)} unit="ms" />
      <InputWithUnit id="ao-vc" label="VC" value={data.vc} onChange={v => onChange('vc', v)} unit="mm" />
      <InputWithUnit id="ao-reg" label="Reg (grado)" value={data.reg} onChange={v => onChange('reg', v)} unit="" />
      <InputWithUnit id="ao-fhdr" label="Flujo holodiastólico reverso" value={data.flujoHolodiastolicoReverso} onChange={v => onChange('flujoHolodiastolicoReverso', v)} unit="" />
    </div>
  </SectionGroup>
);

export default AortaSection;
