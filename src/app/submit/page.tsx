'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    claim: '',
    description: '',
    impressive_numbers: '',
    category: 'Operations & Admin'
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/auth');
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('resources').insert([
        {
          user_id: user.id,
          title: formData.title,
          url: formData.url,
          claim: formData.claim,
          description: formData.description,
          impressive_numbers: formData.impressive_numbers
        }
      ]);
      
      if (error) throw error;
      
      alert('Workflow submitted successfully! It will appear on the board once approved by moderation.');
      router.push('/');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) return null;

  return (
    <main className="container" style={{ padding: '60px 20px', maxWidth: '600px' }}>
      <div className="glow-bg" />
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Submit Workflow</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Share a verified AI workflow that actually drives business impact.
      </p>

      <form onSubmit={handleSubmit} className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Tool / Workflow Name *</label>
          <input 
            required 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="e.g. Zendesk + Claude 3 Routing" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'white' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>The Claim *</label>
          <input 
            required 
            type="text" 
            name="claim" 
            value={formData.claim} 
            onChange={handleChange}
            placeholder="e.g. Automated Tier-1 Customer Support by 80%" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'white' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Impressive Numbers / Impact *</label>
          <input 
            required 
            type="text" 
            name="impressive_numbers" 
            value={formData.impressive_numbers} 
            onChange={handleChange}
            placeholder="e.g. Saved 15 hours/week" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'white' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Category *</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'white', appearance: 'none' }}
          >
            <option value="Sales & Leads">Sales & Leads</option>
            <option value="Marketing & SEO">Marketing & SEO</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Operations & Admin">Operations & Admin</option>
            <option value="Engineering & Data">Engineering & Data</option>
            <option value="Content Creation">Content Creation</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Relevant Link (Optional)</label>
          <input 
            type="url" 
            name="url" 
            value={formData.url} 
            onChange={handleChange}
            placeholder="https://..." 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'white' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Detailed Description *</label>
          <textarea 
            required 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            placeholder="Explain exactly how you built this workflow and how others can replicate it..." 
            rows={5}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'white', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '10px' }}>
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </form>
    </main>
  );
}
