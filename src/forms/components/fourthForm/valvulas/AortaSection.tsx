import React, { useEffect } from "react";
import SectionGroup from "@/components/options/SectionGroup";
import InputWithUnit from "@/components/options/InputWithUnit";
import PresenciaSelect from "../../ui/PresenciaSelect";
import RegurgitacionSelect from "../../ui/RegurgitacionSelect";
import ReadOnlyWithUnit from "@/components/options/ReadOnlyWithUnit";
import { AortaData } from "../../../types/fourthForm/ValvulasData";
import { useAutoAvac } from "../../../hooks/useAutoAvac";

interface Props {
  data: AortaData;
  onChange: (field: keyof AortaData, value: string) => void;
  gpMax: string;
}

const AortaSection: React.FC<Props> = ({ data, onChange, gpMax }) => {
  // Cálculo automático del AVA por ecuación de continuidad
  const { avac: avacCalculado } = useAutoAvac({
    diametroTsvi: data.diametroTsvi,
    itvTsvi: data.itvTsvi,
    itvAorta: data.itvAorta,
  });

  // Actualizar automáticamente el campo avac cuando se calculen nuevos valores
  useEffect(() => {
    if (avacCalculado && avacCalculado !== data.avac) {
      onChange("avac", avacCalculado);
    }
  }, [avacCalculado, data.avac, onChange]);

  return (
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
        
        {/* Sección para cálculo de AVA por ecuación de continuidad */}
        <div className="md:col-span-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3 border-b pb-1">
            Ecuación de Continuidad (AVA)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithUnit
              id="ao-diametro-tsvi"
              label="Diam. TSVI"
              value={data.diametroTsvi}
              onChange={(v) => onChange("diametroTsvi", v)}
              unit="mm"
            />
            <InputWithUnit
              id="ao-itv-tsvi"
              label="ITV TSVI"
              value={data.itvTsvi}
              onChange={(v) => onChange("itvTsvi", v)}
              unit="cm"
            />
            <InputWithUnit
              id="ao-itv-aorta"
              label="ITV Aorta"
              value={data.itvAorta}
              onChange={(v) => onChange("itvAorta", v)}
              unit="cm"
            />
          </div>
        </div>

        <ReadOnlyWithUnit 
          label="AVAC / AVA (Calculado)" 
          value={data.avac} 
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
};

export default AortaSection;
