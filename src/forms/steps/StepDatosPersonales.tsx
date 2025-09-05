import React from "react";
import DatosPersonalesForm from "../components/firstForm/personal-data/DatosPersonalesForm";
import PesoTallaSCForm from "../components/firstForm/personal-data/PesoTallaSCForm";
import DatosExamenForm from "../components/firstForm/personal-data/DatosExamenForm";
import { useNavigate } from "react-router-dom";

export function StepDatosPersonales({
  patientData,
  handleInputChange,
  handleDateChange,
  handleVentanasChange,
  handleNext,
}: any) {
  const navigate = useNavigate();
  
  const isFormValid = () => {
    return (
      patientData.nombresApellidos.trim() !== "" &&
      patientData.ci.length === 10 &&
      patientData.fechaExamen
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Por favor complete todos los campos obligatorios correctamente:\n- Nombres y apellidos (solo letras)\n- CI (exactamente 10 dígitos)\n- Fecha del examen");
      return;
    }
    handleNext();
  };

  return (
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
        handleVentanasChange={handleVentanasChange}
      />
      <div className="flex justify-between mt-6">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className={`btn btn-primary ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isFormValid()}
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}
