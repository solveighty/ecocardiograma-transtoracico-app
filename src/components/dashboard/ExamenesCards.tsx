import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  useExamenesPendientes, 
  useExamenesCompletados, 
  useExamenesHoy 
} from "@/hooks/useExamenes";
import { RefreshCw, User, Calendar, Clock } from "lucide-react";
import { Examen } from "@/types/database";

interface ExamenListItemProps {
  examen: Examen;
}

const ExamenListItem = ({ examen }: ExamenListItemProps) => {
  const fecha = new Date(examen.fecha);
  const fechaFormateada = fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const horaFormateada = fecha.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'default';
      case 'pendiente':
        return 'secondary';
      case 'cancelado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{examen.paciente?.nombres}</span>
          <span className="text-sm text-gray-500">CI: {examen.paciente?.ci}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{fechaFormateada}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{horaFormateada}</span>
          </div>
        </div>
        {examen.diagnostico && (
          <p className="text-sm text-gray-700 mt-1 truncate">{examen.diagnostico}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={getEstadoBadgeVariant(examen.estado)}>
          {examen.estado}
        </Badge>
      </div>
    </div>
  );
};

export const ExamenesHoyCard = () => {
  const { examenes, loading, error, refresh } = useExamenesHoy();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Exámenes de Hoy</CardTitle>
        <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : examenes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay exámenes programados para hoy</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {examenes.map((examen) => (
              <ExamenListItem key={examen.id} examen={examen} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ExamenesPendientesCard = () => {
  const { examenes, loading, error, refresh } = useExamenesPendientes();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Exámenes Pendientes</CardTitle>
        <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : examenes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay exámenes pendientes</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {examenes.map((examen) => (
              <ExamenListItem key={examen.id} examen={examen} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ExamenesCompletadosCard = () => {
  const { examenes, loading, error, refresh } = useExamenesCompletados();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Exámenes Completados</CardTitle>
        <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : examenes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay exámenes completados</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {examenes.slice(0, 10).map((examen) => (
              <ExamenListItem key={examen.id} examen={examen} />
            ))}
            {examenes.length > 10 && (
              <p className="text-sm text-gray-500 text-center">
                Y {examenes.length - 10} más...
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
