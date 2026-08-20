import { HTMLAttributes, useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import { Badge, type BadgeProps } from './Badge';
import { Card } from './Card';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  suffix?: string;
  delta?: string;
  tone?: BadgeProps['tone'];
  duration?: number;
}

function AnimatedNumber({ value, duration = 900 }: { value: number; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let frame = 0;
    function step(ts: number) {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return n;
}

/** Stat card — label, mono readout, optional delta badge. */
export function Stat({ label, value, suffix, delta, tone = 'success', duration, className, ...rest }: StatProps) {
  return (
    <Card interactive padding={24} className={className} {...rest}>
      <div className="type-label mb-3.5">{label}</div>
      <div className="flex items-baseline gap-2.5">
        <div className="font-mono text-[40px] leading-none font-bold">
          <AnimatedNumber value={value} duration={duration} />
          {suffix ?? ''}
        </div>
        {delta && <Badge tone={tone}>{delta}</Badge>}
      </div>
    </Card>
  );
}
