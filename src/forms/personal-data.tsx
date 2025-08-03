"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "lucide-react";
import DatosPersonalesForm from "./components/DatosPersonalesForm";
import PesoTallaSCForm from "./components/PesoTallaSCForm";
import DatosExamenForm from "./components/DatosExamenForm";
import BotonesAccionForm from "./components/BotonesAccionForm";

export interface PatientData {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    const result = await window.electronAPI.guardarPaciente(patientData);
    if (result.success) {
      alert("Datos guardados correctamente en: " + result.filePath);
    } else {
      alert("Error al guardar: " + result.error);
    }
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
          <DatosPersonalesForm
            patientData={patientData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
          />
          <PesoTallaSCForm
            patientData={patientData}
            handleInputChange={handleInputChange}
          />
          <DatosExamenForm
            patientData={patientData}
            handleInputChange={handleInputChange}
          />
          <BotonesAccionForm onCancel={() => navigate("/")} />
        </form>
      </div>
    </div>
  );
}
