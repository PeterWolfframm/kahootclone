import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { supabase } from '../lib/supabase';

type Report = {
  id: string;
  title: string;
  pin: string | null;
  played_at: string;
  player_count: number;
  question_count: number;
};

export function Reports() {
  const [rows, setRows] = useState<Report[] | null>(null);
  const nav = useNavigate();
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return nav('/auth');
      const { data: reports } = await supabase.from('game_reports').select('*').order('played_at', { ascending: false });
      setRows((reports as Report[]) ?? []);
    });
  }, [nav]);
  return (
    <div className="page">
      <TopBar />
      <div className="library">
        <h1>Reports</h1>
        {rows === null ? (
          <p className="muted">Loading…</p>
        ) : rows.length === 0 ? (
          <p>
            No games yet. Host a kahoot from your <Link to="/library">library</Link> to see results here.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Kahoot</th>
                <th>PIN</th>
                <th>Players</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>
                    <Link to={`/reports/${r.id}`}>{r.title}</Link>
                  </td>
                  <td>{r.pin}</td>
                  <td>{r.player_count}</td>
                  <td>{new Date(r.played_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function ReportDetail() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [players, setPlayers] = useState<Array<{ nickname: string; score: number; correct_count: number; rank: number }>>([]);
  useEffect(() => {
    supabase.from('game_reports').select('*').eq('id', id).single().then(({ data }) => setTitle(data?.title ?? 'Report'));
    supabase.from('report_players').select('*').eq('report_id', id).order('rank').then(({ data }) => setPlayers(data ?? []));
  }, [id]);
  return (
    <div className="page">
      <TopBar />
      <div className="library">
        <h1>{title}</h1>
        {players.length === 0 ? (
          <p className="muted">No player scores recorded.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Correct</th>
              </tr>
            </thead>
            <tbody>
              {players.map(p => (
                <tr key={p.rank + p.nickname}>
                  <td>{p.rank}</td>
                  <td>{p.nickname}</td>
                  <td>{p.score}</td>
                  <td>{p.correct_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
