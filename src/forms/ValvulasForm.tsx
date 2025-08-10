import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SectionGroup from '@/components/options/SectionGroup';
import InputWithUnit from '@/components/options/InputWithUnit';
import ReadOnlyWithUnit from '@/components/options/ReadOnlyWithUnit';
import { ValvulasData, MitralData, TricuspideData, AortaData, PulmonarData } from './types/fourthForm/ValvulasData';
import { calcAVMFromPHT, calcERO_PISA, calcGradPicoFromVmaxCm, calcPSVD, calcRelEA, calcVR } from './services/fourthForm/valvulasCalculos';

const initialMitral: MitralData = {
  ondaE: '', itv: '', ondaA: '', ore: '', relEA: '', vr: '', durA: '', vc: '', tde: '', thp: '', reg: '', avm: '', vmax: '', gradMax: '', radio: '', gradMed: '', ny: ''
};
const initialTricuspide: TricuspideData = {
  ondaE: '', ondaA: '', relEA: '', reg: '', vmax: '', grpMax: '', psvd: '', thp: '', avt: '', vc: ''
};
const initialAorta: AortaData = {
  vmax: '', gpMax: '', gradMed: '', avac: '', reg: '', thp: '', vc: '', flujoHolodiastolicoReverso: ''
};
const initialPulmonar: PulmonarData = {
  vmax: '', gpMax: '', tam: '', reg: '', pmap: '', pdvd: '', vc: ''
};

interface Props {
  data: ValvulasData;
  setData: React.Dispatch<React.SetStateAction<ValvulasData>>;
  onNext: () => void;
  onBack: () => void;
}

export const getInitialValvulasData = (): ValvulasData => ({
  mitral: initialMitral,
  tricuspide: initialTricuspide,
  aorta: initialAorta,
  pulmonar: initialPulmonar,
});

