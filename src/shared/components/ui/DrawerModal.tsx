// components/modal/DrawerModal.tsx
import React, { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  children: ReactNode;
  title?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DrawerModal: React.FC<Props> = ({ children, title, open, setOpen }) => {
  const { theme } = useTheme();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={() => setOpen(false)}
      />

      <div
        className="relative ml-auto w-full max-w-md h-full shadow-xl p-6 overflow-y-auto"
        style={{
          backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
          color: theme === 'dark' ? '#ffffff' : '#111827',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-semibold"
            style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}
          >
            {title}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-2xl leading-none transition-colors"
            style={{
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color =
                theme === 'dark' ? '#ffffff' : '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                theme === 'dark' ? '#9ca3af' : '#6b7280';
            }}
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DrawerModal;
