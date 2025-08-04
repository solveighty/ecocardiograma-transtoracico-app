import { useState } from "react";

export function usePatientFormSteps(initialStep: number = 1) {
  const [step, setStep] = useState(initialStep);
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  return { step, setStep, handleNext, handleBack };
}
