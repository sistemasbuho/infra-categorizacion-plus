import { AnchorHTMLAttributes, FC, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
  variant?: Variant;
  size?: Size;
}

const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
const variantStyles: Record<Variant, string> = {
  primary: 'bg-orange-400 text-white hover:bg-orange-500 focus:ring-orange-300',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-200',
  outline:
    'border border-gray-300 text-gray-800 hover:bg-gray-100 focus:ring-gray-200',
  ghost: 'bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-200',
};
const sizeStyles: Record<Size, string> = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Link: FC<LinkProps> = ({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  target,
  rel,
  ...rest
}) => {
  const _rel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined);
  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a href={href} target={target} rel={_rel} className={classes} {...rest}>
      {children}
    </a>
  );
};
