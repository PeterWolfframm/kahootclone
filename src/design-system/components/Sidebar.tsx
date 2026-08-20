import { HTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

export type SidebarItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  brand?: ReactNode;
  items: SidebarItem[];
  active: string;
  onSelect?: (id: string) => void;
  footer?: ReactNode;
}

/** Beige rail with black selected state — the dashboard navigation. */
export function Sidebar({ brand, items, active, onSelect, footer, className, ...rest }: SidebarProps) {
  return (
    <nav
      className={cn(
        'flex min-h-full w-60 shrink-0 flex-col gap-1.5 border-r-[length:var(--border-width-md)] border-black bg-surface-sunken px-5 py-7',
        className,
      )}
      {...rest}
    >
      {brand && <div className="mb-7 px-2 font-display text-[22px] font-bold tracking-tight">{brand}</div>}
      {items.map(it => {
        const Icon = it.icon;
        const selected = it.id === active;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect?.(it.id)}
            className={cn(
              'flex items-center gap-3 rounded-md px-3.5 py-3 text-left text-sm font-semibold transition-[background-color,color,transform] duration-base ease-out-back',
              selected ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-white',
            )}
          >
            <Icon size={18} strokeWidth={2} />
            {it.label}
          </button>
        );
      })}
      {footer && <div className="mt-auto pt-6">{footer}</div>}
    </nav>
  );
}
