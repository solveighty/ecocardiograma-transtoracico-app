import React from 'react';
import SectionGroup from '@/components/options/SectionGroup';
import InputWithUnit from '@/components/options/InputWithUnit';
import { GrandesVasosAortaData } from '../../../types/fifthForm/DopplerTisularData';

interface Props {
  data: GrandesVasosAortaData;
  onChange: (field: keyof GrandesVasosAortaData, value: string) => void;
}

const GV_AortaSection: React.FC<Props> = ({ data, onChange }) => (
  <SectionGroup title="Grandes Vasos - Aorta">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit id="gv-ao-rao" label="Rao" value={data.rao} onChange={v => onChange('rao', v)} unit="mm" />
      <InputWithUnit id="gv-ao-anillo" label="Anillo" value={data.anillo} onChange={v => onChange('anillo', v)} unit="mm" />
      <InputWithUnit id="gv-ao-unionst" label="Unión ST" value={data.unionST} onChange={v => onChange('unionST', v)} unit="mm" />
      <InputWithUnit id="gv-ao-cayado" label="Cayado" value={data.cayado} onChange={v => onChange('cayado', v)} unit="mm" />
      <InputWithUnit id="gv-ao-desc" label="Ao. Desc." value={data.aoDesc} onChange={v => onChange('aoDesc', v)} unit="mm" />
      <InputWithUnit id="gv-ao-abd" label="Ao. Abd." value={data.aoAbd} onChange={v => onChange('aoAbd', v)} unit="mm" />
    </div>
  </SectionGroup>
);

export default GV_AortaSection;
