import { ScheduleAt } from 'spacetimedb';
import { schema, table, t, SenderError } from 'spacetimedb/server';

const QuizOption = t.object('QuizOption', {
  text: t.string(),
  correct: t.bool(),
});

const QuizQuestion = t.object('QuizQuestion', {
  qtype: t.string(),
  prompt: t.string(),
  image_url: t.string(),
  time_limit_ms: t.u32(),
  points_multiplier: t.u32(),
  options: t.array(QuizOption),
  type_answers: t.array(t.string()),
  slider_min: t.i32(),
  slider_max: t.i32(),
  slider_correct: t.i32(),
  slider_tolerance: t.i32(),
});

const game = table(
  { name: 'game', public: true },
  {
    id: t.u64().primaryKey().autoInc(),
    pin: t.string().unique(),
    host: t.identity().index('btree'),
    title: t.string(),
    kahoot_id: t.string(),
    phase: t.string().index('btree'),
    question_index: t.u32(),
    question_count: t.u32(),
    show_question_on_player: t.bool(),
    phase_started_at: t.timestamp(),
    phase_duration_ms: t.u32(),
    created_at: t.timestamp(),
  }
);

const player = table(
  { name: 'player', public: true },
  {
    identity: t.identity().primaryKey(),
    game_id: t.u64().index('btree'),
    nickname: t.string(),
    score: t.u32(),
    streak: t.u32(),
    correct_count: t.u32(),
    connected: t.bool(),
    answered: t.bool(),
  }
);

const question_public = table(
  { name: 'question_public', public: true },
  {
    game_id: t.u64().primaryKey(),
    index: t.u32(),
    qtype: t.string(),
    prompt: t.string(),
    image_url: t.string(),
    time_limit_ms: t.u32(),
    points_multiplier: t.u32(),
    option0: t.string(),
    option1: t.string(),
    option2: t.string(),
    option3: t.string(),
    option_count: t.u32(),
    slider_min: t.i32(),
    slider_max: t.i32(),
  }
);

const tally = table(
  { name: 'tally', public: true },
  {
    game_id: t.u64().primaryKey(),
    answered_count: t.u32(),
    player_count: t.u32(),
  }
);

const reveal = table(
  { name: 'reveal', public: true },
  {
    game_id: t.u64().primaryKey(),
    correct_mask: t.u32(),
    type_answer: t.string(),
    slider_correct: t.i32(),
    count0: t.u32(),
    count1: t.u32(),
    count2: t.u32(),
    count3: t.u32(),
    typed_correct: t.u32(),
  }
);

const result = table(
  { name: 'result', public: true },
  {
    id: t.u64().primaryKey().autoInc(),
    game_id: t.u64().index('btree'),
    player: t.identity().index('btree'),
    question_index: t.u32(),
    is_correct: t.bool(),
    points: t.u32(),
  }
);

const quiz_secret = table(
  { name: 'quiz_secret' },
  {
    game_id: t.u64().primaryKey(),
    questions: t.array(QuizQuestion),
  }
);

const answer = table(
  {
    name: 'answer',
    indexes: [
      {
        accessor: 'by_game_question',
        algorithm: 'btree',
        columns: ['game_id', 'question_index'],
      },
    ],
  },
  {
    id: t.u64().primaryKey().autoInc(),
    game_id: t.u64(),
    player: t.identity().index('btree'),
    question_index: t.u32(),
    choice_mask: t.u32(),
    typed: t.string(),
    slider_value: t.i32(),
    is_correct: t.bool(),
    points: t.u32(),
    elapsed_ms: t.u32(),
  }
);

const phase_timer = table(
  {
    name: 'phase_timer',
    scheduled: (): any => on_phase_timer,
  },
  {
    scheduled_id: t.u64().primaryKey().autoInc(),
    scheduled_at: t.scheduleAt(),
    game_id: t.u64(),
    expected_phase: t.string(),
    expected_question: t.u32(),
  }
);

const spacetimedb = schema({
  game,
  player,
  question_public,
  tally,
  reveal,
  result,
  quiz_secret,
  answer,
  phase_timer,
});
export default spacetimedb;

