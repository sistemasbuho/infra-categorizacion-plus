import { useMemo, useState } from 'react';
import {
  FaFilter,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { TagResponse, useTags } from '../../hooks/useTags';
import TableBase from '../../utils/table/TableBase';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import DrawerModal from '../../components/modal/DrawerModal';
import TagForm from '../../components/forms/TagForm';
import toast from 'react-hot-toast';
import { deleteATag } from '../../services/tagRequest';
import PanelDeFiltros, {
  FiltrosTemas,
} from '../../components/ui/PanelDeFiltros';
import { useTheme } from '../../context/ThemeContext';

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
      return new Date(value).toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    },
  },
  {
    accessorKey: 'modified_at',
    header: 'Modificado',
    cell: (info) => {
      const value = info.getValue() as string;
      if (!value) return '—';
      return new Date(value).toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
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
    totalCount,
    nextPage,
    previousPage,
    loadNextPage,
    loadPreviousPage,
  } = useTags();

  const [activeModal, setActiveModal] = useState<
    'create' | 'edit' | 'delete' | 'filters' | null
  >(null);

  const openModal = (type: 'create' | 'edit' | 'delete' | 'filters') =>
    setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  // Estados de filtros
  const [openFiltros, setOpenFiltros] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosTemas>({});
  const onChangeFiltro = (key: keyof FiltrosTemas, value: string) =>
    setFiltros((prev) => ({ ...prev, [key]: value }));
  const onClear = () => setFiltros({});

  const filtered = useMemo(() => {
    return tagList.filter((t) => {
      if (
        filtros.nombre &&
        !t.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
      )
        return false;
      if (
        filtros.created_gte &&
        new Date(t.created_at) < new Date(filtros.created_gte)
      )
        return false;
      if (
        filtros.created_lte &&
        new Date(t.created_at) > new Date(filtros.created_lte + 'T23:59:59')
      )
        return false;
      return true;
    });
  }, [tagList, filtros]);

  return (
    <div
      className="h-screen flex flex-col p-8"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#111827',
      }}
    >
      <div className="flex justify-between w-full mb-10">
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
        showProyecto={false}
      />

      {isLoading ? (
        <Skeleton columns={columns.length} rows={5} />
      ) : tagList.length > 0 ? (
        <>
          <TableBase
            columns={columns}
            data={filtered}
            selectRow={selectATag}
            openModal={() => openModal('edit')}
            openDeleteOption={() => openModal('delete')}
          />

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={loadPreviousPage}
              disabled={!previousPage}
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
                {tagList.length} de {totalCount} tags
              </span>
            </div>

            <Button
              variant="outline"
              onClick={loadNextPage}
              disabled={!nextPage}
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
            No se han encontrado tags
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
            } catch {
              toast.error('Error al crear el tag');
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
                  await deleteATag(selectedTag.id);
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
