import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Clock, BarChart3, User } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { RefreshCallbacks } from "@/hooks/useGlobalRefresh";
import { useEffect } from "react";

interface QuickStatsProps {
  registerRefreshCallback?: (callbacks: RefreshCallbacks) => void;
}

export default function QuickStats({ registerRefreshCallback }: QuickStatsProps) {
  const { stats, loading, error, refreshStats } = useDashboardStats();

  // Registrar el callback de refresh cuando el componente se monta
  useEffect(() => {
    if (registerRefreshCallback) {
      registerRefreshCallback({
        refreshStats: refreshStats
      });
    }
    // Solo ejecutar una vez al montar el componente
  }, [registerRefreshCallback]); // Removido refreshStats de las dependencias

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-4 text-center text-red-500 p-4">
          <p>Error al cargar estadísticas: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Exámenes Hoy</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : stats.examenesHoy}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.examenesHoy === 1 ? "Examen" : "Exámenes"} programados
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : stats.examenesPendientes}
          </div>
          <p className="text-xs text-muted-foreground">Por completar</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completados</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : stats.examenesCompletados}
          </div>
          <p className="text-xs text-muted-foreground">Total histórico</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : stats.pacientesAtendidos}
          </div>
          <p className="text-xs text-muted-foreground">Total registrados</p>
        </CardContent>
      </Card>
    </div>
  );
}