type DbCtx = {
  sender: { equals(other: unknown): boolean };
  timestamp: { microsSinceUnixEpoch: bigint };
  random: { integerInRange(min: number, max: number): number };
  db: any;
};

type GameRow = any;

function requireHost(ctx: DbCtx, gameId: bigint): GameRow {
  const g = ctx.db.game.id.find(gameId) as GameRow | null;
  if (!g) throw new SenderError('Game not found');
  if (!g.host.equals(ctx.sender)) throw new SenderError('Only the host can do that');
  return g;
}

function playerCount(ctx: { db: any }, gameId: bigint): number {
  let n = 0;
  for (const _p of ctx.db.player.game_id.filter(gameId)) n += 1;
  return n;
}

function schedulePhase(
  ctx: { timestamp: { microsSinceUnixEpoch: bigint }; db: any },
  gameId: bigint,
  phase: string,
  questionIndex: number,
  delayMs: number
) {
  ctx.db.phase_timer.insert({
    scheduled_id: 0n,
    scheduled_at: ScheduleAt.time(ctx.timestamp.microsSinceUnixEpoch + BigInt(delayMs) * 1000n),
    game_id: gameId,
    expected_phase: phase,
    expected_question: questionIndex,
  });
}

function setTally(ctx: { db: any }, gameId: bigint, answered: number) {
  const existing = ctx.db.tally.game_id.find(gameId);
  const count = playerCount(ctx, gameId);
  const row = { game_id: gameId, answered_count: answered, player_count: count };
  if (existing) ctx.db.tally.game_id.update(row);
  else ctx.db.tally.insert(row);
}

function resetAnswered(ctx: { db: any }, gameId: bigint) {
  for (const p of ctx.db.player.game_id.filter(gameId)) {
    if (p.answered) ctx.db.player.identity.update({ ...p, answered: false });
  }
}

function publishQuestion(ctx: { db: any }, gameId: bigint, index: number, q: {
  qtype: string;
  prompt: string;
  image_url: string;
  time_limit_ms: number;
  points_multiplier: number;
  options: Array<{ text: string; correct: boolean }>;
  slider_min: number;
  slider_max: number;
}) {
  const row = {
    game_id: gameId,
    index,
    qtype: q.qtype,
    prompt: q.prompt,
    image_url: q.image_url,
    time_limit_ms: q.time_limit_ms,
    points_multiplier: q.points_multiplier,
    option0: q.options[0]?.text ?? '',
    option1: q.options[1]?.text ?? '',
    option2: q.options[2]?.text ?? '',
    option3: q.options[3]?.text ?? '',
    option_count: q.options.length,
    slider_min: q.slider_min,
    slider_max: q.slider_max,
  };
  const existing = ctx.db.question_public.game_id.find(gameId);
  if (existing) ctx.db.question_public.game_id.update(row);
  else ctx.db.question_public.insert(row);
}

function uniquePin(ctx: { random: { integerInRange(min: number, max: number): number }; db: any }): string {
  for (let i = 0; i < 20; i++) {
    const pin = String(ctx.random.integerInRange(1000000, 9999999));
    if (!ctx.db.game.pin.find(pin)) return pin;
  }
  throw new SenderError('Could not allocate a PIN');
}

function scoreFor(correct: boolean, elapsedMs: number, limitMs: number, multiplier: number, streak: number) {
  if (!correct || multiplier === 0) return { points: 0, streak: 0 };
  const base = 1000 * multiplier;
  const ratio = Math.min(1, Math.max(0, elapsedMs / Math.max(1, limitMs)));
  const timePoints = Math.round(base * (1 - ratio / 2));
  const nextStreak = streak + 1;
  const bonus = nextStreak >= 2 ? Math.min(500, (nextStreak - 1) * 100) : 0;
  return { points: timePoints + bonus, streak: nextStreak };
}

function isAnswerCorrect(
  q: {
    qtype: string;
    options: Array<{ correct: boolean }>;
    type_answers: string[];
    slider_correct: number;
    slider_tolerance: number;
  },
  choiceMask: number,
  typed: string,
  sliderValue: number
): boolean {
  if (q.qtype === 'type_answer') {
    const needle = typed.trim().toLowerCase();
    if (!needle) return false;
    return q.type_answers.some(a => a.trim().toLowerCase() === needle);
  }
  if (q.qtype === 'slider') {
    return Math.abs(sliderValue - q.slider_correct) <= q.slider_tolerance;
  }
  let expected = 0;
  q.options.forEach((opt: { correct: boolean }, i: number) => {
    if (opt.correct) expected |= 1 << i;
  });
  if (q.qtype === 'multi_select') return choiceMask === expected && expected !== 0;
  return choiceMask === expected && expected !== 0;
}

