"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "lucide-react";

import DatosPersonalesForm from "./components/personal-data/DatosPersonalesForm";
import PesoTallaSCForm from "./components/personal-data/PesoTallaSCForm";
import DatosExamenForm from "./components/personal-data/DatosExamenForm";
import BotonesAccionForm from "./components/personal-data/BotonesAccionForm";
import MedidasVIForm, { MedidasVIData } from "./MedidasVIForm";
import { calcularSuperficieCorporal, calcularEdad } from "./services/personalData";

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
  const [step, setStep] = useState(1);
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
  const [medidasVIData, setMedidasVIData] = useState<MedidasVIData>({
    ddfvi: "",
    dsfvi: "",
    gdsept: "",
    gdpil: "",
    rao: "",
    vdfLineal: "",
    vsfLineal: "",
    vdfSimpson: "",
    vsfSimpson: "",
  });

  // Calcular superficie corporal automáticamente (Fórmula de Mosteller)
  useEffect(() => {
    const sc = calcularSuperficieCorporal(patientData.peso, patientData.talla);
    if (sc) {
      setPatientData((prev) => ({
        ...prev,
        superficieCorporal: sc,
      }));
    }
  }, [patientData.peso, patientData.talla]);

  // Calcular edad automáticamente basada en fecha de nacimiento
  useEffect(() => {
    if (patientData.fechaNacimiento) {
      const edad = calcularEdad(patientData.fechaNacimiento);
      setPatientData((prev) => ({
        ...prev,
        edad,
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


  // Avanzar al siguiente paso
  const handleNext = () => setStep((prev) => prev + 1);
  // Volver atrás
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            Datos del Paciente
          </h1>
          <p className="text-gray-600 mt-2">
            Complete la información personal del paciente para el examen de ecocardiograma
          </p>
        </div>
        {step === 1 && (
          <form onSubmit={e => { e.preventDefault(); handleNext(); }}>
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
            <div className="flex justify-between mt-6">
              <BotonesAccionForm onCancel={() => navigate("/")} />
              <button type="submit" className="btn btn-primary">Siguiente</button>
            </div>
          </form>
        )}
        {step === 2 && (
          <MedidasVIForm
            medidasVIData={medidasVIData}
            setMedidasVIData={setMedidasVIData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
