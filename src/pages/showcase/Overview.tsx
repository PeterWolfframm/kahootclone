import { Bell, MoreHorizontal } from 'lucide-react';
import { Badge, BarChart, Card, DataTable, IconButton, Stat, Switch, Tabs, Tag, Tooltip } from '../../design-system';
import { ACTIVITY, QUIZZES, WEEKLY_PLAYS, statusTone, type QuizRow } from './data';

export function Overview({
  quizzes,
  filter,
  onFilter,
  onToggleLive,
}: {
  quizzes: QuizRow[];
  filter: string;
  onFilter: (v: string) => void;
  onToggleLive: (id: string) => void;
}) {
  const visible = quizzes.filter(r => filter === 'All' || r.status === filter);
  const live = quizzes.filter(r => r.status === 'Live');

  return (
    <div className="flex flex-col gap-6 px-10 py-8">
      <div className="grid grid-cols-4 gap-6">
        <Stat label="Quizzes played" value={4820} delta="+12%" tone="success" />
        <Stat label="Active players" value={963} delta="+4%" tone="success" />
        <Stat label="Avg. score" value={74} suffix="%" delta="-2%" tone="warning" />
        <Stat label="Completion rate" value={91} suffix="%" delta="+1%" tone="success" />
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-6">
        <BarChart title="Plays this week" data={WEEKLY_PLAYS} highlightIndex={5} />
        <Card padding={28}>
          <div className="mb-5 font-display text-xl font-semibold leading-snug tracking-tight">Live now</div>
          <div className="mb-4 font-mono text-[40px] leading-none font-bold">{live.length}</div>
          <p className="mb-5 text-sm text-secondary">
            {live.length} quizzes are accepting players. Host from the quizzes view.
          </p>
          <div className="flex flex-col gap-2">
            {live.map(q => (
              <div key={q.id} className="flex items-center justify-between rounded-md bg-surface-sunken px-3 py-2.5">
                <span className="font-semibold">{q.name}</span>
                <span className="font-mono text-sm">{q.players}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-[1.6fr_1fr] gap-6">
        <Card padding={28}>
          <div className="mb-5 flex items-center justify-between">
            <div className="font-display text-xl font-semibold leading-snug tracking-tight">Your quizzes</div>
            <Tabs items={['All', 'Live', 'Draft']} value={filter} onChange={onFilter} />
          </div>
          <DataTable
            columns={[
              { key: 'name', header: 'Name', render: (r: QuizRow) => <span className="font-semibold">{r.name}</span> },
              { key: 'cat', header: 'Category', render: r => <Tag>{r.category}</Tag> },
              { key: 'players', header: 'Players', render: r => <span className="font-mono text-md">{r.players}</span> },
              { key: 'status', header: 'Status', render: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
              {
                key: 'live',
                header: 'Live',
                render: r => <Switch checked={r.status === 'Live'} onChange={() => onToggleLive(r.id)} />,
              },
              {
                key: 'more',
                header: '',
                render: () => (
                  <Tooltip label="More actions">
                    <IconButton size="sm" variant="secondary" aria-label="More">
                      <MoreHorizontal size={16} strokeWidth={2} />
                    </IconButton>
                  </Tooltip>
                ),
              },
            ]}
            rows={visible}
            getRowKey={r => r.id}
            gridTemplate="2fr 1fr 1fr 1fr 100px 60px"
            empty={<div className="px-4 py-8 text-sm">No quizzes yet. Build your first one.</div>}
          />
        </Card>

        <Card padding={28}>
          <div className="mb-5 flex items-center justify-between">
            <div className="font-display text-xl font-semibold leading-snug tracking-tight">Recent activity</div>
            <IconButton aria-label="Notifications" size="sm">
              <Bell size={16} strokeWidth={2} />
            </IconButton>
          </div>
          <div className="flex flex-col gap-3">
            {ACTIVITY.map(a => (
              <div key={a.id} className="border-t-2 border-grey-100 pt-3 first:border-t-0 first:pt-0">
                <div className="font-semibold">{a.who}</div>
                <div className="text-sm text-secondary">{a.what}</div>
                <div className="type-label mt-1">{a.when}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