function enterQuestion(
  ctx: { timestamp: { microsSinceUnixEpoch: bigint }; db: any },
  g: GameRow,
  index: number
) {
  const secret = ctx.db.quiz_secret.game_id.find(g.id);
  if (!secret || index >= secret.questions.length) throw new SenderError('Question missing');
  const q = secret.questions[index];
  publishQuestion(ctx, g.id, index, q);
  resetAnswered(ctx, g.id);
  const revealRow = ctx.db.reveal.game_id.find(g.id);
  if (revealRow) ctx.db.reveal.game_id.delete(g.id);
  setTally(ctx, g.id, 0);
  ctx.db.game.id.update({
    ...g,
    phase: 'preview',
    question_index: index,
    phase_started_at: ctx.timestamp,
    phase_duration_ms: 5000,
  });
  schedulePhase(ctx, g.id, 'preview', index, 5000);
}

function startAnswering(
  ctx: { timestamp: { microsSinceUnixEpoch: bigint }; db: any },
  g: GameRow
) {
  const secret = ctx.db.quiz_secret.game_id.find(g.id);
  if (!secret) return;
  const q = secret.questions[g.question_index];
  ctx.db.game.id.update({
    ...g,
    phase: 'answering',
    phase_started_at: ctx.timestamp,
    phase_duration_ms: q.time_limit_ms,
  });
  schedulePhase(ctx, g.id, 'answering', g.question_index, q.time_limit_ms);
}

function lockAndScore(
  ctx: { timestamp: { microsSinceUnixEpoch: bigint }; db: any },
  g: GameRow
) {
  const secret = ctx.db.quiz_secret.game_id.find(g.id);
  if (!secret) return;
  const q = secret.questions[g.question_index];
  const startedMicros = g.phase_started_at.microsSinceUnixEpoch;
  const now = ctx.timestamp.microsSinceUnixEpoch;
  const counts = [0, 0, 0, 0];
  let typedCorrect = 0;
  let correctMask = 0;
  q.options.forEach((opt: { correct: boolean }, i: number) => {
    if (opt.correct) correctMask |= 1 << i;
  });

  for (const a of ctx.db.answer.by_game_question.filter([g.id, g.question_index])) {
    const elapsed = Number((now - startedMicros) / 1000n);
    const correct = isAnswerCorrect(q, a.choice_mask, a.typed, a.slider_value);
    const p = ctx.db.player.identity.find(a.player);
    const streak = p?.streak ?? 0;
    const scored = scoreFor(correct, a.elapsed_ms || elapsed, q.time_limit_ms, q.points_multiplier, streak);
    ctx.db.answer.id.update({
      ...a,
      is_correct: correct,
      points: scored.points,
    });
    for (const r of ctx.db.result.player.filter(a.player)) {
      if (r.game_id === g.id && r.question_index === g.question_index) {
        ctx.db.result.id.update({ ...r, is_correct: correct, points: scored.points });
      }
    }
    if (p) {
      ctx.db.player.identity.update({
        ...p,
        score: p.score + scored.points,
        streak: scored.streak,
        correct_count: p.correct_count + (correct ? 1 : 0),
      });
    }
    if (q.qtype === 'type_answer' || q.qtype === 'slider') {
      if (correct) typedCorrect += 1;
    } else {
      for (let i = 0; i < 4; i++) {
        if (a.choice_mask & (1 << i)) counts[i] += 1;
      }
    }
  }

  const revealRow = {
    game_id: g.id,
    correct_mask: correctMask,
    type_answer: q.type_answers[0] ?? '',
    slider_correct: q.slider_correct,
    count0: counts[0],
    count1: counts[1],
    count2: counts[2],
    count3: counts[3],
    typed_correct: typedCorrect,
  };
  const existing = ctx.db.reveal.game_id.find(g.id);
  if (existing) ctx.db.reveal.game_id.update(revealRow);
  else ctx.db.reveal.insert(revealRow);

  ctx.db.game.id.update({
    ...g,
    phase: 'reveal',
    phase_started_at: ctx.timestamp,
    phase_duration_ms: 8000,
  });
  schedulePhase(ctx, g.id, 'reveal', g.question_index, 8000);
}

