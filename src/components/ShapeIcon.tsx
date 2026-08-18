export function ShapeIcon({ index, size = 36 }: { index: number; size?: number }) {
  const s = size;
  if (index === 0) {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" aria-hidden>
        <polygon points="20,4 36,36 4,36" fill="currentColor" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" aria-hidden>
        <polygon points="20,2 38,20 20,38 2,20" fill="currentColor" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg width={s} height={s} viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="20" r="16" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" aria-hidden>
      <rect x="6" y="6" width="28" height="28" fill="currentColor" />
    </svg>
  );
}
