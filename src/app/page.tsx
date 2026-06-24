export const revalidate = 0; // Force dynamic rendering

import { supabase } from '@/lib/supabase';
import ResourceCard from '@/components/ResourceCard';
import Link from 'next/link';

const CATEGORIES = [
  'All',
  'Sales & Leads',
  'Marketing & SEO',
  'Customer Support',
  'Operations & Admin',
  'Engineering & Data',
  'Content Creation'
];

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const currentCategory = searchParams.category || 'All';

  let query = supabase
    .from('resources')
    .select(`
      *,
      profiles:user_id (full_name, avatar_url)
    `)
    .eq('is_approved', true)
    .order('upvotes_count', { ascending: false });

  if (currentCategory !== 'All') {
    query = query.eq('category', currentCategory);
  }

  const { data: resources } = await query;

  return (
    <main className="container">
      <div className="glow-bg" />
      <header style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Signal Workflows
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 32px' }}>
          The proof-of-work board for AI. Discover verified workflows that actually drive business results, not just a list of tools.
        </p>
        <Link href="/submit" className="btn-primary" style={{ display: 'inline-block' }}>
          Submit Workflow
        </Link>
      </header>

      {/* Category Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
        {CATEGORIES.map(cat => {
          const isActive = currentCategory === cat;
          return (
            <Link 
              key={cat} 
              href={cat === 'All' ? '/' : `/?category=${encodeURIComponent(cat)}`}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '500',
                textDecoration: 'none',
                background: isActive ? 'var(--accent-color)' : 'var(--bg-secondary)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: isActive ? 'none' : '1px solid var(--border-color)',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </Link>
          )
        })}
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '80px' }}>
        {resources && resources.length > 0 ? (
          resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
            No workflows approved in this category yet. Be the first to submit!
          </div>
        )}
      </section>
    </main>
  );
}
