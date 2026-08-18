import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { COLORS, randomNick } from '../lib/supabase';
import { remainingMs } from '../lib/quiz';
import { playCorrect, playWrong } from '../lib/audio';
import { ShapeIcon } from '../components/ShapeIcon';
import { hex, useConn, useGames, useJoinGame, usePlayers, useQuestions, useReveals, useResults, useSubmitAnswer } from '../lib/spacetime';

export function Play() {
  const { pin } = useParams();
  const conn = useConn();
  const joinGame = useJoinGame();
  const submitAnswer = useSubmitAnswer();
  const { rows: games } = useGames();
  const { rows: players } = usePlayers();
  const { rows: questions } = useQuestions();
  const { rows: reveals } = useReveals();
  const { rows: results } = useResults();
  const [nick, setNick] = useState(randomNick);
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const [slider, setSlider] = useState(50);
  const [mask, setMask] = useState(0);

  const game = games.find(g => g.pin === pin);
  const me = players.find(p => hex(p.identity) === hex(conn.identity));
  const inGame = !!(me && game && me.gameId === game.id);
  const q = questions.find(x => game && x.gameId === game.id);
  const rev = reveals.find(x => game && x.gameId === game.id);
  const myResult = results.find(
    r => game && hex(r.player) === hex(conn.identity) && r.gameId === game.id && r.questionIndex === game.questionIndex
  );
  const ranked = useMemo(
    () => (game ? players.filter(p => p.gameId === game.id).sort((a, b) => b.score - a.score) : []),
    [players, game]
  );
  const rank = ranked.findIndex(p => hex(p.identity) === hex(conn.identity)) + 1;

  useEffect(() => {
    if (game?.phase === 'reveal' && myResult) {
      if (myResult.isCorrect) playCorrect();
      else playWrong();
    }
  }, [game?.phase, myResult?.isCorrect]);

  function join(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      joinGame({ pin: pin ?? '', nickname: nick }).catch((err: any) => setError(err.message ?? String(err)));
    } catch (err: any) {
      setError(err.message ?? String(err));
    }
  }

  function submit(choiceMask = mask) {
    if (!game) return;
    try {
      submitAnswer({
        gameId: game.id,
        choiceMask,
        typed,
        sliderValue: slider,
      }).catch((err: any) => setError(err.message ?? String(err)));
    } catch (err: any) {
      setError(err.message ?? String(err));
    }
  }

  if (!conn.isActive) return <div className="hero">Connecting…</div>;
  if (!game) {
    return (
      <div className="hero">
        <div className="card">
          <h1>Game not found</h1>
          <p>Check the PIN and try again.</p>
        </div>
      </div>
    );
  }

  if (!inGame) {
    if (game.phase !== 'lobby') {
      return (
        <div className="hero">
          <div className="card">
            <h1>This game already started</h1>
          </div>
        </div>
      );
    }
    return (
      <div className="hero">
        <form className="card" onSubmit={join}>
          <h1>Join {game.title}</h1>
          <label className="label">Nickname</label>
          <input className="field" value={nick} onChange={e => setNick(e.target.value)} maxLength={15} />
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" type="submit">
            OK, go!
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
        </div>
      </div>
    );
  }

  if (game.phase === 'get_ready') {
    return (
      <div className="feedback" style={{ background: '#46178f' }}>
        <h1>Question {game.questionIndex + 1}</h1>
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
          <form
            className="card"
            onSubmit={e => {
              e.preventDefault();
              submit(0);
            }}
          >
            {game.showQuestionOnPlayer && <h1>{q.prompt}</h1>}
            <input className="field" value={typed} onChange={e => setTyped(e.target.value)} autoFocus />
            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
      );
    }
    if (q.qtype === 'slider') {
      return (
        <div className="hero">
          <form
            className="card"
            onSubmit={e => {
              e.preventDefault();
              submit(0);
            }}
          >
            {game.showQuestionOnPlayer && <h1>{q.prompt}</h1>}
            <input type="range" min={q.sliderMin} max={q.sliderMax} value={slider} onChange={e => setSlider(Number(e.target.value))} />
            <div className="center">{slider}</div>
            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
      );
    }
    if (q.qtype === 'multi_select') {
      return (
        <div className="page">
          {game.showQuestionOnPlayer && q && <h2 className="center">{q.prompt}</h2>}
          <div className="answers">
            {opts.map((text, i) => (
              <button
                key={i}
                className="ans"
                style={{ background: COLORS[i], outline: mask & (1 << i) ? '4px solid #fff' : undefined }}
                onClick={() => setMask(m => m ^ (1 << i))}
              >
                <ShapeIcon index={i} />
                {game.showQuestionOnPlayer ? text : ''}
              </button>
            ))}
          </div>
          <div className="center" style={{ padding: 12 }}>
            <button className="btn btn-dark" onClick={() => submit(mask)}>
              Submit
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="page">
        {game.showQuestionOnPlayer && <h2 className="center">{q.prompt}</h2>}
        <div className="answers">
          {opts.map((text, i) => (
            <button key={i} className="ans" style={{ background: COLORS[i] }} onClick={() => submit(1 << i)}>
              <ShapeIcon index={i} />
              {game.showQuestionOnPlayer ? text : ''}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (game.phase === 'reveal') {
    const ok = myResult?.isCorrect;
    return (
      <div className={`feedback ${ok ? 'ok' : 'bad'}`}>
        <div>
          <h1>{ok ? 'Correct' : 'Nice try'}</h1>
          <p>+{myResult?.points ?? 0} points</p>
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
      </div>
    </div>
  );
}
