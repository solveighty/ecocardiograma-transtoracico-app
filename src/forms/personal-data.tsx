"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Save, User, Heart } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PatientData {
  nombresApellidos: string;
  edad: string;
  sexo: string;
  ci: string;
  fechaNacimiento: Date | undefined;
  peso: string;
  talla: string;
  superficieCorporal: string;
  ventana: string;
  ritmo: string;
  frecuenciaCardiaca: string;
  fechaExamen: Date | undefined;
}

export default function PatientForm() {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientData>({
    nombresApellidos: "",
    edad: "",
    sexo: "",
    ci: "",
    fechaNacimiento: undefined,
    peso: "",
    talla: "",
    superficieCorporal: "",
    ventana: "",
    ritmo: "",
    frecuenciaCardiaca: "",
    fechaExamen: new Date(),
  });

  // Calcular superficie corporal automáticamente (Fórmula de Mosteller)
  useEffect(() => {
    if (patientData.peso && patientData.talla) {
      const peso = Number.parseFloat(patientData.peso);
      const talla = Number.parseFloat(patientData.talla);
      if (peso > 0 && talla > 0) {
        const sc = Math.sqrt((peso * talla) / 3600);
        setPatientData((prev) => ({
          ...prev,
          superficieCorporal: sc.toFixed(2),
        }));
      }
    }
  }, [patientData.peso, patientData.talla]);

  // Calcular edad automáticamente basada en fecha de nacimiento
  useEffect(() => {
    if (patientData.fechaNacimiento) {
      const today = new Date();
      const birthDate = new Date(patientData.fechaNacimiento);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      setPatientData((prev) => ({
        ...prev,
        edad: age.toString(),
      }));
    }
  }, [patientData.fechaNacimiento]);

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (
    field: keyof PatientData,
    date: Date | undefined
  ) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del paciente:", patientData);
    // Aquí puedes agregar la lógica para guardar los datos
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            Datos del Paciente
          </h1>
          <p className="text-gray-600 mt-2">
            Complete la información personal del paciente para el examen de
            ecocardiograma
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
                  <Label
                    htmlFor="nombresApellidos"
                    className="text-sm font-medium"
                  >
                    Nombres y apellidos: <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nombresApellidos"
                    value={patientData.nombresApellidos}
                    onChange={(e) =>
                      handleInputChange("nombresApellidos", e.target.value)
                    }
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
                      onChange={(e) =>
                        handleInputChange("edad", e.target.value)
                      }
                      placeholder="0"
                      className="flex-1"
                      min="0"
                      max="120"
                      required
                    />
                    <span className="text-sm text-gray-500">años</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="sexo" className="text-sm font-medium">
                    Sexo: <span className="text-red-500">*</span>
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

                <div>
                  <Label htmlFor="ci" className="text-sm font-medium">
                    CI: <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ci"
                    value={patientData.ci}
                    onChange={(e) => handleInputChange("ci", e.target.value)}
                    placeholder="Cédula de identidad"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              {/* Fecha de Nacimiento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    FN (Fecha de Nacimiento):{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !patientData.fechaNacimiento &&
                            "text-muted-foreground"
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
                        onSelect={(date) =>
                          handleDateChange("fechaNacimiento", date)
                        }
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
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
                        onSelect={(date) =>
                          handleDateChange("fechaExamen", date)
                        }
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Peso, Talla, SC */}
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
                      onChange={(e) =>
                        handleInputChange("peso", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleInputChange("talla", e.target.value)
                      }
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
                  <p className="text-xs text-gray-500 mt-1">
                    Se calcula automáticamente con peso y talla
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                DATOS DEL EXAMEN
              </CardTitle>
              <CardDescription>
                Información específica del ecocardiograma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ventana, Ritmo, FC */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ventana" className="text-sm font-medium">
                    Ventana: <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={patientData.ventana}
                    onValueChange={(value) =>
                      handleInputChange("ventana", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar ventana" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paraesternal">Paraesternal</SelectItem>
                      <SelectItem value="apical">Apical</SelectItem>
                      <SelectItem value="subcostal">Subcostal</SelectItem>
                      <SelectItem value="supraesternal">
                        Supraesternal
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ritmo" className="text-sm font-medium">
                    Ritmo: <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={patientData.ritmo}
                    onValueChange={(value) => handleInputChange("ritmo", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar ritmo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sinusal">Sinusal</SelectItem>
                      <SelectItem value="fibrilacion_auricular">
                        Fibrilación Auricular
                      </SelectItem>
                      <SelectItem value="taquicardia">Taquicardia</SelectItem>
                      <SelectItem value="bradicardia">Bradicardia</SelectItem>
                      <SelectItem value="arritmia">Arritmia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fc" className="text-sm font-medium">
                    FC (Frecuencia Cardíaca):{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="fc"
                      type="number"
                      value={patientData.frecuenciaCardiaca}
                      onChange={(e) =>
                        handleInputChange("frecuenciaCardiaca", e.target.value)
                      }
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

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Cancelar
          </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Guardar Datos
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
