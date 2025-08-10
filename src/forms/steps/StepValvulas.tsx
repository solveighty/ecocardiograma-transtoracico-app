import ValvulasForm from "../ValvulasForm";

export function StepValvulas({ data, setData, handleNext, handleBack }: any) {
  return (
    <ValvulasForm data={data} setData={setData} onNext={handleNext} onBack={handleBack} />
  );
}
