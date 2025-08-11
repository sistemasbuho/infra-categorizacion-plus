import React, { useState, useEffect } from 'react';
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaUserTie,
} from 'react-icons/fa';
import { IoClose, IoCheckmarkCircle } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import {
  ProyectoCompleto,
  Colaborador,
  ColaboradorInfo,
  searchColaboradores,
  ProyectoELT,
  searchProyectosELT,
} from '../../Proyectos/services/proyectosRequest';
import { AsyncReactSelect } from '../../../shared/components/ui/AsyncReactSelect';
import { CrearFormulario } from './CrearFormulario';
import {
  obtenerFormulario,
  FormularioResponse,
} from '../services/formularioRequest';

interface ProyectoDetailsProps {
  proyecto: ProyectoCompleto;
  theme: string;
  onUpdateProyecto: (
    updates: Partial<{
      proyecto_id: string;
      nombre: string;
      keyword?: { palabras_clave: string[] };
      colaboradores?: number[];
      tags?: string[];
      activo?: boolean;
      redes?: boolean;
    }>
  ) => Promise<void>;
  onRefreshProyecto?: () => Promise<void>;
}

export const ProyectoDetails: React.FC<ProyectoDetailsProps> = ({
  proyecto,
  theme,
  onUpdateProyecto,
  onRefreshProyecto,
}) => {
  const navigate = useNavigate();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingNombre, setEditingNombre] = useState(
    proyecto.proyecto_categorizacion.nombre
  );
  const [selectedProyectoELT, setSelectedProyectoELT] = useState<ProyectoELT>({
    id: proyecto.proyecto_etl?.id || '',
    nombre: proyecto.proyecto_etl?.nombre || '',
  });
  const [editingKeywords, setEditingKeywords] = useState<string[]>(() => {
    return Array.isArray(proyecto.proyecto_categorizacion.keyword)
      ? proyecto.proyecto_categorizacion.keyword
      : proyecto.proyecto_categorizacion.keyword?.palabras_clave || [];
  });
  const [editingColaboradores, setEditingColaboradores] = useState<
    Colaborador[]
  >(() => {
    return proyecto.proyecto_categorizacion.colaboradores_info.map(
      (colabInfo) => ({
        id: colabInfo.id,
        username: colabInfo.email.split('@')[0],
        email: colabInfo.email,
        nombre_completo: colabInfo.nombre,
      })
    );
  });
  const [saving, setSaving] = useState(false);
  const [isFormularioModalOpen, setIsFormularioModalOpen] = useState(false);
  const [isEditFormularioModalOpen, setIsEditFormularioModalOpen] =
    useState(false);
  const [formularioExistente, setFormularioExistente] =
    useState<FormularioResponse | null>(null);
  const [loadingFormulario, setLoadingFormulario] = useState(false);
  const [editingRedes, setEditingRedes] = useState(
    proyecto.proyecto_categorizacion.redes || false
  );

  useEffect(() => {
    const formularioId = proyecto.proyecto_categorizacion.formulario;
    if (formularioId && proyecto.proyecto_categorizacion.redes) {
      obtenerFormularioExistente(formularioId);
    }
  }, [
    proyecto.proyecto_categorizacion.formulario,
    proyecto.proyecto_categorizacion.redes,
  ]);

  const obtenerFormularioExistente = async (formularioId: string) => {
    setLoadingFormulario(true);
    try {
      const formulario = await obtenerFormulario(formularioId);
      setFormularioExistente(formulario);
    } catch (error) {
      console.error('Error al obtener formulario:', error);
    } finally {
      setLoadingFormulario(false);
    }
  };

  const cardStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
    color: theme === 'dark' ? '#f9fafb' : '#111827',
  };

  const headerStyle = {
    backgroundColor: theme === 'dark' ? '#111827' : '#f8fafc',
    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
  };

  const labelStyle = {
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
  };

  const editButtonStyle = {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
  };

  const saveButtonStyle = {
    backgroundColor: '#10b981',
    color: '#ffffff',
  };

  const cancelButtonStyle = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
  };

  const handleStartEdit = (section: string) => {
    setEditingSection(section);
    if (section === 'detalles') {
      setEditingNombre(proyecto.proyecto_categorizacion.nombre);
      setEditingRedes(proyecto.proyecto_categorizacion.redes || false);
      const colaboradoresConvertidos =
        proyecto.proyecto_categorizacion.colaboradores_info.map(
          (colabInfo) => ({
            id: colabInfo.id,
            username: colabInfo.email.split('@')[0],
            email: colabInfo.email,
            nombre_completo: colabInfo.nombre,
          })
        );
      setEditingColaboradores(colaboradoresConvertidos);
    } else if (section === 'proyecto_etl') {
      setSelectedProyectoELT({
        id: proyecto.proyecto_etl?.id || '',
        nombre: proyecto.proyecto_etl?.nombre || '',
      });
    } else if (section === 'keywords') {
      const keywords = Array.isArray(proyecto.proyecto_categorizacion.keyword)
        ? proyecto.proyecto_categorizacion.keyword
        : proyecto.proyecto_categorizacion.keyword?.palabras_clave || [];
      setEditingKeywords([...keywords]);
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditingNombre(proyecto.proyecto_categorizacion.nombre);
    setEditingRedes(proyecto.proyecto_categorizacion.redes || false);
    setSelectedProyectoELT({
      id: proyecto.proyecto_etl?.id || '',
      nombre: proyecto.proyecto_etl?.nombre || '',
    });
    const keywords = Array.isArray(proyecto.proyecto_categorizacion.keyword)
      ? proyecto.proyecto_categorizacion.keyword
      : proyecto.proyecto_categorizacion.keyword?.palabras_clave || [];
    setEditingKeywords([...keywords]);
    const colaboradoresConvertidos =
      proyecto.proyecto_categorizacion.colaboradores_info.map((colabInfo) => ({
        id: colabInfo.id,
        username: colabInfo.email.split('@')[0],
        email: colabInfo.email,
        nombre_completo: colabInfo.nombre,
      }));
    setEditingColaboradores(colaboradoresConvertidos);
  };

  const handleSave = async (section: string) => {
    if (saving) return;

    try {
      setSaving(true);
      let updates: Partial<{
        proyecto_id: string;
        nombre: string;
        keyword?: { palabras_clave: string[] };
        colaboradores?: number[];
        tags?: string[];
        activo?: boolean;
        redes?: boolean;
      }> = {};

      if (section === 'detalles') {
        updates.nombre = editingNombre;
        updates.colaboradores = editingColaboradores.map((c) => c.id);
        updates.redes = editingRedes;
      } else if (section === 'proyecto_etl') {
        updates.proyecto_id = selectedProyectoELT.id;
      } else if (section === 'keywords') {
        updates.keyword = { palabras_clave: editingKeywords };
      }

      await onUpdateProyecto(updates);
      setEditingSection(null);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setSaving(false);
    }
  };

  const addColaborador = (colaborador: Colaborador) => {
    if (!editingColaboradores.find((c) => c.id === colaborador.id)) {
      setEditingColaboradores([...editingColaboradores, colaborador]);
    }
  };

  const removeColaborador = (colaboradorId: number) => {
    setEditingColaboradores(
      editingColaboradores.filter((c) => c.id !== colaboradorId)
    );
  };

  const addKeyword = () => {
    setEditingKeywords([...editingKeywords, '']);
  };

  const removeKeyword = (index: number) => {
    setEditingKeywords(editingKeywords.filter((_, i) => i !== index));
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...editingKeywords];
    newKeywords[index] = value;
    setEditingKeywords(newKeywords);
  };

  const renderEditButton = (section: string) => {
    const isEditing = editingSection === section;

    if (isEditing) {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleSave(section)}
            disabled={saving}
            className="p-2 rounded-md hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
            style={saveButtonStyle}
          >
            <FaSave size={14} />
          </button>
          <button
            onClick={handleCancelEdit}
            disabled={saving}
            className="p-2 rounded-md hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50"
            style={cancelButtonStyle}
          >
            <FaTimes size={14} />
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => handleStartEdit(section)}
        className="p-2 rounded-md hover:opacity-80 transition-opacity cursor-pointer"
        style={editButtonStyle}
      >
        <FaEdit size={14} />
      </button>
    );
  };

  const renderCard = (
    title: string,
    section: string,
    children: React.ReactNode
  ) => (
    <div className="border rounded-lg overflow-hidden" style={cardStyle}>
      <div
        className="flex justify-between items-center p-4 border-b"
        style={headerStyle}
      >
        <h3 className="font-semibold text-lg">{title}</h3>
        {renderEditButton(section)}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const renderField = (label: string, value: string | React.ReactNode) => (
    <div className="mb-4 last:mb-0">
      <div className="text-sm font-medium mb-2" style={labelStyle}>
        {label}
      </div>
      <div className="text-base">{value}</div>
    </div>
  );

  const renderKeywords = (keywords: string[]) => (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword, index) => (
        <span
          key={index}
          className="px-3 py-1 rounded-full text-sm"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
            color: theme === 'dark' ? '#d1d5db' : '#374151',
          }}
        >
          {keyword}
        </span>
      ))}
    </div>
  );

  const renderEditableNombre = () => {
    if (editingSection === 'detalles') {
      return (
        <input
          type="text"
          value={editingNombre}
          onChange={(e) => setEditingNombre(e.target.value)}
          className="w-full p-2 border rounded-md"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
          }}
          autoFocus
        />
      );
    }
    return proyecto.proyecto_categorizacion.nombre;
  };

  const renderEditableNombreETL = () => {
    if (editingSection === 'proyecto_etl') {
      return (
        <AsyncReactSelect
          placeholder="Buscar proyecto ETL..."
          value={selectedProyectoELT}
          onChange={(proyecto) => setSelectedProyectoELT(proyecto)}
          searchFunction={searchProyectosELT}
          optionLabelKey="nombre"
          optionValueKey="id"
          noOptionsMessage="No se encontraron proyectos ETL"
          isClearable={false}
          menuPortalTarget={true}
        />
      );
    }
    return (
      proyecto.proyecto_etl?.nombre || (
        <span style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
          No hay proyecto ETL asignado
        </span>
      )
    );
  };

  const renderEditableKeywords = () => {
    if (editingSection === 'keywords') {
      return (
        <div className="space-y-3">
          {editingKeywords.map((keyword, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={keyword}
                onChange={(e) => updateKeyword(index, e.target.value)}
                placeholder="Ingresa una palabra clave"
                className="flex-1 p-2 border rounded-md"
                style={{
                  backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                  borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: theme === 'dark' ? '#f9fafb' : '#111827',
                }}
              />
              <button
                onClick={() => removeKeyword(index)}
                className="p-2 rounded-md hover:opacity-80 transition-opacity cursor-pointer"
                style={cancelButtonStyle}
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={addKeyword}
            className="flex items-center gap-2 p-2 rounded-md hover:opacity-80 transition-opacity cursor-pointer"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
              color: theme === 'dark' ? '#d1d5db' : '#374151',
            }}
          >
            <FaPlus size={12} />
            <span>Agregar palabra clave</span>
          </button>
        </div>
      );
    }

    const keywords = Array.isArray(proyecto.proyecto_categorizacion.keyword)
      ? proyecto.proyecto_categorizacion.keyword
      : proyecto.proyecto_categorizacion.keyword?.palabras_clave || [];

    return keywords.length > 0
      ? renderKeywords(keywords)
      : 'No hay palabras clave definidas';
  };

  const renderColaboradores = (colaboradores: ColaboradorInfo[]) => (
    <div className="flex flex-wrap gap-2">
      {colaboradores.length > 0 ? (
        colaboradores.map((colaborador) => (
          <span
            key={colaborador.id}
            className="inline-flex items-center gap-2 px-3 py-1 rounded text-sm"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
              color: theme === 'dark' ? '#d1d5db' : '#374151',
            }}
          >
            <IoCheckmarkCircle className="text-green-500" />
            {colaborador.nombre}
          </span>
        ))
      ) : (
        <span
          className="text-sm"
          style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
        >
          No hay colaboradores asignados
        </span>
      )}
    </div>
  );

  const renderEditableColaboradores = () => {
    if (editingSection === 'detalles') {
      return (
        <div className="space-y-4">
          <AsyncReactSelect
            placeholder="Buscar colaborador..."
            value={null}
            onChange={(colaborador) => {
              if (colaborador) {
                addColaborador(colaborador);
              }
            }}
            searchFunction={searchColaboradores}
            optionLabelKey="nombre_completo"
            optionValueKey="id"
            noOptionsMessage="No se encontraron colaboradores"
            isClearable={false}
            menuPortalTarget={true}
          />

          {editingColaboradores.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {editingColaboradores.map((colaborador) => (
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
                    className="ml-1 hover:text-red-500 transition-colors"
                  >
                    <IoClose size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    return renderColaboradores(
      proyecto.proyecto_categorizacion.colaboradores_info
    );
  };

  const renderEditableRedes = () => {
    if (editingSection === 'detalles') {
      return (
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={editingRedes}
              onChange={(e) => setEditingRedes(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                editingRedes
                  ? 'bg-blue-600'
                  : theme === 'dark'
                  ? 'bg-gray-600'
                  : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  editingRedes ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="ml-3 text-sm font-medium">
              {editingRedes ? 'Proyecto de redes' : 'Proyecto estándar'}
            </span>
          </label>
        </div>
      );
    }

    const isRedes = proyecto.proyecto_categorizacion.redes;
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isRedes ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
        <span className="text-sm">
          {isRedes ? 'Proyecto de redes' : 'Proyecto estándar'}
        </span>
      </div>
    );
  };

  const handleAsignarArticulos = () => {
    navigate(
      `/asignar-articulos?proyecto_id=${proyecto.proyecto_categorizacion.id}`
    );
  };

  const handleAsignarRedes = () => {
    navigate(
      `/asignar-redes?proyecto_id=${proyecto.proyecto_categorizacion.proyecto_id}`
    );
  };

  const renderAsignarCard = (
    title: string,
    buttonText: string,
    description: string,
    onClickHandler: () => void
  ) => (
    <div className="border rounded-lg overflow-hidden" style={cardStyle}>
      <div
        className="flex justify-between items-center p-4 border-b"
        style={headerStyle}
      >
        <h3 className="font-semibold text-lg">{title}</h3>
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: theme === 'dark' ? '#10b981' : '#059669',
          }}
        />
      </div>
      <div className="p-6">
        <div className="text-center">
          <button
            onClick={onClickHandler}
            className="flex items-center gap-3 mx-auto px-6 py-3 rounded-md hover:opacity-80 transition-opacity cursor-pointer"
            style={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
            }}
          >
            <FaUserTie size={16} />
            <span className="font-medium">{buttonText}</span>
          </button>
          <p
            className="text-sm mt-3"
            style={{
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );

  const handleCrearFormulario = () => {
    setIsFormularioModalOpen(true);
  };

  const handleEditarFormulario = () => {
    if (formularioExistente) {
      setIsEditFormularioModalOpen(true);
    }
  };

  const handleFormularioUpdated = async () => {
    if (onRefreshProyecto) {
      await onRefreshProyecto();
    } else {
      const formularioId = proyecto.proyecto_categorizacion.formulario;
      if (formularioId) {
        obtenerFormularioExistente(formularioId);
      }
    }
  };

  const renderCrearFormularioCard = () => {
    const hasFormulario =
      proyecto.proyecto_categorizacion.formulario && formularioExistente;

    return (
      <div className="border rounded-lg overflow-hidden" style={cardStyle}>
        <div
          className="flex justify-between items-center p-4 border-b"
          style={headerStyle}
        >
          <h3 className="font-semibold text-lg">
            {hasFormulario ? 'Formulario' : 'Crear Formulario'}
          </h3>
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: hasFormulario
                ? theme === 'dark'
                  ? '#10b981'
                  : '#059669'
                : theme === 'dark'
                ? '#f59e0b'
                : '#d97706',
            }}
          />
        </div>
        <div className="p-6">
          {loadingFormulario ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p
                className="text-sm mt-3"
                style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                Cargando formulario...
              </p>
            </div>
          ) : hasFormulario ? (
            <div>
              <div className="mb-4">
                <h4 className="font-medium mb-2">
                  {formularioExistente.nombre}
                </h4>
                <p
                  className="text-sm"
                  style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                >
                  {formularioExistente.descripcion}
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                >
                  {formularioExistente.campos.length} campos
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleEditarFormulario}
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:opacity-80 transition-opacity cursor-pointer"
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#ffffff',
                  }}
                >
                  <FaEdit size={14} />
                  <span className="font-medium">Editar</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleCrearFormulario}
                className="flex items-center gap-3 mx-auto px-6 py-3 rounded-md hover:opacity-80 transition-opacity cursor-pointer"
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                }}
              >
                <FaPlus size={16} />
                <span className="font-medium">Crear Formulario</span>
              </button>
              <p
                className="text-sm mt-3"
                style={{
                  color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                }}
              >
                Crear un formulario para este proyecto
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderCard(
          'Detalles',
          'detalles',
          <>
            {renderField('ID', proyecto.proyecto_categorizacion.id)}
            {renderField('NOMBRE', renderEditableNombre())}
            {renderField('COLABORADORES', renderEditableColaboradores())}
            {renderField('REDES', renderEditableRedes())}
          </>
        )}

        {renderCard(
          'Proyecto ETL',
          'proyecto_etl',
          <>
            {renderField(
              'ID',
              proyecto.proyecto_etl?.id || (
                <span
                  style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                >
                  No hay proyecto ETL asignado
                </span>
              )
            )}
            {renderField('NOMBRE', renderEditableNombreETL())}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderCard(
          'Críterios de aceptación',
          'keywords',
          <>{renderField('PALABRAS CLAVE', renderEditableKeywords())}</>
        )}

        {proyecto.proyecto_categorizacion.redes
          ? renderAsignarCard(
              'Asignar Redes',
              'Asignar Redes',
              'Gestionar la asignación de redes para este proyecto',
              handleAsignarRedes
            )
          : renderAsignarCard(
              'Asignar Artículos',
              'Asignar Artículos',
              'Gestionar la asignación de artículos para este proyecto',
              handleAsignarArticulos
            )}
      </div>

      {proyecto.proyecto_categorizacion.redes && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCrearFormularioCard()}
        </div>
      )}

      {proyecto.proyecto_categorizacion.redes && (
        <CrearFormulario
          theme={theme}
          isFormularioModalOpen={isFormularioModalOpen}
          setIsFormularioModalOpen={setIsFormularioModalOpen}
          proyectoId={proyecto.proyecto_categorizacion.id}
          onFormularioUpdated={handleFormularioUpdated}
        />
      )}

      {/* Modal de edición de formulario */}
      {proyecto.proyecto_categorizacion.redes && formularioExistente && (
        <CrearFormulario
          theme={theme}
          isFormularioModalOpen={isEditFormularioModalOpen}
          setIsFormularioModalOpen={setIsEditFormularioModalOpen}
          proyectoId={proyecto.proyecto_categorizacion.id}
          modoEdicion={true}
          formularioExistente={formularioExistente}
          onFormularioUpdated={handleFormularioUpdated}
        />
      )}
    </div>
  );
};
