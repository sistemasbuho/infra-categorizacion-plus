import React, { useState } from 'react';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { toast } from 'react-hot-toast';
import { FaCog, FaList, FaUser, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import {
  updateArticuloHeader,
  buscarTiposPublicacion,
  buscarMedios,
  buscarAutores,
  buscarProgramas,
  updateCategorizacionGeneral,
} from '../../../../services/fragmentoRequest';
import { AsyncReactSelect } from '../../../../components/forms/AsyncReactSelect';
import Select from 'react-select';

interface RightSidebarProps {
  articuloData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  transcriptionFontSize: number;
  setTranscriptionFontSize: (size: number) => void;
  fragmentos: any[];
  temporalFragments: any[];
  onFragmentClick: (fragmento: any) => void;
  onDeleteFragment: (fragmentoId: string) => void;
  tags?: any[];
  temas?: any[];
  tonos?: any[];
  activos?: any[];
  pasivos?: any[];
  tipo?: any[];
  proyectoId?: string;
  onRefreshData?: () => void;
  selectedText?: string;
  selectedRange?: { start: number; end: number } | null;
  onCreateFragment?: (fragmentoData: any) => void;
  onUpdateFragment?: (fragmentoId: string, fragmentoData: any) => void;
  removeTemporalFragment?: (temporalId: string) => void;
  clearTemporalFragments?: () => void;
}

export const RightSidebar = ({
  articuloData,
  activeTab,
  setActiveTab,
  transcriptionFontSize,
  setTranscriptionFontSize,
  fragmentos,
  temporalFragments,
  onFragmentClick,
  onDeleteFragment,
  tags,
  temas,
  tonos,
  activos,
  pasivos,
  onRefreshData,
  selectedText,
  selectedRange,
  onCreateFragment,
  onUpdateFragment,
  removeTemporalFragment,
}: RightSidebarProps) => {
  const { theme } = useTheme();
  const [categorizationView, setCategorizationView] = useState('fragmentos');
  const [selectedTema, setSelectedTema] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<any[]>([]);
  const [selectedActivo, setSelectedActivo] = useState<any[]>([]);
  const [selectedPasivo, setSelectedPasivo] = useState<any[]>([]);
  const [selectedTono, setSelectedTono] = useState<any[]>([]);

  const [selectedTemaGeneral, setSelectedTemaGeneral] = useState<any[]>([]);
  const [selectedTagGeneral, setSelectedTagGeneral] = useState<any[]>([]);

  const [selectedTipoPublicacion, setSelectedTipoPublicacion] = useState<any>(
    () => {
      return articuloData.tipo_publicacion
        ? {
            nombre: articuloData.tipo_publicacion,
            id: articuloData.tipo_publicacion,
          }
        : null;
    }
  );

  const [selectedMedio, setSelectedMedio] = useState<any>(() => {
    return articuloData.medio?.nombre
      ? {
          nombre: articuloData.medio.nombre,
          uuid: articuloData.medio.id || articuloData.medio.nombre,
        }
      : null;
  });

  const [selectedAutor, setSelectedAutor] = useState<any>(() => {
    return articuloData.autor
      ? {
          nombre: articuloData.autor,
          uuid: articuloData.autor,
        }
      : null;
  });

  const [selectedPrograma, setSelectedPrograma] = useState<any>(null);
  const [selectedFragmento, setSelectedFragmento] = useState<any>(null);

  const [fechaArticulo, setFechaArticulo] = useState<string>(() => {
    try {
      const date = new Date(articuloData.fecha);
      return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16);
    } catch (error) {
      return '';
    }
  });

  const handleFechaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = event.target.value;
    setFechaArticulo(nuevaFecha);
  };

  const handleSaveHeaderInfo = async () => {
    try {
      const headerData: {
        fecha_publicacion?: string;
        medio?: string;
        autor?: string;
        tipo_publicacion?: string;
        programa?: string;
      } = {};

      if (fechaArticulo) {
        const fechaISO = new Date(fechaArticulo).toISOString();
        headerData.fecha_publicacion = fechaISO;
      }

      if (selectedTipoPublicacion) {
        headerData.tipo_publicacion = selectedTipoPublicacion.nombre;
      }

      if (selectedMedio) {
        headerData.medio = selectedMedio.nombre;
      }

      if (selectedAutor) {
        headerData.autor = selectedAutor.nombre;
      }

      if (selectedPrograma) {
        headerData.programa = selectedPrograma.nombre;
      }

      await updateArticuloHeader(articuloData.id, headerData);

      toast.success('Información del encabezado guardada exitosamente');

      if (onRefreshData) {
        onRefreshData();
      }
    } catch (error) {
      console.error('Error al guardar la información del encabezado:', error);
      toast.error('Error al guardar la información del encabezado');
    }
  };

  const handleCancelHeaderInfo = () => {
    try {
      const date = new Date(articuloData.fecha);
      setFechaArticulo(
        isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16)
      );
    } catch (error) {
      setFechaArticulo('');
    }

    setSelectedTipoPublicacion(
      articuloData.tipo_publicacion
        ? {
            nombre: articuloData.tipo_publicacion,
            id: articuloData.tipo_publicacion,
          }
        : null
    );

    setSelectedMedio(
      articuloData.medio?.nombre
        ? {
            nombre: articuloData.medio.nombre,
            uuid: articuloData.medio.id || articuloData.medio.nombre,
          }
        : null
    );

    setSelectedAutor(
      articuloData.autor
        ? {
            nombre: articuloData.autor,
            uuid: articuloData.autor,
          }
        : null
    );

    setSelectedPrograma(null);

    toast.success('Cambios cancelados');
  };

  const handleFragmentSelection = (fragmento: any) => {
    if (selectedFragmento?.id === fragmento.id) {
      setSelectedFragmento(null);
      onFragmentClick(null);

      setSelectedTema([]);
      setSelectedTag([]);
      setSelectedActivo([]);
      setSelectedPasivo([]);
      setSelectedTono([]);

      return;
    }

    setSelectedFragmento(fragmento);
    onFragmentClick(fragmento);

    if (fragmento.isTemporary || fragmento.categoria === 'temporal') {
      setSelectedTema([]);
      setSelectedTag([]);
      setSelectedActivo([]);
      setSelectedPasivo([]);
      setSelectedTono([]);

      return;
    }

    const temaOptions = (fragmento.temas || [])
      .map((tema: any) => {
        if (typeof tema === 'object' && tema.id && tema.nombre) {
          return tema;
        }
        if (typeof tema === 'string') {
          return temas?.find((t) => t.id === tema) || null;
        }
        return null;
      })
      .filter(Boolean);

    const tagOptions = (fragmento.tag || fragmento.tags || [])
      .map((tag: any) => {
        if (typeof tag === 'object' && tag.id && tag.nombre) {
          return tag;
        }
        if (typeof tag === 'string') {
          return tags?.find((t) => t.id === tag) || null;
        }
        return null;
      })
      .filter(Boolean);

    const activoOptions = (fragmento.activo_data || fragmento.activo || [])
      .map((activo: any) => {
        if (typeof activo === 'object' && activo.id && activo.nombre) {
          return activo;
        }
        if (typeof activo === 'string') {
          return activos?.find((a) => a.id === activo) || null;
        }
        return null;
      })
      .filter(Boolean);

    const pasivoOptions = (fragmento.pasivo_data || fragmento.pasivo || [])
      .map((pasivo: any) => {
        if (typeof pasivo === 'object' && pasivo.id && pasivo.nombre) {
          return pasivo;
        }
        if (typeof pasivo === 'string') {
          return pasivos?.find((p) => p.id === pasivo) || null;
        }
        return null;
      })
      .filter(Boolean);

    let tonoOption = null;
    const tonoData = fragmento.tonoOriginal || fragmento.tono;
    if (tonoData) {
      if (typeof tonoData === 'object' && tonoData.id && tonoData.nombre) {
        tonoOption = tonoData;
      } else if (typeof tonoData === 'string') {
        tonoOption =
          tonos?.find((t) => t.id === tonoData || t.nombre === tonoData) ||
          null;
      }
    }

    const transformedTemas = temaOptions.map((tema: any) => ({
      id: tema.id,
      nombre: tema.nombre,
      value: tema.id,
      label: tema.nombre,
    }));

    const transformedTags = tagOptions.map((tag: any) => ({
      id: tag.id,
      nombre: tag.nombre,
      value: tag.id,
      label: tag.nombre,
    }));

    const transformedActivos = activoOptions.map((activo: any) => ({
      id: activo.id,
      nombre: activo.nombre,
      value: activo.id,
      label: activo.nombre,
    }));

    const transformedPasivos = pasivoOptions.map((pasivo: any) => ({
      id: pasivo.id,
      nombre: pasivo.nombre,
      value: pasivo.id,
      label: pasivo.nombre,
    }));

    const transformedTono = tonoOption
      ? [
          {
            id: tonoOption.id,
            nombre: tonoOption.nombre,
            value: tonoOption.id,
            label: tonoOption.nombre,
          },
        ]
      : [];

    setSelectedTema(transformedTemas);
    setSelectedTag(transformedTags);
    setSelectedActivo(transformedActivos);
    setSelectedPasivo(transformedPasivos);
    setSelectedTono(transformedTono);
  };

  const handleSaveFragmentCategorization = async () => {
    try {
      if (selectedTema.length === 0) {
        toast.error('Por favor seleccione al menos un tema');
        return;
      }

      if (selectedTono.length === 0) {
        toast.error('Por favor seleccione una tonalidad');
        return;
      }

      const fragmentoData = {
        tema_ids: selectedTema.map((t: any) => t.id),
        tag_ids: selectedTag.map((t: any) => t.id),
        activo: selectedActivo.map((a: any) => a.id),
        pasivo: selectedPasivo.map((p: any) => p.id),
        tono_id: selectedTono[0]?.id,
      };

      if (selectedFragmento) {
        if (
          selectedFragmento.isTemporary ||
          selectedFragmento.categoria === 'temporal'
        ) {
          const createData = {
            texto: selectedFragmento.texto,
            indice_inicial: selectedFragmento.posicion_inicio.toString(),
            indice_final: selectedFragmento.posicion_fin.toString(),
            tema_ids: fragmentoData.tema_ids,
            tag_ids: fragmentoData.tag_ids,
            tono_id: fragmentoData.tono_id,
            activo: fragmentoData.activo,
            pasivo: fragmentoData.pasivo,
          };

          if (onCreateFragment) {
            await onCreateFragment(createData);
          }

          if (removeTemporalFragment) {
            removeTemporalFragment(selectedFragmento.id);
          }
        } else {
          const updateData = {
            texto: selectedFragmento.texto,
            tema_ids: fragmentoData.tema_ids,
            tag_ids: fragmentoData.tag_ids,
            tono_id: fragmentoData.tono_id,
            activo: fragmentoData.activo,
            pasivo: fragmentoData.pasivo,
          };

          if (onUpdateFragment) {
            await onUpdateFragment(selectedFragmento.id, updateData);
          }
        }
      } else if (selectedText && selectedRange) {
        const createData = {
          texto: selectedText,
          indice_inicial: selectedRange.start.toString(),
          indice_final: selectedRange.end.toString(),
          tema_ids: fragmentoData.tema_ids,
          tag_ids: fragmentoData.tag_ids,
          tono_id: fragmentoData.tono_id,
          activo: fragmentoData.activo,
          pasivo: fragmentoData.pasivo,
        };

        if (onCreateFragment) {
          await onCreateFragment(createData);
        }
      } else {
        toast.error('Por favor seleccione texto o un fragmento existente');
        return;
      }

      // Limpiar selecciones
      setSelectedTema([]);
      setSelectedTag([]);
      setSelectedActivo([]);
      setSelectedPasivo([]);
      setSelectedTono([]);
      setSelectedFragmento(null);

      // Refrescar datos
      if (onRefreshData) {
        onRefreshData();
      }

      toast.success('Fragmento guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar categorización por fragmento:', error);
      toast.error('Error al guardar la categorización por fragmento');
    }
  };

  const handleSaveGeneralCategorization = async () => {
    try {
      if (selectedTemaGeneral.length === 0) {
        toast.error('Por favor seleccione al menos un tema');
        return;
      }

      const data: {
        tema_general?: string[];
        tag_general?: string[];
      } = {};

      if (selectedTemaGeneral.length > 0) {
        data.tema_general = selectedTemaGeneral.map((tema) => tema.id);
      }

      if (selectedTagGeneral.length > 0) {
        data.tag_general = selectedTagGeneral.map((tag) => tag.id);
      }

      await updateCategorizacionGeneral(articuloData.id, data);

      toast.success('Categorización general guardada exitosamente');

      if (onRefreshData) {
        onRefreshData();
      }
    } catch (error) {
      console.error('Error al guardar categorización general:', error);
      toast.error('Error al guardar la categorización general');
    }
  };

  const handleCancelFragmentCategorization = () => {
    if (
      selectedFragmento &&
      (selectedFragmento.isTemporary ||
        selectedFragmento.categoria === 'temporal')
    ) {
      if (removeTemporalFragment) {
        removeTemporalFragment(selectedFragmento.id);
      }
    }

    setSelectedTema([]);
    setSelectedTag([]);
    setSelectedActivo([]);
    setSelectedPasivo([]);
    setSelectedTono([]);
    setSelectedFragmento(null);
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

      <div className="flex-1 p-6 overflow-y-auto">
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
                <AsyncReactSelect
                  label="Tipo"
                  placeholder="Tipo de Publicación"
                  value={selectedTipoPublicacion}
                  onChange={setSelectedTipoPublicacion}
                  searchFunction={buscarTiposPublicacion}
                  optionLabelKey="nombre"
                  optionValueKey="id"
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
                  value={fechaArticulo}
                  onChange={handleFechaChange}
                  style={{
                    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                    color: theme === 'dark' ? '#ffffff' : '#374151',
                  }}
                />
              </div>

              <div className="group">
                <AsyncReactSelect
                  label="Medio"
                  placeholder="Buscar medio..."
                  value={selectedMedio}
                  onChange={setSelectedMedio}
                  searchFunction={buscarMedios}
                  optionLabelKey="nombre"
                  optionValueKey="uuid"
                />
              </div>

              <div className="group">
                <AsyncReactSelect
                  label="Programa"
                  placeholder="Buscar programa..."
                  value={selectedPrograma}
                  onChange={setSelectedPrograma}
                  searchFunction={buscarProgramas}
                  optionLabelKey="nombre"
                  optionValueKey="id"
                />
              </div>

              <div className="group">
                <AsyncReactSelect
                  label="Autor"
                  placeholder="Buscar autor..."
                  value={selectedAutor}
                  onChange={setSelectedAutor}
                  searchFunction={buscarAutores}
                  optionLabelKey="nombre"
                  optionValueKey="uuid"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleCancelHeaderInfo}
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
              <button
                onClick={handleSaveHeaderInfo}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 hover:shadow-lg"
              >
                Guardar
              </button>
            </div>
          </div>
        )}

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
                    Fragmentos ({fragmentos.length + temporalFragments.length})
                  </h4>

                  {fragmentos.length === 0 && temporalFragments.length === 0 ? (
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
                      {[...fragmentos, ...temporalFragments].map(
                        (fragmento, index) => {
                          const isSelected =
                            selectedFragmento?.id === fragmento.id;
                          const isTemporary =
                            fragmento.isTemporary ||
                            fragmento.categoria === 'temporal';

                          return (
                            <div
                              key={fragmento.id}
                              className={`border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 ${
                                isSelected
                                  ? 'ring-2 ring-blue-500 ring-opacity-50'
                                  : ''
                              }`}
                              style={{
                                backgroundColor: isSelected
                                  ? theme === 'dark'
                                    ? '#1e3a8a'
                                    : '#dbeafe'
                                  : theme === 'dark'
                                  ? '#1f2937'
                                  : '#ffffff',
                                borderColor: isSelected
                                  ? theme === 'dark'
                                    ? '#3b82f6'
                                    : '#3b82f6'
                                  : theme === 'dark'
                                  ? '#4b5563'
                                  : '#e5e7eb',
                              }}
                              onClick={() => handleFragmentSelection(fragmento)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                  <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{
                                      backgroundColor: isTemporary
                                        ? theme === 'dark'
                                          ? '#f59e0b'
                                          : '#fbbf24'
                                        : theme === 'dark'
                                        ? '#7c3aed'
                                        : '#a855f7',
                                      color: '#ffffff',
                                    }}
                                  >
                                    {isTemporary ? 'T' : index + 1}
                                  </div>
                                  <p
                                    className="text-sm line-clamp-2 flex-1"
                                    style={{
                                      color:
                                        theme === 'dark'
                                          ? '#d1d5db'
                                          : '#374151',
                                    }}
                                  >
                                    {fragmento.texto}
                                  </p>
                                </div>
                                <span
                                  className="text-xs ml-2 flex-shrink-0"
                                  style={{
                                    color:
                                      theme === 'dark' ? '#6b7280' : '#9ca3af',
                                  }}
                                >
                                  {fragmento.posicion_inicio}-
                                  {fragmento.posicion_fin}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-2">
                                {!isTemporary && (
                                  <span
                                    className="text-xs px-2 py-1 rounded-full"
                                    style={{
                                      backgroundColor:
                                        theme === 'dark'
                                          ? '#065f46'
                                          : '#d1fae5',
                                      color:
                                        theme === 'dark'
                                          ? '#a7f3d0'
                                          : '#065f46',
                                    }}
                                  >
                                    {fragmento.tono?.nombre || fragmento.tono}
                                  </span>
                                )}
                                {isTemporary && (
                                  <span
                                    className="text-xs px-2 py-1 rounded-full"
                                    style={{
                                      backgroundColor:
                                        theme === 'dark'
                                          ? '#7c2d12'
                                          : '#fed7aa',
                                      color:
                                        theme === 'dark'
                                          ? '#fed7aa'
                                          : '#7c2d12',
                                    }}
                                  >
                                    Sin categorizar
                                  </span>
                                )}
                                {!isTemporary &&
                                  (fragmento.tag || fragmento.tags) &&
                                  (fragmento.tag || fragmento.tags).length >
                                    0 && (
                                    <span
                                      className="text-xs px-2 py-1 rounded-full"
                                      style={{
                                        backgroundColor:
                                          theme === 'dark'
                                            ? '#1e40af'
                                            : '#dbeafe',
                                        color:
                                          theme === 'dark'
                                            ? '#93c5fd'
                                            : '#1e40af',
                                      }}
                                    >
                                      {(fragmento.tag || fragmento.tags).length}{' '}
                                      tag
                                      {(fragmento.tag || fragmento.tags)
                                        .length > 1
                                        ? 's'
                                        : ''}
                                    </span>
                                  )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isTemporary) {
                                      removeTemporalFragment?.(fragmento.id);
                                    } else {
                                      onDeleteFragment(fragmento.id);
                                    }
                                  }}
                                  className="ml-auto text-red-500 hover:text-red-600 transition-colors duration-200 p-1 cursor-pointer"
                                  title={
                                    isTemporary
                                      ? 'Eliminar fragmento temporal'
                                      : 'Eliminar fragmento'
                                  }
                                >
                                  <FaTrash className="w-3 h-3" />
                                </button>
                                {isTemporary && (
                                  <span
                                    className="text-xs px-2 py-1 rounded-full"
                                    style={{
                                      backgroundColor:
                                        theme === 'dark'
                                          ? '#f59e0b'
                                          : '#fbbf24',
                                      color:
                                        theme === 'dark'
                                          ? '#1f2937'
                                          : '#ffffff',
                                    }}
                                  >
                                    Temporal
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
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
                      <span
                        className="ml-2 text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        {temas?.length || 0} opciones
                      </span>
                    </label>
                    <Select
                      isMulti
                      placeholder="Seleccionar tema..."
                      value={selectedTema}
                      onChange={(selectedOptions) =>
                        setSelectedTema(Array.from(selectedOptions || []))
                      }
                      options={
                        temas?.map((tema: any) => ({
                          id: tema.id,
                          nombre: tema.nombre,
                          value: tema.id,
                          label: tema.nombre,
                        })) || []
                      }
                      isSearchable={false}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                          borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? '#3b82f6'
                            : state.isFocused
                            ? theme === 'dark'
                              ? '#4b5563'
                              : '#f3f4f6'
                            : theme === 'dark'
                            ? '#374151'
                            : '#ffffff',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
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
                      <FaList className="w-4 h-4 text-purple-500" />
                      Tag
                      <span
                        className="ml-2 text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        {tags?.length || 0} opciones
                      </span>
                    </label>
                    <Select
                      isMulti
                      placeholder="Seleccionar tag..."
                      value={selectedTag}
                      onChange={(selectedOptions) =>
                        setSelectedTag(Array.from(selectedOptions || []))
                      }
                      options={
                        tags?.map((tag: any) => ({
                          id: tag.id,
                          nombre: tag.nombre,
                          value: tag.id,
                          label: tag.nombre,
                        })) || []
                      }
                      isSearchable={false}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                          borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? '#3b82f6'
                            : state.isFocused
                            ? theme === 'dark'
                              ? '#4b5563'
                              : '#f3f4f6'
                            : theme === 'dark'
                            ? '#374151'
                            : '#ffffff',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
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
                      <FaUser className="w-4 h-4 text-blue-500" />
                      Activo
                      <span
                        className="ml-2 text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        {activos?.length || 0} opciones
                      </span>
                    </label>
                    <Select
                      isMulti
                      placeholder="Seleccionar activo..."
                      value={selectedActivo}
                      onChange={(selectedOptions) =>
                        setSelectedActivo(Array.from(selectedOptions || []))
                      }
                      options={
                        activos?.map((activo: any) => ({
                          id: activo.id,
                          nombre: activo.nombre,
                          value: activo.id,
                          label: activo.nombre,
                        })) || []
                      }
                      isSearchable={false}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                          borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? '#3b82f6'
                            : state.isFocused
                            ? theme === 'dark'
                              ? '#4b5563'
                              : '#f3f4f6'
                            : theme === 'dark'
                            ? '#374151'
                            : '#ffffff',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
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
                      Pasivo
                      <span
                        className="ml-2 text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        {pasivos?.length || 0} opciones
                      </span>
                    </label>
                    <Select
                      isMulti
                      placeholder="Seleccionar pasivo..."
                      value={selectedPasivo}
                      onChange={(selectedOptions) =>
                        setSelectedPasivo(Array.from(selectedOptions || []))
                      }
                      options={
                        pasivos?.map((pasivo: any) => ({
                          id: pasivo.id,
                          nombre: pasivo.nombre,
                          value: pasivo.id,
                          label: pasivo.nombre,
                        })) || []
                      }
                      isSearchable={false}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                          borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? '#3b82f6'
                            : state.isFocused
                            ? theme === 'dark'
                              ? '#4b5563'
                              : '#f3f4f6'
                            : theme === 'dark'
                            ? '#374151'
                            : '#ffffff',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
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
                      <FaCog className="w-4 h-4 text-indigo-500" />
                      Tonalidad
                      <span
                        className="ml-2 text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        {tonos?.length || 0} opciones
                      </span>
                    </label>
                    <Select
                      placeholder="Seleccionar tonalidad..."
                      value={selectedTono[0] || null}
                      onChange={(selectedOption) =>
                        setSelectedTono(selectedOption ? [selectedOption] : [])
                      }
                      options={
                        tonos?.map((tono: any) => ({
                          id: tono.id,
                          nombre: tono.nombre,
                          value: tono.id,
                          label: tono.nombre,
                        })) || []
                      }
                      isSearchable={false}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                          borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? '#3b82f6'
                            : state.isFocused
                            ? theme === 'dark'
                              ? '#4b5563'
                              : '#f3f4f6'
                            : theme === 'dark'
                            ? '#374151'
                            : '#ffffff',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                      }}
                    />
                  </div>
                </div>

                <div
                  className="border rounded-lg p-4 text-center"
                  style={{
                    backgroundColor: selectedFragmento
                      ? theme === 'dark'
                        ? '#065f46'
                        : '#d1fae5'
                      : selectedText
                      ? theme === 'dark'
                        ? '#1e40af'
                        : '#dbeafe'
                      : theme === 'dark'
                      ? '#78350f'
                      : '#fef3c7',
                    borderColor: selectedFragmento
                      ? theme === 'dark'
                        ? '#059669'
                        : '#10b981'
                      : selectedText
                      ? theme === 'dark'
                        ? '#3b82f6'
                        : '#60a5fa'
                      : theme === 'dark'
                      ? '#92400e'
                      : '#f59e0b',
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: selectedFragmento
                        ? theme === 'dark'
                          ? '#a7f3d0'
                          : '#065f46'
                        : selectedText
                        ? theme === 'dark'
                          ? '#93c5fd'
                          : '#1e40af'
                        : theme === 'dark'
                        ? '#fde68a'
                        : '#92400e',
                    }}
                  >
                    {selectedFragmento
                      ? 'Editando fragmento'
                      : selectedText
                      ? 'Crear nuevo fragmento'
                      : 'Selecciona un fragmento o texto'}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: selectedFragmento
                        ? theme === 'dark'
                          ? '#10b981'
                          : '#059669'
                        : selectedText
                        ? theme === 'dark'
                          ? '#60a5fa'
                          : '#3b82f6'
                        : theme === 'dark'
                        ? '#f59e0b'
                        : '#d97706',
                    }}
                  >
                    {selectedFragmento
                      ? 'Modifica las categorías y guarda los cambios'
                      : selectedText
                      ? 'Asigna categorías al texto seleccionado'
                      : 'Haz clic en un fragmento para editarlo o selecciona texto'}
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
                    disabled={
                      selectedTema.length === 0 || selectedTono.length === 0
                    }
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedTema.length === 0 || selectedTono.length === 0
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    {(selectedFragmento && selectedFragmento.isTemporary) ||
                    selectedFragmento?.categoria === 'temporal'
                      ? 'Crear fragmento'
                      : selectedFragmento
                      ? 'Actualizar'
                      : 'Crear fragmento'}
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

                  <div className="group mb-4">
                    <label
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      }}
                    >
                      <FaList className="w-4 h-4 text-blue-500" />
                      Tema
                      <span
                        className="ml-2 text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        {articuloData?.variables_categorizacion?.[0]?.temas
                          ?.length || 0}{' '}
                        opciones
                      </span>
                    </label>
                    <Select
                      isMulti
                      placeholder="Asignar temas al artículo"
                      value={selectedTemaGeneral}
                      onChange={(selectedOptions) =>
                        setSelectedTemaGeneral(
                          Array.from(selectedOptions || [])
                        )
                      }
                      options={
                        articuloData?.variables_categorizacion?.[0]?.temas?.map(
                          (tema: any) => ({
                            id: tema.id,
                            nombre: tema.nombre,
                            value: tema.id,
                            label: tema.nombre,
                          })
                        ) || []
                      }
                      isSearchable={false}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                          borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? '#3b82f6'
                            : state.isFocused
                            ? theme === 'dark'
                              ? '#4b5563'
                              : '#f3f4f6'
                            : theme === 'dark'
                            ? '#374151'
                            : '#ffffff',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
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
                      <FaList className="w-4 h-4 text-purple-500" />
                      Tag
                      <span
                        className="ml-2 text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }}
                      >
                        {articuloData?.variables_categorizacion?.[0]?.tags
                          ?.length || 0}{' '}
                        opciones
                      </span>
                    </label>
                    <Select
                      isMulti
                      placeholder="Asignar tags al artículo"
                      value={selectedTagGeneral}
                      onChange={(selectedOptions) =>
                        setSelectedTagGeneral(Array.from(selectedOptions || []))
                      }
                      options={
                        articuloData?.variables_categorizacion?.[0]?.tags?.map(
                          (tag: any) => ({
                            id: tag.id,
                            nombre: tag.nombre,
                            value: tag.id,
                            label: tag.nombre,
                          })
                        ) || []
                      }
                      isSearchable={false}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                          borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        menu: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#374151' : '#ffffff',
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? '#3b82f6'
                            : state.isFocused
                            ? theme === 'dark'
                              ? '#4b5563'
                              : '#f3f4f6'
                            : theme === 'dark'
                            ? '#374151'
                            : '#ffffff',
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor:
                            theme === 'dark' ? '#1f2937' : '#e5e7eb',
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: theme === 'dark' ? '#ffffff' : '#374151',
                        }),
                      }}
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
