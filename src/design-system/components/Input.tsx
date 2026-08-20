import { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Field } from './Field';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helper?: string;
  onChange?: (v: string) => void;
}

/** Input — text field. Focus swaps the border to accent rather than glowing. */
export function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
  helper,
  disabled,
  type = 'text',
  className,
  style,
  id,
  ...rest
}: InputProps) {
  return (
    <Field label={label} htmlFor={id} helper={helper} error={error} className={className} style={style}>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={e => onChange?.(e.target.value)}
        className={cn('control focus-accent', error && 'border-danger')}
        {...rest}
      />
    </Field>
  );
}
