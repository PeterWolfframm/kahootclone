import { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'size'> {
  label?: string;
  onChange?: (v: boolean) => void;
}

/** Switch — pill toggle; thumb springs across on change. */
export function Switch({ label, checked = false, onChange, disabled, className, style, id, ...rest }: SwitchProps) {
  return (
    <label
      className={cn('inline-flex cursor-pointer items-center gap-2.5 font-body', disabled && 'cursor-not-allowed', className)}
      style={style}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange?.(e.target.checked)}
        className="peer sr-only"
        {...rest}
      />
      <span
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-pill border-[length:var(--border-width-md)] border-black bg-white transition-colors duration-fast ease-standard peer-checked:bg-accent peer-checked:[&>span]:left-[22px] peer-checked:[&>span]:bg-white peer-disabled:border-grey-300 peer-disabled:peer-checked:bg-grey-300',
        )}
      >
        <span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-black transition-[left,background-color] duration-base ease-out-back" />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
