import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

if (!supabaseConfigured && typeof window !== 'undefined') {
  console.warn('Supabase credentials missing. Using local mock accounts only.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  grade: number;
  age: number;
  school: string;
  state: string;
  contact: string;
  created_at: string;
};

export type SubjectStats = {
  profile_id: string;
  subject_id: string;
  trophies: number;
  wins: number;
  losses: number;
  draws: number;
  updated_at: string;
};

export type Wallet = {
  profile_id: string;
  coins: number;
  gems: number;
  updated_at: string;
};
