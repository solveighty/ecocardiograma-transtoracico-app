import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useFormDatabase } from '../../forms/hooks/useFormDatabase';
import { PatientData } from '../../forms/types/firstForm/PatientData';
import { Search, Save, CheckCircle, AlertCircle, User } from 'lucide-react';

export const DatabaseFormExample = () => {
  const [ci, setCi] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState<PatientData | null>(null);
  
  const {
    loading,
    error,
    lastSavedExamenId,
    lastSavedPacienteId,
    buscarPaciente,
    guardarBorrador,
    finalizarExamen,
    clearError
  } = useFormDatabase();

  const handleBuscarPaciente = async () => {
    if (!ci.trim()) return;
    
    const paciente = await buscarPaciente(ci);
    if (paciente) {
      setPacienteEncontrado(paciente);
    } else {
      setPacienteEncontrado(null);
    }
  };

  const handleGuardarBorrador = async () => {
    if (!pacienteEncontrado) return;
    
    // Datos de ejemplo para el formulario
    const formDataEjemplo = {
      patientData: pacienteEncontrado,
      medidasVIData: {} as any,
      ventriculosAuriculasData: {},
      valvulasData: {} as any,
      dtvvData: {} as any
    };

    const success = await guardarBorrador(formDataEjemplo);
    if (success) {
    }
  };

  const handleFinalizarExamen = async () => {
    if (!pacienteEncontrado) return;
    
    // Datos de ejemplo para el formulario
    const formDataEjemplo = {
      patientData: pacienteEncontrado,
      medidasVIData: {} as any,
      ventriculosAuriculasData: {},
      valvulasData: {} as any,
      dtvvData: {} as any
    };

    const success = await finalizarExamen(formDataEjemplo, 'Examen normal - Sin alteraciones significativas');
    if (success) {

    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Ejemplo de Integración con Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Buscador de pacientes */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="ci">Cédula de Identidad</Label>
              <Input
                id="ci"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                placeholder="Ingrese la CI del paciente"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col justify-end gap-2">
              <Button 
                onClick={handleBuscarPaciente} 
                disabled={loading || !ci.trim()}
                size="sm"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>

          {/* Mensajes de estado */}
          {loading && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span>Buscando...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700">{error}</span>
              <Button onClick={clearError} variant="ghost" size="sm" className="ml-auto">
                ×
              </Button>
            </div>
          )}

          {/* Información del paciente encontrado */}
          {pacienteEncontrado && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <User className="h-5 w-5" />
                  Paciente Encontrado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nombres y Apellidos</Label>
                    <p className="text-sm">{pacienteEncontrado.nombresApellidos}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Edad</Label>
                    <p className="text-sm">{pacienteEncontrado.edad} años</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Sexo</Label>
                    <p className="text-sm">{pacienteEncontrado.sexo === 'M' ? 'Masculino' : 'Femenino'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">CI</Label>
                    <p className="text-sm">{pacienteEncontrado.ci}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Peso</Label>
                    <p className="text-sm">{pacienteEncontrado.peso} kg</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Talla</Label>
                    <p className="text-sm">{pacienteEncontrado.talla} cm</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleGuardarBorrador} variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Borrador
                  </Button>
                  <Button onClick={handleFinalizarExamen} size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Examen
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mostrar últimos IDs guardados */}
          {(lastSavedExamenId || lastSavedPacienteId) && (
            <div className="flex gap-2">
              {lastSavedPacienteId && (
                <Badge variant="outline">
                  Paciente ID: {lastSavedPacienteId}
                </Badge>
              )}
              {lastSavedExamenId && (
                <Badge variant="outline">
                  Examen ID: {lastSavedExamenId}
                </Badge>
              )}
            </div>
          )}

          {/* Mensaje cuando no se encuentra paciente */}
          {ci.trim() && !pacienteEncontrado && !loading && !error && (
            <div className="text-center py-4 text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No se encontró ningún paciente con la CI: {ci}</p>
              <p className="text-sm">Puede crear un nuevo paciente con estos datos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información sobre la integración */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades Implementadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ Completado</h4>
              <ul className="text-sm space-y-1">
                <li>• Base de datos SQLite con sqlite3</li>
                <li>• Tablas pacientes y examenes</li>
                <li>• Búsqueda de pacientes por CI</li>
                <li>• Guardado de exámenes (pendientes/completados)</li>
                <li>• Estadísticas del dashboard</li>
                <li>• Hooks para React</li>
                <li>• Integración con formularios</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">🔄 Próximas mejoras</h4>
              <ul className="text-sm space-y-1">
                <li>• Cargar exámenes existentes</li>
                <li>• Búsqueda avanzada</li>
                <li>• Reportes personalizados</li>
                <li>• Backup automático</li>
                <li>• Migración de datos JSON</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
