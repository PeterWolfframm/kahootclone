# Keypad design system

Brutalist / haptic UI kit used by this app. Tokens are CSS variables; Tailwind maps them to utilities; repeating signatures are grouped as `@utility` recipes; component variants use [CVA](https://cva.style).

The live product brand is **play!**. **Keypad** is the design-system name (placeholder from the imported kit).

## Consume

```ts
import { Button, Card, cn } from '../design-system';

<Button variant="primary" size="lg">Start quiz</Button>
<Card interactive className="max-w-sm">…</Card>
```

`ToastProvider` must wrap any tree that calls `useToast()` (already on `/showcase`).

## Architecture

1. **Tokens** — [`tokens.css`](./tokens.css). Source of truth. Override on `:root` to retheme.
2. **Theme** — [`theme.css`](./theme.css). `@theme inline` exposes tokens as Tailwind utilities (`bg-accent`, `text-muted`, `shadow-hard-md`, `font-display`, `rounded-lg`, `duration-fast`, `ease-out-back`).
3. **Recipes** — grouped class names for signatures that would otherwise be copy-pasted:
   - `haptic` — thick black border + hard shadow; `:active` translates 2px, scales to `--press-scale`, swaps to `shadow-hard-press`. Add `shadow-none` for ghost/flat.
   - `surface-card` — white fill, 2.5px border, 20px radius, hard-md shadow.
   - `type-label` — uppercase, wide tracking, muted.
   - `focus-accent` — accent border + focus ring (no glow).
   - `control` — shared Input/Select shell.
4. **`cn()`** — [`lib/cn.ts`](./lib/cn.ts). `clsx` + `tailwind-merge`. Always merge `className` so callers can override.
5. **CVA primitives** — Button, IconButton, Badge, … accept `className` and native element props.
6. **Layout primitives** — AppShell, Sidebar, PageHeader, Stat, BarChart, DataTable. No app types; safe to reuse in any screen.

## Utilities cheat sheet

| Intent | Utility |
|---|---|
| Accent fill | `bg-accent` / `hover:bg-accent-hover` / `text-on-accent` |
| Muted copy | `text-muted` / `text-secondary` |
| Sunken surface | `bg-surface-sunken` / `bg-surface-warm` |
| Semantic | `bg-success` `bg-danger` `bg-warning` (+ `-soft`) |
| Type | `font-display` `font-body` `font-mono` |
| Elevation | `shadow-hard-sm/md/lg/press` |
| Radius | `rounded-sm/md/lg/xl/pill` |

## Add a component

1. Build it from recipes + tokens, not hex values.
2. Variants go through `cva(...)`.
3. Forward `className` with `cn(recipe({ … }), className)`.
4. Keep press behavior on `haptic` (CSS `:active`), not React mouse state.
5. Export from [`index.ts`](./index.ts).

```ts
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

const chip = cva('haptic rounded-pill px-3 py-1 text-xs font-semibold', {
  variants: {
    tone: { default: 'bg-white', accent: 'bg-accent text-on-accent' },
  },
  defaultVariants: { tone: 'default' },
});
```

## Theming

Override CSS variables. Tailwind utilities follow because they reference the variables:

```css
:root {
  --accent-500: #1d4ed8;
  --accent-primary: var(--accent-500);
}
```

Do not introduce a second brand color. Accent is for actions, selection, links, and focus only.

## Do / don’t

- Sentence case everywhere. All-caps only on `type-label` metadata.
- Accent only for primary actions / selected / focus — never decoration.
- Hard-offset shadows, never blur. Borders are structural (2.5–3.5px).
- Motion is fast (130–180ms) with `--ease-out-back` on entrances. No slow fades.
- Lucide icons at 2px stroke. No emoji.
- Numbers as digits, in `font-mono` when they are scores, timers, or PINs.

Living spec: `/showcase` → **System**. Dashboard composition: `/showcase` → Overview and the other sidebar views.
