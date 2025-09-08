import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Calculator, Edit3 } from "lucide-react";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit: string;
  calculatedValue?: string;
  canCalculate?: boolean;
  onToggleMode?: () => void;
  isManualMode?: boolean;
  placeholder?: string;
}

const InputWithAutoCalculation: React.FC<Props> = ({
  id,
  label,
  value,
  onChange,
  unit,
  calculatedValue = "",
  canCalculate = false,
  onToggleMode,
  isManualMode = false,
  placeholder = "0"
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleUseCalculated = () => {
    if (calculatedValue) {
      setLocalValue(calculatedValue);
      onChange(calculatedValue);
    }
  };

  const showCalculatedOption = canCalculate && calculatedValue && calculatedValue !== value;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {canCalculate && (
          <span className="ml-2 text-xs text-gray-500">
            {isManualMode ? "(manual)" : "(automático)"}
          </span>
        )}
      </label>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            id={id}
            value={localValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pr-12"
            readOnly={!isManualMode && canCalculate}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
            {unit}
          </span>
        </div>
        
        {canCalculate && onToggleMode && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleMode}
            title={isManualMode ? "Cambiar a cálculo automático" : "Cambiar a entrada manual"}
          >
            {isManualMode ? <Calculator className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {showCalculatedOption && isManualMode && (
        <div className="flex items-center justify-between text-xs text-gray-600 bg-blue-50 p-2 rounded">
          <span>Valor calculado: {calculatedValue} {unit}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleUseCalculated}
            className="h-6 px-2 text-xs"
          >
            Usar
          </Button>
        </div>
      )}
    </div>
  );
};

export default InputWithAutoCalculation;
