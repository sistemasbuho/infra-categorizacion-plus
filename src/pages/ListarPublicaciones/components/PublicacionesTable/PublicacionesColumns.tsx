import { createColumnHelper } from '@tanstack/react-table';
import { Link } from '../../../../shared/components/ui/Link';
import { Button } from '../../../../shared/components/ui/Button';
import { Publicacion } from '../../hooks/usePublicaciones';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<Publicacion>();

export const createPublicacionesColumns = (
  onDeletePublicacion: (publicacion: Publicacion) => void,
  navigate: ReturnType<typeof useNavigate>
) => [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (i) => i.getValue()?.substring(0, 8) || 'Sin datos',
  }),
  columnHelper.display({
    id: 'abrir',
    header: 'Categorizar',
    cell: ({ row }) => {
      const handleCategorizar = () => {
        const publicacionId = row.original.publicacion_id;
        const proyectoId = row.original.proyecto_id;

        if (!proyectoId) {
          console.warn('No hay proyecto asignado para esta publicación');
          return;
        }

        navigate(
          `/categorizacion-redes/publicacion_id/${publicacionId}/proyecto_id/${proyectoId}`
        );
      };

      return (
        <Button
          onClick={handleCategorizar}
          variant="primary"
          size="sm"
          className="w-full h-9 p-0"
        >
          Categorizar
        </Button>
      );
    },
  }),
  columnHelper.display({
    id: 'borrado',
    header: 'Borrado',
    cell: ({ row }) => (
      <Button
        onClick={() => onDeletePublicacion(row.original)}
        variant="primary"
        size="sm"
        className="w-full p-2"
      >
        {row.original.borrado ? 'Pasar a activo' : 'Pasar a borrado'}
      </Button>
    ),
  }),
  columnHelper.accessor('fecha', {
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
  columnHelper.accessor('red_social', {
    header: 'Red Social',
    cell: (i) => {
      const value = i.getValue() || 'Sin datos';
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
      const proyecto = row.original.categorizacion_proyecto;
      const value = proyecto ? `${proyecto.substring(0, 8)}...` : 'Sin datos';
      return (
        <div
          className="max-w-xs truncate"
          title={proyecto || 'Sin datos'}
          style={{ maxWidth: '100px' }}
        >
          {value}
        </div>
      );
    },
  }),
  columnHelper.accessor('medio', {
    header: 'Medio',
    cell: (i) => {
      const value = i.getValue() || 'Sin datos';
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
    id: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url = row.original.url;
      return url ? (
        <Link href={url} target="_blank" variant="primary" size="sm">
          Ver publicación
        </Link>
      ) : (
        'Sin datos'
      );
    },
  }),
];
