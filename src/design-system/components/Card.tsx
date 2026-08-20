import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  padding?: number | string;
  /** Adds a hover lift (shadow grows, card shifts up-left) for clickable cards. */
  interactive?: boolean;
}

/** Card — bordered surface with the hard offset shadow; lifts slightly on hover. */
export function Card({ children, padding = 28, interactive = false, className, style, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'surface-card font-body',
        interactive &&
          'cursor-pointer transition-[box-shadow,transform] duration-base ease-out-back hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg',
        className,
      )}
      style={{ padding, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
