import { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const toast = cva('inline-flex items-center gap-2.5 rounded-md px-5 py-3.5 font-body text-sm font-semibold shadow-hard-sm', {
  variants: {
    tone: {
      neutral: 'bg-black text-white',
      success: 'bg-success text-white',
      danger: 'bg-danger text-white',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export interface ToastProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof toast> {
  children?: ReactNode;
}

/** Toast — brief confirmation chip. Use ToastProvider / useToast to fire them. */
export function Toast({ tone, className, children, ...rest }: ToastProps) {
  return (
    <div className={cn(toast({ tone }), className)} {...rest}>
      {children}
    </div>
  );
}
