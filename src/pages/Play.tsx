import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { COLORS, COLOR_NAMES, randomNick } from '../lib/supabase';
import { remainingMs } from '../lib/quiz';
import { playCorrect, playWrong } from '../lib/audio';
import { ShapeIcon } from '../components/ShapeIcon';
import {
  hex,
  useConn,
  useGames,
  useJoinGame,
  useLeaveGame,
  usePlayers,
  useQuestions,
  useResults,
  useSubmitAnswer,
} from '../lib/spacetime';

const NICK_KEY = 'kahootclone-nickname';

function loadNick() {
  try {
    const saved = localStorage.getItem(NICK_KEY)?.trim();
    if (saved && saved.length >= 2) return saved.slice(0, 15);
  } catch {
    /* ignore */
  }
  return randomNick();
}

function Countdown({ started, duration }: { started: bigint; duration: number }) {
  const [left, setLeft] = useState(() => remainingMs(started, duration));
  useEffect(() => {
    const t = setInterval(() => setLeft(remainingMs(started, duration)), 100);
    return () => clearInterval(t);
  }, [started, duration]);
  return (
    <div className="player-timer" aria-live="polite">
      {Math.ceil(left / 1000)}
    </div>
  );
}

export function Play() {
  const { pin } = useParams();
  const nav = useNavigate();
  const conn = useConn();
  const joinGame = useJoinGame();
  const leaveGame = useLeaveGame();
  const submitAnswer = useSubmitAnswer();
  const { rows: games, ready: gamesReady } = useGames();
  const { rows: players } = usePlayers();
  const { rows: questions } = useQuestions();
  const { rows: results } = useResults();
  const [nick, setNick] = useState(loadNick);
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const [slider, setSlider] = useState(50);
  const [mask, setMask] = useState(0);
  const [joining, setJoining] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const game = games.find(g => g.pin === pin);
  const me = players.find(p => hex(p.identity) === hex(conn.identity));
  const inGame = !!(me && game && me.gameId === game.id);
  const q = questions.find(x => game && x.gameId === game.id);
  const myResult = results.find(
    r => game && hex(r.player) === hex(conn.identity) && r.gameId === game.id && r.questionIndex === game.questionIndex
  );
  const ranked = useMemo(
    () => (game ? players.filter(p => p.gameId === game.id).sort((a, b) => b.score - a.score) : []),
    [players, game]
  );
  const rank = ranked.findIndex(p => hex(p.identity) === hex(conn.identity)) + 1;

  useEffect(() => {
    setTyped('');
    setMask(0);
    setSubmitting(false);
    setError('');
    if (q) {
      const min = q.sliderMin;
      const max = q.sliderMax;
      setSlider(Math.round((min + max) / 2));
    }
  }, [game?.questionIndex, q?.sliderMin, q?.sliderMax]);

  useEffect(() => {
    if (game?.phase === 'reveal' && myResult) {
      if (myResult.isCorrect) playCorrect();
      else playWrong();
    }
  }, [game?.phase, myResult?.isCorrect]);

  function join(e: FormEvent) {
    e.preventDefault();
    const name = nick.trim();
    if (name.length < 2) {
      setError('Nickname must be 2–15 characters');
      return;
    }
    setError('');
    setJoining(true);
    try {
      localStorage.setItem(NICK_KEY, name);
      joinGame({ pin: pin ?? '', nickname: name })
        .catch((err: any) => setError(err.message ?? String(err)))
        .finally(() => setJoining(false));
    } catch (err: any) {
      setError(err.message ?? String(err));
      setJoining(false);
    }
  }

  function submit(choiceMask = mask) {
    if (!game || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      submitAnswer({
        gameId: game.id,
        choiceMask,
        typed,
        sliderValue: slider,
      }).catch((err: any) => {
        setError(err.message ?? String(err));
        setSubmitting(false);
      });
    } catch (err: any) {
      setError(err.message ?? String(err));
      setSubmitting(false);
    }
  }

  function leave() {
    if (!game) return;
    leaveGame({ gameId: game.id })
      .catch(() => undefined)
      .finally(() => nav('/'));
  }

  const homeLink = (
    <p className="center" style={{ marginTop: 16 }}>
      <Link to="/">Try another PIN</Link>
    </p>
  );

  if (!conn.isActive || !gamesReady) return <div className="hero">Connecting…</div>;
  if (!game) {
    return (
      <div className="hero">
        <div className="card">
          <h1>Game not found</h1>
          <p>Check the PIN and try again.</p>
          {homeLink}
        </div>
      </div>
    );
  }

  if (!inGame) {
    if (game.phase === 'finished' || game.phase === 'podium') {
      return (
        <div className="hero">
          <div className="card">
            <h1>This game is over</h1>
            <p>Ask the host for a new PIN.</p>
            {homeLink}
          </div>
        </div>
      );
    }
    if (game.phase !== 'lobby') {
      return (
        <div className="hero">
          <div className="card">
            <h1>This game already started</h1>
            <p>You can only join while players are still in the lobby.</p>
            {homeLink}
          </div>
        </div>
      );
    }
    return (
      <div className="hero">
        <form className="card" onSubmit={join}>
          <h1>Join {game.title}</h1>
          <label className="label" htmlFor="nick">
            Nickname
          </label>
          <input
            id="nick"
            className="field"
            value={nick}
            onChange={e => setNick(e.target.value.slice(0, 15))}
            maxLength={15}
            minLength={2}
            required
            autoComplete="nickname"
          />
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={joining}>
            {joining ? 'Joining…' : 'OK, go!'}
          </button>
        </form>
      </div>
    );
  }

  if (game.phase === 'lobby') {
    return (
      <div className="feedback" style={{ background: '#46178f' }}>
        <div>
          <h1>You're in!</h1>
          <p>See your nickname on the host screen.</p>
          <h2>{me?.nickname}</h2>
          <button className="btn btn-dark" type="button" onClick={leave} style={{ marginTop: 20 }}>
            Leave game
          </button>
        </div>
      </div>
    );
  }

  if (game.phase === 'get_ready' || (game.phase === 'answering' && !q)) {
    return (
      <div className="feedback" style={{ background: '#46178f' }}>
        <h1>Question {game.questionIndex + 1}</h1>
        <p>Get ready…</p>
      </div>
    );
  }

  if (game.phase === 'preview') {
    return (
      <div className="feedback" style={{ background: '#3b1277' }}>
        <div>
          {game.showQuestionOnPlayer && q ? <h1>{q.prompt}</h1> : <h1>Get ready…</h1>}
        </div>
      </div>
    );
  }

  if (game.phase === 'answering' && q) {
    const timer = <Countdown started={game.phaseStartedAt.microsSinceUnixEpoch} duration={game.phaseDurationMs} />;
    if (me?.answered) {
      return (
        <div className="feedback" style={{ background: '#1368ce' }}>
          <h1>Got it!</h1>
          <p>Waiting for others</p>
        </div>
      );
    }
    const opts = [q.option0, q.option1, q.option2, q.option3].slice(0, q.optionCount);
    if (q.qtype === 'type_answer') {
      return (
        <div className="hero">
          {timer}
          <form
            className="card"
            onSubmit={e => {
              e.preventDefault();
              if (!typed.trim()) {
                setError('Type an answer');
                return;
              }
              submit(0);
            }}
          >
            {game.showQuestionOnPlayer && <h1>{q.prompt}</h1>}
            <input
              className="field"
              value={typed}
              onChange={e => setTyped(e.target.value)}
              autoFocus
              disabled={submitting}
            />
            {error && <div className="error">{error}</div>}
            <button className="btn btn-primary" disabled={submitting || !typed.trim()}>
              {submitting ? 'Sending…' : 'Submit'}
            </button>
          </form>
        </div>
      );
    }
    if (q.qtype === 'slider') {
      return (
        <div className="hero">
          {timer}
          <form
            className="card"
            onSubmit={e => {
              e.preventDefault();
              submit(0);
            }}
          >
            {game.showQuestionOnPlayer && <h1>{q.prompt}</h1>}
            <input
              type="range"
              min={q.sliderMin}
              max={q.sliderMax}
              value={slider}
              disabled={submitting}
              onChange={e => setSlider(Number(e.target.value))}
            />
            <div className="center">{slider}</div>
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Sending…' : 'Submit'}
            </button>
          </form>
        </div>
      );
    }
    if (q.qtype === 'multi_select') {
      return (
        <div className="page">
          {timer}
          {game.showQuestionOnPlayer && <h2 className="center">{q.prompt}</h2>}
          <div className="answers">
            {opts.map((text, i) => (
              <button
                key={i}
                type="button"
                className="ans"
                aria-label={game.showQuestionOnPlayer ? text : COLOR_NAMES[i]}
                aria-pressed={!!(mask & (1 << i))}
                disabled={submitting}
                style={{ background: COLORS[i], outline: mask & (1 << i) ? '4px solid #fff' : undefined }}
                onClick={() => setMask(m => m ^ (1 << i))}
              >
                <ShapeIcon index={i} />
                {game.showQuestionOnPlayer ? text : ''}
              </button>
            ))}
          </div>
          {error && <div className="error center">{error}</div>}
          <div className="center" style={{ padding: 12 }}>
            <button
              className="btn btn-dark"
              disabled={submitting || mask === 0}
              onClick={() => {
                if (!mask) {
                  setError('Select at least one answer');
                  return;
                }
                submit(mask);
              }}
            >
              {submitting ? 'Sending…' : 'Submit'}
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="page">
        {timer}
        {game.showQuestionOnPlayer && <h2 className="center">{q.prompt}</h2>}
        <div className="answers">
          {opts.map((text, i) => (
            <button
              key={i}
              type="button"
              className="ans"
              aria-label={game.showQuestionOnPlayer ? text : COLOR_NAMES[i]}
              disabled={submitting}
              style={{ background: COLORS[i] }}
              onClick={() => submit(1 << i)}
            >
              <ShapeIcon index={i} />
              {game.showQuestionOnPlayer ? text : ''}
            </button>
          ))}
        </div>
        {error && <div className="error center">{error}</div>}
      </div>
    );
  }

  if (game.phase === 'reveal') {
    if (!myResult) {
      return (
        <div className="feedback bad">
          <div>
            <h1>Time’s up</h1>
            <p>+0 points</p>
            <p>You're #{rank || '—'}</p>
          </div>
        </div>
      );
    }
    const ok = myResult.isCorrect;
    return (
      <div className={`feedback ${ok ? 'ok' : 'bad'}`}>
        <div>
          <h1>{ok ? 'Correct' : 'Nice try'}</h1>
          <p>+{myResult.points} points</p>
          {me && me.streak > 1 && <p>Streak ×{me.streak}</p>}
          <p>You're #{rank || '—'}</p>
        </div>
      </div>
    );
  }

  if (game.phase === 'scoreboard') {
    return (
      <div className="feedback" style={{ background: '#46178f' }}>
        <div>
          <h1>#{rank}</h1>
          <p>{me?.score} points</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback" style={{ background: '#46178f' }}>
      <div>
        <h1>{rank === 1 ? 'You won!' : `You placed #${rank}`}</h1>
        <p>{me?.score} points</p>
        <p style={{ marginTop: 24 }}>
          <Link className="btn btn-primary" to="/" style={{ display: 'inline-block', width: 'auto', textDecoration: 'none' }}>
            Play again
          </Link>
        </p>
      </div>
    </div>
  );
}
