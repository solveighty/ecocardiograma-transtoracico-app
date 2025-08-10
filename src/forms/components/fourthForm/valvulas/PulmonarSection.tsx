import React from 'react';
import SectionGroup from '@/components/options/SectionGroup';
import InputWithUnit from '@/components/options/InputWithUnit';
import RegurgitacionSelect from '../../ui/RegurgitacionSelect';
import ReadOnlyWithUnit from '@/components/options/ReadOnlyWithUnit';
import { PulmonarData } from '../../../types/fourthForm/ValvulasData';

interface Props {
  data: PulmonarData;
  onChange: (field: keyof PulmonarData, value: string) => void;
  gpMax: string;
}

const PulmonarSection: React.FC<Props> = ({ data, onChange, gpMax }) => (
  <SectionGroup title="PULMONAR">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit id="pulm-vmax" label="Vmax" value={data.vmax} onChange={v => onChange('vmax', v)} unit="cm/s" />
      <ReadOnlyWithUnit label="GP Max" value={gpMax} unit="mmHg" />
      <InputWithUnit id="pulm-tam" label="TAM" value={data.tam} onChange={v => onChange('tam', v)} unit="ms" />
  <RegurgitacionSelect id="pulm-reg" value={data.reg} onChange={v => onChange('reg', v)} />
      <InputWithUnit id="pulm-pmap" label="PMAP" value={data.pmap} onChange={v => onChange('pmap', v)} unit="mmHg" />
      <InputWithUnit id="pulm-pdvd" label="PDVD" value={data.pdvd} onChange={v => onChange('pdvd', v)} unit="mmHg" />
      <InputWithUnit id="pulm-vc" label="VC" value={data.vc} onChange={v => onChange('vc', v)} unit="mm" />
    </div>
  </SectionGroup>
);

export default PulmonarSection;
