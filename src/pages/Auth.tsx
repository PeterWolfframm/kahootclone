import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TopBar } from '../components/TopBar';
import { Button, Input } from '../design-system';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);
    const fn =
      mode === 'in'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password, options: { data: { display_name: email.split('@')[0] } } });
    const { data, error: err } = await fn;
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (mode === 'up' && !data.session) {
      setInfo('Check your email to confirm your account.');
      return;
    }
    nav('/library');
  }

  async function forgot() {
    setError('');
    setInfo('');
    if (!email.trim()) {
      setError('Enter your email first.');
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setBusy(false);
    if (err) setError(err.message);
    else setInfo('Check your email for a reset link.');
  }

  return (
    <div className="page">
      <TopBar />
      <div className="hero">
        <form className="card" onSubmit={submit}>
          <h1>{mode === 'in' ? 'Log in' : 'Create account'}</h1>
          <p>Hosts sign in to create kahoots and run live games.</p>
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
            style={{ marginBottom: 14 }}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
            autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
            style={{ marginBottom: 14 }}
          />
          {error && <div className="error">{error}</div>}
          {info && <div className="info">{info}</div>}
          <Button type="submit" variant="primary" size="lg" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Please wait…' : mode === 'in' ? 'Log in' : 'Sign up'}
          </Button>
          {mode === 'in' && (
            <p className="center" style={{ marginTop: 12 }}>
              <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={forgot}>
                Forgot password?
              </Button>
            </p>
          )}
          <p className="center" style={{ marginTop: 14 }}>
            <Button type="button" variant="ghost" size="sm" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>
              {mode === 'in' ? 'Need an account?' : 'Already have an account?'}
            </Button>
          </p>
          <p className="center">
            <Link to="/">Back to join</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
