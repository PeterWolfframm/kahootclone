import { SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Field } from './Field';

export type SelectOption = { value: string; label: string } | string;

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  onChange?: (v: string) => void;
  options?: SelectOption[];
  error?: string;
  helper?: string;
}

/** Select — native select dressed in the same bordered control shell as Input. */
export function Select({
  label,
  value,
  onChange,
  options = [],
  disabled,
  className,
  style,
  id,
  error,
  helper,
  ...rest
}: SelectProps) {
  return (
    <Field label={label} htmlFor={id} helper={helper} error={error} className={className} style={style}>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={e => onChange?.(e.target.value)}
        className={cn('control focus-accent appearance-auto', error && 'border-danger')}
        {...rest}
      >
        {options.map(o => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </Field>
  );
}
