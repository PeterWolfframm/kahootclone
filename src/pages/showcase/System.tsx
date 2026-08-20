import { ReactNode, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  IconButton,
  Input,
  Radio,
  Select,
  Switch,
  Tabs,
  Tag,
  Toast,
  Tooltip,
} from '../../design-system';

const NEUTRALS: [string, string][] = [
  ['--black', '#0a0a0a'],
  ['--grey-950', '#141414'],
  ['--grey-900', '#1c1c1c'],
  ['--grey-700', '#3d3d3d'],
  ['--grey-500', '#6b6b6b'],
  ['--grey-300', '#a4a4a4'],
  ['--grey-200', '#d4d4d4'],
  ['--grey-100', '#e9e9e9'],
  ['--grey-50', '#f4f4f3'],
  ['--white', '#ffffff'],
];
const BEIGE: [string, string][] = [
  ['--beige-300', '#d9c9ae'],
  ['--beige-200', '#e8dcc4'],
  ['--beige-100', '#f0e6d4'],
  ['--beige-50', '#f8f1e4'],
];
const ACCENT: [string, string][] = [
  ['--accent-700', '#7a3a12'],
  ['--accent-600', '#a04d17'],
  ['--accent-500', '#c2621d'],
  ['--accent-400', '#d68a4c'],
  ['--accent-100', '#f2ddc2'],
  ['--accent-50', '#faf0e3'],
];
const SEMANTIC: [string, string, string][] = [
  ['--semantic-success', '#0a8a4a', 'Correct'],
  ['--semantic-danger', '#e0102b', 'Incorrect'],
  ['--semantic-warning', '#c77700', 'Warning'],
];
const SPACING = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
const RADII: [string, string][] = [
  ['--radius-sm', '8px — tags, checkboxes'],
  ['--radius-md', '14px — buttons, inputs'],
  ['--radius-lg', '20px — cards, dialogs'],
  ['--radius-xl', '28px — large surfaces'],
  ['--radius-pill', '999px — switches, chips'],
];

