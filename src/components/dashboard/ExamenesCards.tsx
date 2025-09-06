import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  useExamenesPendientes, 
  useExamenesCompletados, 
  useExamenesHoy 
} from "@/hooks/useExamenes";
import { 
  User, 
  Calendar, 
  Clock, 
  Trash2, 
  CalendarDays,
  Activity,
  CheckCircle2,
  AlertCircle,
  Edit3
} from "lucide-react";
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
  onDelete?: (id: number) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact';
}

const ExamenListItem = ({ examen, onDelete, showActions = true, variant = 'default' }: ExamenListItemProps) => {
  const navigate = useNavigate();

  const handleEditExamen = () => {
    const urlParams = new URLSearchParams({
      pacienteId: examen.pacienteId.toString(),
      nombre: examen.paciente?.nombres || '',
      ci: examen.paciente?.ci || '',
      fechaNacimiento: examen.paciente?.fechaNacimiento || '',
      fecha: formatearFechaParaUI(new Date(examen.fecha)),
      modo: 'editar'
    });
    navigate(`/formulario?${urlParams.toString()}`);
  };

  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'completado':
        return { variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200' };
      case 'pendiente':
        return { variant: 'secondary' as const, icon: AlertCircle, color: 'text-orange-600 bg-orange-50 border-orange-200' };
      default:
        return { variant: 'outline' as const, icon: Clock, color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
  };

  const badgeInfo = getBadgeVariant(examen.estado);
  const IconComponent = badgeInfo.icon;

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{examen.paciente?.nombres || 'Paciente sin nombre'}</p>
            <p className="text-xs text-gray-500">CI: {examen.paciente?.ci || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${badgeInfo.color} text-xs`}>
            <IconComponent className="h-3 w-3 mr-1" />
            {examen.estado}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(examen.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{examen.paciente?.nombres || 'Paciente sin nombre'}</h3>
            <p className="text-xs text-gray-500">CI: {examen.paciente?.ci || 'N/A'}</p>
          </div>
        </div>
        <Badge className={`${badgeInfo.color} text-xs font-medium`}>
          <IconComponent className="h-3 w-3 mr-1" />
          {examen.estado}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span>{formatearFechaParaUI(new Date(examen.fecha))}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <Clock className="h-3 w-3 text-gray-400" />
          <span>{new Date(examen.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditExamen}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs h-7"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            Editar
          </Button>
          
          {onDelete && examen.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(examen.id!)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const ExamenesHoyCard = ({ registerRefreshCallback }: ExamenCardProps = {}) => {
  const { examenes, loading, error, refresh, deleteExamen } = useExamenesHoy();

  // Registrar el callback de refresh cuando el componente se monta
  useEffect(() => {
    if (registerRefreshCallback) {
      registerRefreshCallback({
        refreshExamenesHoy: refresh
      });
    }
    // Solo ejecutar una vez al montar el componente
  }, [registerRefreshCallback]); // Removido refresh de las dependencias

  const handleDeleteExamen = async (id: number) => {
    try {
      await deleteExamen(id);
    } catch (err) {
      console.error('Error deleting examen:', err);
    }
  };

  const completados = examenes.filter(e => e.estado === 'completado').length;
  const pendientes = examenes.filter(e => e.estado === 'pendiente').length;

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Exámenes de Hoy</CardTitle>
              <p className="text-sm text-gray-500">{examenes.length} exámenes programados</p>
            </div>
          </div>
          
          {examenes.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{completados}</div>
                <div className="text-xs text-gray-500">Completados</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{pendientes}</div>
                <div className="text-xs text-gray-500">Pendientes</div>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : examenes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No hay exámenes programados para hoy</p>
          </div>
        ) : (
          <div className="space-y-3">
            {examenes.map((examen) => (
              <ExamenListItem
                key={examen.id}
                examen={examen}
                onDelete={handleDeleteExamen}
                showActions={true}
                variant="default"
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
    <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50/50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-gray-900">Exámenes Pendientes</CardTitle>
            {!loading && <p className="text-xs text-gray-500">{examenes.length} pendientes</p>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 rounded-lg p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : examenes.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-green-600 text-sm font-medium">No hay exámenes pendientes</p>
            <p className="text-xs text-gray-500 mt-1">¡Excelente trabajo!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {examenes.slice(0, 5).map((examen) => (
              <ExamenListItem
                key={examen.id}
                examen={examen}
                showActions={false}
                variant="compact"
              />
            ))}
            {examenes.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700">
                  Ver {examenes.length - 5} más...
                </Button>
              </div>
            )}
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
    <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50/50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-gray-900">Exámenes Completados</CardTitle>
            {!loading && <p className="text-xs text-gray-500">{examenes.length} completados</p>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 rounded-lg p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : examenes.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No hay exámenes completados aún</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {examenes.slice(0, 5).map((examen) => (
              <ExamenListItem
                key={examen.id}
                examen={examen}
                showActions={false}
                variant="compact"
              />
            ))}
            {examenes.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700">
                  Ver {examenes.length - 5} más...
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
