import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/** Display title + muted subtitle with an action slot on the right. */
export function PageHeader({ title, subtitle, actions, className, ...rest }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b-[length:var(--border-width-md)] border-black px-10 py-6',
        className,
      )}
      {...rest}
    >
      <div>
        <h1 className="font-display text-2xl font-semibold leading-snug tracking-tight">{title}</h1>
        {subtitle && <div className="mt-1 text-muted">{subtitle}</div>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
