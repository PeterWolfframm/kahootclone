import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/TopBar';

export function Home() {
  const [pin, setPin] = useState('');
  const nav = useNavigate();

  function join(e: FormEvent) {
    e.preventDefault();
    const clean = pin.replace(/\D/g, '');
    if (clean.length >= 6) nav(`/play/${clean}`);
  }

  return (
    <div className="page">
      <TopBar />
      <div className="hero">
        <form className="card" onSubmit={join}>
          <h1>Join a game</h1>
          <p>Enter the game PIN from the host screen.</p>
          <div className="label">Game PIN</div>
          <input
            className="pin"
            inputMode="numeric"
            maxLength={8}
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="0000000"
            autoFocus
          />
          <button className="btn btn-primary" type="submit">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
