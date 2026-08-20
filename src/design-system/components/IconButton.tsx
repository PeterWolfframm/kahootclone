import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const iconButton = cva(
  'haptic inline-flex items-center justify-center disabled:cursor-not-allowed disabled:border-grey-200 disabled:bg-grey-100 disabled:text-grey-300 disabled:shadow-none disabled:transform-none',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:bg-accent-hover',
        secondary: 'bg-white text-black',
      },
      size: {
        sm: 'size-9 rounded-sm',
        md: 'size-11 rounded-md',
        lg: 'size-[52px] rounded-md',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
);

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconButton> {
  'aria-label': string;
  children?: ReactNode;
}

/** IconButton — square haptic control for a single icon action. Shares Button's press signature. */
export function IconButton({ variant, size, className, children, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} className={cn(iconButton({ variant, size }), className)} {...rest}>
      {children}
    </button>
  );
}
