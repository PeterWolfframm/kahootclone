import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { Button } from '../design-system';

export function Home() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();
  const clean = pin.replace(/\D/g, '');
  const valid = clean.length === 7;

  function join(e: FormEvent) {
    e.preventDefault();
    if (!valid) {
      setError('Enter the 7-digit PIN from the host screen.');
      return;
    }
    setError('');
    nav(`/play/${clean}`);
  }

  return (
    <div className="page">
      <TopBar />
      <div className="hero">
        <form className="card" onSubmit={join}>
          <h1>Join a game</h1>
          <p>Enter the game PIN from the host screen.</p>
          <label className="label" htmlFor="pin">
            Game PIN
          </label>
          <input
            id="pin"
            className="pin"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={7}
            value={pin}
            onChange={e => {
              setPin(e.target.value.replace(/\D/g, '').slice(0, 7));
              setError('');
            }}
            placeholder="0000000"
            autoComplete="off"
            autoFocus
          />
          {error && <div className="error">{error}</div>}
          <Button type="submit" variant="primary" size="lg" disabled={!valid} style={{ width: '100%' }}>
            Enter
          </Button>
        </form>
      </div>
    </div>
  );
}
