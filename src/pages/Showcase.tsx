import { useMemo, useState } from 'react';
import { BarChart3, Bell, LayoutGrid, Layers, ListChecks, Plus, Settings, Users } from 'lucide-react';
import { AppShell, Button, IconButton, PageHeader, Sidebar, ToastProvider, type SidebarItem } from '../design-system';
import { QUIZZES, type QuizRow } from './showcase/data';
import { Overview } from './showcase/Overview';
import { Quizzes, nextStatus } from './showcase/Quizzes';
import { Players } from './showcase/Players';
import { ReportsView } from './showcase/Reports';
import { SettingsView } from './showcase/Settings';
import { System } from './showcase/System';

const NAV: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'quizzes', label: 'Quizzes', icon: ListChecks },
  { id: 'players', label: 'Players', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'system', label: 'System', icon: Layers },
];

const TITLES: Record<string, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: '' },
  quizzes: { title: 'Quizzes', subtitle: 'Create, host, and retire quizzes.' },
  players: { title: 'Players', subtitle: 'Everyone who has joined a session.' },
  reports: { title: 'Reports', subtitle: 'Scores and completion across sessions.' },
  settings: { title: 'Settings', subtitle: 'Workspace defaults.' },
  system: { title: 'System', subtitle: 'Tokens, recipes, and primitives.' },
};

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function ShowcaseInner() {
  const [view, setView] = useState('overview');
  const [quizzes, setQuizzes] = useState<QuizRow[]>(QUIZZES);
  const [filter, setFilter] = useState('All');
  const date = useMemo(todayLabel, []);

  function toggleLive(id: string) {
    setQuizzes(prev => prev.map(q => (q.id === id ? { ...q, status: nextStatus(q.status) } : q)));
  }

  const meta = TITLES[view] ?? TITLES.overview;
  const subtitle = view === 'overview' ? date : meta.subtitle;

  return (
    <AppShell
      sidebar={
        <Sidebar
          brand="Keypad"
          items={NAV}
          active={view}
          onSelect={setView}
          footer={<p className="px-2 text-xs leading-normal text-muted">Design-system name. The live product is play!</p>}
        />
      }
    >
      <PageHeader
        title={meta.title}
        subtitle={subtitle}
        actions={
          view !== 'system' ? (
            <>
              <IconButton aria-label="Notifications">
                <Bell size={18} strokeWidth={2} />
              </IconButton>
              <Button icon={<Plus size={16} strokeWidth={2.5} />} onClick={() => setView('quizzes')}>
                New quiz
              </Button>
            </>
          ) : undefined
        }
      />
      <div className="min-h-0 flex-1 overflow-auto">
        {view === 'overview' && (
          <Overview quizzes={quizzes} filter={filter} onFilter={setFilter} onToggleLive={toggleLive} />
        )}
        {view === 'quizzes' && (
          <Quizzes
            quizzes={quizzes}
            onCreate={row => setQuizzes(prev => [row, ...prev])}
            onDelete={id => setQuizzes(prev => prev.filter(q => q.id !== id))}
            onToggleLive={toggleLive}
          />
        )}
        {view === 'players' && <Players />}
        {view === 'reports' && <ReportsView />}
        {view === 'settings' && <SettingsView />}
        {view === 'system' && <System />}
      </div>
    </AppShell>
  );
}

export function Showcase() {
  return (
    <ToastProvider>
      <ShowcaseInner />
    </ToastProvider>
  );
}
