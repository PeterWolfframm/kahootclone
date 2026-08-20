import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { packQuestions, remainingMs } from '../lib/quiz';
import { isLobbyMusicMuted, setLobbyMusicMuted, startLobbyMusic, stopLobbyMusic } from '../lib/audio';
import { ShapeIcon } from '../components/ShapeIcon';
import { COLORS } from '../lib/supabase';
import {
  hex,
  useAdvance,
  useConn,
  useFinishGame,
  useGames,
  useHostGame,
  useKickPlayer,
  usePlayers,
  useQuestions,
  useReveals,
  useStartGame,
  useTallies,
} from '../lib/spacetime';

export function HostLaunch() {
  const { id } = useParams();
  const nav = useNavigate();
  const conn = useConn();
  const { rows: games } = useGames();
  const hostGame = useHostGame();
  const finishGame = useFinishGame();
  const [error, setError] = useState('');
  const [showQ, setShowQ] = useState(true);
  const [busy, setBusy] = useState(false);
  const [justHosted, setJustHosted] = useState(false);

  const live = games.find(g => hex(g.host) === hex(conn.identity) && g.phase !== 'finished');

  useEffect(() => {
    if (justHosted && live) nav(`/host/live/${live.pin}`, { replace: true });
  }, [justHosted, live, nav]);

  async function loadPacked() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      nav('/auth');
      return null;
    }
    const { data: kahoot } = await supabase.from('kahoots').select('*').eq('id', id).single();
    const { data: questions } = await supabase.from('questions').select('*').eq('kahoot_id', id).order('position');
    if (!kahoot || !questions?.length) {
      setError('This kahoot has no questions');
      return null;
    }
    const ids = questions.map(q => q.id);
    const { data: options } = await supabase.from('options').select('*').in('question_id', ids);
    const { data: typeAnswers } = await supabase.from('type_answers').select('*').in('question_id', ids);
    return { kahoot, questions, options: options ?? [], typeAnswers: typeAnswers ?? [] };
  }

  async function hostPacked() {
    const packed = await loadPacked();
    if (!packed) return;
    await hostGame({
      title: packed.kahoot.title,
      kahootId: packed.kahoot.id,
      showQuestionOnPlayer: showQ,
      questions: packQuestions(packed.questions, packed.options, packed.typeAnswers),
    });
    setJustHosted(true);
  }

  async function host(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await hostPacked();
    } catch (err: any) {
      setError(err.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  async function endAndHost() {
    if (!live) return;
    setError('');
    setBusy(true);
    try {
      await finishGame({ gameId: live.id });
      await hostPacked();
    } catch (err: any) {
      setError(err.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  if (live && !justHosted) {
    return (
      <div className="page">
        <div className="hero">
          <div className="card">
            <h1>You already have a live game</h1>
            <p>
              PIN {live.pin} is still {live.phase === 'lobby' ? 'in lobby' : live.phase}. Finish it before hosting this kahoot, or jump back in.
            </p>
            {error && <div className="error">{error}</div>}
            <button className="btn btn-primary" type="button" onClick={() => nav(`/host/live/${live.pin}`)}>
              Resume lobby
            </button>
            <button
              className="btn btn-dark"
              type="button"
              disabled={busy}
              style={{ width: '100%', marginTop: 12 }}
              onClick={endAndHost}
            >
              {busy ? 'Working…' : 'End it and host this one'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="hero">
        <form className="card" onSubmit={host}>
          <h1>Host game</h1>
          <p>Players will join with a PIN on their phones.</p>
          <label>
            <input type="checkbox" checked={showQ} onChange={e => setShowQ(e.target.checked)} /> Show questions on player devices
          </label>
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={!conn.isActive || busy} style={{ marginTop: 16 }}>
            {busy ? 'Creating…' : 'Create lobby'}
          </button>
        </form>
      </div>
    </div>
  );
}

function TimerBar({ started, duration }: { started: bigint; duration: number }) {
  const [left, setLeft] = useState(() => remainingMs(started, duration));
  useEffect(() => {
    const t = setInterval(() => setLeft(remainingMs(started, duration)), 100);
    return () => clearInterval(t);
  }, [started, duration]);
  const pct = duration ? (left / duration) * 100 : 0;
  return (
    <div className="timer">
      <div style={{ width: `${pct}%` }} />
    </div>
  );
}

export function HostLive() {
  const { pin } = useParams();
  const nav = useNavigate();
  const startGame = useStartGame();
  const advance = useAdvance();
  const finishGame = useFinishGame();
  const kickPlayer = useKickPlayer();
  const { rows: games, ready } = useGames();
  const { rows: players } = usePlayers();
  const { rows: questions } = useQuestions();
  const { rows: tallies } = useTallies();
  const { rows: reveals } = useReveals();
  const game = games.find(g => g.pin === pin);
  const plist = players.filter(p => game && p.gameId === game.id).sort((a, b) => b.score - a.score);
  const q = questions.find(x => game && x.gameId === game.id);
  const tally = tallies.find(x => game && x.gameId === game.id);
  const rev = reveals.find(x => game && x.gameId === game.id);
  const joinUrl = `${window.location.origin}/play/${pin}`;
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [muted, setMuted] = useState(isLobbyMusicMuted);

  useEffect(() => {
    if (game?.phase === 'lobby' && !muted) startLobbyMusic();
    else stopLobbyMusic();
    return () => stopLobbyMusic();
  }, [game?.phase, muted]);

  useEffect(() => {
    if (!game || saved || (game.phase !== 'podium' && game.phase !== 'finished')) return;
    setSaved(true);
    const g = game;
    const snapshot = [...plist];
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      const { data: report } = await supabase
        .from('game_reports')
        .insert({
          kahoot_id: g.kahootId || null,
          host_id: user.user.id,
          title: g.title,
          pin: g.pin,
          player_count: snapshot.length,
          question_count: g.questionCount,
        })
        .select()
        .single();
      if (report) {
        await supabase.from('report_players').insert(
          snapshot.map((p, i) => ({
            report_id: report.id,
            nickname: p.nickname,
            score: p.score,
            correct_count: p.correctCount,
            rank: i + 1,
          }))
        );
      }
    })();
  }, [game?.phase, saved, game, plist]);

  function catchErr(p: Promise<unknown>) {
    return p.catch((err: any) => setError(err.message ?? String(err)));
  }

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 1600);
    } catch {
      setError('Could not copy');
    }
  }

  function toggleMute() {
    const next = !muted;
    setLobbyMusicMuted(next);
    setMuted(next);
    if (!next && game?.phase === 'lobby') startLobbyMusic();
  }

  async function endGame() {
    if (!game) return;
    setError('');
    try {
      await finishGame({ gameId: game.id });
      nav('/reports');
    } catch (err: any) {
      setError(err.message ?? String(err));
    }
  }

  if (!game) {
    return (
      <div className="hero">
        <div className="card">
          <h1>{ready ? 'Lobby not found' : 'Connecting to lobby…'}</h1>
          {ready && (
            <p className="center">
              <Link to="/library">Back to library</Link>
            </p>
          )}
        </div>
      </div>
    );
  }

  const opts = q ? [q.option0, q.option1, q.option2, q.option3].slice(0, q.optionCount) : [];
  const counts = rev ? [rev.count0, rev.count1, rev.count2, rev.count3] : [0, 0, 0, 0];
  const maxC = Math.max(1, ...counts);

  return (
    <div className="lobby">
      {game.phase !== 'lobby' && game.phaseDurationMs > 0 && (
        <TimerBar started={game.phaseStartedAt.microsSinceUnixEpoch} duration={game.phaseDurationMs} />
      )}
      {error && <div className="error center">{error}</div>}
      {game.phase === 'lobby' && (
        <>
          <div className="lobby-top">
            <div className="pin-board">
              <div className="label">Join at {window.location.host} with PIN</div>
              <div className="big">{game.pin}</div>
              <div>{plist.length} players</div>
              <div className="row" style={{ marginTop: 10 }}>
                <button className="btn btn-dark" type="button" style={{ width: 'auto' }} onClick={() => copy(game.pin, 'PIN')}>
                  {copied === 'PIN' ? 'Copied PIN' : 'Copy PIN'}
                </button>
                <button className="btn btn-dark" type="button" style={{ width: 'auto' }} onClick={() => copy(joinUrl, 'URL')}>
                  {copied === 'URL' ? 'Copied link' : 'Copy link'}
                </button>
                <button className="btn btn-dark" type="button" style={{ width: 'auto' }} onClick={toggleMute}>
                  {muted ? 'Unmute music' : 'Mute music'}
                </button>
              </div>
            </div>
            <div className="pin-board">
              <QRCodeSVG value={joinUrl} size={160} />
            </div>
          </div>
          <div className="nicks">
            {plist.length === 0 && <p className="muted">Waiting for players…</p>}
            {plist.map(p => (
              <span className="nick" key={hex(p.identity)}>
                {p.nickname}
                <button
                  type="button"
                  className="nick-kick"
                  aria-label={`Kick ${p.nickname}`}
                  onClick={() => catchErr(kickPlayer({ gameId: game.id, identity: p.identity }))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div style={{ padding: 24 }}>
            <button
              className="btn btn-primary"
              style={{ width: 'auto' }}
              disabled={plist.length < 1}
              onClick={() => {
                setError('');
                catchErr(startGame({ gameId: game.id }));
              }}
            >
              Start
            </button>
          </div>
        </>
      )}
      {game.phase === 'get_ready' && (
        <div className="hero">
          <h1>
            Question {game.questionIndex + 1} of {game.questionCount}
          </h1>
          <p>Get ready!</p>
        </div>
      )}
      {(game.phase === 'preview' || game.phase === 'answering') && q && (
        <div>
          <div className="library">
            <div className="label">
              {game.questionIndex + 1}/{game.questionCount} · {tally?.answeredCount ?? 0}/{tally?.playerCount ?? 0} answered
            </div>
            <h1>{q.prompt}</h1>
            {q.imageUrl && <img src={q.imageUrl} alt="" style={{ maxHeight: 240 }} />}
          </div>
          {game.phase === 'answering' && (
            <div className="answers">
              {opts.map((text, i) => (
                <div key={i} className="ans" style={{ background: COLORS[i] }}>
                  <ShapeIcon index={i} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {game.phase === 'reveal' && q && (
        <div>
          <div className="library">
            <h1>{q.prompt}</h1>
          </div>
          <div className="stat-bars">
            {opts.map((text, i) => (
              <div className="stat" key={i}>
                <div>{counts[i]}</div>
                <div
                  className="fill"
                  style={{
                    height: `${(counts[i] / maxC) * 100}%`,
                    background: COLORS[i],
                    outline: rev && rev.correctMask & (1 << i) ? '4px solid #fff' : undefined,
                  }}
                />
                <ShapeIcon index={i} />
                <div>{text}</div>
              </div>
            ))}
          </div>
          {(q.qtype === 'type_answer' || q.qtype === 'slider') && (
            <div className="center">
              Correct: {q.qtype === 'slider' ? rev?.sliderCorrect : rev?.typeAnswer} · {rev?.typedCorrect} got it
            </div>
          )}
        </div>
      )}
      {game.phase === 'scoreboard' && (
        <div className="library">
          <h1>Scoreboard</h1>
          {plist.slice(0, 5).map((p, i) => (
            <div key={hex(p.identity)} className="nick" style={{ display: 'block', marginBottom: 8 }}>
              {i + 1}. {p.nickname} — {p.score}
            </div>
          ))}
        </div>
      )}
      {(game.phase === 'podium' || game.phase === 'finished') && (
        <div>
          <h1 className="center">Podium</h1>
          <div className="podium">
            {[plist[1], plist[0], plist[2]].map((p, i) =>
              p ? (
                <div className="place" key={hex(p.identity)}>
                  <div>{p.nickname}</div>
                  <div>{p.score}</div>
                  <div className="bar" style={{ height: [140, 200, 100][i] }}>
                    {['2', '1', '3'][i]}
                  </div>
                </div>
              ) : null
            )}
          </div>
          <div className="center">
            <button className="btn btn-dark" onClick={endGame}>
              End game
            </button>
          </div>
        </div>
      )}
      {game.phase !== 'lobby' && game.phase !== 'finished' && game.phase !== 'podium' && (
        <div style={{ padding: 16 }}>
          <button
            className="btn btn-dark"
            onClick={() => {
              setError('');
              catchErr(advance({ gameId: game.id }));
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
