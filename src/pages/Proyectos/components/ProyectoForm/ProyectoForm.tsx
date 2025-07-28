import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { useForm } from 'react-hook-form';
import { IoClose, IoCheckmarkCircle, IoSaveSharp } from 'react-icons/io5';
import { Colaborador, Tag, ProyectoELT } from '../../services/proyectosRequest';
import { AsyncReactSelect } from '../../../../shared/components/ui/AsyncReactSelect';

interface ProyectoFormData {
  proyecto_id: string;
  nombre: string;
  keyword: {
    palabras_clave: string[];
  };
  colaboradores: number[];
  tags: string[];
  redes?: boolean;
}

interface ProyectoFormDefaultValue {
  proyecto_id?: string;
  nombre?: string;
  keyword?: {
    palabras_clave: string[];
  };
  colaboradores?: number[];
  tags?: string[];
  redes?: boolean;
  colaboradores_info?: import('../../services/proyectosRequest').ColaboradorInfo[];
  tags_info?: import('../../services/proyectosRequest').TagInfo[];
}

interface Props {
  defaultValue?: ProyectoFormDefaultValue;
  confirmEvent: (data: ProyectoFormData) => void;
  formId: string;
  searchColaboradores: (nombre: string) => Promise<Colaborador[]>;
  searchProyectosELT: (nombre: string) => Promise<ProyectoELT[]>;
  getTags: (
    page?: number,
    pageSize?: number,
    search?: string
  ) => Promise<Tag[]>;
}

