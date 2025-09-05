import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar, Plus, User, Hash, CalendarDays, AlertCircle, CheckCircle } from 'lucide-react';
import { DatabaseService } from '../../services/databaseService';
import { Paciente, Examen } from '../../types/database';
import { getFechaLocalHoy, formatearFechaParaUI } from '../../lib/dateUtils';

interface PacienteProgramado {
  paciente: Paciente;
  examen: Examen;
}

export const AgendaDelDia: React.FC = () => {
  const [pacientesProgramados, setPacientesProgramados] = useState<PacienteProgramado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    fecha: getFechaLocalHoy(), // Fecha de hoy por defecto usando utilidad
    ci: '',
    nombres: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fechaHoy = getFechaLocalHoy();

  useEffect(() => {
    cargarPacientesHoy();
  }, []);

  const cargarPacientesHoy = async () => {
    try {
      setLoading(true);
      const resultExamenes = await DatabaseService.getExamenes({
        fecha_desde: fechaHoy,
        fecha_hasta: fechaHoy
      });

      if (resultExamenes.success && resultExamenes.data) {
        const pacientesConExamenes: PacienteProgramado[] = [];
        
        for (const examen of resultExamenes.data) {
          const resultPaciente = await DatabaseService.getPacienteById(examen.pacienteId);
          if (resultPaciente.success && resultPaciente.data) {
            pacientesConExamenes.push({
              paciente: resultPaciente.data,
              examen: examen
            });
          }
        }
        
        setPacientesProgramados(pacientesConExamenes);
      }
    } catch (error) {
      console.error('Error cargando pacientes de hoy:', error);
      setMessage({ type: 'error', text: 'Error al cargar los pacientes programados' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'ci') {
      // Solo permitir números y máximo 10 dígitos para CI
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue
        }));
      }
    } else if (name === 'nombres') {
      // Solo permitir letras, espacios y tildes para nombres
      const textValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
      setFormData(prev => ({
        ...prev,
        [name]: textValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ci || !formData.nombres || !formData.fecha) {
      setMessage({ type: 'error', text: 'Por favor complete todos los campos obligatorios' });
      return;
    }

    if (formData.ci.length !== 10) {
      setMessage({ type: 'error', text: 'La cédula de identidad debe tener exactamente 10 dígitos' });
      return;
    }

    if (formData.nombres.trim().length < 2) {
      setMessage({ type: 'error', text: 'El nombre debe tener al menos 2 caracteres' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      // Verificar si el paciente ya existe
      let pacienteId: number;
      const existingPaciente = await DatabaseService.getPacienteByCi(formData.ci);
      
      if (existingPaciente.success && existingPaciente.data) {
        // Paciente existe, usar su ID
        pacienteId = existingPaciente.data.id!;
      } else {
        // Crear nuevo paciente con datos mínimos
        const nuevoPaciente: Omit<Paciente, 'id'> = {
          nombres: formData.nombres,
          ci: formData.ci,
          edad: 0, // Se completará después
          sexo: 'M', // Se completará después
          fechaNacimiento: '1990-01-01', // Se completará después
          peso: 0, // Se completará después
          talla: 0, // Se completará después
          superficieCorporal: 0 // Se completará después
        };

        const resultPaciente = await DatabaseService.savePaciente(nuevoPaciente);
        if (!resultPaciente.success) {
          throw new Error(resultPaciente.error || 'Error al crear paciente');
        }
        pacienteId = resultPaciente.id!;
      }

      // Crear el examen programado
      const nuevoExamen: Omit<Examen, 'id'> = {
        pacienteId: pacienteId,
        estado: 'pendiente',
        fecha: formData.fecha,
        diagnostico: '',
        datos: {}
      };

      const resultExamen = await DatabaseService.saveExamen(nuevoExamen);
      if (!resultExamen.success) {
        throw new Error(resultExamen.error || 'Error al programar examen');
      }

      setMessage({ type: 'success', text: 'Paciente programado exitosamente' });
      setFormData({
        fecha: getFechaLocalHoy(),
        ci: '',
        nombres: ''
      });
      setShowForm(false);
      
      // Recargar la lista
      await cargarPacientesHoy();

    } catch (error: any) {
      console.error('Error al programar paciente:', error);
      setMessage({ type: 'error', text: error.message || 'Error al programar el paciente' });
    } finally {
      setSubmitting(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'text-green-600 bg-green-100';
      case 'pendiente':
        return 'text-orange-600 bg-orange-100';
      case 'cancelado':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <CheckCircle className="h-4 w-4" />;
      case 'pendiente':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span>Agenda del Día</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span>Agenda del Día - {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </CardTitle>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Programar Paciente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mensajes */}
          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message.text}
            </div>
          )}

          {/* Formulario para programar paciente */}
          {showForm && (
            <Card className="mb-6 border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg">Programar Nuevo Paciente</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fecha">Fecha del Examen</Label>
                      <Input
                        id="fecha"
                        name="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={handleInputChange}
                        min={fechaHoy}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ci">Cédula de Identidad <span className="text-red-500">*</span></Label>
                      <Input
                        id="ci"
                        name="ci"
                        type="text"
                        value={formData.ci}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          // Prevenir la entrada de cualquier carácter que no sea número
                          if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                            e.preventDefault();
                          }
                          // Prevenir más de 10 dígitos
                          if (formData.ci.length >= 10 && /[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="10 dígitos (solo números)"
                        className={`${formData.ci.length > 0 && formData.ci.length !== 10 ? 'border-red-500' : ''}`}
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        required
                      />
                      {formData.ci.length > 0 && formData.ci.length !== 10 && (
                        <p className="text-red-500 text-xs mt-1">La cédula debe tener exactamente 10 dígitos</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="nombres">Nombre Completo <span className="text-red-500">*</span></Label>
                      <Input
                        id="nombres"
                        name="nombres"
                        type="text"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        onKeyPress={(e) => {
                          // Prevenir la entrada de números y símbolos especiales
                          if (!/[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="Solo letras y espacios"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      disabled={submitting || formData.ci.length !== 10 || formData.nombres.trim().length < 2}
                      className={`bg-orange-600 hover:bg-orange-700 ${
                        (formData.ci.length !== 10 || formData.nombres.trim().length < 2) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                    >
                      {submitting ? 'Programando...' : 'Programar Paciente'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de pacientes programados */}
          {pacientesProgramados.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-3">
                Pacientes Programados ({pacientesProgramados.length})
              </h3>
              {pacientesProgramados.map(({ paciente, examen }) => (
                <Card key={`${paciente.id}-${examen.id}`} className="border-l-4 border-l-orange-500">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <User className="h-5 w-5 text-gray-600" />
                          <span className="font-semibold text-lg">{paciente.nombres}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getEstadoColor(examen.estado)}`}>
                            {getEstadoIcon(examen.estado)}
                            <span className="capitalize">{examen.estado}</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Hash className="h-4 w-4" />
                            <span>CI: {paciente.ci}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>Programado: {formatearFechaParaUI(examen.fecha)}</span>
                          </div>
                          {paciente.edad > 0 && (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{paciente.edad} años</span>
                            </div>
                          )}
                        </div>
                        {examen.diagnostico && (
                          <div className="mt-2 text-sm">
                            <strong>Diagnóstico:</strong> {examen.diagnostico}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay pacientes programados para hoy
              </h3>
              <p className="text-gray-500 mb-4">
                Comience programando un nuevo paciente para el día de hoy
              </p>
              {!showForm && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Programar Primer Paciente
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgendaDelDia;
