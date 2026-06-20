import { createClient } from '@supabase/supabase-js';

// Use placeholder fallbacks so client initialization never crashes the frontend bundle if env vars are missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_placeholder_token_to_prevent_initialization_crash.dummy_placeholder_token_to_prevent_initialization_crash';

const isMissing = !import.meta.env.VITE_SUPABASE_URL || 
                   import.meta.env.VITE_SUPABASE_URL.includes('your-project-id') || 
                   !import.meta.env.VITE_SUPABASE_ANON_KEY;

if (isMissing) {
  console.warn(
    'Supabase environment variables are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your deployment environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