export const ProyectoForm: React.FC<Props> = ({
  defaultValue,
  confirmEvent,
  formId,
  searchColaboradores,
  searchProyectosELT,
  getTags,
}) => {
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProyectoFormData>({
    defaultValues: defaultValue || {
      proyecto_id: '',
      nombre: '',
      keyword: { palabras_clave: [] },
      colaboradores: [],
      tags: [],
      redes: false,
    },
  });

  // Estados para colaboradores
  const [colaboradorSearch, setColaboradorSearch] = useState('');
  const [colaboradorOptions, setColaboradorOptions] = useState<Colaborador[]>(
    []
  );
  const [selectedColaboradores, setSelectedColaboradores] = useState<
    Colaborador[]
  >([]);
  const [openColaboradorList, setOpenColaboradorList] = useState(false);
  const colaboradorContainerRef = useRef<HTMLDivElement>(null);

  // Estados para tags
  const [tagSearch, setTagSearch] = useState('');
  const [tagOptions, setTagOptions] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [openTagList, setOpenTagList] = useState(false);
  const tagContainerRef = useRef<HTMLDivElement>(null);

  // Estados para keywords
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(
    defaultValue?.keyword?.palabras_clave || []
  );

  // Estado para proyecto ELT seleccionado
  const [selectedProyectoELT, setSelectedProyectoELT] =
    useState<ProyectoELT | null>(null);

  // Estado para redes
  const [isRedes, setIsRedes] = useState<boolean>(defaultValue?.redes || false);

  useEffect(() => {
    if (defaultValue?.proyecto_id && !selectedProyectoELT) {
      setSelectedProyectoELT({
        id: defaultValue.proyecto_id,
        nombre: `Proyecto ${defaultValue.proyecto_id.slice(0, 8)}...`,
      });
    }
  }, [defaultValue, selectedProyectoELT]);

  useEffect(() => {
    if (
      defaultValue?.colaboradores_info &&
      defaultValue.colaboradores_info.length > 0
    ) {
      const colaboradoresConvertidos: Colaborador[] =
        defaultValue.colaboradores_info.map((colabInfo) => ({
          id: colabInfo.id,
          username: colabInfo.email.split('@')[0],
          email: colabInfo.email,
          nombre_completo: colabInfo.nombre,
        }));
      setSelectedColaboradores(colaboradoresConvertidos);
    }

    if (defaultValue?.tags_info && defaultValue.tags_info.length > 0) {
      setSelectedTags(defaultValue.tags_info);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (defaultValue?.redes !== undefined) {
      setIsRedes(defaultValue.redes);
    }
  }, [defaultValue?.redes]);

  useEffect(() => {
    setValue('keyword', { palabras_clave: keywords });
  }, [keywords, setValue]);

  useEffect(() => {
    setValue(
      'colaboradores',
      selectedColaboradores.map((c) => c.id)
    );
  }, [selectedColaboradores, setValue]);

  useEffect(() => {
    setValue(
      'tags',
      selectedTags.map((t) => t.id)
    );
  }, [selectedTags, setValue]);

  useEffect(() => {
    if (selectedProyectoELT) {
      setValue('proyecto_id', selectedProyectoELT.id);
    }
  }, [selectedProyectoELT, setValue]);

  useEffect(() => {
    setValue('redes', isRedes);
  }, [isRedes, setValue]);

  const handleColaboradorSearch = async (searchTerm: string) => {
    if (searchTerm.length >= 2) {
      try {
        const results = await searchColaboradores(searchTerm);
        setColaboradorOptions(results);
      } catch (error) {
        console.error('Error buscando colaboradores:', error);
        setColaboradorOptions([]);
      }
    } else {
      setColaboradorOptions([]);
    }
  };

  const handleTagSearch = async (searchTerm: string) => {
    try {
      const results = await getTags(1, 50, searchTerm);
      setTagOptions(results);
    } catch (error) {
      console.error('Error buscando tags:', error);
      setTagOptions([]);
    }
  };

  useEffect(() => {
    const loadInitialTags = async () => {
      try {
        const results = await getTags(1, 50);
        setTagOptions(results);
      } catch (error) {
        console.error('Error cargando tags iniciales:', error);
      }
    };
    loadInitialTags();
  }, [getTags]);

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      const newKeywords = [...keywords, keywordInput.trim()];
      setKeywords(newKeywords);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const addColaborador = (colaborador: Colaborador) => {
    if (!selectedColaboradores.find((c) => c.id === colaborador.id)) {
      setSelectedColaboradores([...selectedColaboradores, colaborador]);
    }
    setColaboradorSearch('');
    setOpenColaboradorList(false);
    setColaboradorOptions([]);
  };

  const removeColaborador = (colaboradorId: number) => {
    setSelectedColaboradores(
      selectedColaboradores.filter((c) => c.id !== colaboradorId)
    );
  };

  const addTag = (tag: Tag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagSearch('');
    setOpenTagList(false);
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
  };

  const onSubmit = handleSubmit((data) => {
    confirmEvent({
      ...data,
      keyword: { palabras_clave: keywords },
      colaboradores: selectedColaboradores.map((c) => c.id),
      tags: selectedTags.map((t) => t.id),
      redes: isRedes,
    });
  });

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-6">
      <div>
        <AsyncReactSelect
          label="Proyecto ELT"
          placeholder="Buscar proyecto..."
          value={selectedProyectoELT}
          onChange={(proyecto) => setSelectedProyectoELT(proyecto)}
          searchFunction={searchProyectosELT}
          optionLabelKey="nombre"
          optionValueKey="id"
          noOptionsMessage="No se encontraron proyectos"
        />
        <input
          type="hidden"
          {...register('proyecto_id', {
            required: 'Debes seleccionar un proyecto',
          })}
        />
        {errors.proyecto_id && (
          <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>
            {errors.proyecto_id.message}
          </p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
        >
          Nombre del Proyecto
        </label>
        <input
          type="text"
          {...register('nombre', { required: 'El nombre es obligatorio' })}
          className="w-full px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor =
              theme === 'dark' ? '#3b82f6' : '#2563eb';
            e.currentTarget.style.boxShadow = `0 0 0 3px ${
              theme === 'dark'
                ? 'rgba(59, 130, 246, 0.1)'
                : 'rgba(37, 99, 235, 0.1)'
            }`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor =
              theme === 'dark' ? '#4b5563' : '#d1d5db';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {errors.nombre && (
          <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>
            {errors.nombre.message}
          </p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-3"
          style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
        >
          Tipo de Proyecto
        </label>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isRedes}
              onChange={(e) => setIsRedes(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                isRedes
                  ? 'bg-blue-600'
                  : theme === 'dark'
                  ? 'bg-gray-600'
                  : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  isRedes ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="ml-3 text-sm font-medium">
              {isRedes ? 'Proyecto de redes' : 'Proyecto estándar'}
            </span>
          </label>
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
        >
          Palabras Clave
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addKeyword();
              }
            }}
            className="flex-1 px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#111827',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
            placeholder="Agregar palabra clave"
            onFocus={(e) => {
              e.currentTarget.style.borderColor =
                theme === 'dark' ? '#3b82f6' : '#2563eb';
              e.currentTarget.style.boxShadow = `0 0 0 3px ${
                theme === 'dark'
                  ? 'rgba(59, 130, 246, 0.1)'
                  : 'rgba(37, 99, 235, 0.1)'
              }`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor =
                theme === 'dark' ? '#4b5563' : '#d1d5db';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-4 py-2 rounded transition"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
              color: theme === 'dark' ? '#ffffff' : '#374151',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
          >
            Agregar
          </button>
        </div>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm"
                style={{
                  backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
                  color: theme === 'dark' ? '#ffffff' : '#374151',
                }}
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="ml-1 hover:text-red-500"
                >
                  <IoClose size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div ref={colaboradorContainerRef} className="relative">
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
        >
          Colaboradores
        </label>
        <input
          type="text"
          value={colaboradorSearch}
          onChange={(e) => {
            setColaboradorSearch(e.target.value);
            handleColaboradorSearch(e.target.value);
            setOpenColaboradorList(true);
          }}
          onFocus={(e) => {
            setOpenColaboradorList(true);
            e.currentTarget.style.borderColor =
              theme === 'dark' ? '#3b82f6' : '#2563eb';
            e.currentTarget.style.boxShadow = `0 0 0 3px ${
              theme === 'dark'
                ? 'rgba(59, 130, 246, 0.1)'
                : 'rgba(37, 99, 235, 0.1)'
            }`;
          }}
          className="w-full px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          placeholder="Buscar colaboradores..."
          onBlur={(e) => {
            e.currentTarget.style.borderColor =
              theme === 'dark' ? '#4b5563' : '#d1d5db';
            e.currentTarget.style.boxShadow = 'none';
            setTimeout(() => setOpenColaboradorList(false), 100);
          }}
        />

        {openColaboradorList && colaboradorOptions.length > 0 && (
          <ul
            className="absolute z-10 mt-1 w-full border rounded shadow max-h-60 overflow-auto"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
            }}
          >
            {colaboradorOptions.map((colaborador) => (
              <li
                key={colaborador.id}
                className="px-3 py-2 cursor-pointer transition-colors"
                style={{
                  color: theme === 'dark' ? '#ffffff' : '#111827',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    theme === 'dark' ? '#4b5563' : '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => addColaborador(colaborador)}
              >
                <div className="font-medium">{colaborador.nombre_completo}</div>
                <div className="text-sm opacity-70">{colaborador.email}</div>
              </li>
            ))}
          </ul>
        )}

        {selectedColaboradores.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedColaboradores.map((colaborador) => (
              <span
                key={colaborador.id}
                className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
                  color: theme === 'dark' ? '#ffffff' : '#374151',
                }}
              >
                <IoCheckmarkCircle className="text-green-500" />
                {colaborador.nombre_completo}
                <button
                  type="button"
                  onClick={() => removeColaborador(colaborador.id)}
                  className="ml-1 hover:text-red-500"
                >
                  <IoClose size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div ref={tagContainerRef} className="relative">
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
        >
          Tags
        </label>
        <input
          type="text"
          value={tagSearch}
          onChange={(e) => {
            setTagSearch(e.target.value);
            handleTagSearch(e.target.value);
            setOpenTagList(true);
          }}
          onFocus={(e) => {
            setOpenTagList(true);
            e.currentTarget.style.borderColor =
              theme === 'dark' ? '#3b82f6' : '#2563eb';
            e.currentTarget.style.boxShadow = `0 0 0 3px ${
              theme === 'dark'
                ? 'rgba(59, 130, 246, 0.1)'
                : 'rgba(37, 99, 235, 0.1)'
            }`;
          }}
          className="w-full px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          placeholder="Buscar tags..."
          onBlur={(e) => {
            e.currentTarget.style.borderColor =
              theme === 'dark' ? '#4b5563' : '#d1d5db';
            e.currentTarget.style.boxShadow = 'none';
            setTimeout(() => setOpenTagList(false), 100);
          }}
        />

        {openTagList && tagOptions.length > 0 && (
          <ul
            className="absolute z-10 mt-1 w-full border rounded shadow max-h-60 overflow-auto"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
            }}
          >
            {tagOptions
              .filter((tag) => !selectedTags.find((st) => st.id === tag.id))
              .map((tag) => (
                <li
                  key={tag.id}
                  className="px-3 py-2 cursor-pointer transition-colors"
                  style={{
                    color: theme === 'dark' ? '#ffffff' : '#111827',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      theme === 'dark' ? '#4b5563' : '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => addTag(tag)}
                >
                  <div className="font-medium">{tag.nombre}</div>
                </li>
              ))}
          </ul>
        )}

        {selectedTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm"
                style={{
                  backgroundColor: theme === 'dark' ? '#3b82f6' : '#dbeafe',
                  color: theme === 'dark' ? '#ffffff' : '#1e40af',
                }}
              >
                <IoCheckmarkCircle className="text-green-500" />
                {tag.nombre}
                <button
                  type="button"
                  onClick={() => removeTag(tag.id)}
                  className="ml-1 hover:text-red-500"
                >
                  <IoClose size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        className="flex justify-end gap-3 pt-6 border-t"
        style={{
          borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
        }}
      >
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded transition"
          style={{
            backgroundColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
            color: '#ffffff',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === 'dark' ? '#2563eb' : '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === 'dark' ? '#3b82f6' : '#2563eb';
          }}
        >
          <IoSaveSharp />
          Guardar
        </button>
      </div>
    </form>
  );
};
