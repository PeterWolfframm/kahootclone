import { HTMLAttributes, useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import { Card } from './Card';

export type BarChartDatum = { label: string; value: number };

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  data: BarChartDatum[];
  highlightIndex?: number;
  height?: number;
}

/** Hard-edged bar chart. Highlighted bar uses the accent; others are black. */
export function BarChart({ title, data, highlightIndex, height = 160, className, ...rest }: BarChartProps) {
  const [in_, setIn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setIn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <Card padding={28} className={cn('flex-1', className)} {...rest}>
      {title && <div className="mb-6 font-display text-xl font-semibold leading-snug tracking-tight">{title}</div>}
      <div className="flex items-end gap-4" style={{ height }}>
        {data.map((d, i) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={cn(
                'w-full rounded-t-sm',
                i === highlightIndex ? 'bg-accent' : 'bg-black',
              )}
              style={{
                height: in_ ? `${(d.value / max) * 100}%` : '0%',
                transition: `height 700ms var(--ease-out-back) ${i * 60}ms`,
              }}
            />
            <div className="text-xs text-muted">{d.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
