import React from "react";
import SectionGroup from "../../../../components/options/SectionGroup";
import InputWithUnit from "../../../../components/options/InputWithUnit";
import ReadOnlyWithUnit from "../../../../components/options/ReadOnlyWithUnit";
import type { MedidasVIData } from "../../../types/secondForm/MedidasVIData";

interface Props {
  medidasVIData: MedidasVIData;
  handleChange: (field: keyof MedidasVIData, value: string) => void;
  calcVL: (vdf: string, vsf: string) => string;
  calcFETeich: (ddfvi: string, dsfvi: string) => string;
  calcFA: (ddfvi: string, dsfvi: string) => string;
}

const VolumenesLinealesSection: React.FC<Props> = ({
  medidasVIData,
  handleChange,
  calcVL,
  calcFETeich,
  calcFA,
}) => (
  <SectionGroup title="Volúmenes (lineales)">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InputWithUnit
        id="vdfLineal"
        label="VDF"
        value={medidasVIData.vdfLineal}
        onChange={(v: string) => handleChange("vdfLineal", v)}
        unit="ml"
      />
      <InputWithUnit
        id="vsfLineal"
        label="VSF"
        value={medidasVIData.vsfLineal}
        onChange={(v: string) => handleChange("vsfLineal", v)}
        unit="ml"
      />
      <ReadOnlyWithUnit
        label="VL"
        value={calcVL(medidasVIData.vdfLineal, medidasVIData.vsfLineal)}
        unit="ml"
      />
          <ReadOnlyWithUnit
            label="FE (de volúmenes lineales)"
            value={(() => {
              const vdf = parseFloat(medidasVIData.vdfLineal);
              const vsf = parseFloat(medidasVIData.vsfLineal);
              if (!isNaN(vdf) && !isNaN(vsf) && vdf > 0) {
                return (((vdf - vsf) / vdf) * 100).toFixed(2);
              }
              return "";
            })()}
            unit="%"
          />
      <ReadOnlyWithUnit
        label="FE Teich (de diámetros)"
        value={calcFETeich(medidasVIData.ddfvi, medidasVIData.dsfvi)}
        unit="%"
      />
      <ReadOnlyWithUnit
        label="FA"
        value={calcFA(medidasVIData.ddfvi, medidasVIData.dsfvi)}
        unit="%"
      />
          {(() => {
            const teich = parseFloat(calcFETeich(medidasVIData.ddfvi, medidasVIData.dsfvi));
            const vdf = parseFloat(medidasVIData.vdfLineal);
            const vsf = parseFloat(medidasVIData.vsfLineal);
            const vol = !isNaN(vdf) && !isNaN(vsf) && vdf > 0 ? (((vdf - vsf) / vdf) * 100) : NaN;
            if (!isNaN(teich) && !isNaN(vol) && Math.abs(teich - vol) > 1) {
              return (
                <div className="md:col-span-3 text-xs text-yellow-700">
                  Advertencia: FE Teich y FE de volúmenes difieren más de 1 pp.
                </div>
              );
            }
            return null;
          })()}
    </div>
  </SectionGroup>
);

export default VolumenesLinealesSection;
