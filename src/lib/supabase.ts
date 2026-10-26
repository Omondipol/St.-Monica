import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kobpqfbgpiwqdmehawsi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Q-u99MCnv56Bt01_Nc7HKQ_axz-I3UB';

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseAnonKey !== '' &&
    !supabaseAnonKey.includes('placeholder')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
