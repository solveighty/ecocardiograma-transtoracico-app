import InputWithUnit from "../../../../components/options/InputWithUnit";
import ReadOnlyWithUnit from "../../../../components/options/ReadOnlyWithUnit";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { PatientData } from "@/forms/types/firstForm/PatientData";
import type { BSAFormula } from "@/forms/services/firstForm/personalData";

interface Props {
  patientData: PatientData;
  handleInputChange: (field: keyof PatientData, value: string) => void;
}

export default function PesoTallaSCForm({
  patientData,
  handleInputChange,
}: Props) {
  const handleFormulaChange = (value: string) => {
    handleInputChange("bsaFormula", value as BSAFormula);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="peso" className="text-sm font-medium">
            Peso:
          </Label>
          <InputWithUnit
            id="peso"
            label=""
            value={patientData.peso}
            onChange={(v: string) => handleInputChange("peso", v)}
            unit="kg"
            min={0}
            max={999.99}
            step={0.1}
            placeholder="0.0"
          />
        </div>
        <div>
          <Label htmlFor="talla" className="text-sm font-medium">
            Talla:
          </Label>
          <InputWithUnit
            id="talla"
            label=""
            value={patientData.talla}
            onChange={(v: string) => handleInputChange("talla", v)}
            unit="cm"
            min={0}
            max={300}
            step={0.1}
            placeholder="0.0"
          />
        </div>
        <div>
          <Label htmlFor="sc" className="text-sm font-medium">
            SC (Superficie Corporal):
          </Label>
          <ReadOnlyWithUnit
            label=""
            value={patientData.superficieCorporal}
            unit="m²"
          />
        </div>
      </div>
      
      <div className="max-w-md">
        <Label htmlFor="bsa-formula" className="text-sm font-medium">
          Fórmula para Superficie Corporal:
        </Label>
        <Select 
          value={patientData.bsaFormula || 'dubois'} 
          onValueChange={handleFormulaChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar fórmula" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dubois">Du Bois (SC = 0.007184 × talla^0.725 × peso^0.425)</SelectItem>
            <SelectItem value="mosteller">Mosteller (SC = √((talla × peso) / 3600))</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          Se recalcula automáticamente al cambiar peso, talla o fórmula
        </p>
      </div>
    </div>
  );
}
