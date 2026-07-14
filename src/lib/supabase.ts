import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Environment variables VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY belum diatur.');
}

let finalUrl = supabaseUrl;

if (finalUrl && !finalUrl.startsWith('http')) {
  finalUrl = `https://${finalUrl}`;
}

// Gunakan dummy url jika kosong untuk mencegah error crash saat build, 
// tapi berikan peringatan.
export const supabase = createClient(
  finalUrl || 'https://xxxxxxxxxxxxxxxxxxxx.supabase.co', 
  supabaseAnonKey || 'dummy-key'
);
