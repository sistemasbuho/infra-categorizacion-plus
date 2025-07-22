import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import { FaUserTie } from 'react-icons/fa6';
import { FaHashtag } from 'react-icons/fa6';
import { AsyncReactSelect } from '../../../shared/components/ui/AsyncReactSelect';
import { Colaborador } from '../services/asignacionesRequest';

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

interface AsignarFormularioProps {
  theme: string;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<'usuario' | 'fecha'>>;
  formDataUsuario: AsignacionFormData;
  handleUsuarioFormChange: (
    field: keyof AsignacionFormData,
    value: string | Colaborador | null
  ) => void;
  handleConfirmarUsuario: () => void;
  handleConfirmarFecha: () => void;
  formDataFecha: AsignacionFechaFormData;
  handleFechaFormChange: (
    field: keyof AsignacionFechaFormData,
    value: string | Colaborador | null
  ) => void;
  searchColaboradores: (nombre: string) => Promise<Colaborador[]>;
}

export const AsignarFormulario = ({
  theme,
  activeTab,
  setActiveTab,
  formDataUsuario,
  handleUsuarioFormChange,
  handleConfirmarUsuario,
  handleConfirmarFecha,
  formDataFecha,
  handleFechaFormChange,
  searchColaboradores,
}: AsignarFormularioProps) => {
  return (
    <div
      className="border rounded-lg shadow-lg flex flex-col overflow-hidden"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        minHeight: '600px',
      }}
    >
      <div
        className="flex border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 flex-shrink-0"
        style={{
          borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        }}
      >
        <button
          onClick={() => setActiveTab('usuario')}
          className={`flex-1 flex items-center justify-center p-4 text-sm transition-all duration-200 hover:bg-blue-100 dark:hover:bg-gray-600 ${
            activeTab === 'usuario' ? 'border-b-3 border-blue-500' : ''
          }`}
          style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            color:
              activeTab === 'usuario'
                ? theme === 'dark'
                  ? '#60a5fa'
                  : '#3b82f6'
                : theme === 'dark'
                ? '#d1d5db'
                : '#6b7280',
          }}
        >
          <FaUser
            className={`w-4 h-4 mr-2 ${
              activeTab === 'usuario' ? 'transform scale-110' : ''
            }`}
          />
          Por Usuario
        </button>
        <button
          onClick={() => setActiveTab('fecha')}
          className={`flex-1 flex items-center justify-center p-4 text-sm transition-all duration-200 hover:bg-blue-100 dark:hover:bg-gray-600 ${
            activeTab === 'fecha' ? 'border-b-3 border-blue-500' : ''
          }`}
          style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            color:
              activeTab === 'fecha'
                ? theme === 'dark'
                  ? '#60a5fa'
                  : '#3b82f6'
                : theme === 'dark'
                ? '#d1d5db'
                : '#6b7280',
          }}
        >
          <FaCalendarAlt
            className={`w-4 h-4 mr-2 ${
              activeTab === 'fecha' ? 'transform scale-110' : ''
            }`}
          />
          Por Fecha
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'usuario' ? (
          <div className="space-y-6">
            <div
              className="border-b pb-4"
              style={{
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              }}
            >
              <h3
                className="text-xl font-bold flex items-center gap-2"
                style={{
                  color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
                }}
              >
                <FaUser className="w-5 h-5" />
                ASIGNAR POR USUARIO
              </h3>
              <p
                className="text-sm mt-1"
                style={{
                  color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                }}
              >
                Asigna artículos a un usuario específico
              </p>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{
                    color: theme === 'dark' ? '#d1d5db' : '#374151',
                  }}
                >
                  <FaUserTie className="w-4 h-4 text-green-500" />
                  Asignado a:
                </label>
                <AsyncReactSelect
                  placeholder="Seleccionar usuario"
                  value={formDataUsuario.usuario}
                  onChange={(selected) =>
                    handleUsuarioFormChange('usuario', selected)
                  }
                  searchFunction={searchColaboradores}
                  optionLabelKey="nombre_completo"
                  optionValueKey="id"
                  isClearable
                  noOptionsMessage="No se encontraron usuarios"
                  menuPortalTarget={true}
                />
              </div>

              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{
                    color: theme === 'dark' ? '#d1d5db' : '#374151',
                  }}
                >
                  <FaHashtag className="w-4 h-4 text-blue-500" /># artículos
                </label>
                <input
                  type="number"
                  value={formDataUsuario.numero_articulos}
                  onChange={(e) =>
                    handleUsuarioFormChange('numero_articulos', e.target.value)
                  }
                  className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                  placeholder="Número de artículos"
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

              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{
                    color: theme === 'dark' ? '#d1d5db' : '#374151',
                  }}
                >
                  <FaUser className="w-4 h-4 text-purple-500" />
                  Tranferir a
                </label>
                <AsyncReactSelect
                  placeholder="Seleccionar usuario de destino"
                  value={formDataUsuario.pasar_a}
                  onChange={(selected) =>
                    handleUsuarioFormChange('pasar_a', selected)
                  }
                  searchFunction={searchColaboradores}
                  optionLabelKey="nombre_completo"
                  optionValueKey="id"
                  isClearable
                  noOptionsMessage="No se encontraron usuarios"
                  menuPortalTarget={true}
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleConfirmarUsuario}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 hover:shadow-lg w-full"
                >
                  Confirmar Asignación
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div
              className="border-b pb-4"
              style={{
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              }}
            >
              <h3
                className="text-xl font-bold flex items-center gap-2"
                style={{
                  color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
                }}
              >
                <FaCalendarAlt className="w-5 h-5" />
                ASIGNAR POR FECHA
              </h3>
              <p
                className="text-sm mt-1"
                style={{
                  color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                }}
              >
                Asigna artículos por rango de fechas
              </p>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{
                    color: theme === 'dark' ? '#d1d5db' : '#374151',
                  }}
                >
                  <FaUserTie className="w-4 h-4 text-green-500" />
                  Asignado a:
                </label>
                <AsyncReactSelect
                  placeholder="Seleccionar usuario"
                  value={formDataFecha.usuario}
                  onChange={(selected) =>
                    handleFechaFormChange('usuario', selected)
                  }
                  searchFunction={searchColaboradores}
                  optionLabelKey="nombre_completo"
                  optionValueKey="id"
                  isClearable
                  noOptionsMessage="No se encontraron usuarios"
                  menuPortalTarget={true}
                />
              </div>

              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{
                    color: theme === 'dark' ? '#d1d5db' : '#374151',
                  }}
                >
                  <FaCalendarAlt className="w-4 h-4 text-green-500" />
                  Fecha desde
                </label>
                <input
                  type="date"
                  value={formDataFecha.fecha_desde}
                  onChange={(e) =>
                    handleFechaFormChange('fecha_desde', e.target.value)
                  }
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

              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{
                    color: theme === 'dark' ? '#d1d5db' : '#374151',
                  }}
                >
                  <FaCalendarAlt className="w-4 h-4 text-blue-500" />
                  Fecha hasta
                </label>
                <input
                  type="date"
                  value={formDataFecha.fecha_hasta}
                  onChange={(e) =>
                    handleFechaFormChange('fecha_hasta', e.target.value)
                  }
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

              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{
                    color: theme === 'dark' ? '#d1d5db' : '#374151',
                  }}
                >
                  <FaHashtag className="w-4 h-4 text-purple-500" /># artículos
                </label>
                <input
                  type="number"
                  value={formDataFecha.numero_articulos}
                  onChange={(e) =>
                    handleFechaFormChange('numero_articulos', e.target.value)
                  }
                  className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                  placeholder="Número de artículos"
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

              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{
                    color: theme === 'dark' ? '#d1d5db' : '#374151',
                  }}
                >
                  <FaUser className="w-4 h-4 text-orange-500" />
                  Transferir a
                </label>
                <AsyncReactSelect
                  placeholder="Seleccionar usuario de destino"
                  value={formDataFecha.pasar_a}
                  onChange={(selected) =>
                    handleFechaFormChange('pasar_a', selected)
                  }
                  searchFunction={searchColaboradores}
                  optionLabelKey="nombre_completo"
                  optionValueKey="id"
                  isClearable
                  noOptionsMessage="No se encontraron usuarios"
                  menuPortalTarget={true}
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleConfirmarFecha}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 hover:shadow-lg w-full"
                >
                  Confirmar Asignación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
