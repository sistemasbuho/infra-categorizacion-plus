import { FaFilter } from 'react-icons/fa';
import { PageContainer } from '../../shared/components/Layout/PageContainer';
import { Button } from '../../shared/components/ui/Button';
import { ArticulosTable } from '../MisArticulosLideres/components/ArticulosTable';
import { useArticulos } from './hooks/useArticulos';
import { Paginacion } from '../../shared/components/ui/Paginacion';
import { FiltersPanel } from './components/FiltersPanel';
import { useModal } from '../../shared/hooks/useModal';

export const MisArticulos = () => {
  const {
    articulos,
    isLoading,
    paginacion,
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
  } = useArticulos();

  const { isOpen: openFiltros, toggleModal: toggleFiltros } = useModal();

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

  return (
    <PageContainer
      title="Mis Artículos"
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
        onDeleteArticle={() => {}}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onPageChange={setPage}
      />

      {/* Paginación */}
      <div className="mt-6">
        <Paginacion
          totalCount={paginacion.count}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </PageContainer>
  );
};
