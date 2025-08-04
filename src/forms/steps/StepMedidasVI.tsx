import MedidasVIForm from "../MedidasVIForm";

export function StepMedidasVI({ medidasVIData, setMedidasVIData, handleNext, handleBack }: any) {
  return (
    <MedidasVIForm
      medidasVIData={medidasVIData}
      setMedidasVIData={setMedidasVIData}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
