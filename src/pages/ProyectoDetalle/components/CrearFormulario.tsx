import { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import {
  FaPlus,
  FaTimes,
  FaTrash,
  FaEdit,
  FaList,
  FaHashtag,
  FaCheck,
} from 'react-icons/fa';
import { IoSaveSharp, IoDocumentText } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { crearFormulario, FormularioData } from '../services/formularioRequest';

interface CrearFormularioProps {
  theme: string;
  isFormularioModalOpen: boolean;
  setIsFormularioModalOpen: (isOpen: boolean) => void;
  proyectoId: string;
}

export const CrearFormulario = ({
  theme,
  isFormularioModalOpen,
  setIsFormularioModalOpen,
  proyectoId,
}: CrearFormularioProps) => {
  const [formularioNombre, setFormularioNombre] = useState('');
  const [formularioDescripcion, setFormularioDescripcion] = useState('');
  const [saving, setSaving] = useState(false);
  const [formularioCampos, setFormularioCampos] = useState<
    Array<{
      id: string;
      nombre_campo: string;
      tipo: 'text' | 'select';
      obligatorio: boolean;
      opciones: string;
    }>
  >([]);

  const handleCloseFormularioModal = () => {
    setIsFormularioModalOpen(false);
    setFormularioNombre('');
    setFormularioDescripcion('');
    setFormularioCampos([]);
  };

  const agregarCampo = () => {
    const nuevoCampo = {
      id: Math.random().toString(36).substr(2, 9),
      nombre_campo: '',
      tipo: 'text' as const,
      obligatorio: false,
      opciones: '',
    };
    setFormularioCampos([...formularioCampos, nuevoCampo]);
  };

  const eliminarCampo = (id: string) => {
    setFormularioCampos(formularioCampos.filter((campo) => campo.id !== id));
  };

  const actualizarCampo = (
    id: string,
    updates: Partial<(typeof formularioCampos)[0]>
  ) => {
    setFormularioCampos(
      formularioCampos.map((campo) =>
        campo.id === id ? { ...campo, ...updates } : campo
      )
    );
  };

  const guardarFormulario = async () => {
    if (!formularioNombre.trim() || !formularioDescripcion.trim()) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    if (formularioCampos.length === 0) {
      toast.error('Debe agregar al menos un campo');
      return;
    }

    for (const campo of formularioCampos) {
      if (!campo.nombre_campo.trim()) {
        toast.error('Todos los campos deben tener un nombre');
        return;
      }
      if (campo.tipo === 'select' && !campo.opciones.trim()) {
        toast.error('Los campos de tipo SELECT deben tener opciones');
        return;
      }
    }

    setSaving(true);

    try {
      const formularioData: FormularioData = {
        nombre: formularioNombre.trim(),
        descripcion: formularioDescripcion.trim(),
        proyecto_id: proyectoId,
        campos: formularioCampos.map(({ id, ...campo }) => ({
          nombre_campo: campo.nombre_campo.trim(),
          tipo: campo.tipo,
          opciones: campo.tipo === 'select' ? campo.opciones.trim() : null,
          obligatorio: campo.obligatorio,
        })),
      };

      await crearFormulario(formularioData);
      toast.success('Formulario creado exitosamente');
      handleCloseFormularioModal();
    } catch (error) {
      console.error('Error al crear formulario:', error);
      toast.error('Error al crear el formulario');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    backgroundColor: theme === 'dark' ? '#4b5563' : '#ffffff',
    borderColor: theme === 'dark' ? '#6b7280' : '#d1d5db',
    color: theme === 'dark' ? '#f9fafb' : '#111827',
  };

  const inputFocusStyle = {
    borderColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
    boxShadow:
      theme === 'dark'
        ? '0 0 0 3px rgba(96, 165, 250, 0.1)'
        : '0 0 0 3px rgba(59, 130, 246, 0.1)',
  };

  const sectionStyle = {
    backgroundColor: theme === 'dark' ? '#374151' : '#f8fafc',
    borderColor: theme === 'dark' ? '#4b5563' : '#e2e8f0',
  };

  const cardStyle = {
    backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
    borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isFormularioModalOpen ? 'block' : 'hidden'
      }`}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          backgroundColor:
            theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={handleCloseFormularioModal}
      />

      <div
        className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl"
        style={{
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f9fafb' : '#111827',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{
            background:
              theme === 'dark'
                ? 'linear-gradient(to right, #374151, #4b5563)'
                : 'linear-gradient(to right, #dbeafe, #e0e7ff)',
            borderBottom: `1px solid ${
              theme === 'dark' ? '#4b5563' : '#e5e7eb'
            }`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg text-white"
              style={{ backgroundColor: '#3b82f6' }}
            >
              <IoDocumentText size={20} />
            </div>
            <div>
              <h3
                className="text-xl font-bold"
                style={{ color: theme === 'dark' ? '#f9fafb' : '#1f2937' }}
              >
                Crear formulario
              </h3>
              <p
                className="text-sm"
                style={{
                  color: theme === 'dark' ? '#d1d5db' : '#6b7280',
                  opacity: 0.8,
                }}
              >
                Crear nuevo formulario dinámico
              </p>
            </div>
          </div>
          <Button
            onClick={handleCloseFormularioModal}
            variant="secondary"
            aria-label="Cerrar"
            className="hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FaTimes size={18} />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="px-6 py-6">
            <div className="space-y-8">
              <div
                className="rounded-xl p-6 border"
                style={{
                  ...sectionStyle,
                  background:
                    theme === 'dark'
                      ? 'linear-gradient(to right, #374151, #4b5563)'
                      : 'linear-gradient(to right, #f0f9ff, #e0f2fe)',
                }}
              >
                <h4
                  className="flex items-center gap-2 font-semibold text-lg mb-6"
                  style={{ color: theme === 'dark' ? '#60a5fa' : '#1e40af' }}
                >
                  <FaEdit className="text-blue-500" />
                  Información del formulario
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{
                        color: theme === 'dark' ? '#e5e7eb' : '#374151',
                      }}
                    >
                      <IoDocumentText className="w-4 h-4 text-blue-500" />
                      Nombre del formulario
                    </label>
                    <input
                      type="text"
                      value={formularioNombre}
                      onChange={(e) => setFormularioNombre(e.target.value)}
                      placeholder="Agregue el nombre"
                      className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none"
                      style={inputStyle}
                      onFocus={(e) => {
                        Object.assign(e.currentTarget.style, inputFocusStyle);
                      }}
                      onBlur={(e) => {
                        Object.assign(e.currentTarget.style, inputStyle);
                      }}
                    />
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-red-500">*</span>
                      <span
                        className="text-xs"
                        style={{
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        Obligatorio
                      </span>
                    </div>
                  </div>

                  <div className="group">
                    <label
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{
                        color: theme === 'dark' ? '#e5e7eb' : '#374151',
                      }}
                    >
                      <FaList className="w-4 h-4 text-blue-500" />
                      Descripción del formulario
                    </label>
                    <input
                      type="text"
                      value={formularioDescripcion}
                      onChange={(e) => setFormularioDescripcion(e.target.value)}
                      placeholder="Agregue la descripción"
                      className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none"
                      style={inputStyle}
                      onFocus={(e) => {
                        Object.assign(e.currentTarget.style, inputFocusStyle);
                      }}
                      onBlur={(e) => {
                        Object.assign(e.currentTarget.style, inputStyle);
                      }}
                    />
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-red-500">*</span>
                      <span
                        className="text-xs"
                        style={{
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        Obligatorio
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <FaHashtag className="text-green-500" />
                  <h4
                    className="font-semibold text-lg"
                    style={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}
                  >
                    Campos del formulario
                  </h4>
                  <span
                    className="text-sm px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: theme === 'dark' ? '#065f46' : '#d1fae5',
                      color: theme === 'dark' ? '#34d399' : '#059669',
                    }}
                  >
                    {formularioCampos.length} campos
                  </span>
                </div>

                {formularioCampos.map((campo, index) => (
                  <div
                    key={campo.id}
                    className="rounded-xl p-6 mb-6 border hover:shadow-lg transition-all duration-200"
                    style={cardStyle}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <h5
                          className="font-semibold text-lg"
                          style={{
                            color: theme === 'dark' ? '#f9fafb' : '#111827',
                          }}
                        >
                          Campo {index + 1}
                        </h5>
                        {campo.obligatorio && (
                          <span
                            className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                            style={{
                              backgroundColor:
                                theme === 'dark' ? '#7f1d1d' : '#fee2e2',
                              color: theme === 'dark' ? '#fca5a5' : '#dc2626',
                            }}
                          >
                            <FaCheck className="w-3 h-3" />
                            Obligatorio
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => eliminarCampo(campo.id)}
                        className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        title="Eliminar campo"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div className="lg:col-span-2">
                        <label
                          className="flex items-center gap-2 text-sm font-medium mb-2"
                          style={{
                            color: theme === 'dark' ? '#d1d5db' : '#374151',
                          }}
                        >
                          <FaEdit className="w-4 h-4 text-gray-500" />
                          Nombre del campo
                        </label>
                        <input
                          type="text"
                          value={campo.nombre_campo}
                          onChange={(e) =>
                            actualizarCampo(campo.id, {
                              nombre_campo: e.target.value,
                            })
                          }
                          placeholder="Agregue el nombre"
                          className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
                          style={inputStyle}
                          onFocus={(e) => {
                            Object.assign(
                              e.currentTarget.style,
                              inputFocusStyle
                            );
                          }}
                          onBlur={(e) => {
                            Object.assign(e.currentTarget.style, inputStyle);
                          }}
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        <label
                          className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border-2 border-dashed transition-all hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                          style={{
                            borderColor: campo.obligatorio
                              ? '#10b981'
                              : theme === 'dark'
                              ? '#6b7280'
                              : '#d1d5db',
                            backgroundColor: campo.obligatorio
                              ? theme === 'dark'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : '#ecfdf5'
                              : 'transparent',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={campo.obligatorio}
                            onChange={(e) =>
                              actualizarCampo(campo.id, {
                                obligatorio: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-green-600"
                          />
                          <span
                            className="text-sm font-medium flex items-center gap-1"
                            style={{
                              color: theme === 'dark' ? '#d1d5db' : '#374151',
                            }}
                          >
                            Campo obligatorio
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        className="flex items-center gap-2 text-sm font-medium mb-2"
                        style={{
                          color: theme === 'dark' ? '#d1d5db' : '#374151',
                        }}
                      >
                        <FaList className="w-4 h-4 text-purple-500" />
                        Tipo de campo
                      </label>
                      <select
                        value={campo.tipo}
                        onChange={(e) => {
                          const nuevoTipo = e.target.value as 'text' | 'select';
                          const updates: any = { tipo: nuevoTipo };
                          if (nuevoTipo === 'select' && !campo.opciones) {
                            updates.opciones = '';
                          }
                          actualizarCampo(campo.id, updates);
                        }}
                        className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
                        style={inputStyle}
                        onFocus={(e) => {
                          Object.assign(e.currentTarget.style, inputFocusStyle);
                        }}
                        onBlur={(e) => {
                          Object.assign(e.currentTarget.style, inputStyle);
                        }}
                      >
                        <option value="text">📝 Campo de texto</option>
                        <option value="select">📋 Lista de selección</option>
                      </select>
                    </div>

                    {campo.tipo === 'select' && (
                      <div
                        className="rounded-lg p-4 border"
                        style={{
                          backgroundColor:
                            theme === 'dark'
                              ? 'rgba(59, 130, 246, 0.1)'
                              : '#eff6ff',
                          borderColor: theme === 'dark' ? '#1e40af' : '#bfdbfe',
                        }}
                      >
                        <label
                          className="flex items-center gap-2 text-sm font-medium mb-3"
                          style={{
                            color: theme === 'dark' ? '#93c5fd' : '#1e40af',
                          }}
                        >
                          <FaList className="w-4 h-4" />
                          Opciones (separadas por comas)
                        </label>
                        <input
                          type="text"
                          value={campo.opciones}
                          onChange={(e) =>
                            actualizarCampo(campo.id, {
                              opciones: e.target.value,
                            })
                          }
                          placeholder="Ej: Opción 1, Opción 2, Opción 3"
                          className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
                          style={inputStyle}
                          onFocus={(e) => {
                            Object.assign(
                              e.currentTarget.style,
                              inputFocusStyle
                            );
                          }}
                          onBlur={(e) => {
                            Object.assign(e.currentTarget.style, inputStyle);
                          }}
                        />
                        {campo.opciones && (
                          <div className="mt-3">
                            <p
                              className="text-xs mb-2"
                              style={{
                                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                              }}
                            >
                              Vista previa:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {campo.opciones.split(',').map((opcion, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 rounded-full"
                                  style={{
                                    backgroundColor:
                                      theme === 'dark' ? '#1e40af' : '#dbeafe',
                                    color:
                                      theme === 'dark' ? '#93c5fd' : '#1e40af',
                                  }}
                                >
                                  {opcion.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <button
                  onClick={agregarCampo}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed w-full justify-center transition-all duration-200 group cursor-pointer"
                  style={{
                    borderColor: theme === 'dark' ? '#6b7280' : '#d1d5db',
                    color: theme === 'dark' ? '#d1d5db' : '#6b7280',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.backgroundColor =
                      theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff';
                    e.currentTarget.style.color =
                      theme === 'dark' ? '#93c5fd' : '#1e40af';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      theme === 'dark' ? '#6b7280' : '#d1d5db';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color =
                      theme === 'dark' ? '#d1d5db' : '#6b7280';
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                    style={{
                      backgroundColor: theme === 'dark' ? '#1e3a8a' : '#dbeafe',
                    }}
                  >
                    <FaPlus
                      size={16}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <span className="font-medium text-lg">
                    Agregar nuevo campo
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex justify-end gap-3 px-6 py-5 border-t"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
            borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
            minHeight: '80px',
          }}
        >
          <Button
            variant="secondary"
            onClick={handleCloseFormularioModal}
            className="px-6 py-3"
            disabled={saving}
          >
            <FaTimes className="mr-2" size={14} />
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={guardarFormulario}
            disabled={
              !formularioNombre.trim() ||
              !formularioDescripcion.trim() ||
              saving
            }
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <IoSaveSharp className="mr-2" size={16} />
            {saving ? 'Guardando...' : 'Guardar formulario'}
          </Button>
        </div>
      </div>
    </div>
  );
};
