import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { useTheme } from '../../shared/context/ThemeContext';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';

const sizeStyles: Record<Size, string> = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style = {},
  onMouseEnter,
  onMouseLeave,
  ...rest
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#fb923c',
          color: '#ffffff',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          color: theme === 'dark' ? '#ffffff' : '#374151',
          border: 'none',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme === 'dark' ? '#ffffff' : '#374151',
          border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme === 'dark' ? '#ffffff' : '#374151',
          border: 'none',
        };
      default:
        return {};
    }
  };

  const getHoverStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#f97316', // orange-500
        };
      case 'secondary':
        return {
          backgroundColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
        };
      case 'outline':
        return {
          backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
        };
      case 'ghost':
        return {
          backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
        };
      default:
        return {};
    }
  };

  const classes = [baseStyles, sizeStyles[size], className].join(' ');

  const buttonStyle = {
    ...getVariantStyles(),
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const hoverStyles = getHoverStyles();
    Object.assign(e.currentTarget.style, hoverStyles);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const originalStyles = getVariantStyles();
    Object.assign(e.currentTarget.style, originalStyles, style);
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <button
      className={classes}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </button>
  );
};
