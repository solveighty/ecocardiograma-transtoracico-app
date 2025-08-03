import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

import type { PatientData } from "../../personal-data";
interface Props {
  patientData: PatientData;
  handleInputChange: (field: keyof PatientData, value: string) => void;
  handleDateChange: (field: keyof PatientData, date: Date | undefined) => void;
}

export default function DatosPersonalesForm({ patientData, handleInputChange, handleDateChange }: Props) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          DATOS PERSONALES
        </CardTitle>
        <CardDescription>Información básica del paciente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="nombresApellidos" className="text-sm font-medium">
              Nombres y apellidos: <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombresApellidos"
              value={patientData.nombresApellidos}
              onChange={(e) => {
                // Solo permitir letras, espacios y tildes
                let value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s']/g, "");
                handleInputChange("nombresApellidos", value);
              }}
              placeholder="Ingrese nombres y apellidos completos"
              className="mt-1"
              required
            />
          </div>
        </div>
        {/* Edad, Sexo, CI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="edad" className="text-sm font-medium">
              Edad: <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="edad"
                type="number"
                value={patientData.edad}
                readOnly
                placeholder="0"
                className="flex-1 bg-gray-50 cursor-not-allowed"
                min="0"
                max="99"
                maxLength={2}
                tabIndex={-1}
              />
              <span className="text-sm text-gray-500">años</span>
            </div>
          </div>
          <div>
            <Label htmlFor="sexo" className="text-sm font-medium">
              Sexo: <span className="text-red-500">*</span>
            </Label>
            <Select value={patientData.sexo} onValueChange={(value) => handleInputChange("sexo", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="femenino">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ci" className="text-sm font-medium">
              CI: <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ci"
              value={patientData.ci}
              onChange={(e) => {
                let value = e.target.value;
                if (value.length > 10) value = value.slice(0, 10);
                // Solo permitir hasta 10 caracteres
                const match = value.match(/^\d{0,10}$/);
                if (match) {
                  handleInputChange("ci", value);
                }
              }}
              placeholder="Cédula de identidad"
              className="mt-1"
              maxLength={10}
              minLength={10}
              required
            />
          </div>
        </div>
        {/* Fecha de Nacimiento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">
              FN (Fecha de Nacimiento): <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !patientData.fechaNacimiento && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {patientData.fechaNacimiento ? (
                    format(patientData.fechaNacimiento, "dd/MM/yyyy", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={patientData.fechaNacimiento}
                  onSelect={(date) => handleDateChange("fechaNacimiento", date)}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-sm font-medium">
              Fecha del Examen: <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !patientData.fechaExamen && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {patientData.fechaExamen ? (
                    format(patientData.fechaExamen, "dd/MM/yyyy", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={patientData.fechaExamen}
                  onSelect={(date) => handleDateChange("fechaExamen", date)}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
