import { useState } from 'react';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { toast } from 'react-hot-toast';
import {
  FaCog,
  FaList,
  FaUser,
  FaCalendarAlt,
  FaNewspaper,
  FaTv,
  FaUserEdit,
  FaTrash,
} from 'react-icons/fa';
import AsyncSelectTema from '../../../../components/asyncSelects/AsyncSelectTema';
import AsyncSelectTag from '../../../../components/asyncSelects/AsyncSelectTag';
import AsyncSelectTono from '../../../../components/asyncSelects/AsyncSelectTono';
import AsyncSelectActivoPasivo from '../../../../components/asyncSelects/AsyncSelectActivoPasivo';
import AsyncSelectTipo from '../../../../components/asyncSelects/AsyncSelectTipo';

interface RightSidebarProps {
  articuloData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  transcriptionFontSize: number;
  setTranscriptionFontSize: (size: number) => void;
  fragmentos: any[];
  onFragmentClick: (fragmento: any) => void;
  onDeleteFragment: (fragmentoId: string) => void;
  tags?: any[];
  temas?: any[];
  proyectoId?: string;
}

export const RightSidebar = ({
  articuloData,
  activeTab,
  setActiveTab,
  transcriptionFontSize,
  setTranscriptionFontSize,
  fragmentos,
  onFragmentClick,
  onDeleteFragment,
  tags,
  temas,
  proyectoId,
}: RightSidebarProps) => {
  const { theme } = useTheme();
  const [categorizationView, setCategorizationView] = useState('fragmentos');

  // Estados para almacenar las selecciones de categorización
  const [selectedTema, setSelectedTema] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<any[]>([]);
  const [selectedActivo, setSelectedActivo] = useState<any[]>([]);
  const [selectedPasivo, setSelectedPasivo] = useState<any[]>([]);
  const [selectedTono, setSelectedTono] = useState<any[]>([]);

  // Estados para categorización general
  const [selectedTemaGeneral, setSelectedTemaGeneral] = useState<any[]>([]);
  const [selectedTagGeneral, setSelectedTagGeneral] = useState<any[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<any[]>([]);

  // Funciones callback para manejar las respuestas de los AsyncSelect
  const handleTemaResponse = (response: any, input: string) => {
    if (response) {
      setSelectedTema(Array.isArray(response) ? response : [response]);
    }
  };

  const handleTagResponse = (response: any, input: string) => {
    if (response) {
      setSelectedTag(Array.isArray(response) ? response : [response]);
    }
  };

  const handleActivoResponse = (response: any, input: string) => {
    if (response) {
      setSelectedActivo(Array.isArray(response) ? response : [response]);
    }
  };

  const handlePasivoResponse = (response: any, input: string) => {
    if (response) {
      setSelectedPasivo(Array.isArray(response) ? response : [response]);
    }
  };

  const handleTonoResponse = (response: any, input: string) => {
    if (response) {
      setSelectedTono(Array.isArray(response) ? response : [response]);
    }
  };

  // Funciones callback para categorización general
  const handleTemaGeneralResponse = (response: any, input: string) => {
    if (response) {
      setSelectedTemaGeneral(Array.isArray(response) ? response : [response]);
    }
  };

  const handleTagGeneralResponse = (response: any, input: string) => {
    if (response) {
      setSelectedTagGeneral(Array.isArray(response) ? response : [response]);
    }
  };

  const handleTipoResponse = (response: any, input: string) => {
    if (response) {
      setSelectedTipo(Array.isArray(response) ? response : [response]);
    }
  };

  // Funciones de guardado
  const handleSaveFragmentCategorization = async () => {
    try {
      // Validar que se haya seleccionado al menos un tema
      if (selectedTema.length === 0) {
        toast.error('Por favor seleccione al menos un tema');
        return;
      }

      // TODO: Implementar la llamada a la API para guardar la categorización por fragmento
      console.log('Guardando categorización por fragmento:', {
        tema: selectedTema,
        tag: selectedTag,
        activo: selectedActivo,
        pasivo: selectedPasivo,
        tono: selectedTono,
        tipo: selectedTipo,
      });

      toast.success('Categorización por fragmento guardada exitosamente');

      // Limpiar selecciones después de guardar
      setSelectedTema([]);
      setSelectedTag([]);
      setSelectedActivo([]);
      setSelectedPasivo([]);
      setSelectedTono([]);
      setSelectedTipo([]);
    } catch (error) {
      console.error('Error al guardar categorización por fragmento:', error);
      toast.error('Error al guardar la categorización por fragmento');
    }
  };

  const handleSaveGeneralCategorization = async () => {
    try {
      // Validar que se haya seleccionado al menos un tema
      if (selectedTemaGeneral.length === 0) {
        toast.error('Por favor seleccione al menos un tema');
        return;
      }

      // TODO: Implementar la llamada a la API para guardar la categorización general
      console.log('Guardando categorización general:', {
        tema: selectedTemaGeneral,
        tag: selectedTagGeneral,
      });

      toast.success('Categorización general guardada exitosamente');

      // Limpiar selecciones después de guardar
      setSelectedTemaGeneral([]);
      setSelectedTagGeneral([]);
    } catch (error) {
      console.error('Error al guardar categorización general:', error);
      toast.error('Error al guardar la categorización general');
    }
  };

  const handleCancelFragmentCategorization = () => {
    setSelectedTema([]);
    setSelectedTag([]);
    setSelectedActivo([]);
    setSelectedPasivo([]);
    setSelectedTono([]);
    setSelectedTipo([]);
    toast.success('Categorización por fragmento cancelada');
  };

  const handleCancelGeneralCategorization = () => {
    setSelectedTemaGeneral([]);
    setSelectedTagGeneral([]);
    toast.success('Categorización general cancelada');
  };

  const tabs = [
    { id: 'info', icon: FaList, label: 'Información' },
    { id: 'categorization', icon: FaUser, label: 'Categorización' },
    { id: 'settings', icon: FaCog, label: 'Configuración' },
  ];

  const increaseFontSize = () => {
    setTranscriptionFontSize(Math.min(transcriptionFontSize + 2, 24));
  };

  const decreaseFontSize = () => {
    setTranscriptionFontSize(Math.max(transcriptionFontSize - 2, 12));
  };

  return (
    <div
      className="w-96 h-full border-l shadow-lg flex flex-col min-h-0"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
      }}
    >
      {/* Tab Navigation */}
      <div
        className="flex border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 flex-shrink-0"
        style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center p-4 text-sm transition-all duration-200 hover:bg-blue-100 dark:hover:bg-gray-600 ${
              activeTab === tab.id ? 'border-b-3 border-blue-500' : ''
            }`}
            style={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              color:
                activeTab === tab.id
                  ? theme === 'dark'
                    ? '#60a5fa'
                    : '#3b82f6'
                  : theme === 'dark'
                  ? '#d1d5db'
                  : '#6b7280',
            }}
          >
            <tab.icon
              className={`w-5 h-5 ${
                activeTab === tab.id ? 'transform scale-110' : ''
              }`}
            />
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Información del artículo */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div
              className="border-b pb-4"
              style={{
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              }}
            >
              <h3
                className="text-xl font-bold flex items-center gap-2"
                style={{ color: theme === 'dark' ? '#60a5fa' : '#3b82f6' }}
              >
                <FaUser className="w-5 h-5" />
                ENCABEZADO
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                Información general del artículo
              </p>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
                >
                  <FaList className="w-4 h-4 text-blue-500" />
                  Tipo
                </label>
                <AsyncSelectTipo
                  sendResponse={handleTipoResponse}
                  placeholder="Seleccionar tipo"
                  isMulti={false}
                  name="tipo"
                />
              </div>

              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
                >
                  <FaCalendarAlt className="w-4 h-4 text-green-500" />
                  Fecha
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                  defaultValue={new Date(articuloData.fecha)
                    .toISOString()
                    .slice(0, 16)}
                  style={{
                    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                    color: theme === 'dark' ? '#ffffff' : '#374151',
                  }}
                />
              </div>

              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
                >
                  <FaNewspaper className="w-4 h-4 text-purple-500" />
                  Medio
                </label>
                <select
                  className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                  style={{
                    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                    color: theme === 'dark' ? '#ffffff' : '#374151',
                  }}
                >
                  <option>{articuloData.medio.nombre}</option>
                </select>
              </div>

              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
                >
                  <FaTv className="w-4 h-4 text-orange-500" />
                  Programa
                </label>
                <select
                  className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                  style={{
                    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                    color: theme === 'dark' ? '#ffffff' : '#374151',
                  }}
                >
                  <option>Select...</option>
                </select>
              </div>

              <div className="group">
                <label
                  className="flex items-center gap-2 text-sm font-semibold mb-2"
                  style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
                >
                  <FaUserEdit className="w-4 h-4 text-indigo-500" />
                  Autor
                </label>
                <select
                  className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                  style={{
                    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                    color: theme === 'dark' ? '#ffffff' : '#374151',
                  }}
                >
                  <option>Buscar</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                className="flex-1 py-3 px-4 border rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: theme === 'dark' ? 'transparent' : '#ffffff',
                  borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: theme === 'dark' ? '#d1d5db' : '#374151',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor =
                    theme === 'dark' ? '#374151' : '#f9fafb';
                  (e.target as HTMLElement).style.borderColor =
                    theme === 'dark' ? '#6b7280' : '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor =
                    theme === 'dark' ? 'transparent' : '#ffffff';
                  (e.target as HTMLElement).style.borderColor =
                    theme === 'dark' ? '#4b5563' : '#d1d5db';
                }}
              >
                Cancelar
              </button>
              <button className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 hover:shadow-lg">
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* Categorización */}
        {activeTab === 'categorization' && (
          <div className="space-y-6">
            <div
              className="border-b pb-4"
              style={{
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              }}
            >
              <h3
                className="text-xl font-bold flex items-center gap-2"
                style={{ color: theme === 'dark' ? '#60a5fa' : '#3b82f6' }}
              >
                <FaCog className="w-5 h-5" />
                CATEGORIZACIÓN
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                Organización y clasificación del contenido
              </p>
            </div>

            {/* Pestañas de categorización */}
            <div
              className="flex border-b rounded-lg p-1"
              style={{
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
              }}
            >
              <button
                onClick={() => setCategorizationView('fragmentos')}
                className="flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 shadow-sm"
                style={{
                  backgroundColor:
                    categorizationView === 'fragmentos'
                      ? theme === 'dark'
                        ? '#1f2937'
                        : '#ffffff'
                      : 'transparent',
                  color:
                    categorizationView === 'fragmentos'
                      ? theme === 'dark'
                        ? '#60a5fa'
                        : '#2563eb'
                      : theme === 'dark'
                      ? '#9ca3af'
                      : '#6b7280',
                }}
              >
                Por fragmentos
              </button>
              <button
                onClick={() => setCategorizationView('general')}
                className="flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 shadow-sm"
                style={{
                  backgroundColor:
                    categorizationView === 'general'
                      ? theme === 'dark'
                        ? '#1f2937'
                        : '#ffffff'
                      : 'transparent',
                  color:
                    categorizationView === 'general'
                      ? theme === 'dark'
                        ? '#60a5fa'
                        : '#2563eb'
                      : theme === 'dark'
                      ? '#9ca3af'
                      : '#6b7280',
                }}
              >
                General
              </button>
            </div>

            {categorizationView === 'fragmentos' && (
              <div className="space-y-4">
                <div
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
                  }}
                >
                  <h4
                    className="font-semibold mb-3 flex items-center gap-2"
                    style={{
                      color: theme === 'dark' ? '#d1d5db' : '#374151',
                    }}
                  >
                    <FaList className="w-4 h-4 text-blue-500" />
                    Fragmentos ({fragmentos.length})
                  </h4>

                  {fragmentos.length === 0 ? (
                    <div className="text-center py-6">
                      <div
                        className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#1e3a8a' : '#dbeafe',
                        }}
                      >
                        <FaList
                          className="w-8 h-8"
                          style={{
                            color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
                          }}
                        />
                      </div>
                      <p
                        className="text-sm"
                        style={{
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        Aún no hay fragmentos
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{
                          color: theme === 'dark' ? '#6b7280' : '#9ca3af',
                        }}
                      >
                        Selecciona texto del artículo para crear fragmentos
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {fragmentos.map((fragmento, index) => (
                        <div
                          key={fragmento.id}
                          className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200"
                          style={{
                            backgroundColor:
                              theme === 'dark' ? '#1f2937' : '#ffffff',
                            borderColor:
                              theme === 'dark' ? '#4b5563' : '#e5e7eb',
                          }}
                          onClick={() => onFragmentClick(fragmento)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{
                                  backgroundColor:
                                    theme === 'dark' ? '#7c3aed' : '#a855f7',
                                  color: '#ffffff',
                                }}
                              >
                                {index + 1}
                              </div>
                              <span
                                className="text-xs font-medium"
                                style={{
                                  color:
                                    theme === 'dark' ? '#9ca3af' : '#6b7280',
                                }}
                              >
                                {fragmento.categoria}
                              </span>
                            </div>
                            <span
                              className="text-xs"
                              style={{
                                color: theme === 'dark' ? '#6b7280' : '#9ca3af',
                              }}
                            >
                              {fragmento.posicion_inicio}-
                              {fragmento.posicion_fin}
                            </span>
                          </div>
                          <p
                            className="text-sm line-clamp-3"
                            style={{
                              color: theme === 'dark' ? '#d1d5db' : '#374151',
                            }}
                          >
                            {fragmento.texto}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor:
                                  theme === 'dark' ? '#065f46' : '#d1fae5',
                                color: theme === 'dark' ? '#a7f3d0' : '#065f46',
                              }}
                            >
                              {fragmento.tono}
                            </span>
                            {fragmento.tags && fragmento.tags.length > 0 && (
                              <span
                                className="text-xs px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor:
                                    theme === 'dark' ? '#1e40af' : '#dbeafe',
                                  color:
                                    theme === 'dark' ? '#93c5fd' : '#1e40af',
                                }}
                              >
                                {fragmento.tags.length} tag
                                {fragmento.tags.length > 1 ? 's' : ''}
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteFragment(fragmento.id);
                              }}
                              className="ml-auto text-red-500 hover:text-red-600 transition-colors duration-200 p-1 cursor-pointer"
                              title="Eliminar fragmento"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="group">
                    <label
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      }}
                    >
                      <FaList className="w-4 h-4 text-green-500" />
                      Tema
                    </label>
                    <AsyncSelectTema
                      projectId={proyectoId ? parseInt(proyectoId) : 1}
                      sendResponse={handleTemaResponse}
                      placeholder="Seleccionar tema"
                      isMulti={true}
                      name="tema"
                    />
                  </div>

                  <div className="group">
                    <label
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      }}
                    >
                      <FaList className="w-4 h-4 text-purple-500" />
                      Tag
                    </label>
                    <AsyncSelectTag
                      projectId={proyectoId ? parseInt(proyectoId) : 1}
                      sendResponse={handleTagResponse}
                      placeholder="Seleccionar tag"
                      isMulti={true}
                      name="tag"
                    />
                  </div>

                  <div className="group">
                    <label
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      }}
                    >
                      <FaUser className="w-4 h-4 text-blue-500" />
                      Activo
                    </label>
                    <AsyncSelectActivoPasivo
                      sendResponse={handleActivoResponse}
                      placeholder="Seleccionar activo"
                      isMulti={true}
                      name="activo"
                      isDisabled={false}
                      value={selectedActivo}
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
                      Pasivo
                    </label>
                    <AsyncSelectActivoPasivo
                      sendResponse={handlePasivoResponse}
                      placeholder="Seleccionar pasivo"
                      isMulti={true}
                      name="pasivo"
                      isDisabled={false}
                      value={selectedPasivo}
                    />
                  </div>

                  <div className="group">
                    <label
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      }}
                    >
                      <FaCog className="w-4 h-4 text-indigo-500" />
                      Tonalidad
                    </label>
                    <AsyncSelectTono
                      sendResponse={handleTonoResponse}
                      placeholder="Seleccionar tonalidad"
                      isMulti={false}
                      name="tonalidad"
                    />
                  </div>
                </div>

                <div
                  className="border rounded-lg p-4 text-center"
                  style={{
                    backgroundColor: theme === 'dark' ? '#78350f' : '#fef3c7',
                    borderColor: theme === 'dark' ? '#92400e' : '#f59e0b',
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: theme === 'dark' ? '#fde68a' : '#92400e',
                    }}
                  >
                    Por favor seleccione un fragmento
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: theme === 'dark' ? '#f59e0b' : '#d97706',
                    }}
                  >
                    Selecciona texto del artículo para continuar
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCancelFragmentCategorization}
                    className="flex-1 py-3 px-4 border rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor:
                        theme === 'dark' ? 'transparent' : '#ffffff',
                      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                      color: theme === 'dark' ? '#d1d5db' : '#374151',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        theme === 'dark' ? '#374151' : '#f9fafb';
                      (e.target as HTMLElement).style.borderColor =
                        theme === 'dark' ? '#6b7280' : '#9ca3af';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        theme === 'dark' ? 'transparent' : '#ffffff';
                      (e.target as HTMLElement).style.borderColor =
                        theme === 'dark' ? '#4b5563' : '#d1d5db';
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveFragmentCategorization}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 hover:shadow-lg"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {categorizationView === 'general' && (
              <div className="space-y-6">
                <div
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
                  }}
                >
                  <h4
                    className="font-semibold mb-3 flex items-center gap-2"
                    style={{
                      color: theme === 'dark' ? '#d1d5db' : '#374151',
                    }}
                  >
                    <FaCog className="w-4 h-4 text-blue-500" />
                    Categoría General
                  </h4>
                  <div className="group">
                    <label
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      }}
                    >
                      <FaList className="w-4 h-4 text-blue-500" />
                      Tema
                    </label>
                    <AsyncSelectTema
                      projectId={proyectoId ? parseInt(proyectoId) : 1}
                      sendResponse={handleTemaGeneralResponse}
                      placeholder="Seleccionar tema"
                      isMulti={true}
                      name="temaGeneral"
                    />
                  </div>
                  <div className="group">
                    <label
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      }}
                    >
                      <FaList className="w-4 h-4 text-purple-500" />
                      Tag
                    </label>
                    <AsyncSelectTag
                      projectId={proyectoId ? parseInt(proyectoId) : 1}
                      sendResponse={handleTagGeneralResponse}
                      placeholder="Seleccionar tag"
                      isMulti={true}
                      name="tagGeneral"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelGeneralCategorization}
                    className="flex-1 py-3 px-4 border rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor:
                        theme === 'dark' ? 'transparent' : '#ffffff',
                      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                      color: theme === 'dark' ? '#d1d5db' : '#374151',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        theme === 'dark' ? '#374151' : '#f9fafb';
                      (e.target as HTMLElement).style.borderColor =
                        theme === 'dark' ? '#6b7280' : '#9ca3af';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        theme === 'dark' ? 'transparent' : '#ffffff';
                      (e.target as HTMLElement).style.borderColor =
                        theme === 'dark' ? '#4b5563' : '#d1d5db';
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveGeneralCategorization}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 hover:shadow-lg"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Configuración */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div
              className="border-b pb-4"
              style={{
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              }}
            >
              <h3
                className="text-xl font-bold flex items-center gap-2"
                style={{ color: theme === 'dark' ? '#60a5fa' : '#3b82f6' }}
              >
                <FaCog className="w-5 h-5" />
                PERSONALIZACIÓN
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                Configuración de la interfaz
              </p>
            </div>

            <div className="space-y-6">
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
                }}
              >
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
                >
                  Tamaño letra
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={decreaseFontSize}
                    className="w-12 h-12 flex items-center justify-center border rounded-lg transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                      color: theme === 'dark' ? '#ffffff' : '#374151',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        theme === 'dark' ? '#1e3a8a' : '#dbeafe';
                      (e.target as HTMLElement).style.borderColor =
                        theme === 'dark' ? '#3b82f6' : '#60a5fa';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        theme === 'dark' ? '#374151' : '#ffffff';
                      (e.target as HTMLElement).style.borderColor =
                        theme === 'dark' ? '#4b5563' : '#d1d5db';
                    }}
                  >
                    <span className="text-lg font-bold">−</span>
                  </button>
                  <div className="flex flex-col items-center">
                    <span
                      className="text-2xl font-bold"
                      style={{
                        color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
                      }}
                    >
                      Aa
                    </span>
                    <span
                      className="text-xs mt-1"
                      style={{
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                      }}
                    >
                      {transcriptionFontSize}px
                    </span>
                  </div>
                  <button
                    onClick={increaseFontSize}
                    className="w-12 h-12 flex items-center justify-center border rounded-lg transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                      color: theme === 'dark' ? '#ffffff' : '#374151',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        theme === 'dark' ? '#1e3a8a' : '#dbeafe';
                      (e.target as HTMLElement).style.borderColor =
                        theme === 'dark' ? '#3b82f6' : '#60a5fa';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor =
                        theme === 'dark' ? '#374151' : '#ffffff';
                      (e.target as HTMLElement).style.borderColor =
                        theme === 'dark' ? '#4b5563' : '#d1d5db';
                    }}
                  >
                    <span className="text-lg font-bold">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
