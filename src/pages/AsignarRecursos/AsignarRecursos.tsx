import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../../shared/context/ThemeContext';
import {
  getResumenAsignados,
  ResumenAsignados,
  searchColaboradores,
  asignarManual,
  asignarPorFecha,
  Colaborador,
  TipoRecurso,
} from './services/asignacionesRequest';
import { toast } from 'react-hot-toast';
import TableBase from '../../shared/components/ui/TableBase';
import { createColumnHelper } from '@tanstack/react-table';
import { FaUserTie } from 'react-icons/fa';
import { AsignarFormulario } from './components/AsignarFormulario';

interface Usuario {
  id: string;
  nombre: string;
  numero_articulos: number;
}

interface AsignacionFormData {
  usuario: Colaborador | null;
  numero_articulos: string;
  pasar_a: Colaborador | null;
}

interface AsignacionFechaFormData {
  usuario: Colaborador | null;
  fecha_desde: string;
  fecha_hasta: string;
  numero_articulos: string;
  pasar_a: Colaborador | null;
}

interface AsignarRecursosProps {
  tipoRecurso: TipoRecurso;
}

const columnHelper = createColumnHelper<Usuario>();

export const AsignarRecursos: React.FC<AsignarRecursosProps> = ({
  tipoRecurso,
}) => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const proyectoId = searchParams.get('proyecto_id');

  const [resumen, setResumen] = useState<ResumenAsignados | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'usuario' | 'fecha'>('usuario');

  const [formDataUsuario, setFormDataUsuario] = useState<AsignacionFormData>({
    usuario: null,
    numero_articulos: '',
    pasar_a: null,
  });

  const [formDataFecha, setFormDataFecha] = useState<AsignacionFechaFormData>({
    usuario: null,
    fecha_desde: '',
    fecha_hasta: '',
    numero_articulos: '',
    pasar_a: null,
  });

  const recursoLabel =
    tipoRecurso === 'redes' ? 'Redes' : 'Artículos/Publicaciones';
  const recursoLabelLower = tipoRecurso === 'redes' ? 'redes' : 'artículos';

  const columns = [
    columnHelper.display({
      id: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => row.original.nombre,
    }),
    columnHelper.display({
      id: 'numero_articulos',
      header: `# ${tipoRecurso === 'redes' ? 'Redes' : 'Artículos'}`,
      cell: ({ row }) => row.original.numero_articulos,
    }),
  ];

  useEffect(() => {
    const fetchResumen = async () => {
      if (!proyectoId) {
        setError('ID de proyecto no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const resumenData = await getResumenAsignados(proyectoId, tipoRecurso);
        setResumen(resumenData);
      } catch (err: any) {
        console.error('Error fetching resumen asignados:', err);
        setError(
          `Error al cargar el resumen de asignaciones de ${recursoLabelLower}`
        );
        toast.error(
          `Error al cargar el resumen de asignaciones de ${recursoLabelLower}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, [proyectoId, tipoRecurso, recursoLabelLower]);

  const handleUsuarioFormChange = (
    field: keyof AsignacionFormData,
    value: string | Colaborador | null
  ) => {
    setFormDataUsuario((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFechaFormChange = (
    field: keyof AsignacionFechaFormData,
    value: string | Colaborador | null
  ) => {
    setFormDataFecha((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirmarUsuario = async () => {
    if (!proyectoId) {
      toast.error('ID de proyecto no proporcionado');
      return;
    }

    if (!formDataUsuario.usuario) {
      toast.error('Debe seleccionar un usuario origen');
      return;
    }

    if (!formDataUsuario.pasar_a) {
      toast.error('Debe seleccionar un usuario destino');
      return;
    }

    if (
      !formDataUsuario.numero_articulos ||
      parseInt(formDataUsuario.numero_articulos) <= 0
    ) {
      toast.error(`Debe especificar un número válido de ${recursoLabelLower}`);
      return;
    }

    try {
      await asignarManual(
        {
          desde_id: formDataUsuario.usuario.id,
          hasta_id: formDataUsuario.pasar_a.id,
          cantidad: parseInt(formDataUsuario.numero_articulos),
          proyecto_id: proyectoId,
        },
        tipoRecurso
      );

      toast.success(
        `Asignación de ${recursoLabelLower} por usuario confirmada`
      );

      setFormDataUsuario({
        usuario: null,
        numero_articulos: '',
        pasar_a: null,
      });

      const resumenData = await getResumenAsignados(proyectoId, tipoRecurso);
      setResumen(resumenData);
    } catch (error: any) {
      console.error('Error en asignación:', error);
      toast.error('Error al confirmar la asignación');
    }
  };

  const handleConfirmarFecha = async () => {
    if (!proyectoId) {
      toast.error('ID de proyecto no proporcionado');
      return;
    }

    if (!formDataFecha.usuario) {
      toast.error('Debe seleccionar un usuario origen');
      return;
    }

    if (!formDataFecha.fecha_desde) {
      toast.error('Debe seleccionar una fecha desde');
      return;
    }

    if (!formDataFecha.fecha_hasta) {
      toast.error('Debe seleccionar una fecha hasta');
      return;
    }

    if (
      !formDataFecha.numero_articulos ||
      parseInt(formDataFecha.numero_articulos) <= 0
    ) {
      toast.error(`Debe especificar un número válido de ${recursoLabelLower}`);
      return;
    }

    if (!formDataFecha.pasar_a) {
      toast.error('Debe seleccionar un usuario de destino');
      return;
    }

    if (
      new Date(formDataFecha.fecha_desde) > new Date(formDataFecha.fecha_hasta)
    ) {
      toast.error('La fecha desde debe ser anterior a la fecha hasta');
      return;
    }

    try {
      await asignarPorFecha(
        {
          desde_id: formDataFecha.usuario.id,
          hasta_id: formDataFecha.pasar_a.id,
          cantidad: parseInt(formDataFecha.numero_articulos),
          fecha_inicio: formDataFecha.fecha_desde,
          fecha_fin: formDataFecha.fecha_hasta,
          proyecto_id: proyectoId,
        },
        tipoRecurso
      );

      toast.success(`Asignación de ${recursoLabelLower} por fecha confirmada`);

      setFormDataFecha({
        usuario: null,
        fecha_desde: '',
        fecha_hasta: '',
        numero_articulos: '',
        pasar_a: null,
      });

      const resumenData = await getResumenAsignados(proyectoId, tipoRecurso);
      setResumen(resumenData);
    } catch (error: any) {
      console.error('Error en asignación por fecha:', error);
      toast.error('Error al confirmar la asignación por fecha');
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen p-8"
        style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
        }}
      >
        <div>
          <h1
            className="text-2xl font-bold mb-6"
            style={{
              color: theme === 'dark' ? '#f9fafb' : '#111827',
            }}
          >
            Asignar {recursoLabel}
          </h1>
          <div className="animate-pulse">
            <div
              className="h-8 w-48 rounded mb-6"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              }}
            />
            <div
              className="h-12 w-full rounded"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen p-8"
        style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
        }}
      >
        <div>
          <h1
            className="text-2xl font-bold mb-6"
            style={{
              color: theme === 'dark' ? '#f9fafb' : '#111827',
            }}
          >
            Asignar {recursoLabel}
          </h1>
          <div className="text-center">
            <h2
              className="text-xl font-semibold mb-2"
              style={{
                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              }}
            >
              {error}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
      }}
    >
      <div>
        <h1
          className="text-2xl font-bold mb-6"
          style={{
            color: theme === 'dark' ? '#f9fafb' : '#111827',
          }}
        >
          Asignar {recursoLabel}
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar nombre"
                className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                style={{
                  backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                  borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: theme === 'dark' ? '#f9fafb' : '#111827',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    theme === 'dark' ? '#3b82f6' : '#2563eb';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    theme === 'dark' ? '#4b5563' : '#d1d5db';
                }}
              />
            </div>

            <div
              className="border rounded-lg shadow-lg overflow-hidden"
              style={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              }}
            >
              <div className="p-6">
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex space-x-4">
                        <div
                          className="h-4 flex-1 rounded"
                          style={{
                            backgroundColor:
                              theme === 'dark' ? '#374151' : '#e5e7eb',
                          }}
                        />
                        <div
                          className="h-4 w-16 rounded"
                          style={{
                            backgroundColor:
                              theme === 'dark' ? '#374151' : '#e5e7eb',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : resumen?.usuarios && resumen.usuarios.length > 0 ? (
                  <TableBase
                    columns={columns}
                    data={resumen.usuarios}
                    selectRow={() => {}}
                    openModal={() => {}}
                    openDeleteOption={() => {}}
                    showActions={false}
                  />
                ) : (
                  <div className="text-center py-8">
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          theme === 'dark' ? '#374151' : '#f3f4f6',
                      }}
                    >
                      <FaUserTie
                        className="w-8 h-8"
                        style={{
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                      />
                    </div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{
                        color: theme === 'dark' ? '#f9fafb' : '#111827',
                      }}
                    >
                      No hay usuarios disponibles
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-1">
            <AsignarFormulario
              theme={theme}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              formDataUsuario={formDataUsuario}
              handleUsuarioFormChange={handleUsuarioFormChange}
              handleConfirmarUsuario={handleConfirmarUsuario}
              handleConfirmarFecha={handleConfirmarFecha}
              formDataFecha={formDataFecha}
              handleFechaFormChange={handleFechaFormChange}
              searchColaboradores={searchColaboradores}
              tipoRecurso={tipoRecurso}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
