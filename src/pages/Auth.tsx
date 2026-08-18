import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TopBar } from '../components/TopBar';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const fn =
      mode === 'in'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password, options: { data: { display_name: email.split('@')[0] } } });
    const { error: err } = await fn;
    if (err) setError(err.message);
    else nav('/library');
  }

  return (
    <div className="page">
      <TopBar />
      <div className="hero">
        <form className="card" onSubmit={submit}>
          <h1>{mode === 'in' ? 'Log in' : 'Create account'}</h1>
          <p>Hosts sign in to create kahoots and run live games.</p>
          <label className="label">Email</label>
          <input className="field" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="label">Password</label>
          <input className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" type="submit">
            {mode === 'in' ? 'Log in' : 'Sign up'}
          </button>
          <p className="center" style={{ marginTop: 14 }}>
            <button type="button" className="btn-ghost" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>
              {mode === 'in' ? 'Need an account?' : 'Already have an account?'}
            </button>
          </p>
          <p className="center">
            <Link to="/">Back to join</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
