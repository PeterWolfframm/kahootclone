import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar: ReactNode;
  children?: ReactNode;
}

/** Full-height dashboard frame: sidebar + main column. */
export function AppShell({ sidebar, children, className, ...rest }: AppShellProps) {
  return (
    <div className={cn('flex h-full min-h-full bg-surface-page font-body text-fg', className)} {...rest}>
      {sidebar}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
