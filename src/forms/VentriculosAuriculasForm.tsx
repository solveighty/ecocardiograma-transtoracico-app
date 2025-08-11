import FormNavigationButtons from "./components/ui/FormNavigationButtons";
import type { VentriculosAuriculasData } from "./types/thirdForm/VentriculosAuriculasData";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import VentriculoIzquierdoSection from "./components/thirdForm/ventriculos-auriculas/VentriculoIzquierdoSection";
import VentriculoDerechoSection from "./components/thirdForm/ventriculos-auriculas/VentriculoDerechoSection";
import AuriculaIzquierdaSection from "./components/thirdForm/ventriculos-auriculas/AuriculaIzquierdaSection";
import AuriculaDerechaSection from "./components/thirdForm/ventriculos-auriculas/AuriculaDerechaSection";
import {
  calcMasaVI,
  calcIMVI,
  calcGRP,
  calcCAF,
  calcIE,
  calcRelacionVDVI,
} from "./services/thirdForm/ventriculosAuriculasCalculos";

interface Props {
  data: VentriculosAuriculasData;
  setData: React.Dispatch<React.SetStateAction<VentriculosAuriculasData>>;
  onNext: () => void;
  onBack: () => void;
}

import { useEffect } from "react";

const VentriculosAuriculasForm: React.FC<Props> = ({
  data,
  setData,
  onNext,
  onBack,
}) => {
  const handleChange = (
    field: keyof VentriculosAuriculasData,
    value: string
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Cálculos automáticos en render
  const masa = calcMasaVI({
    ddfvi: data.ddfvi,
    gdsept: data.gdsept,
    gdpil: data.gdpil,
  });
  const imvi = calcIMVI({
    masaVI: masa,
    superficieCorporal: data.superficieCorporal,
  });
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
      volAi = ((0.85 * area4C * area2C) / longCm).toFixed(1);
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
        <CardDescription>
          Ingrese los parámetros de ventrículos y aurículas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {import.meta.env.DEV && (
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                const snapshot = {
                  form: 'Ventrículos y Aurículas',
                  inputs: { ...data },
                  calculados: {
                    masa,
                    imvi,
                    grp,
                    ie,
                    caf,
                    relacionVdVi,
                    volAi: data.volAi,
                    volIndexAi: data.volIndexAi,
                  },
                  timestamp: new Date().toISOString(),
                };
                const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const ts = new Date().toISOString().replace(/[:.]/g, '-');
                a.href = url;
                a.download = `echocardio-ventriculos-auriculas-${ts}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              }}
            >
              Exportar JSON (dev)
            </button>
          </div>
        )}
        <VentriculoIzquierdoSection
          data={data}
          masa={masa}
          imvi={imvi}
          grp={grp}
          handleChange={handleChange}
        />
        <VentriculoDerechoSection
          data={data}
          caf={caf}
          ie={ie}
          relacionVdVi={relacionVdVi}
          handleChange={handleChange}
        />
        <AuriculaIzquierdaSection data={data} handleChange={handleChange} />
        <AuriculaDerechaSection data={data} handleChange={handleChange} />
        <FormNavigationButtons onBack={onBack} onNext={onNext} />
      </CardContent>
    </Card>
  );
};

export default VentriculosAuriculasForm;
