import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp } from "lucide-react";
import { useResumenMensual, useEstadisticasMesActual } from "@/hooks/useEstadisticas";

const mesesNombres = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const ResumenMensualCard = () => {
  const anioActual = new Date().getFullYear();
  const { resumen, loading, error, refresh } = useResumenMensual(anioActual);

  const totalAnual = resumen.reduce((sum, mes) => sum + mes.total, 0);
  const promedioMensual = totalAnual > 0 ? Math.round(totalAnual / 12) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Resumen {anioActual}</CardTitle>
        <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalAnual}</div>
            <div className="text-sm text-blue-800">Total del año</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{promedioMensual}</div>
            <div className="text-sm text-green-800">Promedio mensual</div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {resumen.map((mes) => (
              <div key={mes.mes} className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {mesesNombres[mes.mes - 1]}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: totalAnual > 0 ? `${(mes.total / Math.max(...resumen.map(r => r.total))) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-8 text-right">
                    {mes.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const EstadisticasMesActualCard = () => {
  const { estadisticas, loading, error, refresh } = useEstadisticasMesActual();

  const porcentajeCompletados = estadisticas.total > 0 
    ? Math.round((estadisticas.completados / estadisticas.total) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          {mesesNombres[estadisticas.mes - 1]} {estadisticas.anio}
        </CardTitle>
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
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-xl font-bold text-blue-600">
                  {estadisticas.total}
                </div>
                <div className="text-xs text-blue-800">Total</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-xl font-bold text-green-600">
                  {estadisticas.completados}
                </div>
                <div className="text-xs text-green-800">Completados</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-orange-50 rounded">
                <div className="text-xl font-bold text-orange-600">
                  {estadisticas.pendientes}
                </div>
                <div className="text-xs text-orange-800">Pendientes</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="text-xl font-bold text-purple-600">
                  {estadisticas.pacientesUnicos}
                </div>
                <div className="text-xs text-purple-800">Pacientes</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Tasa de finalización</span>
                <span className="text-sm font-bold">{porcentajeCompletados}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${porcentajeCompletados}%` }}
                />
              </div>
            </div>

            {estadisticas.total > 0 && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>Rendimiento mensual</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