function goScoreboard(
  ctx: { timestamp: { microsSinceUnixEpoch: bigint }; db: any },
  g: GameRow
) {
  const last = g.question_index + 1 >= g.question_count;
  ctx.db.game.id.update({
    ...g,
    phase: last ? 'podium' : 'scoreboard',
    phase_started_at: ctx.timestamp,
    phase_duration_ms: last ? 0 : 7000,
  });
  if (!last) schedulePhase(ctx, g.id, 'scoreboard', g.question_index, 7000);
}

function advanceFrom(ctx: { timestamp: { microsSinceUnixEpoch: bigint }; db: any }, g: GameRow) {
  switch (g.phase) {
    case 'get_ready':
      enterQuestion(ctx, g, g.question_index);
      break;
    case 'preview':
      startAnswering(ctx, g);
      break;
    case 'answering':
      lockAndScore(ctx, g);
      break;
    case 'reveal':
      goScoreboard(ctx, g);
      break;
    case 'scoreboard':
      enterQuestion(ctx, { ...g, question_index: g.question_index + 1 } as GameRow, g.question_index + 1);
      break;
    default:
      break;
  }
}

export const init = spacetimedb.init(_ctx => {});

export const onConnect = spacetimedb.clientConnected(ctx => {
  const p = ctx.db.player.identity.find(ctx.sender);
  if (p && !p.connected) ctx.db.player.identity.update({ ...p, connected: true });
});

export const onDisconnect = spacetimedb.clientDisconnected(ctx => {
  const p = ctx.db.player.identity.find(ctx.sender);
  if (p && p.connected) ctx.db.player.identity.update({ ...p, connected: false });
});

export const host_game = spacetimedb.reducer(
  {
    title: t.string(),
    kahoot_id: t.string(),
    show_question_on_player: t.bool(),
    questions: t.array(QuizQuestion),
  },
  (ctx, { title, kahoot_id, show_question_on_player, questions }) => {
    if (!title.trim()) throw new SenderError('Title required');
    if (questions.length < 1) throw new SenderError('Add at least one question');
    for (const g of ctx.db.game.host.filter(ctx.sender)) {
      if (g.phase !== 'finished' && g.phase !== 'podium') {
        throw new SenderError('You already have a live game. Finish it first.');
      }
    }
    const inserted = ctx.db.game.insert({
      id: 0n,
      pin: uniquePin(ctx),
      host: ctx.sender,
      title: title.trim().slice(0, 80),
      kahoot_id,
      phase: 'lobby',
      question_index: 0,
      question_count: questions.length,
      show_question_on_player,
      phase_started_at: ctx.timestamp,
      phase_duration_ms: 0,
      created_at: ctx.timestamp,
    });
    ctx.db.quiz_secret.insert({ game_id: inserted.id, questions });
    setTally(ctx, inserted.id, 0);
  }
);

export const join_game = spacetimedb.reducer(
  { pin: t.string(), nickname: t.string() },
  (ctx, { pin, nickname }) => {
    const g = ctx.db.game.pin.find(pin.trim());
    if (!g) throw new SenderError('Game not found');
    if (g.phase !== 'lobby') throw new SenderError('This game has already started');
    if (g.host.equals(ctx.sender)) throw new SenderError('Host cannot join as a player');
    const name = nickname.trim().slice(0, 15);
    if (name.length < 2) throw new SenderError('Nickname must be 2–15 characters');
    for (const p of ctx.db.player.game_id.filter(g.id)) {
      if (p.nickname.toLowerCase() === name.toLowerCase() && !p.identity.equals(ctx.sender)) {
        throw new SenderError('Nickname taken');
      }
    }
    const existing = ctx.db.player.identity.find(ctx.sender);
    if (existing) {
      ctx.db.player.identity.update({
        identity: ctx.sender,
        game_id: g.id,
        nickname: name,
        score: 0,
        streak: 0,
        correct_count: 0,
        connected: true,
        answered: false,
      });
    } else {
      ctx.db.player.insert({
        identity: ctx.sender,
        game_id: g.id,
        nickname: name,
        score: 0,
        streak: 0,
        correct_count: 0,
        connected: true,
        answered: false,
      });
    }
    setTally(ctx, g.id, 0);
  }
);

