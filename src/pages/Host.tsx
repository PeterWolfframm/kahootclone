import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { packQuestions, remainingMs } from '../lib/quiz';
import { startLobbyMusic, stopLobbyMusic } from '../lib/audio';
import { ShapeIcon } from '../components/ShapeIcon';
import { COLORS } from '../lib/supabase';
import { hex, useAdvance, useConn, useFinishGame, useGames, useHostGame, usePlayers, useQuestions, useReveals, useStartGame, useTallies } from '../lib/spacetime';

export function HostLaunch() {
  const { id } = useParams();
  const nav = useNavigate();
  const conn = useConn();
  const { rows: games } = useGames();
  const hostGame = useHostGame();
  const [error, setError] = useState('');
  const [showQ, setShowQ] = useState(true);

  useEffect(() => {
    const mine = games.find(g => hex(g.host) === hex(conn.identity) && g.phase !== 'finished');
    if (mine) nav(`/host/live/${mine.pin}`, { replace: true });
  }, [games, conn.identity, nav]);

  async function host(e: FormEvent) {
    e.preventDefault();
    setError('');
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return nav('/auth');
    const { data: kahoot } = await supabase.from('kahoots').select('*').eq('id', id).single();
    const { data: questions } = await supabase.from('questions').select('*').eq('kahoot_id', id).order('position');
    if (!kahoot || !questions?.length) {
      setError('This kahoot has no questions');
      return;
    }
    const ids = questions.map(q => q.id);
    const { data: options } = await supabase.from('options').select('*').in('question_id', ids);
    const { data: typeAnswers } = await supabase.from('type_answers').select('*').in('question_id', ids);
    try {
      await hostGame({
        title: kahoot.title,
        kahootId: kahoot.id,
        showQuestionOnPlayer: showQ,
        questions: packQuestions(questions, options ?? [], typeAnswers ?? []),
      });
    } catch (err: any) {
      setError(err.message ?? String(err));
    }
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
          <button className="btn btn-primary" type="submit" disabled={!conn.isActive} style={{ marginTop: 16 }}>
            Create lobby
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
  const startGame = useStartGame();
  const advance = useAdvance();
  const finishGame = useFinishGame();
  const { rows: games } = useGames();
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

  useEffect(() => {
    if (game?.phase === 'lobby') startLobbyMusic();
    else stopLobbyMusic();
    return () => stopLobbyMusic();
  }, [game?.phase]);

  useEffect(() => {
    if (!game || saved || (game.phase !== 'podium' && game.phase !== 'finished')) return;
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      const { data: report } = await supabase
        .from('game_reports')
        .insert({
          kahoot_id: game.kahootId || null,
          host_id: user.user.id,
          title: game.title,
          pin: game.pin,
          player_count: plist.length,
          question_count: game.questionCount,
        })
        .select()
        .single();
      if (report) {
        await supabase.from('report_players').insert(
          plist.map((p, i) => ({
            report_id: report.id,
            nickname: p.nickname,
            score: p.score,
            correct_count: p.correctCount,
            rank: i + 1,
          }))
        );
      }
      setSaved(true);
    })();
  }, [game?.phase, saved]);

  if (!game) return <div className="hero">Connecting to lobby…</div>;

  const opts = q ? [q.option0, q.option1, q.option2, q.option3].slice(0, q.optionCount) : [];
  const counts = rev ? [rev.count0, rev.count1, rev.count2, rev.count3] : [0, 0, 0, 0];
  const maxC = Math.max(1, ...counts);

  return (
    <div className="lobby">
      <TimerBar started={game.phaseStartedAt.microsSinceUnixEpoch} duration={game.phaseDurationMs} />
      {game.phase === 'lobby' && (
        <>
          <div className="lobby-top">
            <div className="pin-board">
              <div className="label">Join at {window.location.host} with PIN</div>
              <div className="big">{game.pin}</div>
              <div>{plist.length} players</div>
            </div>
            <div className="pin-board">
              <QRCodeSVG value={joinUrl} size={160} />
            </div>
          </div>
          <div className="nicks">
            {plist.map(p => (
              <span className="nick" key={hex(p.identity)}>
                {p.nickname}
              </span>
            ))}
          </div>
          <div style={{ padding: 24 }}>
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => startGame({ gameId: game.id })}>
              Start
            </button>
          </div>
        </>
      )}
      {game.phase === 'get_ready' && (
        <div className="hero">
          <h1>Question {game.questionIndex + 1} of {game.questionCount}</h1>
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
            <button className="btn btn-dark" onClick={() => finishGame({ gameId: game.id })}>
              End game
            </button>
          </div>
        </div>
      )}
      {game.phase !== 'lobby' && game.phase !== 'finished' && (
        <div style={{ padding: 16 }}>
          <button className="btn btn-dark" onClick={() => advance({ gameId: game.id })}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
