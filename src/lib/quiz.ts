import type { QuestionRow, OptionRow, QuestionType } from './supabase';

export type PackedQuestion = {
  qtype: string;
  prompt: string;
  imageUrl: string;
  timeLimitMs: number;
  pointsMultiplier: number;
  options: Array<{ text: string; correct: boolean }>;
  typeAnswers: string[];
  sliderMin: number;
  sliderMax: number;
  sliderCorrect: number;
  sliderTolerance: number;
};

export function packQuestions(
  questions: QuestionRow[],
  options: OptionRow[],
  typeAnswers: Array<{ question_id: string; answer: string }>
): PackedQuestion[] {
  return [...questions]
    .sort((a, b) => a.position - b.position)
    .map(q => ({
      qtype: q.type,
      prompt: q.prompt,
      imageUrl: q.image_url ?? '',
      timeLimitMs: q.time_limit_ms,
      pointsMultiplier: q.points_multiplier,
      options: options
        .filter(o => o.question_id === q.id)
        .sort((a, b) => a.position - b.position)
        .map(o => ({ text: o.text, correct: o.is_correct })),
      typeAnswers: typeAnswers.filter(t => t.question_id === q.id).map(t => t.answer),
      sliderMin: q.slider_min ?? 0,
      sliderMax: q.slider_max ?? 100,
      sliderCorrect: q.slider_correct ?? 50,
      sliderTolerance: q.slider_tolerance ?? 0,
    }));
}

export function blankQuestion(type: QuestionType): Omit<QuestionRow, 'id' | 'kahoot_id'> {
  return {
    position: 0,
    type,
    prompt: type === 'true_false' ? 'True or false?' : 'New question',
    image_url: null,
    time_limit_ms: 20000,
    points_multiplier: 1,
    slider_min: 0,
    slider_max: 100,
    slider_correct: 50,
    slider_tolerance: 0,
  };
}

export function defaultOptions(type: QuestionType): Array<Pick<OptionRow, 'position' | 'text' | 'is_correct'>> {
  if (type === 'true_false') {
    return [
      { position: 0, text: 'True', is_correct: true },
      { position: 1, text: 'False', is_correct: false },
    ];
  }
  return [0, 1, 2, 3].map(position => ({
    position,
    text: '',
    is_correct: position === 0,
  }));
}

export function remainingMs(startedAtMicros: bigint | number | undefined, durationMs: number) {
  if (startedAtMicros == null) return durationMs;
  const started = typeof startedAtMicros === 'bigint' ? Number(startedAtMicros / 1000n) : startedAtMicros / 1000;
  return Math.max(0, durationMs - (Date.now() - started));
}
