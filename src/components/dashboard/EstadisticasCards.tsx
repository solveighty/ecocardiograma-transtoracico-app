import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useResumenMensual } from "@/hooks/useEstadisticas";
import { RefreshCallbacks } from "@/hooks/useGlobalRefresh";
import { useEffect } from "react";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";

const mesesNombres = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

interface EstadisticasCardProps {
  registerRefreshCallback?: (callbacks: RefreshCallbacks) => void;
}

export const ResumenMensualCard = ({ registerRefreshCallback }: EstadisticasCardProps = {}) => {
  const anioActual = new Date().getFullYear();
  const { resumen, loading, error, refresh } = useResumenMensual(anioActual);

  // Registrar el callback de refresh cuando el componente se monta
  useEffect(() => {
    if (registerRefreshCallback) {
      registerRefreshCallback({
        refreshResumenMensual: refresh
      });
    }
    // Solo ejecutar una vez al montar el componente
  }, [registerRefreshCallback]); // Removido refresh de las dependencias

  const totalAnual = resumen.reduce((sum, mes) => sum + mes.total, 0);
  const promedioMensual = totalAnual > 0 ? Math.round(totalAnual / 12) : 0;
  const mesesActivos = resumen.filter(m => m.total > 0).length;

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-purple-50/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">Resumen {anioActual}</CardTitle>
              <p className="text-sm text-gray-500">Estadísticas anuales</p>
            </div>
          </div>
          
          {totalAnual > 0 && (
            <div className="flex items-center space-x-1 text-purple-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">{totalAnual} total</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-100 rounded-lg p-3 space-y-2">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex items-center space-x-2">
                  <div className="w-10 h-2 bg-gray-200 rounded"></div>
                  <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                  <div className="w-6 h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Estadísticas resumidas */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-xl font-bold text-blue-700">{totalAnual}</div>
                <div className="text-xs text-blue-600 font-medium">Total año</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="text-xl font-bold text-green-700">{promedioMensual}</div>
                <div className="text-xs text-green-600 font-medium">Promedio</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-xl font-bold text-purple-700">{mesesActivos}</div>
                <div className="text-xs text-purple-600 font-medium">Meses activos</div>
              </div>
            </div>

            {/* Gráfico de barras mejorado */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">Distribución mensual</h4>
                {totalAnual > 0 && (
                  <span className="text-xs text-gray-500">Máximo: {Math.max(...resumen.map(m => m.total))}</span>
                )}
              </div>
              
              <div className="space-y-2">
                {resumen.map((mes, index) => {
                  const mesNombre = mesesNombres[index];
                  const porcentaje = totalAnual > 0 ? (mes.total / Math.max(...resumen.map(m => m.total))) * 100 : 0;
                  const isCurrentMonth = new Date().getMonth() === index;
                  
                  return (
                    <div key={mes.mes} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <div className={`text-xs font-medium ${isCurrentMonth ? 'text-purple-700' : 'text-gray-600'}`}>
                          {mesNombre}
                          {isCurrentMonth && <span className="ml-1 text-purple-500">●</span>}
                        </div>
                        <div className={`text-xs ${mes.total > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                          {mes.total}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ease-out ${
                              isCurrentMonth 
                                ? 'bg-gradient-to-r from-purple-400 to-purple-600' 
                                : mes.total > 0 
                                  ? 'bg-gradient-to-r from-blue-400 to-blue-600' 
                                  : 'bg-gray-200'
                            }`}
                            style={{ 
                              width: `${Math.max(porcentaje, mes.total > 0 ? 8 : 0)}%`,
                              transition: 'width 0.5s ease-out'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalAnual === 0 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No hay datos para este año</p>
                  <p className="text-xs text-gray-400 mt-1">Los datos aparecerán cuando se registren exámenes</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
