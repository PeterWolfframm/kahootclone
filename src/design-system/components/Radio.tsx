import { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'size'> {
  label?: string;
  selected?: boolean;
  onSelect?: () => void;
}

/** Radio — full bordered row (quiz answer option); tapping anywhere selects it. */
export function Radio({
  label,
  selected = false,
  onSelect,
  disabled,
  className,
  style,
  name,
  value,
  ...rest
}: RadioProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3.5 rounded-md border-[length:var(--border-width-md)] px-[18px] py-3.5 font-body transition-[border-color,background-color,transform] duration-fast ease-out-back',
        selected ? 'scale-[1.015] border-accent bg-accent-soft' : 'border-black bg-white',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
      style={style}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={() => onSelect?.()}
        className="sr-only"
        {...rest}
      />
      <span
        className={cn(
          'inline-flex size-[22px] shrink-0 items-center justify-center rounded-full border-[length:var(--border-width-md)]',
          selected ? 'border-accent' : 'border-black',
        )}
      >
        {selected && <span className="size-[11px] rounded-full bg-accent" />}
      </span>
      <span className="text-md leading-normal text-black">{label}</span>
    </label>
  );
}
