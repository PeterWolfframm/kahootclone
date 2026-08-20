import { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'size'> {
  label?: string;
  onChange?: (v: boolean) => void;
}

/** Checkbox — square, thick-bordered; check fills with the accent color. */
export function Checkbox({ label, checked = false, onChange, disabled, className, style, id, ...rest }: CheckboxProps) {
  return (
    <label
      className={cn('inline-flex cursor-pointer items-center gap-2.5 font-body', disabled && 'cursor-not-allowed', className)}
      style={style}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange?.(e.target.checked)}
        className="peer sr-only"
        {...rest}
      />
      <span
        className={cn(
          'inline-flex size-6 shrink-0 items-center justify-center rounded-sm border-[length:var(--border-width-md)] border-black bg-white transition-[transform,background-color] duration-fast ease-out-back peer-checked:scale-105 peer-checked:bg-accent peer-checked:[&_svg]:opacity-100 peer-disabled:border-grey-300 peer-disabled:peer-checked:bg-grey-300',
        )}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-0"
          aria-hidden
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {label && <span className={cn('text-sm', disabled ? 'text-muted' : 'text-black')}>{label}</span>}
    </label>
  );
}
