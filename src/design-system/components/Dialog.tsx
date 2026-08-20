import { HTMLAttributes, MouseEvent, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  title?: string;
  children?: ReactNode;
  onClose?: () => void;
  actions?: ReactNode;
}

/** Dialog — modal with a flat (no blur) dark scrim and a hard-shadow bordered panel. */
export function Dialog({ open, title, children, onClose, actions, className, style, ...rest }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const panel = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e: MouseEvent) => e.stopPropagation()}
        className={cn('w-[420px] max-w-[calc(100%-48px)] rounded-lg border-[3px] border-black bg-white p-8 font-body shadow-hard-lg', className)}
        style={style}
        {...rest}
      >
        {title && <div className="mb-3 font-display text-xl font-semibold leading-snug tracking-tight">{title}</div>}
        <div className="text-md leading-normal text-secondary">{children}</div>
        {actions && <div className="mt-6 flex justify-end gap-3">{actions}</div>}
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
