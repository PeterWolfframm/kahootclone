import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  onRemove?: () => void;
}

/** Tag — bordered outline chip; optionally removable. Distinct from Badge (filled, no border). */
export function Tag({ children, onRemove, className, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border-2 border-black bg-white py-[5px] pr-3 pl-3.5 font-body text-xs',
        className,
      )}
      {...rest}
    >
      {children}
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label="Remove" className="flex p-0 text-black">
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
            <line x1={4} y1={4} x2={20} y2={20} />
            <line x1={20} y1={4} x2={4} y2={20} />
          </svg>
        </button>
      )}
    </span>
  );
}
