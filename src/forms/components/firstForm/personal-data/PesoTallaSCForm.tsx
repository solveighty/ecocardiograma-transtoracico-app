import InputWithUnit from "../../../../components/options/InputWithUnit";
import ReadOnlyWithUnit from "../../../../components/options/ReadOnlyWithUnit";
import { Label } from "@/components/ui/label";

import type { PatientData } from "@/forms/types/firstForm/PatientData";
interface Props {
  patientData: PatientData;
  handleInputChange: (field: keyof PatientData, value: string) => void;
}

export default function PesoTallaSCForm({ patientData, handleInputChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="peso" className="text-sm font-medium">
          Peso: <span className="text-red-500">*</span>
        </Label>
        <InputWithUnit
          id="peso"
          label=""
          value={patientData.peso}
          onChange={(v: string) => handleInputChange("peso", v)}
          unit="kg"
          min={0}
          max={999.99}
          required
          placeholder="0.00"
        />
      </div>
      <div>
        <Label htmlFor="talla" className="text-sm font-medium">
          Talla: <span className="text-red-500">*</span>
        </Label>
        <InputWithUnit
          id="talla"
          label=""
          value={patientData.talla}
          onChange={(v: string) => handleInputChange("talla", v)}
          unit="cm"
          min={0}
          max={300}
          required
          placeholder="0"
        />
      </div>
      <div>
        <Label htmlFor="sc" className="text-sm font-medium">
          SC (Superficie Corporal):
        </Label>
        <ReadOnlyWithUnit label="" value={patientData.superficieCorporal} unit="m²" />
        <p className="text-xs text-gray-500 mt-1">Se calcula automáticamente con peso y talla</p>
      </div>
    </div>
  );
}
