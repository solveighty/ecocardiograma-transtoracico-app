import DopplerTisularVasosVenasForm from "../DopplerTisularVasosVenasForm";

export function StepDopplerTisular({
  data,
  setData,
  mitralE,
  handleBack,
}: any) {
  return (
    <DopplerTisularVasosVenasForm
      data={data}
      setData={setData}
      mitralE={mitralE}
      onBack={handleBack}
    />
  );
}
