import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  actions,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="h-screen flex flex-col p-8"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#111827',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-4xl font-bold"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          {title}
        </h1>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
};
