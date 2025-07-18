import { IoSaveSharp } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { TagResponse } from '../hooks/useTags';
import { useTheme } from '../../../shared/context/ThemeContext';

type TagFormData = {
  nombre: string;
};

type Props = {
  defaultValue?: TagResponse;
  confirmEvent: (data: TagFormData) => void;
  formId: string;
};

function TagForm({ defaultValue, confirmEvent, formId }: Props) {
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TagFormData>({
    defaultValues: defaultValue ? { nombre: defaultValue.nombre } : {},
  });

  const onSubmit = handleSubmit((data: TagFormData) => {
    confirmEvent(data);
  });

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
}

export default TagForm;
