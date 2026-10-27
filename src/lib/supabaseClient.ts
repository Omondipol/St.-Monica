import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta.env?.VITE_SUPABASE_URL as string) ||
  'https://pzvpbixdefvztffjyrye.supabase.co';

const supabaseAnonKey =
  (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) ||
  'sb_publishable_qI6m1zfFhj0-PmK6aVp89w_pDGhrt33';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseAnonKey !== '' &&
    !supabaseAnonKey.includes('placeholder')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
