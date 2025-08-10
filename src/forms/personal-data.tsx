"use client";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { StepDatosPersonales } from "./steps/StepDatosPersonales";
import { StepMedidasVI } from "./steps/StepMedidasVI";
import { StepVentriculosAuriculas } from "./steps/StepVentriculosAuriculas";
import { StepValvulas } from "./steps/StepValvulas";
import { StepDopplerTisular } from "./steps/StepDopplerTisular";
import { MedidasVIData } from "./types/secondForm/MedidasVIData";
import { usePatientFormSteps } from "./hooks/usePatientFormSteps";
import { useSyncVentriculosAuriculasData } from "./hooks/useSyncVentriculosAuriculasData";
import { useAutoSuperficieCorporal } from "./hooks/useAutoSuperficieCorporal";
import { useAutoEdad } from "./hooks/useAutoEdad";
import { useAutoMasaImviGrp } from "./hooks/useAutoMasaImviGrp";
import { PatientData } from "./types/firstForm/PatientData";
import { getInitialPatientData, getInitialMedidasVIData, getInitialVentriculosAuriculasData } from "./services/initialFormStates";
import { getInitialValvulasData } from "./ValvulasForm";
import { getInitialDopplerVasosVenasData } from "./DopplerTisularVasosVenasForm";
import type { DopplerVasosVenasData } from "./types/fifthForm/DopplerTisularData";
import type { ValvulasData } from "./types/fourthForm/ValvulasData";

export default function PatientForm() {
  const { step, handleNext, handleBack } = usePatientFormSteps(1);
  const [patientData, setPatientData] = useState<PatientData>(getInitialPatientData());
  const [medidasVIData, setMedidasVIData] = useState<MedidasVIData>(getInitialMedidasVIData());
  const [ventriculosAuriculasData, setVentriculosAuriculasData] = useState(
    getInitialVentriculosAuriculasData(getInitialMedidasVIData(), getInitialPatientData())
  );
  const [valvulasData, setValvulasData] = useState<ValvulasData>(getInitialValvulasData());
  const [dtvvData, setDtvvData] = useState<DopplerVasosVenasData>(getInitialDopplerVasosVenasData());

  useSyncVentriculosAuriculasData(medidasVIData, patientData, setVentriculosAuriculasData);
  useAutoSuperficieCorporal(patientData, setPatientData, setVentriculosAuriculasData);
  useAutoEdad(patientData, setPatientData);
  useAutoMasaImviGrp(ventriculosAuriculasData, setVentriculosAuriculasData);

  // Auto-estimar RAP desde VCI (DT y colapso) y sincronizar con Tricúspide
  useEffect(() => {
    const toNum = (v?: string) => {
      const n = parseFloat((v ?? '').toString().replace(',', '.'));
      return Number.isFinite(n) ? n : undefined;
    };
    const dt = toNum(dtvvData?.vci?.dt);
    const col = toNum(dtvvData?.vci?.colapso);
    if (dt === undefined || col === undefined) return;
    // Criterios ASE habituales
    // IVC < 21 mm y colapso > 50% => RAP 3 mmHg
    // IVC > 21 mm y colapso < 50% => RAP 15 mmHg
    // Intermedio => RAP 8 mmHg
    let rapSuggested = 8;
    if (dt < 21 && col >= 50) rapSuggested = 3;
    else if (dt > 21 && col < 50) rapSuggested = 15;
    setValvulasData(prev => ({
      ...prev,
      tricuspide: { ...prev.tricuspide, rap: String(rapSuggested) }
    }));
  }, [dtvvData?.vci?.dt, dtvvData?.vci?.colapso]);

  const handleInputChange = (field: string | number | symbol, value: string) => {
    setPatientData((prev) => ({
      ...prev,
      [field as keyof PatientData]: value,
    }));
  };

  const handleDateChange = (
    field: string | number | symbol,
    date: Date | undefined
  ) => {
    setPatientData((prev) => ({
      ...prev,
      [field as keyof PatientData]: date,
    }));
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
            Complete la información personal del paciente para el examen de ecocardiograma
          </p>
        </div>
        {step === 1 && (
          <StepDatosPersonales
            patientData={patientData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            handleNext={handleNext}
          />
        )}
        {step === 2 && (
          <StepMedidasVI
            medidasVIData={medidasVIData}
            setMedidasVIData={setMedidasVIData}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
        {step === 3 && (
          <StepVentriculosAuriculas
            data={ventriculosAuriculasData}
            setData={setVentriculosAuriculasData}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
        {step === 4 && (
          <StepValvulas
            data={valvulasData}
            setData={setValvulasData}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
        {step === 5 && (
          <StepDopplerTisular
            data={dtvvData}
            setData={setDtvvData}
            mitralE={valvulasData.mitral.ondaE}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
