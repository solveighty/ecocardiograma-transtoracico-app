import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  useExamenesPendientes, 
  useExamenesCompletados, 
  useExamenesHoy 
} from "@/hooks/useExamenes";
import { User, Calendar, Clock, FileText, Trash2 } from "lucide-react";
import { Examen } from "@/types/database";
import { useNavigate } from "react-router-dom";
import { formatearFechaParaUI } from "@/lib/dateUtils";
import { RefreshCallbacks } from "@/hooks/useGlobalRefresh";
import { useEffect } from "react";

interface ExamenCardProps {
  registerRefreshCallback?: (callbacks: RefreshCallbacks) => void;
}

interface ExamenListItemProps {
  examen: Examen;
  showLlenarDatos?: boolean;
  onDelete?: (id: number) => void;
}

const ExamenListItem = ({ examen, showLlenarDatos = false, onDelete }: ExamenListItemProps) => {
  const navigate = useNavigate();
  
  const handleLlenarDatos = () => {
    // Navegar al formulario con los datos del paciente pre-cargados
    const searchParams = new URLSearchParams({
      ci: examen.paciente?.ci || '',
      nombres: examen.paciente?.nombres || '',
      fecha: examen.fecha,
      examenId: examen.id?.toString() || ''
    });
    navigate(`/ecocardiograma?${searchParams.toString()}`);
  };

  const handleDelete = () => {
    if (examen.id && window.confirm(`¿Está seguro de que desea eliminar la cita de ${examen.paciente?.nombres}?`)) {
      onDelete?.(examen.id);
    }
  };
  const fecha = new Date(examen.fecha);
  const fechaFormateada = formatearFechaParaUI(examen.fecha);
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
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <User className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-lg text-gray-900">{examen.paciente?.nombres}</span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            CI: {examen.paciente?.ci}
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-600" />
            <span className="font-medium">{fechaFormateada}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="font-medium">{horaFormateada}</span>
          </div>
        </div>
        {examen.diagnostico && (
          <p className="text-sm text-gray-700 italic bg-gray-50 p-2 rounded border-l-4 border-blue-200">
            {examen.diagnostico}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 ml-4">
        <Badge variant={getEstadoBadgeVariant(examen.estado)} className="text-sm py-1 px-3">
          {examen.estado}
        </Badge>
        {showLlenarDatos && examen.estado === 'pendiente' && (
          <Button
            size="sm"
            onClick={handleLlenarDatos}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
          >
            <FileText className="h-4 w-4 mr-2" />
            Llenar Datos
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            className="px-3 py-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export const ExamenesHoyCard = ({ registerRefreshCallback }: ExamenCardProps = {}) => {
  const { examenes, loading, error, refresh, deleteExamen } = useExamenesHoy();

  // Registrar el callback de refresh cuando el componente se monta
  useEffect(() => {
    if (registerRefreshCallback) {
      registerRefreshCallback({
        refreshExamenesHoy: () => refresh()
      });
    }
  }, [registerRefreshCallback, refresh]); // Incluir refresh para que se actualice cuando cambie

  const handleDeleteExamen = async (id: number) => {
    try {
      await deleteExamen(id);
    } catch (err) {
      console.error('Error al eliminar examen:', err);
      // El error ya se maneja en el hook
    }
  };

  return (
    <Card className="h-fit min-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold text-gray-900">Exámenes de Hoy</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            {examenes.length} {examenes.length === 1 ? 'examen programado' : 'exámenes programados'}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : examenes.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No hay exámenes programados para hoy</p>
            <p className="text-gray-400 text-sm">Los nuevos exámenes aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {examenes.map((examen) => (
              <ExamenListItem 
                key={examen.id} 
                examen={examen} 
                showLlenarDatos={true} 
                onDelete={handleDeleteExamen}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ExamenesPendientesCard = ({ registerRefreshCallback }: ExamenCardProps = {}) => {
  const { examenes, loading, error, refresh } = useExamenesPendientes();

  // Registrar el callback de refresh cuando el componente se monta
  useEffect(() => {
    if (registerRefreshCallback) {
      registerRefreshCallback({
        refreshExamenesPendientes: refresh
      });
    }
    // Solo ejecutar una vez al montar el componente
  }, [registerRefreshCallback]); // Removido refresh de las dependencias

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Exámenes Pendientes</CardTitle>
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

export const ExamenesCompletadosCard = ({ registerRefreshCallback }: ExamenCardProps = {}) => {
  const { examenes, loading, error, refresh } = useExamenesCompletados();

  // Registrar el callback de refresh cuando el componente se monta
  useEffect(() => {
    if (registerRefreshCallback) {
      registerRefreshCallback({
        refreshExamenesCompletados: refresh
      });
    }
    // Solo ejecutar una vez al montar el componente
  }, [registerRefreshCallback]); // Removido refresh de las dependencias

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Exámenes Completados</CardTitle>
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
