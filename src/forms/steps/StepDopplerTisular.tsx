import DopplerTisularVasosVenasForm from "../DopplerTisularVasosVenasForm";

export function StepDopplerTisular({
  data,
  setData,
  mitralE,
  handleNext,
  handleBack,
}: any) {
  return (
    <DopplerTisularVasosVenasForm
      data={data}
      setData={setData}
      mitralE={mitralE}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
