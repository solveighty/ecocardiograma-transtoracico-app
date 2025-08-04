"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "lucide-react";

import DatosPersonalesForm from "./components/personal-data/DatosPersonalesForm";
import PesoTallaSCForm from "./components/personal-data/PesoTallaSCForm";
import DatosExamenForm from "./components/personal-data/DatosExamenForm";
import BotonesAccionForm from "./components/personal-data/BotonesAccionForm";
import MedidasVIForm, { MedidasVIData } from "./MedidasVIForm";
import VentriculosAuriculasForm from "./VentriculosAuriculasForm";
import {
  calcMasaVI,
  calcIMVI,
  calcGRP,
  calcCAF,
  calcIE,
  calcRelacionVDVI,
  calcVolAI,
  calcVolIndex
} from "./services/ventriculosAuriculasCalculos";
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

  const [ventriculosAuriculasData, setVentriculosAuriculasData] = useState({
    // Ventrículo Izquierdo
    ddfvi: medidasVIData.ddfvi,
    gdsept: medidasVIData.gdsept,
    gdpil: medidasVIData.gdpil,
    masa: "",
    imvi: "",
    grp: "",
    mapse: "",
    tiempoDPDT: "",
    dpdt: "",
    // Ventrículo Derecho
    basal: "",
    basalSistolico: "",
    caf: "",
    medio: "",
    ie: "",
    long: "",
    relacionVdVi: "",
    tapse: "",
    medidaVI: "",
    // Aurícula Izquierda
    dai: "",
    areaAi: "",
    areaAi2C: "",
    volAi: "",
    volIndexAi: "",
    superficieCorporal: patientData.superficieCorporal,
    // Aurícula Derecha
    dmAd: "",
    areaAd: "",
  });

  // Sincronizar datos base para cálculos automáticos en el formulario de ventrículos y aurículas
  useEffect(() => {
    setVentriculosAuriculasData((prev) => ({
      ...prev,
      ddfvi: medidasVIData.ddfvi,
      gdsept: medidasVIData.gdsept,
      gdpil: medidasVIData.gdpil,
      superficieCorporal: patientData.superficieCorporal,
    }));
  }, [medidasVIData.ddfvi, medidasVIData.gdsept, medidasVIData.gdpil, patientData.superficieCorporal]);

  // Calcular superficie corporal automáticamente (Du Bois) y propagar a los índices dependientes
  useEffect(() => {
    const sc = calcularSuperficieCorporal(patientData.peso, patientData.talla);
    setPatientData((prev) => ({
      ...prev,
      superficieCorporal: sc || "",
    }));
    setVentriculosAuriculasData((prev) => {
      // Recalcular IMVI y Vol Index si hay masa y volAi
      const imvi = calcIMVI({ masaVI: prev.masa, superficieCorporal: sc || "" });
      const volIndexAi = calcVolIndex(prev.volAi, sc || "");
      return {
        ...prev,
        superficieCorporal: sc || "",
        imvi,
        volIndexAi,
      };
    });
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

  // Recalcular masa, imvi y grp automáticamente cuando cambian los valores relevantes
  useEffect(() => {
    const masa = calcMasaVI({
      ddfvi: ventriculosAuriculasData.ddfvi,
      gdsept: ventriculosAuriculasData.gdsept,
      gdpil: ventriculosAuriculasData.gdpil,
    });
    const imvi = calcIMVI({
      masaVI: masa,
      superficieCorporal: ventriculosAuriculasData.superficieCorporal,
    });
    const grp = calcGRP(
      ventriculosAuriculasData.gdsept,
      ventriculosAuriculasData.gdpil,
      ventriculosAuriculasData.ddfvi
    );
    setVentriculosAuriculasData((prev) => ({
      ...prev,
      masa,
      imvi,
      grp,
    }));
  }, [ventriculosAuriculasData.ddfvi, ventriculosAuriculasData.gdsept, ventriculosAuriculasData.gdpil, ventriculosAuriculasData.superficieCorporal]);

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
  const handleNext = () => {
    // Si estamos en el paso de Ventrículos y Aurículas, calcular y asignar los valores automáticos antes de avanzar
    if (step === 2) {
      setVentriculosAuriculasData((prev) => {
        // Masa VI
        const masa = calcMasaVI({
          ddfvi: medidasVIData.ddfvi,
          gdsept: medidasVIData.gdsept,
          gdpil: medidasVIData.gdpil,
        });
        // IMVI
        const imvi = calcIMVI({
          masaVI: masa,
          superficieCorporal: patientData.superficieCorporal,
        });
        // GRP
        const grp = calcGRP(medidasVIData.gdsept, medidasVIData.gdpil, medidasVIData.ddfvi);
        // IE
        const ie = calcIE(prev.basal, prev.long);
        // CAF (requiere VDdiastólico y VDsistólico, aquí asumimos basal y medio como ejemplo)
        const caf = calcCAF(prev.basal, prev.medio);
        // Relación VD/VI (basal VD / basal VI)
        const relacionVdVi = calcRelacionVDVI(prev.basal, medidasVIData.ddfvi);
        // Volumen AI (requiere área4C, área2C, long)
        const volAi = calcVolAI(prev.areaAi, prev.areaAd, prev.long);
        // Vol Index AI
        const volIndexAi = calcVolIndex(volAi, patientData.superficieCorporal);
        return {
          ...prev,
          masa,
          imvi,
          grp,
          ie,
          caf,
          relacionVdVi,
          volAi,
          volIndexAi,
        };
      });
    }
    setStep((prev) => prev + 1);
  };
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
        {step === 3 && (
          <VentriculosAuriculasForm
            data={ventriculosAuriculasData}
            setData={setVentriculosAuriculasData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
