import { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badge = cva(
  'inline-flex origin-center animate-[badge-in_180ms_var(--ease-out-back)] items-center rounded-pill px-3 py-1 font-body font-[var(--font-label)] tracking-wide uppercase',
  {
    variants: {
      tone: {
        neutral: 'bg-grey-100 text-black',
        primary: 'bg-accent-soft-strong text-accent-700',
        success: 'bg-success-soft text-success',
        danger: 'bg-danger-soft text-danger',
        warning: 'bg-warning-soft text-warning',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badge> {
  children?: ReactNode;
}

/** Badge — small filled-pill status indicator. No border. */
export function Badge({ tone, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn(badge({ tone }), className)} {...rest}>
      {children}
    </span>
  );
}
