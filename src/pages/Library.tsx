import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, type KahootRow } from '../lib/supabase';
import { TopBar } from '../components/TopBar';

export function Library() {
  const [rows, setRows] = useState<KahootRow[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        nav('/auth');
        return;
      }
      const { data: kahoots } = await supabase
        .from('kahoots')
        .select('*')
        .eq('owner_id', data.user.id)
        .order('updated_at', { ascending: false });
      setRows((kahoots as KahootRow[]) ?? []);
    });
  }, [nav]);

  async function create() {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const { data, error } = await supabase
      .from('kahoots')
      .insert({ owner_id: user.user.id, title: 'Untitled kahoot' })
      .select()
      .single();
    if (error) {
      alert(error.message);
      return;
    }
    nav(`/edit/${data.id}`);
  }

  return (
    <div className="page">
      <TopBar />
      <div className="library">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>My kahoots</h1>
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={create}>
            Create
          </button>
        </div>
        <div className="kahoot-grid">
          {rows.map(k => (
            <Link className="kahoot-card" key={k.id} to={`/edit/${k.id}`}>
              {k.cover_url ? <img src={k.cover_url} alt="" /> : <div className="cover" />}
              <div className="body">
                <h3>{k.title}</h3>
                <div className="muted" style={{ color: '#666', fontSize: 13 }}>
                  {k.visibility}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
