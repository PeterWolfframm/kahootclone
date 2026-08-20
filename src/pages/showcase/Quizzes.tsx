import { useState } from 'react';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  DataTable,
  Dialog,
  IconButton,
  Input,
  Select,
  Tag,
  Tooltip,
  useToast,
} from '../../design-system';
import { statusTone, type QuizRow, type QuizStatus } from './data';

export function Quizzes({
  quizzes,
  onCreate,
  onDelete,
  onToggleLive,
}: {
  quizzes: QuizRow[];
  onCreate: (row: QuizRow) => void;
  onDelete: (id: string) => void;
  onToggleLive: (id: string) => void;
}) {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<QuizRow | null>(null);
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState('Geography');

  const cats = ['all', ...Array.from(new Set(quizzes.map(q => q.category)))];
  const visible = quizzes.filter(q => {
    const matchQ = q.name.toLowerCase().includes(query.toLowerCase());
    const matchC = category === 'all' || q.category === category;
    return matchQ && matchC;
  });

  function create() {
    if (!title.trim()) return;
    onCreate({
      id: `q-${Date.now()}`,
      name: title.trim(),
      category: cat,
      players: 0,
      questions: 0,
      status: 'Draft',
    });
    setTitle('');
    setOpen(false);
    toast('Quiz saved as draft', 'success');
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    onDelete(pendingDelete.id);
    toast(`${pendingDelete.name} deleted`, 'danger');
    setPendingDelete(null);
  }

  return (
    <div className="flex flex-col gap-6 px-10 py-8">
      <Card padding={24}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-4">
            <Input
              label="Search"
              placeholder="Quiz name"
              value={query}
              onChange={setQuery}
              style={{ minWidth: 240 }}
            />
            <Select
              label="Category"
              value={category}
              onChange={setCategory}
              options={cats.map(c => ({ value: c, label: c === 'all' ? 'All categories' : c }))}
              style={{ minWidth: 200 }}
            />
          </div>
          <Button icon={<Plus size={16} strokeWidth={2.5} />} onClick={() => setOpen(true)}>
            New quiz
          </Button>
        </div>
        <DataTable
          columns={[
            { key: 'name', header: 'Name', render: (r: QuizRow) => <span className="font-semibold">{r.name}</span> },
            { key: 'cat', header: 'Category', render: r => <Tag>{r.category}</Tag> },
            { key: 'q', header: 'Questions', render: r => <span className="font-mono text-md">{r.questions}</span> },
            { key: 'players', header: 'Players', render: r => <span className="font-mono text-md">{r.players}</span> },
            { key: 'status', header: 'Status', render: r => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
            {
              key: 'actions',
              header: '',
              render: r => (
                <div className="flex justify-end gap-2">
                  <Tooltip label={r.status === 'Live' ? 'End live session' : 'Go live'}>
                    <Button size="sm" variant="secondary" onClick={() => onToggleLive(r.id)}>
                      {r.status === 'Live' ? 'End' : 'Host'}
                    </Button>
                  </Tooltip>
                  <Tooltip label="Delete quiz">
                    <IconButton size="sm" aria-label="Delete" onClick={() => setPendingDelete(r)}>
                      <Trash2 size={14} strokeWidth={2} />
                    </IconButton>
                  </Tooltip>
                  <IconButton size="sm" aria-label="More">
                    <MoreHorizontal size={16} strokeWidth={2} />
                  </IconButton>
                </div>
              ),
            },
          ]}
          rows={visible}
          getRowKey={r => r.id}
          gridTemplate="2fr 1fr 0.8fr 0.8fr 1fr 220px"
          empty={<div className="px-4 py-8 text-sm">No quizzes yet. Build your first one.</div>}
        />
      </Card>

      <Dialog
        open={open}
        title="New quiz"
        onClose={() => setOpen(false)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={create} disabled={!title.trim()}>
              Create draft
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Title" placeholder="World geography" value={title} onChange={setTitle} />
          <Select
            label="Category"
            value={cat}
            onChange={setCat}
            options={['Geography', 'Science', 'Culture', 'Business', 'History']}
          />
        </div>
      </Dialog>

      <Dialog
        open={!!pendingDelete}
        title="Delete this quiz?"
        onClose={() => setPendingDelete(null)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        This can't be undone — all questions and past reports for {pendingDelete?.name} will be removed.
      </Dialog>
    </div>
  );
}

export function nextStatus(status: QuizStatus): QuizStatus {
  return status === 'Live' ? 'Paused' : 'Live';
}
