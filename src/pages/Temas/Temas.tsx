import { useState, useEffect } from 'react';
import {
  FaFilter,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { TemaResponse, useTemas } from '../../hooks/useTemas';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '../../components/ui/Skeleton';
import DrawerModal from '../../components/modal/DrawerModal';
import TemaForm, { LocalTema } from '../../components/forms/TemaForm';
import { Button } from '../../components/ui/Button';
import PanelDeFiltros, {
  FiltrosTemas,
} from '../../components/ui/PanelDeFiltros';
import toast from 'react-hot-toast';
import { useTheme } from '../../shared/context/ThemeContext';
import TableBase from '../../components/ui/TableBase';

export const columns: ColumnDef<TemaResponse>[] = [
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
    accessorKey: 'proyecto_id',
    header: 'Proyecto',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'descripcion',
    header: 'Descripción',
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

export const Temas = () => {
  const { theme } = useTheme();
  const {
    temasList,
    selectATema,
    isLoading,
    createATema,
    selectedTema,
    updateATema,
    deleteATema,
    totalCount,
    page,
    pageSize,
    searchTermNombre,
    searchTermProyecto,
    setPage,
    setPageSize,
    setSearchTermNombre,
    setSearchTermProyecto,
    clearFilters,
  } = useTemas();

  const [activeModal, setActiveModal] = useState<
    'create' | 'edit' | 'delete' | null
  >(null);

  const [openFiltros, setOpenFiltros] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosTemas>({
    nombre: searchTermNombre,
    proyecto_id: searchTermProyecto,
  });

  // Sincronizar filtros con searchTerms del URL
  useEffect(() => {
    setFiltros((prev) => ({
      ...prev,
      nombre: searchTermNombre,
      proyecto_id: searchTermProyecto,
    }));
  }, [searchTermNombre, searchTermProyecto]);

  const openModal = (type: 'create' | 'edit' | 'delete') =>
    setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const onChangeFiltro = (key: keyof FiltrosTemas, value: string) => {
    const newFiltros = { ...filtros, [key]: value };
    setFiltros(newFiltros);

    // Aplicar filtros inmediatamente a la API
    if (key === 'nombre') {
      setSearchTermNombre(value);
    } else if (key === 'proyecto_id') {
      setSearchTermProyecto(value);
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
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Temas
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
          {totalCount} temas encontrados
          {(searchTermNombre || searchTermProyecto) && (
            <span>
              {searchTermNombre && ` para nombre "${searchTermNombre}"`}
              {searchTermProyecto && ` en proyecto "${searchTermProyecto}"`}
            </span>
          )}
        </span>
      </div>

      {isLoading ? (
        <Skeleton columns={columns.length} rows={5} />
      ) : temasList.length > 0 ? (
        <>
          <TableBase
            columns={columns}
            data={temasList}
            selectRow={selectATema}
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
            style={{
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            }}
          >
            {searchTermNombre || searchTermProyecto
              ? 'No se encontraron temas con los filtros aplicados'
              : 'No se han encontrado temas'}
          </h2>
        </div>
      )}

      <DrawerModal
        open={activeModal === 'create'}
        setOpen={closeModal}
        title="Crear Tema"
      >
        <TemaForm
          formId="create-tema-form"
          confirmEvent={async (data: LocalTema) => {
            try {
              await createATema(data);
              toast.success('Tema creado correctamente');
            } catch (error: any) {
              if (error?.response?.status === 400) {
                toast.error('El nombre del tema ya existe');
              } else {
                toast.error('Error al crear el tema');
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
        title="Editar Tema"
      >
        <TemaForm
          formId="edit-tema-form"
          defaultValue={selectedTema}
          confirmEvent={async (data: LocalTema) => {
            try {
              await updateATema({ ...selectedTema, ...data } as TemaResponse);
              toast.success('Tema actualizado correctamente');
            } catch {
              toast.error('Error al actualizar el tema');
            } finally {
              closeModal();
            }
          }}
        />
      </DrawerModal>

      <DrawerModal
        open={activeModal === 'delete'}
        setOpen={closeModal}
        title="Eliminar Tema"
      >
        <div className="space-y-4">
          <p
            style={{
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
            }}
          >
            ¿Estás seguro de eliminar el tema "
            <span className="font-semibold">{selectedTema?.nombre}</span>
            "?
          </p>
          <div className="flex gap-2">
            <button
              className="flex-1 px-4 py-2 rounded transition-colors"
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
                  await deleteATema(selectedTema);
                  toast.success('Tema eliminado correctamente');
                } catch {
                  toast.error('Error al eliminar el tema');
                } finally {
                  closeModal();
                }
              }}
            >
              Eliminar
            </button>
            <button
              className="flex-1 px-4 py-2 rounded transition-colors"
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
