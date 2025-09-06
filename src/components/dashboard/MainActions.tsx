import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, Calendar, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { 
  ExamenesPendientesCard, 
  ExamenesCompletadosCard 
} from "./ExamenesCards";
import { 
  ResumenMensualCard 
} from "./EstadisticasCards";
import AgendaDelDia from "./AgendaDelDia";
import { RefreshCallbacks } from "@/hooks/useGlobalRefresh";

interface MainActionsProps {
  registerRefreshCallback?: (callbacks: RefreshCallbacks) => void;
}

function MainActions({ registerRefreshCallback }: MainActionsProps) {
  const [showAgenda, setShowAgenda] = useState(false);

  if (showAgenda) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowAgenda(false)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Dashboard</span>
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Agenda del Día</h2>
        </div>
        <AgendaDelDia />
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Acciones principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FolderOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-900">Historial de Pacientes</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ver el historial completo de exámenes realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 transition-colors">
              <FileText className="h-4 w-4 mr-2" />
              Ver Historial
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-900">Agenda del Día</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Agendar pacientes para realizar examen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full bg-white hover:bg-orange-50 border-orange-200 text-orange-700 hover:text-orange-800 transition-colors"
              onClick={() => setShowAgenda(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Ver Agenda
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Exámenes - Layout mejorado */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Gestión de Exámenes</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExamenesPendientesCard registerRefreshCallback={registerRefreshCallback} />
          <ExamenesCompletadosCard registerRefreshCallback={registerRefreshCallback} />
        </div>
      </div>

      {/* Sección de Estadísticas */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Estadísticas y Reportes</h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <ResumenMensualCard registerRefreshCallback={registerRefreshCallback} />
        </div>
      </div>
    </div>
  );
}

export default MainActions;
