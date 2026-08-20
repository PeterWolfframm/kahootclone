import { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type TabItem = { value: string; label: string } | string;

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: TabItem[];
  value?: string;
  onChange?: (v: string) => void;
}

function tabValue(it: TabItem) {
  return typeof it === 'string' ? it : it.value;
}
function tabLabel(it: TabItem) {
  return typeof it === 'string' ? it : it.label;
}

/** Tabs — segmented control; selected tab springs with an overshoot ease. */
export function Tabs({ items = [], value, onChange, className, ...rest }: TabsProps) {
  return (
    <div
      className={cn(
        'inline-flex gap-2 rounded-lg border-[length:var(--border-width-md)] border-black bg-surface-warm p-2 font-body',
        className,
      )}
      {...rest}
    >
      {items.map(it => {
        const val = tabValue(it);
        const active = val === value;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange?.(val)}
            className={cn(
              'rounded-md px-[26px] py-3 text-sm font-semibold leading-none transition-[background-color,color,transform] duration-base ease-out-back',
              active ? 'scale-[1.02] bg-black text-white' : 'bg-transparent text-black hover:bg-white',
            )}
          >
            {tabLabel(it)}
          </button>
        );
      })}
    </div>
  );
}
