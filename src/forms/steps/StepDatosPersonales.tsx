import DatosPersonalesForm from "../components/firstForm/personal-data/DatosPersonalesForm";
import PesoTallaSCForm from "../components/firstForm/personal-data/PesoTallaSCForm";
import DatosExamenForm from "../components/firstForm/personal-data/DatosExamenForm";
import BotonesAccionForm from "../components/firstForm/personal-data/BotonesAccionForm";
import { useNavigate } from "react-router-dom";

export function StepDatosPersonales({ patientData, handleInputChange, handleDateChange, handleNext }: any) {
  const navigate = useNavigate();
  return (
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
  );
}
