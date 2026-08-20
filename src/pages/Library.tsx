import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, type KahootRow } from '../lib/supabase';
import { TopBar } from '../components/TopBar';
import { Button, Card, Tag } from '../design-system';

export function Library() {
  const [rows, setRows] = useState<KahootRow[]>([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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
          <Button variant="primary" onClick={create}>
            Create
          </Button>
        </div>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : rows.length === 0 ? (
          <p>
            No kahoots yet.{' '}
            <Button variant="ghost" size="sm" type="button" onClick={create}>
              Create one
            </Button>{' '}
            to host a live game.
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
                    <Tag>{k.visibility}</Tag>
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
