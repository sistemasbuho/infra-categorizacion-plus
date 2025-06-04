import { Flex, IconButton, Table } from '@chakra-ui/react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { FaPen, FaTrash } from 'react-icons/fa';

interface GenericTableProps<T extends { id: string | number }> {
  data: T[];
  columns: ColumnDef<T, string>[];
  selectRow: (row: T) => void;
  openModal: () => void;
  openDeleteOption: () => void;
}

function TableBase<T extends { id: string | number }>({
  data,
  columns,
  selectRow,
  openModal,
  openDeleteOption,
}: GenericTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table.Root variant={'line'}>
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.ColumnHeader key={header.id} p={4}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </Table.ColumnHeader>
            ))}
            <Table.ColumnHeader p={4}>Actions</Table.ColumnHeader>
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row key={row.original.id!}>
            {row.getVisibleCells().map((cell) => (
              <Table.Cell key={cell.id} p={4}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}

            <Table.Cell p={4}>
              <Flex gap={4}>
                <IconButton
                  size={'xs'}
                  onClick={() => {
                    openModal();
                    selectRow(row.original);
                  }}
                >
                  <FaPen />
                </IconButton>

                <IconButton
                  size={'xs'}
                  onClick={() => {
                    openDeleteOption();
                    selectRow(row.original);
                  }}
                >
                  <FaTrash />
                </IconButton>
              </Flex>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export default TableBase;
