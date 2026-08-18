import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type QuestionType = 'quiz' | 'true_false' | 'multi_select' | 'type_answer' | 'slider';

export type KahootRow = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  cover_url: string | null;
  visibility: 'private' | 'public';
  created_at: string;
  updated_at: string;
};

export type QuestionRow = {
  id: string;
  kahoot_id: string;
  position: number;
  type: QuestionType;
  prompt: string;
  image_url: string | null;
  time_limit_ms: number;
  points_multiplier: number;
  slider_min: number | null;
  slider_max: number | null;
  slider_correct: number | null;
  slider_tolerance: number;
};

export type OptionRow = {
  id: string;
  question_id: string;
  position: number;
  text: string;
  is_correct: boolean;
};

export const COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'] as const;
export const COLOR_NAMES = ['Red', 'Blue', 'Yellow', 'Green'] as const;
export const SHAPES = ['triangle', 'diamond', 'circle', 'square'] as const;
export const TIME_OPTIONS = [5000, 10000, 20000, 30000, 60000, 90000, 120000];

export function randomNick(): string {
  const a = ['Swift', 'Lucky', 'Cosmic', 'Pixel', 'Turbo', 'Nifty', 'Brave', 'Sunny'];
  const b = ['Fox', 'Llama', 'Koala', 'Panda', 'Otter', 'Hawk', 'Bean', 'Nova'];
  return `${a[Math.floor(Math.random() * a.length)]}${b[Math.floor(Math.random() * b.length)]}${Math.floor(Math.random() * 90 + 10)}`;
}
