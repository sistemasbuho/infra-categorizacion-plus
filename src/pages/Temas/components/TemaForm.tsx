import { IoSaveSharp, IoCheckmarkCircle, IoClose } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { TemaResponse } from '../../../hooks/useTemas';
import { useState, useEffect, useRef } from 'react';
import { searchProyectos } from '../../../services/temaRequest';
import { useTheme } from '../../../shared/context/ThemeContext';

export type LocalTema = {
  nombre: string;
  descripcion?: string;
  proyecto_id: string;
};

type Props = {
  defaultValue?: TemaResponse;
  confirmEvent: (data: LocalTema) => void;
  formId: string;
};

interface Proyecto {
  id: string;
  nombre: string;
}

const TemaForm: React.FC<Props> = ({ defaultValue, confirmEvent, formId }) => {
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LocalTema>({
    defaultValues: defaultValue
      ? {
          nombre: defaultValue.nombre,
          descripcion: defaultValue.descripcion,
          proyecto_id: defaultValue.proyecto_id,
        }
      : {},
  });

  const onSubmit = handleSubmit((data) => confirmEvent(data));

  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<Proyecto[]>([]);
  const [openList, setOpenList] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);

  useEffect(() => {
    if (!search) {
      if (!selectedProject) {
        setOptions([]);
      }
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const proyectos = await searchProyectos(search);
        setOptions(proyectos);
      } catch {
        setOptions([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, selectedProject]);

  // Manejar el proyecto por defecto cuando se está editando
  useEffect(() => {
    if (defaultValue?.proyecto_id && !selectedProject) {
      // Si tenemos un proyecto_id pero no tenemos el nombre, buscar por ID
      const fetchProjectName = async () => {
        try {
          // Buscar entre los proyectos ya cargados primero
          if (options.length > 0) {
            const found = options.find(
              (p) => p.id === defaultValue.proyecto_id
            );
            if (found) {
              setSelectedProject(found);
              return;
            }
          }

          // Si no está en los options, intentar buscar con una búsqueda vacía para obtener todos
          const proyectos = await searchProyectos('');
          const found = proyectos.find(
            (p) => p.id === defaultValue.proyecto_id
          );
          if (found) {
            setSelectedProject(found);
          }
        } catch (error) {
          console.log('No se pudo cargar el nombre del proyecto');
        }
      };

      fetchProjectName();
    }
  }, [defaultValue, options, selectedProject]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenList(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
        >
          Nombre
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

      <div ref={containerRef} className="relative">
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
        >
          Proyecto{' '}
          {selectedProject && (
            <IoCheckmarkCircle className="inline ml-1 text-green-500" />
          )}
        </label>
        <input
          type="text"
          value={selectedProject ? selectedProject.nombre : search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedProject(null);
            setValue('proyecto_id', '');
            setOpenList(true);
          }}
          onFocus={async (e) => {
            setOpenList(true);
            e.currentTarget.style.borderColor =
              theme === 'dark' ? '#3b82f6' : '#2563eb';
            e.currentTarget.style.boxShadow = `0 0 0 3px ${
              theme === 'dark'
                ? 'rgba(59, 130, 246, 0.1)'
                : 'rgba(37, 99, 235, 0.1)'
            }`;

            // Si no hay opciones y no hay búsqueda activa, cargar proyectos iniciales
            if (options.length === 0 && !search && !selectedProject) {
              try {
                const proyectos = await searchProyectos('');
                setOptions(proyectos.slice(0, 10)); // Mostrar solo los primeros 10
              } catch (error) {
                console.log('No se pudieron cargar proyectos iniciales');
              }
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor =
              theme === 'dark' ? '#4b5563' : '#d1d5db';
            e.currentTarget.style.boxShadow = 'none';
          }}
          placeholder={
            selectedProject ? selectedProject.nombre : 'Buscar proyecto...'
          }
          className="w-full px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
        />

        {/* Botón para limpiar selección */}
        {selectedProject && (
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSelectedProject(null);
              setValue('proyecto_id', '');
              setSearch('');
              setOptions([]);
            }}
          >
            <IoClose />
          </button>
        )}

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
        {openList && options.length > 0 && (
          <ul
            className="absolute z-10 mt-1 w-full border rounded shadow max-h-60 overflow-auto"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
            }}
          >
            {options.map((p) => (
              <li
                key={p.id}
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
                onClick={() => {
                  setValue('proyecto_id', p.id);
                  setSelectedProject(p);
                  setSearch('');
                  setOpenList(false);
                }}
              >
                {p.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
        >
          Descripción
        </label>
        <textarea
          {...register('descripcion')}
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
          rows={3}
        />
      </div>

      <div className="flex justify-end">
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

export default TemaForm;
