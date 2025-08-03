import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Props {
  onCancel: () => void;
}

export default function BotonesAccionForm({ onCancel }: Props) {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        <Save className="h-4 w-4 mr-2" />
        Guardar Datos
      </Button>
    </div>
  );
}