export default function ValvulasForm({ data, setData, onNext, onBack }: Props) {
  // Auxiliar para RAP estimada en PSVD (no estaba en la tabla, lo agregamos localmente)
  const [rap, setRap] = useState<string>('3'); // mmHg típico 3-15

  const handleMitral = (field: keyof MitralData, value: string) => setData(prev => ({ ...prev, mitral: { ...prev.mitral, [field]: value } }));
  const handleTricuspide = (field: keyof TricuspideData, value: string) => setData(prev => ({ ...prev, tricuspide: { ...prev.tricuspide, [field]: value } }));
  const handleAorta = (field: keyof AortaData, value: string) => setData(prev => ({ ...prev, aorta: { ...prev.aorta, [field]: value } }));
  const handlePulmonar = (field: keyof PulmonarData, value: string) => setData(prev => ({ ...prev, pulmonar: { ...prev.pulmonar, [field]: value } }));

  // Cálculos derivados
  const relEA_Mitral = useMemo(() => calcRelEA(data.mitral.ondaE, data.mitral.ondaA), [data.mitral.ondaE, data.mitral.ondaA]);
  const gradMax_Mitral = useMemo(() => calcGradPicoFromVmaxCm(data.mitral.vmax), [data.mitral.vmax]);
  const avm_fromPHT = useMemo(() => calcAVMFromPHT(data.mitral.thp), [data.mitral.thp]);
  const ero_fromPISA = useMemo(() => calcERO_PISA(data.mitral.radio, data.mitral.ny, data.mitral.vmax), [data.mitral.radio, data.mitral.ny, data.mitral.vmax]);
  const vr_calc = useMemo(() => calcVR(data.mitral.ore || ero_fromPISA, data.mitral.itv), [data.mitral.ore, ero_fromPISA, data.mitral.itv]);

  const relEA_Tric = useMemo(() => calcRelEA(data.tricuspide.ondaE, data.tricuspide.ondaA), [data.tricuspide.ondaE, data.tricuspide.ondaA]);
  const grpMax_Tric = useMemo(() => calcGradPicoFromVmaxCm(data.tricuspide.vmax), [data.tricuspide.vmax]);
  const psvd_Tric = useMemo(() => calcPSVD(data.tricuspide.vmax, rap), [data.tricuspide.vmax, rap]);

  const gpMax_Ao = useMemo(() => calcGradPicoFromVmaxCm(data.aorta.vmax), [data.aorta.vmax]);
  const gpMax_Pulm = useMemo(() => calcGradPicoFromVmaxCm(data.pulmonar.vmax), [data.pulmonar.vmax]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Válvulas</CardTitle>
        <CardDescription>Ingrese parámetros para MITRAL, TRICÚSPIDE, AORTA y PULMONAR. Los campos calculados se actualizan automáticamente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <SectionGroup title="MITRAL">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithUnit id="mitral-ondaE" label="Onda E" value={data.mitral.ondaE} onChange={(v) => handleMitral('ondaE', v)} unit="cm/s" />
            <InputWithUnit id="mitral-ondaA" label="Onda A" value={data.mitral.ondaA} onChange={(v) => handleMitral('ondaA', v)} unit="cm/s" />
            <ReadOnlyWithUnit label="Rel. E/A" value={relEA_Mitral} unit="" />

            <InputWithUnit id="mitral-durA" label="Dur. A" value={data.mitral.durA} onChange={(v) => handleMitral('durA', v)} unit="ms" />
            <InputWithUnit id="mitral-tde" label="TDE" value={data.mitral.tde} onChange={(v) => handleMitral('tde', v)} unit="ms" />
            <InputWithUnit id="mitral-thp" label="PHT" value={data.mitral.thp} onChange={(v) => handleMitral('thp', v)} unit="ms" />

            <InputWithUnit id="mitral-itv" label="ITV / VTI" value={data.mitral.itv} onChange={(v) => handleMitral('itv', v)} unit="cm" />
            <InputWithUnit id="mitral-ore" label="ORE (ERO)" value={data.mitral.ore} onChange={(v) => handleMitral('ore', v)} unit="cm²" />
            <ReadOnlyWithUnit label="VR (Reg Vol)" value={vr_calc} unit="ml" />

            <InputWithUnit id="mitral-vc" label="VC" value={data.mitral.vc} onChange={(v) => handleMitral('vc', v)} unit="mm" />
            <InputWithUnit id="mitral-reg" label="Reg (grado)" value={data.mitral.reg} onChange={(v) => handleMitral('reg', v)} unit="" />
            <InputWithUnit id="mitral-avm" label="AVM (planimetría)" value={data.mitral.avm} onChange={(v) => handleMitral('avm', v)} unit="cm²" />

            <InputWithUnit id="mitral-vmax" label="Vmax" value={data.mitral.vmax} onChange={(v) => handleMitral('vmax', v)} unit="cm/s" />
            <ReadOnlyWithUnit label="Grad. Max" value={gradMax_Mitral} unit="mmHg" />
            <InputWithUnit id="mitral-gradMed" label="Grad. Med" value={data.mitral.gradMed} onChange={(v) => handleMitral('gradMed', v)} unit="mmHg" />

            <InputWithUnit id="mitral-radio" label="Radio (PISA)" value={data.mitral.radio} onChange={(v) => handleMitral('radio', v)} unit="cm" />
            <InputWithUnit id="mitral-ny" label="Nyquist (Va)" value={data.mitral.ny} onChange={(v) => handleMitral('ny', v)} unit="cm/s" />
            <ReadOnlyWithUnit label="ERO (PISA)" value={ero_fromPISA} unit="cm²" />

            <ReadOnlyWithUnit label="AVM (PHT)" value={avm_fromPHT} unit="cm²" />
          </div>
        </SectionGroup>

        <SectionGroup title="TRICÚSPIDE">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithUnit id="tric-ondaE" label="Onda E" value={data.tricuspide.ondaE} onChange={(v) => handleTricuspide('ondaE', v)} unit="cm/s" />
            <InputWithUnit id="tric-ondaA" label="Onda A" value={data.tricuspide.ondaA} onChange={(v) => handleTricuspide('ondaA', v)} unit="cm/s" />
            <ReadOnlyWithUnit label="Rel. E/A" value={relEA_Tric} unit="" />

            <InputWithUnit id="tric-vmax" label="Vmax (TR)" value={data.tricuspide.vmax} onChange={(v) => handleTricuspide('vmax', v)} unit="cm/s" />
            <ReadOnlyWithUnit label="GrP Max" value={grpMax_Tric} unit="mmHg" />
            <InputWithUnit id="tric-rap" label="RAP (estimada)" value={rap} onChange={setRap} unit="mmHg" />

            <ReadOnlyWithUnit label="PSVD / RVSP" value={psvd_Tric} unit="mmHg" />
            <InputWithUnit id="tric-thp" label="THP" value={data.tricuspide.thp} onChange={(v) => handleTricuspide('thp', v)} unit="ms" />
            <InputWithUnit id="tric-avt" label="AVT" value={data.tricuspide.avt} onChange={(v) => handleTricuspide('avt', v)} unit="cm²" />

            <InputWithUnit id="tric-vc" label="VC" value={data.tricuspide.vc} onChange={(v) => handleTricuspide('vc', v)} unit="mm" />
            <InputWithUnit id="tric-reg" label="Reg (grado)" value={data.tricuspide.reg} onChange={(v) => handleTricuspide('reg', v)} unit="" />
          </div>
        </SectionGroup>

        <SectionGroup title="AORTA">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithUnit id="ao-vmax" label="Vmax" value={data.aorta.vmax} onChange={(v) => handleAorta('vmax', v)} unit="cm/s" />
            <ReadOnlyWithUnit label="GP Max" value={gpMax_Ao} unit="mmHg" />
            <InputWithUnit id="ao-gradMed" label="Grad. Med" value={data.aorta.gradMed} onChange={(v) => handleAorta('gradMed', v)} unit="mmHg" />

            <InputWithUnit id="ao-avac" label="AVAC / AVA" value={data.aorta.avac} onChange={(v) => handleAorta('avac', v)} unit="cm²" />
            <InputWithUnit id="ao-thp" label="THP" value={data.aorta.thp} onChange={(v) => handleAorta('thp', v)} unit="ms" />
            <InputWithUnit id="ao-vc" label="VC" value={data.aorta.vc} onChange={(v) => handleAorta('vc', v)} unit="mm" />

            <InputWithUnit id="ao-reg" label="Reg (grado)" value={data.aorta.reg} onChange={(v) => handleAorta('reg', v)} unit="" />
            <InputWithUnit id="ao-fhdr" label="Flujo holodiastólico reverso" value={data.aorta.flujoHolodiastolicoReverso} onChange={(v) => handleAorta('flujoHolodiastolicoReverso', v)} unit="" />
          </div>
        </SectionGroup>

        <SectionGroup title="PULMONAR">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithUnit id="pulm-vmax" label="Vmax" value={data.pulmonar.vmax} onChange={(v) => handlePulmonar('vmax', v)} unit="cm/s" />
            <ReadOnlyWithUnit label="GP Max" value={gpMax_Pulm} unit="mmHg" />
            <InputWithUnit id="pulm-tam" label="TAM" value={data.pulmonar.tam} onChange={(v) => handlePulmonar('tam', v)} unit="ms" />

            <InputWithUnit id="pulm-reg" label="Reg (grado)" value={data.pulmonar.reg} onChange={(v) => handlePulmonar('reg', v)} unit="" />
            <InputWithUnit id="pulm-pmap" label="PMAP" value={data.pulmonar.pmap} onChange={(v) => handlePulmonar('pmap', v)} unit="mmHg" />
            <InputWithUnit id="pulm-pdvd" label="PDVD" value={data.pulmonar.pdvd} onChange={(v) => handlePulmonar('pdvd', v)} unit="mmHg" />

            <InputWithUnit id="pulm-vc" label="VC" value={data.pulmonar.vc} onChange={(v) => handlePulmonar('vc', v)} unit="mm" />
          </div>
        </SectionGroup>

        <div className="flex justify-between mt-6">
          <button type="button" className="btn btn-secondary" onClick={onBack}>Volver</button>
          <button type="button" className="btn btn-primary" onClick={onNext}>Siguiente</button>
        </div>
      </CardContent>
    </Card>
  );
}
