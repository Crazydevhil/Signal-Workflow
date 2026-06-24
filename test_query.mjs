import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase
    .from('resources')
    .select('*, profiles!user_id(full_name, avatar_url)')
    .eq('is_approved', true);
    
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
