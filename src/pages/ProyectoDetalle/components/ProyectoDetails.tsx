import React, { useState } from 'react';
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
  Proyecto,
  Colaborador,
  ColaboradorInfo,
  searchColaboradores,
} from '../../Proyectos/services/proyectosRequest';
import { AsyncReactSelect } from '../../../shared/components/ui/AsyncReactSelect';

interface ProyectoDetailsProps {
  proyecto: Proyecto;
  theme: string;
  onUpdateProyecto: (updates: Partial<Proyecto>) => Promise<void>;
}

export const ProyectoDetails: React.FC<ProyectoDetailsProps> = ({
  proyecto,
  theme,
  onUpdateProyecto,
}) => {
  const navigate = useNavigate();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingNombre, setEditingNombre] = useState(proyecto.nombre);
  const [editingKeywords, setEditingKeywords] = useState<string[]>(() => {
    return Array.isArray(proyecto.keyword)
      ? proyecto.keyword
      : proyecto.keyword?.palabras_clave || [];
  });
  const [editingColaboradores, setEditingColaboradores] = useState<
    Colaborador[]
  >(() => {
    return proyecto.colaboradores_info.map((colabInfo) => ({
      id: colabInfo.id,
      username: colabInfo.email.split('@')[0],
      email: colabInfo.email,
      nombre_completo: colabInfo.nombre,
    }));
  });
  const [saving, setSaving] = useState(false);
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
      setEditingNombre(proyecto.nombre);
      const colaboradoresConvertidos = proyecto.colaboradores_info.map(
        (colabInfo) => ({
          id: colabInfo.id,
          username: colabInfo.email.split('@')[0],
          email: colabInfo.email,
          nombre_completo: colabInfo.nombre,
        })
      );
      setEditingColaboradores(colaboradoresConvertidos);
    } else if (section === 'keywords') {
      const keywords = Array.isArray(proyecto.keyword)
        ? proyecto.keyword
        : proyecto.keyword?.palabras_clave || [];
      setEditingKeywords([...keywords]);
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditingNombre(proyecto.nombre);
    const keywords = Array.isArray(proyecto.keyword)
      ? proyecto.keyword
      : proyecto.keyword?.palabras_clave || [];
    setEditingKeywords([...keywords]);
    const colaboradoresConvertidos = proyecto.colaboradores_info.map(
      (colabInfo) => ({
        id: colabInfo.id,
        username: colabInfo.email.split('@')[0],
        email: colabInfo.email,
        nombre_completo: colabInfo.nombre,
      })
    );
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
      }> = {};

      if (section === 'detalles') {
        updates.nombre = editingNombre;
        updates.colaboradores = editingColaboradores.map((c) => c.id);
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
    return proyecto.nombre;
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

    const keywords = Array.isArray(proyecto.keyword)
      ? proyecto.keyword
      : proyecto.keyword?.palabras_clave || [];

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

    return renderColaboradores(proyecto.colaboradores_info);
  };

  const handleAsignarArticulos = () => {
    navigate(`/asignar-articulos?proyecto_id=${proyecto.id}`);
  };

  const renderAsignarCard = () => (
    <div className="border rounded-lg overflow-hidden" style={cardStyle}>
      <div
        className="flex justify-between items-center p-4 border-b"
        style={headerStyle}
      >
        <h3 className="font-semibold text-lg">Asignar Artículos</h3>
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
            onClick={handleAsignarArticulos}
            className="flex items-center gap-3 mx-auto px-6 py-3 rounded-md hover:opacity-80 transition-opacity cursor-pointer"
            style={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
            }}
          >
            <FaUserTie size={16} />
            <span className="font-medium">Asignar Artículos</span>
          </button>
          <p
            className="text-sm mt-3"
            style={{
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            }}
          >
            Gestionar la asignación de artículos para este proyecto
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {renderCard(
        'Detalles',
        'detalles',
        <>
          {renderField('ID', proyecto.id)}
          {renderField('NOMBRE', renderEditableNombre())}
          {renderField('COLABORADORES', renderEditableColaboradores())}
        </>
      )}

      {renderCard(
        'Críterios de aceptación',
        'keywords',
        <>{renderField('PALABRAS CLAVE', renderEditableKeywords())}</>
      )}

      {renderAsignarCard()}
    </div>
  );
};
