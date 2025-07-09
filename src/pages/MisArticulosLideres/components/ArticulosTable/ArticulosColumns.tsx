import { createColumnHelper } from '@tanstack/react-table';
import { Link } from '../../../../components/ui/Link';
import { Button } from '../../../../components/ui/Button';
import { Articulo } from '../../../../hooks/useArticulosLideres';

const columnHelper = createColumnHelper<Articulo>();

export const createArticulosColumns = (
  onDeleteArticle: (article: Articulo) => void
) => [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (i) => i.getValue()?.substring(0, 8) || 'Sin datos',
  }),
  columnHelper.display({
    id: 'abrir',
    header: 'Categorizar',
    cell: ({ row }) => {
      const proyectoId = row.original.proyectos?.[0]?.proyecto?.id || 'default';
      return (
        <Link
          href={`/categorizacion-articulo/${row.original.articulo_id}/${proyectoId}`}
          variant="primary"
          size="sm"
          className="w-full h-9 p-0"
        >
          Categorizar
        </Link>
      );
    },
  }),
  columnHelper.display({
    id: 'borrado',
    header: 'Borrado',
    cell: ({ row }) => (
      <Button
        onClick={() => onDeleteArticle(row.original)}
        variant="primary"
        size="sm"
        className="w-full p-2"
      >
        {row.original.borrado ? 'Pasar a activo' : 'Pasar a borrado'}
      </Button>
    ),
  }),
  columnHelper.accessor('created_at', {
    header: 'Fecha',
    cell: (i) => {
      const value = i.getValue();
      return value ? new Date(value).toLocaleString('es-CO') : 'Sin datos';
    },
  }),
  columnHelper.display({
    id: 'categorizacion',
    header: 'Categorizado',
    cell: ({ row }) => {
      const categorizado = row.original.categorizado;
      return (
        <div className="flex items-center justify-center h-full">
          {categorizado ? (
            <span className="text-green-600 font-semibold">Sí</span>
          ) : (
            <span className="text-red-600 font-semibold">No</span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('titulo', {
    header: 'Titular',
    cell: (i) => i.getValue() || 'Sin datos',
  }),
  columnHelper.accessor('tipo_publicacion', {
    header: 'Tipo publicación',
    cell: (i) => i.getValue() || 'Sin datos',
  }),
  columnHelper.display({
    id: 'medio',
    header: 'Medio',
    cell: ({ row }) => row.original.medio?.url || 'Sin datos',
  }),
  columnHelper.display({
    id: 'proyecto',
    header: 'Proyecto',
    cell: ({ row }) => {
      const proyectos = row.original.proyectos;
      if (!proyectos || proyectos.length === 0) return 'Sin datos';
      return (
        proyectos
          .map((p: any) => p.proyecto?.nombre)
          .filter(Boolean)
          .join(', ') || 'Sin datos'
      );
    },
  }),
  columnHelper.display({
    id: 'asignado_a',
    header: 'Asignado a',
    cell: ({ row }) => {
      const asignado = row.original.asignado_a;
      return asignado
        ? typeof asignado === 'string'
          ? asignado
          : asignado.email || asignado.nombre || 'Sin datos'
        : 'Sin datos';
    },
  }),
  columnHelper.display({
    id: 'autor',
    header: 'Autor',
    cell: ({ row }) => row.original.autor?.autor || 'Sin datos',
  }),
  columnHelper.display({
    id: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url = row.original.url_articulo;
      return url ? (
        <Link href={url} target="_blank" variant="primary" size="sm">
          Ver artículo
        </Link>
      ) : (
        'Sin datos'
      );
    },
  }),
];
