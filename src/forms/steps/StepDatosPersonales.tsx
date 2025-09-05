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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
    >
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
        <button type="submit" className="btn btn-primary">
          Siguiente
        </button>
      </div>
    </form>
  );
}
