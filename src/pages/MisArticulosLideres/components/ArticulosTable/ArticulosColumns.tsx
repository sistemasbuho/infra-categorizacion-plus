import { createColumnHelper } from '@tanstack/react-table';
import { Link } from '../../../../shared/components/ui/Link';
import { Button } from '../../../../shared/components/ui/Button';
import { Articulo } from '../../hooks/useArticulosLideres';

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
          href={`/categorizacion-articulo/articulo_id/${row.original.articulo_id}/proyecto_id/${proyectoId}`}
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
      if (!value) return 'Sin datos';
      try {
        const date = new Date(value);
        return isNaN(date.getTime())
          ? 'Sin datos'
          : date.toLocaleString('es-CO');
      } catch (error) {
        return 'Sin datos';
      }
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
    cell: (i) => {
      const value = i.getValue() || 'Sin datos';
      return (
        <div
          className="max-w-xs truncate"
          title={value}
          style={{ maxWidth: '200px' }}
        >
          {value}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'tipo_publicacion',
    header: 'Tipo publicación',
    cell: ({ row }) => {
      const value = row.original.tipo_publicacion?.nombre || 'Sin datos';
      return (
        <div
          className="max-w-xs truncate"
          title={value}
          style={{ maxWidth: '100px' }}
        >
          {value}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'programa',
    header: 'Programa',
    cell: ({ row }) => {
      const value = row.original.programa?.nombre || 'Sin datos';
      return (
        <div
          className="max-w-xs truncate"
          title={value}
          style={{ maxWidth: '120px' }}
        >
          {value}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'proyecto',
    header: 'Proyecto',
    cell: ({ row }) => {
      const proyectos = row.original.proyectos;
      if (!proyectos || proyectos.length === 0) return 'Sin datos';
      const value =
        proyectos
          .map((p: any) => p.proyecto?.nombre)
          .filter(Boolean)
          .join(', ') || 'Sin datos';
      return (
        <div
          className="max-w-xs truncate"
          title={value}
          style={{ maxWidth: '150px' }}
        >
          {value}
        </div>
      );
    },
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
