import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If credentials are missing, we use placeholder values to avoid crashing at initialization.
// The actual queries will fail gracefully later if the credentials aren't provided.
const isMissingCredentials = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase');

if (isMissingCredentials) {
    console.error('Supabase credentials missing. Check your .env file.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
