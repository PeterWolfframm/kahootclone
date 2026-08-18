import { FormEvent, useEffect, useMemo, useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

type Follow = { id: string; title: string; feed_url: string; folder: string };
type Item = { id: string; title: string; link: string; date: number; snippet: string; feed: string; folder: string };

const PRESETS = [
  { title: 'Hacker News', path: 'hackernews/best' },
  { title: 'GitHub RSSHub issues', path: 'github/issue/DIYgod/RSSHub' },
  { title: 'BBC World', path: 'bbc/world' },
];

function asArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

async function parseFeed(feedUrl: string, feedTitle: string, folder: string): Promise<Item[]> {
  const res = await fetch(feedUrl);
  if (!res.ok) throw new Error(`Feed failed (${res.status})`);
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const doc = parser.parse(xml);
  const channel = doc.rss?.channel ?? doc.feed;
  const entries = asArray(channel?.item ?? channel?.entry);
  return entries.map((entry: any, i: number) => {
    const title = String(entry.title?.['#text'] ?? entry.title ?? 'Untitled');
    const link = String(entry.link?.href ?? entry.link ?? entry.guid ?? '');
    const date = Date.parse(entry.pubDate ?? entry.published ?? entry.updated ?? '') || Date.now() - i;
    const snippet = String(entry.description ?? entry.summary ?? entry.content ?? '').replace(/<[^>]+>/g, '').slice(0, 280);
    return { id: `${feedUrl}::${link || title}`, title, link, date, snippet, feed: feedTitle, folder };
  });
}

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [follows, setFollows] = useState<Follow[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [read, setRead] = useState<Set<string>>(new Set());
  const [q, setQ] = useState('');
  const [folder, setFolder] = useState('all');
  const [path, setPath] = useState('hackernews/best');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user?.id ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  async function loadFollows(uid: string) {
    const { data } = await supabase.from('rss_follows').select('*').eq('user_id', uid).order('created_at');
    setFollows((data as Follow[]) ?? []);
    const { data: reads } = await supabase.from('rss_items_read').select('item_id').eq('user_id', uid);
    setRead(new Set((reads ?? []).map(r => r.item_id)));
  }

  useEffect(() => {
    if (userId) loadFollows(userId);
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const collected: Item[] = [];
      for (const f of follows) {
        try {
          collected.push(...(await parseFeed(f.feed_url, f.title, f.folder)));
        } catch (e) {
          console.warn(f.feed_url, e);
        }
      }
      if (!cancelled) setItems(collected.sort((a, b) => b.date - a.date));
    })();
    return () => {
      cancelled = true;
    };
  }, [follows]);

  const folders = useMemo(() => ['all', ...new Set(follows.map(f => f.folder))], [follows]);
  const visible = items.filter(it => {
    if (folder !== 'all' && it.folder !== folder) return false;
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return it.title.toLowerCase().includes(s) || it.snippet.toLowerCase().includes(s) || it.feed.toLowerCase().includes(s);
  });
  const unread = visible.filter(it => !read.has(it.id)).length;

  async function sign(e: FormEvent, mode: 'in' | 'up') {
    e.preventDefault();
    setError('');
    const fn = mode === 'in' ? supabase.auth.signInWithPassword({ email, password }) : supabase.auth.signUp({ email, password });
    const { error: err } = await fn;
    if (err) setError(err.message);
  }

  async function follow(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setBusy(true);
    setError('');
    const feed_url = path.startsWith('http') ? path : `/r/${path.replace(/^\/+/, '')}`;
    const title = PRESETS.find(p => p.path === path)?.title ?? path;
    const { error: err } = await supabase.from('rss_follows').insert({ user_id: userId, title, feed_url, folder: 'Following' });
    setBusy(false);
    if (err) setError(err.message);
    else loadFollows(userId);
  }

  async function unfollow(id: string) {
    if (!userId) return;
    await supabase.from('rss_follows').delete().eq('id', id);
    loadFollows(userId);
  }

  async function mark(item: Item) {
    if (!userId) return;
    setRead(s => new Set(s).add(item.id));
    await supabase.from('rss_items_read').upsert({ user_id: userId, item_id: item.id });
    if (item.link) window.open(item.link, '_blank');
  }

  if (!userId) {
    return (
      <div className="auth">
        <h1>Reader</h1>
        <p>Follow RSSHub routes and RSS feeds. Timeline, unread, search.</p>
        <form onSubmit={e => sign(e, 'in')}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <div className="err">{error}</div>}
          <button type="submit">Log in</button>
          <button type="button" onClick={e => sign(e as any, 'up')}>
            Sign up
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="shell">
      <aside>
        <h1>Reader</h1>
        <div className="muted">{unread} unread</div>
        {folders.map(f => (
          <button key={f} className={folder === f ? 'on' : ''} onClick={() => setFolder(f)}>
            {f}
          </button>
        ))}
        <h2>Follows</h2>
        {follows.map(f => (
          <div className="follow" key={f.id}>
            <span>{f.title}</span>
            <button onClick={() => unfollow(f.id)}>×</button>
          </div>
        ))}
        <form onSubmit={follow}>
          <input value={path} onChange={e => setPath(e.target.value)} placeholder="hackernews/best or full URL" />
          <div className="presets">
            {PRESETS.map(p => (
              <button type="button" key={p.path} onClick={() => setPath(p.path)}>
                {p.title}
              </button>
            ))}
          </div>
          <button disabled={busy} type="submit">
            Follow
          </button>
          {error && <div className="err">{error}</div>}
        </form>
        <button className="ghost" onClick={() => supabase.auth.signOut()}>
          Log out
        </button>
        <a href="/r/">RSSHub engine</a>
      </aside>
      <main>
        <input className="search" placeholder="Search titles…" value={q} onChange={e => setQ(e.target.value)} />
        {visible.map(it => (
          <article key={it.id} className={read.has(it.id) ? 'read' : ''} onClick={() => mark(it)}>
            <div className="meta">
              {it.feed} · {new Date(it.date).toLocaleString()}
            </div>
            <h3>{it.title}</h3>
            <p>{it.snippet}</p>
          </article>
        ))}
        {visible.length === 0 && <p className="muted">Follow a route to fill your timeline.</p>}
      </main>
    </div>
  );
}
