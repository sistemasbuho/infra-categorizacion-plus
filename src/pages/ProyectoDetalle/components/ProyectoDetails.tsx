import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { Proyecto } from '../../Proyectos/services/proyectosRequest';

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
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingNombre, setEditingNombre] = useState(proyecto.nombre);
  const [editingKeywords, setEditingKeywords] = useState<string[]>(() => {
    return Array.isArray(proyecto.keyword)
      ? proyecto.keyword
      : proyecto.keyword?.palabras_clave || [];
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
  };

  const handleSave = async (section: string) => {
    if (saving) return;

    try {
      setSaving(true);
      let updates: Partial<Proyecto> = {};

      if (section === 'detalles') {
        updates.nombre = editingNombre;
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {renderCard(
        'Detalles',
        'detalles',
        <>
          {renderField('ID', proyecto.id)}
          {renderField('NOMBRE', renderEditableNombre())}
        </>
      )}

      {renderCard(
        'Críterios de aceptación',
        'keywords',
        <>{renderField('PALABRAS CLAVE', renderEditableKeywords())}</>
      )}
    </div>
  );
};
