import React from 'react';
import SectionGroup from '@/components/options/SectionGroup';
import InputWithUnit from '@/components/options/InputWithUnit';
import ReadOnlyWithUnit from '@/components/options/ReadOnlyWithUnit';
import { MitralData } from '../../../types/fourthForm/ValvulasData';

interface Props {
  data: MitralData;
  onChange: (field: keyof MitralData, value: string) => void;
  relEA: string;
  gradMax: string;
  avmFromPHT: string;
  eroFromPISA: string;
  vrCalc: string;
}

const MitralSection: React.FC<Props> = ({ data, onChange, relEA, gradMax, avmFromPHT, eroFromPISA, vrCalc }) => (
  <SectionGroup title="MITRAL">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit id="mitral-ondaE" label="Onda E" value={data.ondaE} onChange={v => onChange('ondaE', v)} unit="cm/s" />
      <InputWithUnit id="mitral-ondaA" label="Onda A" value={data.ondaA} onChange={v => onChange('ondaA', v)} unit="cm/s" />
      <ReadOnlyWithUnit label="Rel. E/A" value={relEA} unit="" />
      <InputWithUnit id="mitral-durA" label="Dur. A" value={data.durA} onChange={v => onChange('durA', v)} unit="ms" />
      <InputWithUnit id="mitral-tde" label="TDE" value={data.tde} onChange={v => onChange('tde', v)} unit="ms" />
      <InputWithUnit id="mitral-thp" label="PHT" value={data.thp} onChange={v => onChange('thp', v)} unit="ms" />
      <InputWithUnit id="mitral-itv" label="ITV / VTI" value={data.itv} onChange={v => onChange('itv', v)} unit="cm" />
      <InputWithUnit id="mitral-ore" label="ORE (ERO)" value={data.ore} onChange={v => onChange('ore', v)} unit="cm²" />
      <ReadOnlyWithUnit label="VR (Reg Vol)" value={vrCalc} unit="ml" />
      <InputWithUnit id="mitral-vc" label="VC" value={data.vc} onChange={v => onChange('vc', v)} unit="mm" />
      <InputWithUnit id="mitral-reg" label="Reg (grado)" value={data.reg} onChange={v => onChange('reg', v)} unit="" />
      <InputWithUnit id="mitral-avm" label="AVM (planimetría)" value={data.avm} onChange={v => onChange('avm', v)} unit="cm²" />
      <InputWithUnit id="mitral-vmax" label="Vmax" value={data.vmax} onChange={v => onChange('vmax', v)} unit="cm/s" />
      <ReadOnlyWithUnit label="Grad. Max" value={gradMax} unit="mmHg" />
      <InputWithUnit id="mitral-gradMed" label="Grad. Med" value={data.gradMed} onChange={v => onChange('gradMed', v)} unit="mmHg" />
      <InputWithUnit id="mitral-radio" label="Radio (PISA)" value={data.radio} onChange={v => onChange('radio', v)} unit="cm" />
      <InputWithUnit id="mitral-ny" label="Nyquist (Va)" value={data.ny} onChange={v => onChange('ny', v)} unit="cm/s" />
      <ReadOnlyWithUnit label="ERO (PISA)" value={eroFromPISA} unit="cm²" />
      <ReadOnlyWithUnit label="AVM (PHT)" value={avmFromPHT} unit="cm²" />
    </div>
  </SectionGroup>
);

export default MitralSection;
