import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useResumenMensual } from "@/hooks/useEstadisticas";
import { RefreshCallbacks } from "@/hooks/useGlobalRefresh";
import { useEffect } from "react";

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
        refreshResumenMensual: () => refresh()
      });
    }
  }, [registerRefreshCallback, refresh]); // Incluir refresh para que se actualice cuando cambie

  const totalAnual = resumen.reduce((sum, mes) => sum + mes.total, 0);
  const promedioMensual = totalAnual > 0 ? Math.round(totalAnual / 12) : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Resumen {anioActual}</CardTitle>
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
