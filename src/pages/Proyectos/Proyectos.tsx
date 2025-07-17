import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { useTheme } from '../../shared/context/ThemeContext';
import { PageContainer } from '../../shared/components/Layout/PageContainer';
import { Button } from '../../shared/components/ui/Button';
import { useProyectos } from './hooks/useProyectos';
import { ProyectosGrid } from './components/ProyectosGrid/ProyectosGrid';
import { ProyectoForm } from './components/ProyectoForm/ProyectoForm';
import { DeleteModal } from './components/DeleteModal/DeleteModal';
import { Proyecto } from './services/proyectosRequest';
import DrawerModal from '../../shared/components/ui/DrawerModal';
import PanelDeFiltros, {
  FiltrosTemas,
} from '../../shared/components/ui/PanelDeFiltros';
import { toast } from 'react-hot-toast';

export const Proyectos = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(
    null
  );
  const [proyectoToDelete, setProyectoToDelete] = useState<Proyecto | null>(
    null
  );

  //Controles de modales
  const [activeModal, setActiveModal] = useState<
    'create' | 'edit' | 'delete' | null
  >(null);

  const openModal = (type: 'create' | 'edit' | 'delete') =>
    setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const {
    proyectos,
    loading,
    totalCount,
    page,
    pageSize,
    searchTerm,
    searchTermFechaDesde,
    searchTermFechaHasta,
    searchTermActivo,
    createProyecto,
    updateProyecto,
    deleteProyecto,
    searchColaboradores,
    searchProyectosELT,
    getTags,
    // setPage,
    setSearchTerm,
    setSearchTermFechaDesde,
    setSearchTermFechaHasta,
    setSearchTermActivo,
    clearFilters,
  } = useProyectos();

  const [openFiltros, setOpenFiltros] = useState(false);
  const [filtrosState, setFiltrosState] = useState<FiltrosTemas>({
    nombre: searchTerm,
  });

  useEffect(() => {
    setFiltrosState((prev) => ({
      ...prev,
      nombre: searchTerm,
      created_gte: searchTermFechaDesde,
      created_lte: searchTermFechaHasta,
      activo: searchTermActivo,
    }));
  }, [
    searchTerm,
    searchTermFechaDesde,
    searchTermFechaHasta,
    searchTermActivo,
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleFilterChange = (key: keyof FiltrosTemas, value: string) => {
    const newFiltros = { ...filtrosState };

    if (!value || value.trim() === '') {
      delete newFiltros[key];
    } else {
      newFiltros[key] = value;
    }

    setFiltrosState(newFiltros);

    if (key === 'nombre') {
      setSearchTerm(value);
    } else if (key === 'created_gte') {
      setSearchTermFechaDesde(value);
    } else if (key === 'created_lte') {
      setSearchTermFechaHasta(value);
    } else if (key === 'activo') {
      setSearchTermActivo(value);
    }
  };

  const handleClearFilters = () => {
    setFiltrosState({});
    clearFilters();
  };

  const handleFormSubmit = async (proyectoData: {
    proyecto_id: string;
    nombre: string;
    keyword?: import('./services/proyectosRequest').Keyword;
    colaboradores?: number[];
    tags?: string[];
  }) => {
    try {
      await createProyecto(proyectoData);
      toast.success('Proyecto creado correctamente');
      closeModal();
    } catch (error: any) {
      console.error('Error creating proyecto:', error);
      if (error?.response?.status === 400) {
        toast.error('Error en los datos del proyecto');
      } else {
        toast.error('Error al crear el proyecto');
      }
    }
  };

  const handleEditFormSubmit = async (proyectoData: {
    proyecto_id: string;
    nombre: string;
    keyword?: import('./services/proyectosRequest').Keyword;
    colaboradores?: number[];
    tags?: string[];
  }) => {
    try {
      if (selectedProyecto) {
        await updateProyecto(selectedProyecto.id, proyectoData);
        toast.success('Proyecto actualizado correctamente');
        closeModal();
      }
    } catch (error: any) {
      console.error('Error updating proyecto:', error);
      if (error?.response?.status === 400) {
        toast.error('Error en los datos del proyecto');
      } else {
        toast.error('Error al actualizar el proyecto');
      }
    }
  };

  const handleEditClick = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto);
    openModal('edit');
  };

  const handleDeleteClick = (proyecto: Proyecto) => {
    setProyectoToDelete(proyecto);
    openModal('delete');
  };

  const handleDeleteConfirm = async () => {
    if (proyectoToDelete) {
      try {
        await deleteProyecto(proyectoToDelete.id);
        toast.success('Proyecto eliminado correctamente');
        closeModal();
        setProyectoToDelete(null);
      } catch (error: any) {
        console.error('Error deleting proyecto:', error);
        toast.error('Error al eliminar el proyecto');
      }
    }
  };

  // const handlePageChange = (newPage: number) => {
  //   setPage(newPage);
  // };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <PageContainer
      title="Proyectos"
      actions={
        <div className="flex gap-4">
          <Button
            className="btn btn-sm btn-primary"
            variant="outline"
            onClick={() => openModal('create')}
          >
            <FaPlus />
          </Button>

          <Button
            className="btn btn-sm btn-secondary flex items-center"
            variant="outline"
            onClick={() => setOpenFiltros(!openFiltros)}
          >
            <FaFilter />
          </Button>
        </div>
      }
    >
      <PanelDeFiltros
        isOpen={openFiltros}
        filtros={filtrosState}
        onChangeFiltro={handleFilterChange}
        onClear={handleClearFilters}
        showNombre={false}
        showProyecto={false}
        showFechaCreado={true}
        showEstado={true}
      />

      <div className="space-y-6">
        {/* Search Input */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
            />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded transition-colors focus:outline-none focus:ring-2"
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
          </div>
        </div>

        {/* Stats */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-medium"
              style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
            >
              Total de proyectos: {totalCount}
            </span>
            <span
              className="text-sm"
              style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
            >
              Página {page} de {totalPages}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="rounded-lg">
          <ProyectosGrid
            proyectos={proyectos}
            loading={loading}
            onProyectoClick={(proyecto) =>
              navigate(`/proyectos/${proyecto.id}`)
            }
            onEditProyecto={handleEditClick}
            onDeleteProyecto={handleDeleteClick}
          />
        </div>

        {/* Pagination */}
        {/* {totalPages > 1 && (
          <div className="flex justify-center">
            <Paginacion
              currentPage={page}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        )} */}
      </div>

      {/* Modals */}
      <DrawerModal
        open={activeModal === 'create'}
        setOpen={closeModal}
        title="Crear Proyecto"
      >
        <ProyectoForm
          formId="create-proyecto-form"
          confirmEvent={handleFormSubmit}
          searchColaboradores={searchColaboradores}
          searchProyectosELT={searchProyectosELT}
          getTags={getTags}
        />
      </DrawerModal>

      <DrawerModal
        open={activeModal === 'edit'}
        setOpen={closeModal}
        title="Editar Proyecto"
      >
        <ProyectoForm
          formId="edit-proyecto-form"
          defaultValue={
            selectedProyecto
              ? {
                  proyecto_id: selectedProyecto.proyecto_id,
                  nombre: selectedProyecto.nombre,
                  keyword: Array.isArray(selectedProyecto.keyword)
                    ? { palabras_clave: selectedProyecto.keyword }
                    : selectedProyecto.keyword,
                  colaboradores:
                    selectedProyecto.colaboradores_info?.map((c) => c.id) || [],
                  tags: selectedProyecto.tags_info?.map((t) => t.id) || [],
                  colaboradores_info: selectedProyecto.colaboradores_info || [],
                  tags_info: selectedProyecto.tags_info || [],
                }
              : undefined
          }
          confirmEvent={handleEditFormSubmit}
          searchColaboradores={searchColaboradores}
          searchProyectosELT={searchProyectosELT}
          getTags={getTags}
        />
      </DrawerModal>

      <DeleteModal
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        proyecto={proyectoToDelete}
        loading={loading}
      />
    </PageContainer>
  );
};
