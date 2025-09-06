import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import { getInitialPatientData, getInitialMedidasVIData, getInitialVentriculosAuriculasData, getInitialValvulasData, getInitialDopplerVasosVenasData } from "./services/initialFormStates";
import type { DopplerVasosVenasData } from "./types/fifthForm/DopplerTisularData";
import type { ValvulasData } from "./types/fourthForm/ValvulasData";
import { useRapFromVci } from "./hooks/useRapFromVci";
import { generateWordReport } from "./services/reportExporter";
import { parseFechaLocal } from "../lib/dateUtils";
import { DatabaseService } from "../services/databaseService";


export default function PatientForm() {
  const { step, handleNext, handleBack } = usePatientFormSteps(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [examenId, setExamenId] = useState<number | null>(null);
  const [patientData, setPatientData] = useState<PatientData>(getInitialPatientData());
  const [medidasVIData, setMedidasVIData] = useState<MedidasVIData>(getInitialMedidasVIData());
  const [ventriculosAuriculasData, setVentriculosAuriculasData] = useState(
    getInitialVentriculosAuriculasData(getInitialMedidasVIData(), getInitialPatientData())
  );
  const [valvulasData, setValvulasData] = useState<ValvulasData>(getInitialValvulasData());
  const [dtvvData, setDtvvData] = useState<DopplerVasosVenasData>(getInitialDopplerVasosVenasData());

  // Pre-llenar datos si vienen de la agenda
  useEffect(() => {
    const ci = searchParams.get('ci');
    const nombres = searchParams.get('nombres');
    const fecha = searchParams.get('fecha');
    const examenIdParam = searchParams.get('examenId');

    // Guardar el ID del examen si viene en los parámetros
    if (examenIdParam) {
      setExamenId(parseInt(examenIdParam));
    }

    if (ci || nombres || fecha) {
      setPatientData(prev => ({
        ...prev,
        ...(ci && { ci }),
        ...(nombres && { nombresApellidos: nombres }),
        ...(fecha && { 
          fechaExamen: parseFechaLocal(fecha)
        })
      }));
    }
  }, [searchParams]);

  useSyncVentriculosAuriculasData(medidasVIData, patientData, setVentriculosAuriculasData);
  useAutoSuperficieCorporal(patientData, setPatientData, setVentriculosAuriculasData);
  useAutoEdad(patientData, setPatientData);
  useAutoMasaImviGrp(ventriculosAuriculasData, setVentriculosAuriculasData);

  useRapFromVci(dtvvData, setValvulasData);

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

  const handleVentanasChange = (ventanas: string[]) => {
    setPatientData((prev) => ({
      ...prev,
      ventanas,
    }));
  };

  // Export removed: the "Crear resumen" button won't trigger file generation for now

  const handleGenerateReport = async () => {
    try {
      await generateWordReport(
        patientData,
        medidasVIData,
        ventriculosAuriculasData,
        valvulasData,
        dtvvData
      );
      
      // Si hay un examenId, actualizar el estado a "completado"
      if (examenId) {
        try {
          const updateResult = await DatabaseService.updateExamen(examenId, { 
            estado: 'completado' 
          });
          
          if (updateResult.success) {
            console.log('Examen marcado como completado exitosamente');
          } else {
            console.error('Error al actualizar el estado del examen:', updateResult.error);
          }
        } catch (error) {
          console.error('Error al marcar el examen como completado:', error);
        }
      }
      
      // Mostrar mensaje de éxito y navegar de vuelta al dashboard
      alert('✅ Informe generado exitosamente. Regresando al dashboard...');
      
      // Pequeño delay para que el usuario pueda leer el mensaje
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Error al generar el informe Word:', error);
      
      // Si es un error de validación, el mensaje ya se mostró en generateWordReport
      if (error instanceof Error && error.message.includes('Validación fallida')) {
        return; // No mostrar mensaje adicional
      }
      
      // Para otros errores, mostrar mensaje genérico
      alert('❌ Error al generar el informe. Por favor, verifique que todos los campos obligatorios estén completos e inténtelo de nuevo.');
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
            Complete la información personal del paciente para el examen de ecocardiograma
          </p>
        </div>
        {step === 1 && (
          <StepDatosPersonales
            patientData={patientData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            handleVentanasChange={handleVentanasChange}
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
            onGenerateReport={handleGenerateReport}
          />
        )}
      </div>
    </div>
  );
}
