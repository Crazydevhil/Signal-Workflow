'use client';

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeaderAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      {user ? (
        <>
          <Link href="/saved" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            My Saved
          </Link>
          <Link href={`/profile/${user.id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            My Profile
          </Link>
          <button 
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer', padding: 0 }}
          >
            Log Out
          </button>
          <Link href="/submit" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
            + Submit
          </Link>
        </>
      ) : (
        <>
          <Link href="/auth" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            Log In
          </Link>
          <Link href="/auth" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
            + Submit
          </Link>
        </>
      )}
    </div>
  );
}
