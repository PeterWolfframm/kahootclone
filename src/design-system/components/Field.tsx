import { CSSProperties, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface FieldProps {
  label?: string;
  htmlFor?: string;
  helper?: string;
  error?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** Label + control + helper/error stack shared by Input and Select. */
export function Field({ label, htmlFor, helper, error, className, style, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5 font-body', className)} style={style}>
      {label && (
        <label htmlFor={htmlFor} className="font-[var(--font-label)] text-secondary">
          {label}
        </label>
      )}
      {children}
      {(helper || error) && (
        <span className={cn('text-xs leading-normal', error ? 'text-danger' : 'text-muted')}>{error || helper}</span>
      )}
    </div>
  );
}
