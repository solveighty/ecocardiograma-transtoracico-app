import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const REGURGITACION_OPTIONS = [
  { value: "none", label: "Ninguna" },
  { value: "+", label: "Leve (+)" },
  { value: "++", label: "Moderada (++)" },
  { value: "+++", label: "Moderada-severa (+++)" },
  { value: "++++", label: "Severa (++++)" },
];

interface Props {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const RegurgitacionSelect: React.FC<Props> = ({
  id,
  label = "Reg (grado)",
  value,
  onChange,
  required,
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Select
      value={value || "none"}
      onValueChange={onChange}
      required={required}
    >
      <SelectTrigger id={id} className="w-full mt-1">
        <SelectValue placeholder="Seleccione grado" />
      </SelectTrigger>
      <SelectContent>
        {REGURGITACION_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default RegurgitacionSelect;
