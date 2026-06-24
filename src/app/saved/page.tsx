'use client';

import { supabase } from '@/lib/supabase';
import ResourceCard from '@/components/ResourceCard';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SavedPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSaved() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      // Fetch bookmarks and join with resources
      const { data } = await supabase
        .from('bookmarks')
        .select(`
          resource_id,
          resources (
            *,
            profiles:user_id (full_name, avatar_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        // Flatten the array
        const savedResources = data.map(b => b.resources).filter(Boolean);
        setResources(savedResources);
      }
      setLoading(false);
    }
    loadSaved();
  }, []);

  if (loading) {
    return (
      <main className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>Loading your saved workflows...</h2>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>You must be signed in to view saved workflows.</h2>
        <Link href="/auth" className="btn-primary" style={{ display: 'inline-block', marginTop: '16px' }}>Sign In</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="glow-bg" />
      <header style={{ padding: '60px 0', textAlign: 'center', borderBottom: '1px solid var(--border-color)', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>My Saved Workflows</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your private library of high-impact strategies.
        </p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '80px' }}>
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
            You haven't saved any workflows yet.
          </div>
        )}
      </section>
    </main>
  );
}
