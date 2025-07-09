import { FC, ReactNode, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Button } from './Button';
import { useTheme } from '../../shared/context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  title,
  children,
  footer,
  onClose,
}) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          backgroundColor:
            theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-lg rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#ffffff' : '#111827',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: `1px solid ${
              theme === 'dark' ? '#374151' : '#e5e7eb'
            }`,
          }}
        >
          <h3
            className="text-xl font-semibold"
            style={{
              color: theme === 'dark' ? '#ffffff' : '#111827',
            }}
          >
            {title}
          </h3>
          <Button onClick={onClose} variant="secondary" aria-label="Cerrar">
            <FaTimes size={18} />
          </Button>
        </div>

        <div className="px-6 py-4">{children}</div>

        {footer && (
          <div
            className="flex justify-end gap-2 px-6 py-4"
            style={{
              borderTop: `1px solid ${
                theme === 'dark' ? '#374151' : '#e5e7eb'
              }`,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
