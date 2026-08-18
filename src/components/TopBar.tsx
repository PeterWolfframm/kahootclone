import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="topbar">
      <Link className="brand" to="/">
        play!
      </Link>
      <nav className="nav">
        <NavLink to="/discover">Discover</NavLink>
        {user ? (
          <>
            <NavLink to="/library">My kahoots</NavLink>
            <NavLink to="/reports">Reports</NavLink>
            <button
              className="btn-ghost"
              onClick={() => supabase.auth.signOut()}
            >
              Log out
            </button>
          </>
        ) : (
          <NavLink to="/auth">Log in</NavLink>
        )}
      </nav>
    </header>
  );
}
