import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface InputWithUnitProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit: string;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  required?: boolean;
  readOnly?: boolean;
}

const InputWithUnit: React.FC<InputWithUnitProps> = ({
  id,
  label,
  value,
  onChange,
  unit,
  placeholder = "0",
  min = 0,
  max,
  required = false,
  readOnly = false,
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <div className="flex items-center gap-2 mt-1">
      <Input
        id={id}
        type="number"
        placeholder={placeholder}
        className="flex-1 mt-0"
        value={value}
        onChange={e => onChange(e.target.value)}
        min={min}
        max={max}
        required={required}
        readOnly={readOnly}
        disabled={readOnly}
      />
      <span className="text-sm text-gray-500">{unit}</span>
    </div>
  </div>
);

export default InputWithUnit;
