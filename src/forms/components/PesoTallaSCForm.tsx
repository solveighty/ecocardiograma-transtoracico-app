import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { PatientData } from "../personal-data";
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
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="peso"
            type="number"
            step="0.1"
            value={patientData.peso}
            onChange={(e) => handleInputChange("peso", e.target.value)}
            placeholder="0.0"
            className="flex-1"
            min="0"
            required
          />
          <span className="text-sm text-gray-500">kg</span>
        </div>
      </div>
      <div>
        <Label htmlFor="talla" className="text-sm font-medium">
          Talla: <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="talla"
            type="number"
            value={patientData.talla}
            onChange={(e) => handleInputChange("talla", e.target.value)}
            placeholder="0"
            className="flex-1"
            min="0"
            required
          />
          <span className="text-sm text-gray-500">cm</span>
        </div>
      </div>
      <div>
        <Label htmlFor="sc" className="text-sm font-medium">
          SC (Superficie Corporal):
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="sc"
            value={patientData.superficieCorporal}
            placeholder="Calculado automáticamente"
            className="flex-1 bg-gray-50"
            readOnly
          />
          <span className="text-sm text-gray-500">m²</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Se calcula automáticamente con peso y talla</p>
      </div>
    </div>
  );
}
