'use client';

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ResourceCard({ resource }: { resource: any }) {
  const [upvotes, setUpvotes] = useState(resource.upvotes_count);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        checkIfUpvoted(user.id);
        checkIfBookmarked(user.id);
      }
    });
  }, []);

  const checkIfUpvoted = async (uid: string) => {
    const { data } = await supabase
      .from('upvotes')
      .select('id')
      .eq('resource_id', resource.id)
      .eq('user_id', uid)
      .single();
    if (data) setHasUpvoted(true);
  };

  const checkIfBookmarked = async (uid: string) => {
    const { data } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('resource_id', resource.id)
      .eq('user_id', uid)
      .single();
    if (data) setHasBookmarked(true);
  };

  const handleUpvote = async () => {
    if (!userId) {
      alert("Please sign in to upvote workflows.");
      return;
    }

    if (hasUpvoted) {
      setUpvotes((prev: number) => prev - 1);
      setHasUpvoted(false);
      await supabase
        .from('upvotes')
        .delete()
        .eq('resource_id', resource.id)
        .eq('user_id', userId);
    } else {
      setUpvotes((prev: number) => prev + 1);
      setHasUpvoted(true);
      await supabase
        .from('upvotes')
        .insert([{ resource_id: resource.id, user_id: userId }]);
    }
  };

  const handleBookmark = async () => {
    if (!userId) {
      alert("Please sign in to save workflows.");
      return;
    }

    if (hasBookmarked) {
      setHasBookmarked(false);
      await supabase
        .from('bookmarks')
        .delete()
        .eq('resource_id', resource.id)
        .eq('user_id', userId);
    } else {
      setHasBookmarked(true);
      await supabase
        .from('bookmarks')
        .insert([{ resource_id: resource.id, user_id: userId }]);
    }
  };

  const authorName = resource.profiles?.full_name || 'Anonymous Creator';
  const authorAvatar = resource.profiles?.avatar_url;

  return (
    <div className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, paddingRight: '20px' }}>
        
        {/* Header: Category & Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {resource.category || 'Uncategorized'}
          </div>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          <Link href={`/profile/${resource.user_id}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
            ) : (
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--border-color)' }} />
            )}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500' }}>{authorName}</span>
          </Link>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', lineHeight: '1.3' }}>
          {resource.claim}
        </h2>
        
        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>
          Tool: {resource.title}
        </div>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
          {resource.description}
        </p>
        
        <div style={{ display: 'inline-block', background: 'rgba(120, 119, 198, 0.1)', color: 'var(--accent-color)', padding: '6px 12px', borderRadius: '4px', fontWeight: '600', fontSize: '0.9rem' }}>
          Impact: {resource.impressive_numbers}
        </div>
        
        {resource.url && resource.url.trim() !== '' && (
          <div style={{ marginTop: '16px' }}>
            <a href={resource.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textDecoration: 'underline' }}>
              View Workflow Details ↗
            </a>
          </div>
        )}
      </div>
      
      {/* Sidebar: Upvote & Bookmark */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div 
          onClick={handleUpvote}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            background: hasUpvoted ? 'rgba(120, 119, 198, 0.2)' : 'var(--bg-tertiary)', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            border: `1px solid ${hasUpvoted ? 'var(--accent-color)' : 'var(--border-color)'}`, 
            minWidth: '60px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: hasUpvoted ? 'var(--accent-color)' : 'var(--text-secondary)' }}>▲</span>
          <span style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '4px', color: hasUpvoted ? 'var(--accent-color)' : 'var(--text-primary)' }}>{upvotes}</span>
        </div>

        <div 
          onClick={handleBookmark}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'var(--bg-tertiary)', 
            padding: '8px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)', 
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: hasBookmarked ? 'var(--accent-color)' : 'var(--text-secondary)'
          }}
          title={hasBookmarked ? "Remove Bookmark" : "Save Workflow"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={hasBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
