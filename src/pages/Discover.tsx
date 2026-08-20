import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type KahootRow } from '../lib/supabase';
import { TopBar } from '../components/TopBar';
import { Card } from '../design-system';

export function Discover() {
  const [rows, setRows] = useState<KahootRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from('kahoots')
      .select('*')
      .eq('visibility', 'public')
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setRows((data as KahootRow[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      <TopBar />
      <div className="library">
        <h1>Discover</h1>
        <p className="muted">Public kahoots you can host.</p>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : rows.length === 0 ? (
          <p>
            No public kahoots yet.{' '}
            <Link to="/auth">Log in</Link> to create one, or go to your <Link to="/library">library</Link>.
          </p>
        ) : (
          <div className="kahoot-grid">
            {rows.map(k => (
              <Link key={k.id} to={`/edit/${k.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card interactive padding={0} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {k.cover_url ? (
                    <img src={k.cover_url} alt="" style={{ height: 120, width: '100%', objectFit: 'cover', borderBottom: 'var(--border-width-sm) solid var(--black)' }} />
                  ) : (
                    <div className="cover" />
                  )}
                  <div style={{ padding: '12px 16px 16px' }}>
                    <h3 style={{ font: 'var(--font-h4)', margin: '0 0 8px' }}>{k.title}</h3>
                    <div style={{ color: 'var(--text-muted)', font: 'var(--font-body-sm)' }}>{k.description || 'Public kahoot'}</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
