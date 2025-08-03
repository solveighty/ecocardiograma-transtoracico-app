import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface ReadOnlyWithUnitProps {
  label: string;
  value: string;
  unit: string;
  placeholder?: string;
}

const ReadOnlyWithUnit: React.FC<ReadOnlyWithUnitProps> = ({
  label,
  value,
  unit,
  placeholder = "Calculado",
}) => (
  <div>
    <Label>{label}</Label>
    <div className="flex items-center gap-2 mt-1">
      <Input value={value} readOnly className="bg-gray-100" placeholder={placeholder} />
      <span className="text-sm text-gray-500">{unit}</span>
    </div>
  </div>
);

export default ReadOnlyWithUnit;
