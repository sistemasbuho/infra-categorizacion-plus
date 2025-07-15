import { useTheme } from '../../context/ThemeContext';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export const Skeleton = ({ columns, rows = 5 }: TableSkeletonProps) => {
  const { theme } = useTheme();

  return (
    <div className="w-full space-y-2 animate-pulse">
      <div className="flex space-x-4 mb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-6 rounded flex-1"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            }}
          ></div>
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex space-x-4 mb-2">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-5 rounded flex-1"
              style={{
                backgroundColor: theme === 'dark' ? '#4b5563' : '#f3f4f6',
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};
