import React from "react";

interface Props {
  onBack: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  isLast?: boolean;
  className?: string;
}

const FormNavigationButtons: React.FC<Props> = ({
  onBack,
  onNext,
  onFinish,
  backLabel = "Volver",
  nextLabel = "Siguiente",
  finishLabel = "Crear resumen",
  isLast = false,
  className = "",
}) => (
  <div className={`flex justify-between mt-6 ${className}`}>
    <button type="button" className="btn btn-secondary" onClick={onBack}>
      {backLabel}
    </button>
    {isLast ? (
      <button
        type="button"
        className="btn btn-primary"
        onClick={onFinish}
      >
        {finishLabel}
      </button>
    ) : (
      <button type="button" className="btn btn-primary" onClick={onNext}>
        {nextLabel}
      </button>
    )}
  </div>
);

export default FormNavigationButtons;
