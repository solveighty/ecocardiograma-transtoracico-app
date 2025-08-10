import VentriculosAuriculasForm from "../VentriculosAuriculasForm";

export function StepVentriculosAuriculas({
  data,
  setData,
  handleNext,
  handleBack,
}: any) {
  return (
    <VentriculosAuriculasForm
      data={data}
      setData={setData}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