export const leave_game = spacetimedb.reducer({ game_id: t.u64() }, (ctx, { game_id }) => {
  const p = ctx.db.player.identity.find(ctx.sender);
  if (p && p.game_id === game_id) ctx.db.player.identity.delete(ctx.sender);
});

export const kick_player = spacetimedb.reducer(
  { game_id: t.u64(), identity: t.identity() },
  (ctx, { game_id, identity }) => {
    requireHost(ctx, game_id);
    ctx.db.player.identity.delete(identity);
    setTally(ctx, game_id, [...ctx.db.player.game_id.filter(game_id)].filter(p => p.answered).length);
  }
);

export const start_game = spacetimedb.reducer({ game_id: t.u64() }, (ctx, { game_id }) => {
  const g = requireHost(ctx, game_id);
  if (g.phase !== 'lobby') throw new SenderError('Game already started');
  if (playerCount(ctx, game_id) < 1) throw new SenderError('Need at least one player');
  ctx.db.game.id.update({
    ...g,
    phase: 'get_ready',
    question_index: 0,
    phase_started_at: ctx.timestamp,
    phase_duration_ms: 4000,
  });
  schedulePhase(ctx, g.id, 'get_ready', 0, 4000);
});

export const advance = spacetimedb.reducer({ game_id: t.u64() }, (ctx, { game_id }) => {
  const g = requireHost(ctx, game_id);
  if (g.phase === 'lobby' || g.phase === 'finished') throw new SenderError('Nothing to advance');
  if (g.phase === 'podium') {
    ctx.db.game.id.update({ ...g, phase: 'finished' });
    return;
  }
  advanceFrom(ctx, g);
});

export const submit_answer = spacetimedb.reducer(
  {
    game_id: t.u64(),
    choice_mask: t.u32(),
    typed: t.string(),
    slider_value: t.i32(),
  },
  (ctx, { game_id, choice_mask, typed, slider_value }) => {
    const g = ctx.db.game.id.find(game_id);
    if (!g) throw new SenderError('Game not found');
    if (g.phase !== 'answering') throw new SenderError('Not accepting answers');
    const p = ctx.db.player.identity.find(ctx.sender);
    if (!p || p.game_id !== game_id) throw new SenderError('You are not in this game');
    if (p.answered) throw new SenderError('Already answered');
    const elapsed = Number((ctx.timestamp.microsSinceUnixEpoch - g.phase_started_at.microsSinceUnixEpoch) / 1000n);
    ctx.db.answer.insert({
      id: 0n,
      game_id,
      player: ctx.sender,
      question_index: g.question_index,
      choice_mask,
      typed: typed.slice(0, 80),
      slider_value,
      is_correct: false,
      points: 0,
      elapsed_ms: Math.max(0, elapsed),
    });
    ctx.db.player.identity.update({ ...p, answered: true });
    ctx.db.result.insert({
      id: 0n,
      game_id,
      player: ctx.sender,
      question_index: g.question_index,
      is_correct: false,
      points: 0,
    });
    const answered = [...ctx.db.player.game_id.filter(game_id)].filter(x => x.answered).length;
    setTally(ctx, game_id, answered);
    if (answered >= playerCount(ctx, game_id)) lockAndScore(ctx, g);
  }
);

export const finish_game = spacetimedb.reducer({ game_id: t.u64() }, (ctx, { game_id }) => {
  const g = requireHost(ctx, game_id);
  ctx.db.game.id.update({ ...g, phase: 'finished' });
});

export const on_phase_timer = spacetimedb.reducer(
  { timer: phase_timer.rowType },
  (ctx, { timer }) => {
    const g = ctx.db.game.id.find(timer.game_id);
    if (!g) return;
    if (g.phase !== timer.expected_phase || g.question_index !== timer.expected_question) return;
    advanceFrom(ctx, g);
  }
);
