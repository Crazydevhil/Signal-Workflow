export const revalidate = 0;

import { supabase } from '@/lib/supabase';
import ResourceCard from '@/components/ResourceCard';
import Link from 'next/link';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  // 1. Fetch Profile Data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single();

  // 2. Fetch User's Workflows
  const { data: resources } = await supabase
    .from('resources')
    .select(`
      *,
      profiles:user_id (full_name, avatar_url)
    `)
    .eq('user_id', params.id)
    .eq('is_approved', true)
    .order('upvotes_count', { ascending: false });

  if (!profile) {
    return (
      <main className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>Profile Not Found</h2>
        <Link href="/" style={{ color: 'var(--accent-color)' }}>Return Home</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="glow-bg" />
      
      {/* Profile Header */}
      <header style={{ padding: '60px 0', textAlign: 'center', borderBottom: '1px solid var(--border-color)', marginBottom: '40px' }}>
        {profile.avatar_url ? (
          <img 
            src={profile.avatar_url} 
            alt={profile.full_name} 
            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '16px', border: '2px solid var(--accent-color)' }} 
          />
        ) : (
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--border-color)', margin: '0 auto 16px' }} />
        )}
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{profile.full_name || 'Anonymous Creator'}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {resources?.length || 0} Verified Workflows
        </p>
      </header>

      {/* User's Workflows Feed */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '80px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Portfolio</h2>
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
            This user hasn't published any approved workflows yet.
          </div>
        )}
      </section>
    </main>
  );
}
