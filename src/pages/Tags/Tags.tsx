import { useState, useEffect } from 'react';
import {
  FaFilter,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { TagResponse, useTags } from '../../hooks/useTags';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { Button } from '../../shared/components/ui/Button';
import DrawerModal from '../../shared/components/ui/DrawerModal';
import TagForm from './components/TagForm';
import toast from 'react-hot-toast';
import PanelDeFiltros, {
  FiltrosTemas,
} from '../../shared/components/ui/PanelDeFiltros';
import { useTheme } from '../../shared/context/ThemeContext';
import TableBase from '../../shared/components/ui/TableBase';
export const columns: ColumnDef<TagResponse>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'nombre',
    header: 'Nombre',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'created_at',
    header: 'Creado',
    cell: (info) => {
      const value = info.getValue() as string;
      if (!value) return '—';
      try {
        const date = new Date(value);
        return isNaN(date.getTime())
          ? '—'
          : date.toLocaleString('es-CO', {
              timeZone: 'America/Bogota',
              year: 'numeric',
              month: 'long',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            });
      } catch (error) {
        return '—';
      }
    },
  },
  {
    accessorKey: 'modified_at',
    header: 'Modificado',
    cell: (info) => {
      const value = info.getValue() as string;
      if (!value) return '—';
      try {
        const date = new Date(value);
        return isNaN(date.getTime())
          ? '—'
          : date.toLocaleString('es-CO', {
              timeZone: 'America/Bogota',
              year: 'numeric',
              month: 'long',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            });
      } catch (error) {
        return '—';
      }
    },
  },
  {
    accessorKey: 'created_by',
    header: 'Creado por',
    cell: (info) => info.getValue() ?? '—',
  },
  {
    accessorKey: 'modified_by',
    header: 'Modificado por',
    cell: (info) => info.getValue() ?? '—',
  },
];

export const Tags = () => {
  const { theme } = useTheme();
  const {
    tagList,
    selectATag,
    isLoading,
    createATag,
    selectedTag,
    updateATag,
    deleteTag,
    totalCount,
    page,
    pageSize,
    searchTerm,
    setPage,
    setPageSize,
    setSearchTerm,
    clearFilters,
  } = useTags();

  const [activeModal, setActiveModal] = useState<
    'create' | 'edit' | 'delete' | null
  >(null);

  const [openFiltros, setOpenFiltros] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosTemas>({
    nombre: searchTerm,
  });

  // Sincronizar filtros con searchTerm del URL
  useEffect(() => {
    setFiltros((prev) => ({
      ...prev,
      nombre: searchTerm,
    }));
  }, [searchTerm]);

  const openModal = (type: 'create' | 'edit' | 'delete') =>
    setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const onChangeFiltro = (key: keyof FiltrosTemas, value: string) => {
    const newFiltros = { ...filtros, [key]: value };
    setFiltros(newFiltros);

    // Aplicar filtro de nombre inmediatamente a la API
    if (key === 'nombre') {
      setSearchTerm(value);
    }
  };

  const onClear = () => {
    setFiltros({});
    clearFilters();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div
      className="h-screen flex flex-col p-8"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#111827',
      }}
    >
      <div className="flex justify-between w-full mb-6">
        <h1
          className="text-4xl font-bold"
          style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}
        >
          Tags
        </h1>

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
            onClick={() => setOpenFiltros((o) => !o)}
          >
            <FaFilter />
          </Button>
        </div>
      </div>

      <PanelDeFiltros
        isOpen={openFiltros}
        filtros={filtros}
        onChangeFiltro={onChangeFiltro}
        onClear={onClear}
        showNombre={true}
        showProyecto={false}
        showFechaCreado={false}
      />

      {/* Results count */}
      <div className="mb-4">
        <span
          className="text-sm"
          style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
        >
          {totalCount} tags encontrados
          {searchTerm && ` para "${searchTerm}"`}
        </span>
      </div>

      {isLoading ? (
        <Skeleton columns={columns.length} rows={5} />
      ) : tagList.length > 0 ? (
        <>
          <TableBase
            columns={columns}
            data={tagList}
            selectRow={selectATag}
            openModal={() => openModal('edit')}
            openDeleteOption={() => openModal('delete')}
          />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-2"
            >
              <FaChevronLeft />
              Anterior
            </Button>

            <div className="flex items-center gap-4">
              <span
                className="text-sm"
                style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                Página {page} de {totalPages}
              </span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 rounded border text-sm"
                style={{
                  backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                  color: theme === 'dark' ? '#ffffff' : '#111827',
                  border: `1px solid ${
                    theme === 'dark' ? '#4b5563' : '#d1d5db'
                  }`,
                }}
              >
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
                <option value={100}>100 por página</option>
              </select>
            </div>

            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-2"
            >
              Siguiente
              <FaChevronRight />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <h2
            className="text-xl font-semibold"
            style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
          >
            {searchTerm
              ? `No se encontraron tags para "${searchTerm}"`
              : 'No se han encontrado tags'}
          </h2>
        </div>
      )}

      <DrawerModal
        open={activeModal === 'create'}
        setOpen={closeModal}
        title="Crear Tag"
      >
        <TagForm
          formId="create-tag-form"
          confirmEvent={async (data) => {
            try {
              await createATag(data as TagResponse);
              toast.success('Tag creado correctamente');
            } catch (error: any) {
              if (error?.response?.status === 400) {
                toast.error('El nombre del tag ya existe');
              } else {
                toast.error('Error al crear el tag');
              }
            } finally {
              closeModal();
            }
          }}
        />
      </DrawerModal>

      <DrawerModal
        open={activeModal === 'edit'}
        setOpen={closeModal}
        title="Editar Tag"
      >
        <TagForm
          formId="edit-tag-form"
          defaultValue={selectedTag}
          confirmEvent={async (data) => {
            try {
              await updateATag({ ...selectedTag, ...data } as TagResponse);
              toast.success('Tag actualizado correctamente');
            } catch {
              toast.error('Error al actualizar el tag');
            } finally {
              closeModal();
            }
          }}
        />
      </DrawerModal>

      <DrawerModal
        open={activeModal === 'delete'}
        setOpen={closeModal}
        title="Eliminar Tag"
      >
        <div className="space-y-4">
          <p style={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
            ¿Estás seguro de eliminar el tag "
            <span className="font-semibold">{selectedTag?.nombre}</span>
            "?
          </p>
          <div className="flex gap-2">
            <button
              className="flex-1 px-4 py-2 rounded transition"
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#b91c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
              onClick={async () => {
                try {
                  await deleteTag(selectedTag);
                  toast.success('Tag eliminado correctamente');
                } catch {
                  toast.error('Error al eliminar el tag');
                } finally {
                  closeModal();
                }
              }}
            >
              Eliminar
            </button>
            <button
              className="flex-1 px-4 py-2 rounded transition"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                color: theme === 'dark' ? '#ffffff' : '#374151',
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === 'dark' ? '#4b5563' : '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === 'dark' ? '#374151' : '#f3f4f6';
              }}
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      </DrawerModal>
    </div>
  );
};
