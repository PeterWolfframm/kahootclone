import { useState } from 'react';
import { Badge, Card, DataTable, Input, Tabs } from '../../design-system';
import { PLAYERS, playerTone, type PlayerRow } from './data';

export function Players() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('All');
  const visible = PLAYERS.filter(p => {
    const matchQ = p.name.toLowerCase().includes(query.toLowerCase());
    const matchT = tab === 'All' || p.status === tab;
    return matchQ && matchT;
  });

  return (
    <div className="flex flex-col gap-6 px-10 py-8">
      <Card padding={24}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <Input label="Search players" placeholder="Name" value={query} onChange={setQuery} style={{ minWidth: 240 }} />
          <Tabs items={['All', 'Active', 'Idle', 'Banned']} value={tab} onChange={setTab} />
        </div>
        <DataTable
          columns={[
            { key: 'name', header: 'Player', render: (r: PlayerRow) => <span className="font-semibold">{r.name}</span> },
            { key: 'quizzes', header: 'Quizzes', render: r => <span className="font-mono text-md">{r.quizzes}</span> },
            { key: 'avg', header: 'Avg. score', render: r => <span className="font-mono text-md">{r.avgScore}%</span> },
            { key: 'seen', header: 'Last seen', render: r => <span className="text-secondary">{r.lastSeen}</span> },
            { key: 'status', header: 'Status', render: r => <Badge tone={playerTone(r.status)}>{r.status}</Badge> },
          ]}
          rows={visible}
          getRowKey={r => r.id}
          gridTemplate="1.4fr 1fr 1fr 1.2fr 1fr"
          empty={<div className="px-4 py-8 text-sm">No players match that filter.</div>}
        />
      </Card>
    </div>
  );
}
