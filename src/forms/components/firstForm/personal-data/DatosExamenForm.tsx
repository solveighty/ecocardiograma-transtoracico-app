import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";

import type { PatientData } from "@/forms/types/firstForm/PatientData";
interface Props {
  patientData: PatientData;
  handleInputChange: (field: keyof PatientData, value: string) => void;
}

export default function DatosExamenForm({ patientData, handleInputChange }: Props) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-600" />
          DATOS DEL EXAMEN
        </CardTitle>
        <CardDescription>Información específica del ecocardiograma</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="ventana" className="text-sm font-medium">
              Ventana: <span className="text-red-500">*</span>
            </Label>
            <Select value={patientData.ventana} onValueChange={(value) => handleInputChange("ventana", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar ventana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paraesternal">Paraesternal</SelectItem>
                <SelectItem value="apical">Apical</SelectItem>
                <SelectItem value="subcostal">Subcostal</SelectItem>
                <SelectItem value="supraesternal">Supraesternal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ritmo" className="text-sm font-medium">
              Ritmo: <span className="text-red-500">*</span>
            </Label>
            <Select value={patientData.ritmo} onValueChange={(value) => handleInputChange("ritmo", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar ritmo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sinusal">Sinusal</SelectItem>
                <SelectItem value="fibrilacion_auricular">Fibrilación Auricular</SelectItem>
                <SelectItem value="taquicardia">Taquicardia</SelectItem>
                <SelectItem value="bradicardia">Bradicardia</SelectItem>
                <SelectItem value="arritmia">Arritmia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="fc" className="text-sm font-medium">
              FC (Frecuencia Cardíaca): <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="fc"
                type="number"
                value={patientData.frecuenciaCardiaca}
                onChange={(e) => handleInputChange("frecuenciaCardiaca", e.target.value)}
                placeholder="0"
                className="flex-1"
                min="0"
                max="300"
                required
              />
              <span className="text-sm text-gray-500">lpm</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
