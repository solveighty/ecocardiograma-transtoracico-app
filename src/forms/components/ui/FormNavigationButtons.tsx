import React from "react";

interface Props {
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  className?: string;
}

const FormNavigationButtons: React.FC<Props> = ({
  onBack,
  onNext,
  backLabel = "Volver",
  nextLabel = "Siguiente",
  className = "",
}) => (
  <div className={`flex justify-between mt-6 ${className}`}>
    <button type="button" className="btn btn-secondary" onClick={onBack}>
      {backLabel}
    </button>
    <button type="button" className="btn btn-primary" onClick={onNext}>
      {nextLabel}
    </button>
  </div>
);

export default FormNavigationButtons;
