export type QuizStatus = 'Live' | 'Draft' | 'Paused';

export type QuizRow = {
  id: string;
  name: string;
  category: string;
  players: number;
  questions: number;
  status: QuizStatus;
};

export type PlayerRow = {
  id: string;
  name: string;
  quizzes: number;
  avgScore: number;
  lastSeen: string;
  status: 'Active' | 'Idle' | 'Banned';
};

export type ActivityItem = {
  id: string;
  who: string;
  what: string;
  when: string;
};

export const QUIZZES: QuizRow[] = [
  { id: 'q1', name: 'World geography', category: 'Geography', players: 312, questions: 12, status: 'Live' },
  { id: 'q2', name: 'Pop culture 2020s', category: 'Culture', players: 198, questions: 10, status: 'Draft' },
  { id: 'q3', name: 'Startup trivia', category: 'Business', players: 84, questions: 8, status: 'Live' },
  { id: 'q4', name: 'Space & astronomy', category: 'Science', players: 47, questions: 15, status: 'Paused' },
  { id: 'q5', name: 'Type-answer capitals', category: 'Geography', players: 61, questions: 20, status: 'Live' },
  { id: 'q6', name: 'True or false: history', category: 'History', players: 23, questions: 16, status: 'Draft' },
];

export const PLAYERS: PlayerRow[] = [
  { id: 'p1', name: 'Mina', quizzes: 14, avgScore: 91, lastSeen: '2 min ago', status: 'Active' },
  { id: 'p2', name: 'Jules', quizzes: 9, avgScore: 74, lastSeen: '12 min ago', status: 'Active' },
  { id: 'p3', name: 'Omar', quizzes: 22, avgScore: 88, lastSeen: '1 hr ago', status: 'Idle' },
  { id: 'p4', name: 'Priya', quizzes: 5, avgScore: 63, lastSeen: '3 hr ago', status: 'Idle' },
  { id: 'p5', name: 'Kenji', quizzes: 11, avgScore: 81, lastSeen: 'yesterday', status: 'Active' },
  { id: 'p6', name: 'Asha', quizzes: 2, avgScore: 40, lastSeen: 'last week', status: 'Banned' },
];

export const ACTIVITY: ActivityItem[] = [
  { id: 'a1', who: 'Mina', what: 'finished World geography — 11/12', when: '2 min ago' },
  { id: 'a2', who: 'Jules', what: 'joined Startup trivia', when: '6 min ago' },
  { id: 'a3', who: 'Omar', what: 'hosted Space & astronomy', when: '28 min ago' },
  { id: 'a4', who: 'Priya', what: 'saved Pop culture 2020s as draft', when: '1 hr ago' },
];

export const WEEKLY_PLAYS = [
  { label: 'Mon', value: 40 },
  { label: 'Tue', value: 62 },
  { label: 'Wed', value: 51 },
  { label: 'Thu', value: 78 },
  { label: 'Fri', value: 66 },
  { label: 'Sat', value: 90 },
  { label: 'Sun', value: 71 },
];

export const SCORE_BUCKETS = [
  { label: '0–20', value: 8 },
  { label: '21–40', value: 14 },
  { label: '41–60', value: 29 },
  { label: '61–80', value: 47 },
  { label: '81–100', value: 61 },
];

export function statusTone(status: QuizStatus): 'success' | 'neutral' | 'warning' {
  if (status === 'Live') return 'success';
  if (status === 'Paused') return 'warning';
  return 'neutral';
}

export function playerTone(status: PlayerRow['status']): 'success' | 'neutral' | 'danger' {
  if (status === 'Active') return 'success';
  if (status === 'Banned') return 'danger';
  return 'neutral';
}
