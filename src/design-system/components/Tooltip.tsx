import { HTMLAttributes, ReactNode, useState } from 'react';
import { cn } from '../lib/cn';

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  children?: ReactNode;
}

/** Tooltip — small black label that appears above a trigger on hover. */
export function Tooltip({ label, children, className, ...rest }: TooltipProps) {
  const [show, setShow] = useState(false);
  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      {...rest}
    >
      {children}
      {show && (
        <span className="absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm bg-black px-3 py-1.5 font-body text-xs text-white">
          {label}
        </span>
      )}
    </span>
  );
}
