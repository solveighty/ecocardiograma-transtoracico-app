import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

import type { PatientData } from "@/forms/types/firstForm/PatientData";
interface Props {
  patientData: PatientData;
  handleInputChange: (field: keyof PatientData, value: string) => void;
  handleDateChange: (field: keyof PatientData, date: Date | undefined) => void;
}

export default function DatosPersonalesForm({
  patientData,
  handleInputChange,
  handleDateChange,
}: Props) {
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
                // Solo permitir letras, espacios y tildes - sin números ni símbolos especiales
                let value = e.target.value.replace(
                  /[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g,
                  ""
                );
                handleInputChange("nombresApellidos", value);
              }}
              onKeyPress={(e) => {
                // Prevenir la entrada de números y símbolos especiales
                if (!/[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="Ingrese nombres y apellidos completos (solo letras)"
              className="mt-1"
              required
            />
          </div>
        </div>
        {/* Edad, Sexo, CI, HCL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edad" className="text-sm font-medium">
              Edad:
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="edad"
                type="number"
                placeholder="Edad en años"
                className="flex-1"
                value={patientData.edad}
                onChange={(e) => {
                  // Validar entrada numérica para edad (0-150)
                  const value = e.target.value;
                  if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 150)) {
                    handleInputChange("edad", value);
                  }
                }}
                min={0}
                max={150}
              />
              <span className="text-sm text-gray-500">años</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Se calcula automáticamente con fecha de nacimiento, o ingrese manualmente
            </p>
          </div>
          <div>
            <Label htmlFor="sexo" className="text-sm font-medium">
              Sexo:
            </Label>
            <Select
              value={patientData.sexo}
              onValueChange={(value) => handleInputChange("sexo", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="femenino">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ci" className="text-sm font-medium">
              CI: <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ci"
              value={patientData.ci}
              onChange={(e) => {
                // Solo permitir números y máximo 10 dígitos
                let value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length <= 10) {
                  handleInputChange("ci", value);
                }
              }}
              onKeyPress={(e) => {
                // Prevenir la entrada de cualquier carácter que no sea número
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                  e.preventDefault();
                }
                // Prevenir más de 10 dígitos
                if (patientData.ci.length >= 10 && /[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="Cédula de identidad (10 dígitos)"
              className={`mt-1 ${patientData.ci.length > 0 && patientData.ci.length !== 10 ? 'border-red-500' : ''}`}
              maxLength={10}
              type="text"
              inputMode="numeric"
              pattern="[0-9]{10}"
              required
            />
            {patientData.ci.length > 0 && patientData.ci.length !== 10 && (
              <p className="text-red-500 text-xs mt-1">La cédula debe tener exactamente 10 dígitos</p>
            )}
          </div>
          <div>
            <Label htmlFor="hcl" className="text-sm font-medium">
              HCL (Historia Clínica):
            </Label>
            <Input
              id="hcl"
              value={patientData.hcl}
              onChange={(e) => handleInputChange("hcl", e.target.value)}
              placeholder="Número de historia clínica"
              className="mt-1"
            />
          </div>
        </div>
        {/* Fecha de Nacimiento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">
              FN (Fecha de Nacimiento):
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
                    format(patientData.fechaNacimiento, "dd/MM/yyyy", {
                      locale: es,
                    })
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
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
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
                    format(patientData.fechaExamen, "dd/MM/yyyy", {
                      locale: es,
                    })
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
