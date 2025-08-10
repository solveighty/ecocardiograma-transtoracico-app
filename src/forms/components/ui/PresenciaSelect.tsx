import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export const PRESENCIA_OPTIONS = [
  { value: 'ausente', label: 'Ausente' },
  { value: 'presente', label: 'Presente' },
  { value: 'no_evaluado', label: 'No evaluado' },
];

interface Props {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const PresenciaSelect: React.FC<Props> = ({ id, label = 'Presencia', value, onChange, required }) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Select value={value} onValueChange={onChange} required={required}>
      <SelectTrigger id={id} className="w-full mt-1" >
        <SelectValue placeholder="Seleccione" />
      </SelectTrigger>
      <SelectContent>
        {PRESENCIA_OPTIONS.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default PresenciaSelect;
