import { createColumnHelper } from '@tanstack/react-table';
import { TemaResponse, useTema } from './context/TemaContext';
import { FaFilter, FaPlus } from 'react-icons/fa';
import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import TableBase from './utils/table/TableBase';
import DrawerModal from './components/modal/DrawerModal';
import TemaForm from './components/forms/TemaForm';
import AlertModal from './components/modal/AlertModal';

const columnHelper = createColumnHelper<TemaResponse>();

type ModalType = 'create' | 'edit' | 'delete' | 'filters' | null;

export const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('nombre', {
    header: 'Nombre',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('proyecto_id', {
    header: 'Proyecto',
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor('descripcion', {
    header: 'Descripción',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Creado',
    cell: (info) => {
      const value = info.getValue() as string | null | undefined;
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
  }),
  columnHelper.accessor('modified_at', {
    header: 'Modificado',
    cell: (info) => {
      const value = info.getValue() as string | null | undefined;
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
  }),
  columnHelper.accessor('created_by', {
    header: 'Creado por',
    cell: (info) => info.getValue() ?? '—',
  }),
  columnHelper.accessor('modified_by', {
    header: 'Modificado por',
    cell: (info) => info.getValue() ?? '—',
  }),
];

function TemaLayout() {
  const {
    temaList,
    selectATema,
    selectedTema,
    createATema,
    updateATema,
    deleteATema,
  } = useTema();

  // Estado para controlar qué modal está abierto
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Función para cerrar cualquier modal
  const closeModal = () => setActiveModal(null);

  // Función para abrir un modal específico
  const openModal = (modalType: ModalType) => setActiveModal(modalType);

  return (
    <VStack h={'100vh'} justifyContent={'start'} w={'full'} px={8}>
      {/* HEADER */}
      <Flex w="full" justifyContent={'space-between'} mb={10}>
        <Heading size="3xl">Temas</Heading>

        <Flex gap={4}>
          <Button size={'sm'} onClick={() => openModal('create')}>
            <FaPlus />
          </Button>

          <Button size={'sm'} onClick={() => openModal('filters')}>
            <FaFilter />
          </Button>
        </Flex>
      </Flex>

      {/* TABLE */}
      {temaList.length > 0 ? (
        <TableBase<TemaResponse>
          columns={columns}
          data={temaList}
          selectRow={selectATema}
          openModal={() => openModal('edit')}
          openDeleteOption={() => openModal('delete')}
        />
      ) : (
        <Box>
          <Heading>No se han encontrado temas</Heading>
        </Box>
      )}

      {/* MODALES */}

      {/* Modal para editar - Ahora como DrawerModal */}
      <DrawerModal
        open={activeModal === 'edit'}
        setOpen={closeModal}
        title="Editar Tema"
      >
        <TemaForm
          defaultValue={selectedTema}
          confirmEvent={(tema) => {
            updateATema(tema);
            closeModal();
          }}
        />
      </DrawerModal>

      {/* Modal para crear */}
      <DrawerModal
        open={activeModal === 'create'}
        setOpen={closeModal}
        title="Crear Tema"
      >
        <TemaForm
          confirmEvent={(tema) => {
            createATema(tema);
            closeModal();
          }}
        />
      </DrawerModal>

      {/* Modal para eliminar */}
      <AlertModal
        open={activeModal === 'delete'}
        setOpen={closeModal}
        title="Eliminar Tag"
      >
        <Flex flexDir={'column'} gap={4}>
          <Text>
            ¿Estás seguro de eliminar el tag?,{' '}
            <span style={{ fontWeight: 'bold' }}>
              Esta acción no se puede deshacer.
            </span>
          </Text>
          <Flex gap={2}>
            <Button
              flex={1}
              colorScheme="red"
              onClick={() => {
                if (selectedTema) {
                  deleteATema(selectedTema);
                  closeModal();
                }
              }}
            >
              Eliminar
            </Button>
            <Button flex={1} variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
          </Flex>
        </Flex>
      </AlertModal>

      {/* Modal para filtros */}
      <DrawerModal
        open={activeModal === 'filters'}
        setOpen={closeModal}
        title="Filtros para Temas"
      >
        <h1>Formulario de filtros aquí</h1>
      </DrawerModal>
    </VStack>
  );
}

export default TemaLayout;
