import { FC } from 'react';
import { Button } from './Button';

interface PaginacionProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export const Paginacion: FC<PaginacionProps> = ({
  totalCount,
  pageSize,
  currentPage,
  onPageChange,
  siblingCount = 1,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages === 0) return null;

  const firstRecord = (currentPage - 1) * pageSize + 1;
  const lastRecord = Math.min(currentPage * pageSize, totalCount);

  const pages: (number | '...')[] = [];
  const left = Math.max(1, currentPage - siblingCount);
  const right = Math.min(totalPages, currentPage + siblingCount);

  if (left > 1) {
    pages.push(1);
    if (left > 2) pages.push('...');
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < totalPages) {
    if (right < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
      <span className="text-sm text-gray-600">
        Mostrando registros del <strong>{firstRecord}</strong> al{' '}
        <strong>{lastRecord}</strong> de un total de{' '}
        <strong>{totalCount}</strong>
      </span>

      <nav className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={idx} className="px-2 text-gray-500 select-none">
              …
            </span>
          ) : (
            <Button
              key={idx}
              variant={p === currentPage ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(p as number)}
              className={p === currentPage ? 'pointer-events-none' : ''}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </nav>
    </div>
  );
};
