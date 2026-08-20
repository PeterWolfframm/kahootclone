import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const button = cva(
  'haptic inline-flex items-center justify-center gap-2 font-body disabled:cursor-not-allowed disabled:border-grey-200 disabled:bg-grey-100 disabled:text-grey-300 disabled:shadow-none disabled:transform-none',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:bg-accent-hover',
        secondary: 'bg-white text-black',
        ghost: 'border-transparent bg-transparent text-black shadow-none hover:bg-grey-50',
        danger: 'bg-danger text-white',
      },
      size: {
        sm: 'rounded-sm px-4 py-2 font-[var(--font-label)]',
        md: 'rounded-md px-[22px] py-3 text-sm font-semibold leading-none',
        lg: 'rounded-md px-[30px] py-4 text-md font-semibold leading-none',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {
  icon?: ReactNode;
}

/** Button — the core haptic control. Press shrinks the hard shadow via the `haptic` recipe. */
export function Button({ variant, size, icon, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={cn(button({ variant, size }), className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}
