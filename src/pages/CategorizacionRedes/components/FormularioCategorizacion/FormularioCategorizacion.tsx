import { useState } from 'react';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { Button } from '../../../../shared/components/ui/Button';
import { FaHashtag, FaCheck, FaList, FaEdit, FaSave } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import {
  Formulario,
  CampoCategorizacion,
  DatosPublicacion,
  guardarCategorizacion,
  GuardarCategorizacionData,
} from '../../services/categorizacionRedesRequest';
import { toast } from 'react-hot-toast';

interface FormularioCategorizacionProps {
  formulario: Formulario;
  publicacion: DatosPublicacion;
}

export const FormularioCategorizacion: React.FC<
  FormularioCategorizacionProps
> = ({ formulario, publicacion }) => {
  const { theme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [valores, setValores] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    publicacion.categorizacion_campos.forEach((campo) => {
      initialValues[campo.id] = campo.valor || '';
    });
    return initialValues;
  });

  const cardStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
  };

  const inputStyle = {
    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
    color: theme === 'dark' ? '#ffffff' : '#111827',
  };

  const inputFocusStyle = {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  };

  const handleValorChange = (campoId: string, valor: string) => {
    setValores((prev) => ({ ...prev, [campoId]: valor }));
  };

  const handleGuardar = async () => {
    setSaving(true);
    try {
      const camposObligatorios = formulario.campos.filter(
        (campo) => campo.obligatorio
      );
      const camposFaltantes = camposObligatorios.filter(
        (campo) => !valores[campo.id] || valores[campo.id].trim() === ''
      );

      if (camposFaltantes.length > 0) {
        const nombresCampos = camposFaltantes
          .map((campo) => campo.nombre_campo)
          .join(', ');
        toast.error(
          `Por favor complete los campos obligatorios: ${nombresCampos}`
        );
        setSaving(false);
        return;
      }

      const dataToSave: GuardarCategorizacionData = {
        publicacion_id: publicacion.publicacion_id,
        categorizacion_proyecto: publicacion.categorizacion_proyecto,
        campos_formulario: Object.entries(valores)
          .filter(([_, valor]) => valor && valor.trim() !== '')
          .map(([campo_id, valor]) => ({
            campo_id,
            valor: valor.trim(),
          })),
      };

      const response = await guardarCategorizacion(dataToSave);

      toast.success('Categorización guardada exitosamente');
      console.log('Respuesta de la API:', response);
    } catch (error) {
      console.error('Error al guardar categorización:', error);
      toast.error('Error al guardar la categorización. Inténtelo nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const renderCampo = (campo: CampoCategorizacion, index: number) => {
    const valor = valores[campo.id] || '';
    const isObligatorioVacio =
      campo.obligatorio && (!valor || valor.trim() === '');

    const cardStyleWithValidation = {
      ...cardStyle,
      borderColor: isObligatorioVacio
        ? theme === 'dark'
          ? '#dc2626'
          : '#ef4444'
        : cardStyle.borderColor,
      borderWidth: isObligatorioVacio ? '2px' : '1px',
    };

    return (
      <div
        key={campo.id}
        className="rounded-xl p-6 mb-4 border hover:shadow-lg transition-all duration-200"
        style={cardStyleWithValidation}
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
              {campo.nombre_campo}
            </h5>
            {campo.obligatorio && (
              <span
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: theme === 'dark' ? '#7f1d1d' : '#fee2e2',
                  color: theme === 'dark' ? '#fca5a5' : '#dc2626',
                }}
              >
                <FaCheck className="w-3 h-3" />
                Obligatorio
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label
            className="flex items-center gap-2 text-sm font-medium mb-2"
            style={{
              color: theme === 'dark' ? '#d1d5db' : '#374151',
            }}
          >
            {campo.tipo === 'select' ? (
              <FaList className="w-4 h-4 text-purple-500" />
            ) : (
              <FaEdit className="w-4 h-4 text-gray-500" />
            )}
            {campo.tipo === 'select'
              ? 'Seleccione una opción'
              : 'Ingrese el texto'}
          </label>

          {campo.tipo === 'select' ? (
            <select
              value={valor}
              onChange={(e) => handleValorChange(campo.id, e.target.value)}
              className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
              style={{
                ...inputStyle,
                borderColor: isObligatorioVacio
                  ? theme === 'dark'
                    ? '#dc2626'
                    : '#ef4444'
                  : inputStyle.borderColor,
                borderWidth: isObligatorioVacio ? '2px' : '1px',
              }}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, inputFocusStyle);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, {
                  ...inputStyle,
                  borderColor: isObligatorioVacio
                    ? theme === 'dark'
                      ? '#dc2626'
                      : '#ef4444'
                    : inputStyle.borderColor,
                  borderWidth: isObligatorioVacio ? '2px' : '1px',
                });
              }}
            >
              <option value="">Seleccione...</option>
              {campo.opciones.split(',').map((opcion, idx) => (
                <option key={idx} value={opcion.trim()}>
                  {opcion.trim()}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={valor}
              onChange={(e) => handleValorChange(campo.id, e.target.value)}
              placeholder="Ingrese su respuesta..."
              className="w-full p-3 border rounded-lg transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none"
              style={{
                ...inputStyle,
                borderColor: isObligatorioVacio
                  ? theme === 'dark'
                    ? '#dc2626'
                    : '#ef4444'
                  : inputStyle.borderColor,
                borderWidth: isObligatorioVacio ? '2px' : '1px',
              }}
              onFocus={(e) => {
                Object.assign(e.currentTarget.style, inputFocusStyle);
              }}
              onBlur={(e) => {
                Object.assign(e.currentTarget.style, {
                  ...inputStyle,
                  borderColor: isObligatorioVacio
                    ? theme === 'dark'
                      ? '#dc2626'
                      : '#ef4444'
                    : inputStyle.borderColor,
                  borderWidth: isObligatorioVacio ? '2px' : '1px',
                });
              }}
            />
          )}

          {isObligatorioVacio && (
            <div className="mt-2 flex items-center gap-2">
              <span
                className="text-xs font-medium"
                style={{
                  color: theme === 'dark' ? '#fca5a5' : '#dc2626',
                }}
              >
                ⚠️ Este campo es obligatorio
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <IoDocumentText className="text-blue-500 text-xl" />
          <h3
            className="font-semibold text-xl"
            style={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}
          >
            {formulario.nombre}
          </h3>
        </div>
        <p
          className="text-sm mb-4"
          style={{
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          }}
        >
          {formulario.descripcion}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <FaHashtag className="text-green-500" />
          <span
            className="text-sm px-2 py-1 rounded-full"
            style={{
              backgroundColor: theme === 'dark' ? '#065f46' : '#d1fae5',
              color: theme === 'dark' ? '#34d399' : '#059669',
            }}
          >
            {formulario.campos.length} campos
          </span>
        </div>
      </div>

      <div className="overflow-y-auto pr-2">
        {formulario.campos.map((campo, index) => renderCampo(campo, index))}
      </div>

      <div
        className="pt-4 border-t"
        style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}
      >
        <Button
          onClick={handleGuardar}
          disabled={saving}
          variant="primary"
          className="w-full py-3 text-lg font-semibold"
        >
          {saving ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Guardando...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <FaSave />
              Guardar Categorización
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