function Swatch({ name, value, note }: { name: string; value: string; note?: string }) {
  return (
    <div className="overflow-hidden rounded-md border-[length:var(--border-width-sm)] border-black">
      <div className="h-[72px]" style={{ background: `var(${name})` }} />
      <div className="bg-white px-3 py-2.5">
        <div className="font-mono text-xs text-fg">{name}</div>
        <div className="text-xs text-muted">{note ?? value}</div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-5 font-display text-xl font-semibold leading-snug tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function System() {
  const [tab, setTab] = useState('All');
  const [checked, setChecked] = useState(true);
  const [switched, setSwitched] = useState(true);
  const [radio, setRadio] = useState('paris');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [text, setText] = useState('');
  const [selectVal, setSelectVal] = useState('geo');

  return (
    <div className="px-10 py-8">
      <p className="mb-10 max-w-2xl text-md leading-normal text-secondary">
        Living spec for the Keypad system. Tokens live in CSS variables; utilities and recipes (`haptic`, `surface-card`,
        `type-label`, `focus-accent`) are the public API. The live product brand is <strong>play!</strong> — Keypad is
        the design-system name.
      </p>

      <Block title="Neutrals">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {NEUTRALS.map(([n, v]) => (
            <Swatch key={n} name={n} value={v} />
          ))}
        </div>
      </Block>

      <Block title="Beige — soft neutral">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {BEIGE.map(([n, v]) => (
            <Swatch key={n} name={n} value={v} />
          ))}
        </div>
      </Block>

      <Block title="Accent — burnt orange">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {ACCENT.map(([n, v]) => (
            <Swatch key={n} name={n} value={v} />
          ))}
        </div>
      </Block>

      <Block title="Semantic feedback">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {SEMANTIC.map(([n, v, note]) => (
            <Swatch key={n} name={n} value={v} note={note} />
          ))}
        </div>
      </Block>

      <Block title="Type">
        <div className="mb-8 flex flex-col gap-5">
          <div className="font-display text-4xl font-bold leading-tight tracking-tight">Aa — Heading 1 / Space Grotesk</div>
          <div className="font-display text-3xl font-semibold leading-tight tracking-tight">Aa — Heading 2</div>
          <div className="font-display text-2xl font-semibold leading-snug tracking-tight">Aa — Heading 3</div>
          <div className="font-display text-xl font-semibold leading-snug tracking-tight">Aa — Heading 4</div>
        </div>
        <div className="mb-8 flex max-w-[620px] flex-col gap-3">
          <div className="text-md leading-normal">Body large — Inter. Roomy 1.45 line-height for long-form copy.</div>
          <div className="text-sm leading-normal">Body medium — the default UI text size.</div>
          <div className="text-xs leading-normal text-muted">Body small — helper text, captions, muted metadata.</div>
          <div className="type-label">Label — uppercase, wide tracking</div>
        </div>
        <div className="flex flex-wrap items-baseline gap-6">
          <div className="font-mono text-2xl font-semibold">482 917</div>
          <div className="font-mono text-md font-medium">07:10 — QUESTION 3 OF 10</div>
        </div>
      </Block>

      <Block title="Spacing & radius">
        <div className="mb-10 flex flex-col gap-2.5">
          {SPACING.map(s => (
            <div key={s} className="flex items-center gap-4">
              <div className="w-[90px] font-mono text-sm">--space-{s}</div>
              <div className="h-4 rounded-sm bg-accent" style={{ width: `var(--space-${s})` }} />
              <div className="text-xs text-muted">{s * 4}px</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
          {RADII.map(([name, note]) => (
            <div key={name} className="text-center">
              <div
                className="mb-2.5 h-20 border-[length:var(--border-width-md)] border-black bg-accent"
                style={{ borderRadius: `var(${name})` }}
              />
              <div className="font-mono text-xs">{name}</div>
              <div className="text-xs text-muted">{note}</div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Elevation — haptic shadows">
        <div className="flex flex-wrap gap-8">
          {(['--shadow-hard-sm', '--shadow-hard-md', '--shadow-hard-lg'] as const).map(s => (
            <div key={s} className="text-center">
              <div
                className="mb-6 h-[100px] w-[140px] rounded-lg border-[length:var(--border-width-md)] border-black bg-white"
                style={{ boxShadow: `var(${s})` }}
              />
              <div className="font-mono text-xs">{s}</div>
            </div>
          ))}
          <div className="text-center">
            <div className="mb-6 h-[100px] w-[140px] translate-x-[2px] translate-y-[2px] rounded-lg border-[length:var(--border-width-md)] border-black bg-white shadow-hard-press" />
            <div className="font-mono text-xs">--shadow-hard-press</div>
            <div className="text-xs text-muted">pressed state</div>
          </div>
        </div>
      </Block>

      <Block title="Motion">
        <p className="mb-5 max-w-xl text-sm text-secondary">
          Fast (130–180ms) with a slight overshoot ease. Press the `haptic` recipe: scale to 0.96 and drop the shadow.
        </p>
        <div className="flex flex-wrap gap-5">
          <Button size="lg">Hover / press me</Button>
          <IconButton aria-label="Example" variant="primary">
            <ArrowRight size={20} strokeWidth={2.5} />
          </IconButton>
          <Card interactive padding={20} className="w-[200px]">
            <div className="text-sm font-semibold">Interactive card</div>
            <div className="text-xs text-muted">Hover to lift</div>
          </Card>
        </div>
      </Block>

      <Block title="Buttons">
        <Card padding={24} className="mb-6">
          <div className="type-label mb-4">Variants</div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </Card>
        <Card padding={24}>
          <div className="type-label mb-4">Sizes</div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </Card>
      </Block>

      <Block title="Forms">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          <Card padding={24}>
            <div className="type-label mb-4">Input</div>
            <Input label="Quiz title" placeholder="World geography" value={text} onChange={setText} helper="Shown to players before they join." />
          </Card>
          <Card padding={24}>
            <div className="type-label mb-4">Select</div>
            <Select
              label="Category"
              value={selectVal}
              onChange={setSelectVal}
              options={[
                { value: 'geo', label: 'Geography' },
                { value: 'sci', label: 'Science' },
                { value: 'pop', label: 'Pop culture' },
              ]}
            />
          </Card>
          <Card padding={24}>
            <div className="type-label mb-4">Checkbox & switch</div>
            <div className="flex flex-col gap-4">
              <Checkbox label="Shuffle answer order" checked={checked} onChange={setChecked} />
              <Switch label="Show question on player screens" checked={switched} onChange={setSwitched} />
            </div>
          </Card>
          <Card padding={24}>
            <div className="type-label mb-4">Radio</div>
            <div className="flex flex-col gap-2.5">
              <Radio name="sys-cap" label="Paris" selected={radio === 'paris'} onSelect={() => setRadio('paris')} />
              <Radio name="sys-cap" label="Lyon" selected={radio === 'lyon'} onSelect={() => setRadio('lyon')} />
              <Radio name="sys-cap" label="Marseille" selected={radio === 'marseille'} onSelect={() => setRadio('marseille')} />
            </div>
          </Card>
          <Card padding={24}>
            <div className="type-label mb-4">Tabs</div>
            <Tabs items={['All', 'Live', 'Draft']} value={tab} onChange={setTab} />
          </Card>
        </div>
      </Block>

      <Block title="Surfaces">
        <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          <Card padding={24}>
            <div className="type-label mb-4">Card</div>
            <p className="m-0 text-sm text-secondary">White fill, 2.5px black border, 20px radius, hard offset shadow. Recipe: `surface-card`.</p>
          </Card>
          <Card padding={24}>
            <div className="type-label mb-4">Badges</div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="neutral">Neutral</Badge>
              <Badge tone="primary">Primary</Badge>
              <Badge tone="success">Live</Badge>
              <Badge tone="danger">Ended</Badge>
              <Badge tone="warning">Paused</Badge>
            </div>
          </Card>
          <Card padding={24}>
            <div className="type-label mb-4">Tags</div>
            <div className="flex flex-wrap gap-2">
              <Tag>Geography</Tag>
              <Tag>Medium</Tag>
              <Tag onRemove={() => {}}>Removable</Tag>
            </div>
          </Card>
        </div>
      </Block>

      <Block title="Overlay">
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <Toast tone="success">Question saved</Toast>
          <Toast tone="danger">That answer's locked in</Toast>
          <Tooltip label="Appears on hover">
            <span className="rounded-pill border-[length:var(--border-width-sm)] border-black px-4 py-2">Hover me</span>
          </Tooltip>
        </div>
        <Dialog
          open={dialogOpen}
          title="Delete this quiz?"
          onClose={() => setDialogOpen(false)}
          actions={
            <>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setDialogOpen(false)}>
                Delete
              </Button>
            </>
          }
        >
          This can't be undone — all questions and past reports for this quiz will be removed.
        </Dialog>
      </Block>
    </div>
  );
}
