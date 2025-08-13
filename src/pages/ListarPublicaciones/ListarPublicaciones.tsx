import { FaFilter } from 'react-icons/fa';
import { Publicacion, usePublicaciones } from './hooks/usePublicaciones';
import { Button } from '../../shared/components/ui/Button';
import { Paginacion } from '../../shared/components/ui/Paginacion';
import { PageContainer } from '../../shared/components/Layout/PageContainer';
import { useModal } from '../../shared/hooks/useModal';
import { PublicacionesTable } from './components/PublicacionesTable';
import { FiltersPanel } from './components/FiltersPanel/FiltersPanel';
import { DeleteModal } from './components/ActionsPanel/DeleteModal';
import toast from 'react-hot-toast';
import { useState } from 'react';

export const ListarPublicaciones = () => {
  const {
    publicaciones,
    isLoading,
    paginacion: { count },
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    changeEstado,
  } = usePublicaciones();

  const { isOpen: openFiltros, toggleModal: toggleFiltros } = useModal();
  const deleteModal = useModal();
  const [selectedPublicacion, setSelectedPublicacion] =
    useState<Publicacion | null>(null);
  const [motivo, setMotivo] = useState('');

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters };

    if (!value || value.trim() === '') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleDeletePublicacion = async () => {
    if (!selectedPublicacion) {
      return;
    }

    const isDeleted = selectedPublicacion.borrado;

    if (!isDeleted && !motivo.trim()) {
      toast.error('Por favor selecciona un motivo');
      return;
    }

    try {
      const accion = !isDeleted;
      const motivoToSend = isDeleted ? 'Reactivación' : motivo;

      await changeEstado(selectedPublicacion.id, accion, motivoToSend);

      const successMessage = isDeleted
        ? 'Publicación reactivada exitosamente'
        : 'Publicación marcada como borrada';

      toast.success(successMessage);
      deleteModal.closeModal();
      setSelectedPublicacion(null);
      setMotivo('');
    } catch (error) {
      toast.error('Error al cambiar el estado de la publicación');
    }
  };

  const handleOpenDeleteModal = (publicacion: Publicacion) => {
    setSelectedPublicacion(publicacion);
    deleteModal.openModal();
  };

  const handleCloseDeleteModal = () => {
    deleteModal.closeModal();
    setSelectedPublicacion(null);
    setMotivo('');
  };

  return (
    <PageContainer
      title="Lista de Publicaciones"
      actions={
        <Button
          className="btn btn-sm btn-secondary flex items-center"
          variant="outline"
          onClick={toggleFiltros}
        >
          <FaFilter />
        </Button>
      }
    >
      {/* Panel de Filtros */}
      <FiltersPanel
        isOpen={openFiltros}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onApplyFilters={() => setPage(1)}
      />

      {/* Tabla de Publicaciones */}
      <PublicacionesTable
        publicaciones={publicaciones}
        isLoading={isLoading}
        onDeletePublicacion={handleOpenDeleteModal}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onPageChange={setPage}
      />

      {/* Paginación */}
      <div className="mt-6">
        <Paginacion
          totalCount={count}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>

      {/* Modal de Confirmación */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        selectedPublicacion={selectedPublicacion}
        motivo={motivo}
        onClose={handleCloseDeleteModal}
        onMotivoChange={setMotivo}
        onConfirm={handleDeletePublicacion}
      />
    </PageContainer>
  );
};
