import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Articulo, useArticulosLideres } from '../../hooks/useArticulosLideres';
import { Button } from '../../components/ui/Button';
import { Paginacion } from '../../components/ui/Paginacion';
import toast from 'react-hot-toast';
import { PageContainer } from '../../shared/components/Layout/PageContainer';
import { useModal } from '../../shared/hooks/useModal';
import { ArticulosTable } from './components/ArticulosTable';
import { DeleteModal } from './components/ActionsPanel/DeleteModal';
import { FiltersPanel } from './components/FiltersPanel/FiltersPanel';

export const MisArticulosLideres = () => {
  const {
    articulos,
    isLoading,
    paginacion: { count },
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    changeEstado,
  } = useArticulosLideres();

  const { isOpen: openFiltros, toggleModal: toggleFiltros } = useModal();
  const deleteModal = useModal();
  const [selectedArticle, setSelectedArticle] = useState<Articulo | null>(null);
  const [motivo, setMotivo] = useState('');

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters };

    // Si el valor está vacío, eliminar el filtro
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

  const handleDeleteArticle = async () => {
    if (!selectedArticle) {
      return;
    }

    const isDeleted = selectedArticle.borrado;

    // Si el artículo no está borrado, necesita un motivo para borrarlo
    if (!isDeleted && !motivo.trim()) {
      toast.error('Por favor selecciona un motivo');
      return;
    }

    try {
      const accion = !isDeleted;
      const motivoToSend = isDeleted ? 'Reactivación' : motivo;

      await changeEstado(selectedArticle.articulo_id, accion, motivoToSend);

      const successMessage = isDeleted
        ? 'Artículo reactivado exitosamente'
        : 'Artículo marcado como borrado';

      toast.success(successMessage);
      deleteModal.closeModal();
      setSelectedArticle(null);
      setMotivo('');
    } catch (error) {
      toast.error('Error al cambiar el estado del artículo');
    }
  };

  const handleOpenDeleteModal = (article: Articulo) => {
    setSelectedArticle(article);
    deleteModal.openModal();
  };

  const handleCloseDeleteModal = () => {
    deleteModal.closeModal();
    setSelectedArticle(null);
    setMotivo('');
  };

  return (
    <PageContainer
      title="Mis Artículos Líderes"
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

      {/* Tabla de Artículos */}
      <ArticulosTable
        articulos={articulos}
        isLoading={isLoading}
        onDeleteArticle={handleOpenDeleteModal}
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
        selectedArticle={selectedArticle}
        motivo={motivo}
        onClose={handleCloseDeleteModal}
        onMotivoChange={setMotivo}
        onConfirm={handleDeleteArticle}
      />
    </PageContainer>
  );
};
