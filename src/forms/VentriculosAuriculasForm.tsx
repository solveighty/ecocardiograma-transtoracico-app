import type { VentriculosAuriculasData } from "./types/thirdForm/VentriculosAuriculasData";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import InputWithUnit from "./components/secondForm/medidas-vi/InputWithUnit";
import SectionGroup from "./components/secondForm/medidas-vi/SectionGroup";
import ReadOnlyWithUnit from "./components/secondForm/medidas-vi/ReadOnlyWithUnit";
import {
  calcMasaVI,
  calcIMVI,
  calcGRP,
  calcCAF,
  calcIE,
  calcRelacionVDVI
} from "./services/thirdForm/ventriculosAuriculasCalculos";

interface Props {
  data: VentriculosAuriculasData;
  setData: React.Dispatch<React.SetStateAction<VentriculosAuriculasData>>;
  onNext: () => void;
  onBack: () => void;
}

import { useEffect } from "react";

const VentriculosAuriculasForm: React.FC<Props> = ({ data, setData, onNext, onBack }) => {
  const handleChange = (field: keyof VentriculosAuriculasData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Cálculos automáticos en render
  const masa = calcMasaVI({ ddfvi: data.ddfvi, gdsept: data.gdsept, gdpil: data.gdpil });
  const imvi = calcIMVI({ masaVI: masa, superficieCorporal: data.superficieCorporal });
  const grp = calcGRP(data.gdsept, data.gdpil, data.ddfvi); // sin unidad
  const ie = calcIE(data.basal, data.long);
  const caf = calcCAF(data.basal, data.basalSistolico); // requiere basal sistólico
  const relacionVdVi = calcRelacionVDVI(data.basal, data.ddfvi);
  // Volumen AI y Vol Index calculados y sincronizados en el estado
  useEffect(() => {
    // Usar área 4C y 2C, longitud en cm
    const area4C = parseFloat(data.areaAi);
    const area2C = parseFloat(data.areaAi2C);
    const longCm = parseFloat(data.long) / 10; // mm a cm
    let volAi = "";
    if (!isNaN(area4C) && !isNaN(area2C) && !isNaN(longCm) && longCm > 0) {
      volAi = (0.85 * area4C * area2C / longCm).toFixed(1);
    }
    let volIndexAi = "";
    const sc = parseFloat(data.superficieCorporal);
    if (volAi && !isNaN(sc) && sc > 0) {
      volIndexAi = (parseFloat(volAi) / sc).toFixed(1);
    }
    setData((prev) => ({ ...prev, volAi, volIndexAi }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.areaAi, data.areaAi2C, data.long, data.superficieCorporal]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ventrículos y Aurículas</CardTitle>
        <CardDescription>Ingrese los parámetros de ventrículos y aurículas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SectionGroup title="Ventrículo Izquierdo">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReadOnlyWithUnit label="Masa" value={masa} unit="gr" />
            <ReadOnlyWithUnit label="IMVI" value={imvi} unit="gr/m²" />
            <ReadOnlyWithUnit label="GRP" value={grp} unit="" />
            <InputWithUnit id="mapse" label="MAPSE" value={data.mapse} onChange={v => handleChange("mapse", v)} unit="mm" />
            <InputWithUnit id="dpdt" label="dP/dt" value={data.dpdt} onChange={v => handleChange("dpdt", v)} unit="mmHg/seg" />
          </div>
        </SectionGroup>
        <SectionGroup title="Ventrículo Derecho">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithUnit id="basal" label="Basal (diástole)" value={data.basal} onChange={v => handleChange("basal", v)} unit="mm" />
            <InputWithUnit id="basalSistolico" label="Basal (sístole)" value={data.basalSistolico} onChange={v => handleChange("basalSistolico", v)} unit="mm" />
            <ReadOnlyWithUnit label="CAF" value={caf} unit="%" />
            <InputWithUnit id="medio" label="Medio" value={data.medio} onChange={v => handleChange("medio", v)} unit="mm" />
            <ReadOnlyWithUnit label="IE" value={ie} unit="" />
            <InputWithUnit id="long" label="Long" value={data.long} onChange={v => handleChange("long", v)} unit="mm" />
            <ReadOnlyWithUnit label="Relación VD/VI" value={relacionVdVi} unit="" />
            <InputWithUnit id="tapse" label="TAPSE" value={data.tapse} onChange={v => handleChange("tapse", v)} unit="mm" />
          </div>
        </SectionGroup>
        <SectionGroup title="Aurícula Izquierda">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithUnit id="dai" label="DAI" value={data.dai} onChange={v => handleChange("dai", v)} unit="mm" />
            <InputWithUnit id="areaAi" label="Área 4C" value={data.areaAi} onChange={v => handleChange("areaAi", v)} unit="cm²" />
            <InputWithUnit id="areaAi2C" label="Área 2C" value={data.areaAi2C} onChange={v => handleChange("areaAi2C", v)} unit="cm²" />
            <ReadOnlyWithUnit label="Vol" value={data.volAi} unit="ml" />
            <ReadOnlyWithUnit label="Vol. Index" value={data.volIndexAi} unit="ml/m²" />
          </div>
        </SectionGroup>
        <SectionGroup title="Aurícula Derecha">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithUnit id="dmAd" label="Dm" value={data.dmAd} onChange={v => handleChange("dmAd", v)} unit="mm" />
            <InputWithUnit id="areaAd" label="Área" value={data.areaAd} onChange={v => handleChange("areaAd", v)} unit="cm²" />
          </div>
        </SectionGroup>
        <div className="flex justify-between mt-6">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Volver
          </button>
          <button type="button" className="btn btn-primary" onClick={onNext}>
            Siguiente
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VentriculosAuriculasForm;
