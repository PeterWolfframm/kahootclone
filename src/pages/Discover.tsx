import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type KahootRow } from '../lib/supabase';
import { TopBar } from '../components/TopBar';

export function Discover() {
  const [rows, setRows] = useState<KahootRow[]>([]);
  useEffect(() => {
    supabase.from('kahoots').select('*').eq('visibility', 'public').order('updated_at', { ascending: false }).then(({ data }) => {
      setRows((data as KahootRow[]) ?? []);
    });
  }, []);

  return (
    <div className="page">
      <TopBar />
      <div className="library">
        <h1>Discover</h1>
        <p className="muted">Public kahoots you can host.</p>
        <div className="kahoot-grid">
          {rows.map(k => (
            <Link className="kahoot-card" key={k.id} to={`/edit/${k.id}`}>
              {k.cover_url ? <img src={k.cover_url} alt="" /> : <div className="cover" />}
              <div className="body">
                <h3>{k.title}</h3>
                <div style={{ color: '#666', fontSize: 13 }}>{k.description || 'Public kahoot'}</div>
              </div>
            </Link>
          ))}
          {rows.length === 0 && <p>No public kahoots yet. Create one and set visibility to public.</p>}
        </div>
      </div>
    </div>
  );
}
