import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FolderOpen, FileText, Calendar, Pencil, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { 
  ExamenesHoyCard, 
  ExamenesPendientesCard, 
  ExamenesCompletadosCard 
} from "./ExamenesCards";
import { 
  ResumenMensualCard, 
  EstadisticasMesActualCard 
} from "./EstadisticasCards";
import AgendaDelDia from "./AgendaDelDia";

function MainActions() {
  const navigate = useNavigate();
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Pencil className="h-5 w-5 text-green-600" />
              <span>Llenar Ecocardiograma Transtorácico</span>
            </CardTitle>
            <CardDescription>
              Llena el formulario para el ecocardiograma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => navigate("/ecocardiograma")}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Llenar Formulario
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-blue-600" />
              <span>Historial de Pacientes</span>
            </CardTitle>
            <CardDescription>
              Ver y gestionar el historial de exámenes realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Ver Historial
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span>Agenda del Día</span>
            </CardTitle>
            <CardDescription>
              Revisar citas y exámenes programados para hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full bg-transparent"
              onClick={() => setShowAgenda(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Ver Agenda
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Exámenes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ExamenesHoyCard />
        <ExamenesPendientesCard />
        <ExamenesCompletadosCard />
      </div>

      {/* Sección de Estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EstadisticasMesActualCard />
        <ResumenMensualCard />
      </div>
    </div>
  );
}

export default MainActions;
