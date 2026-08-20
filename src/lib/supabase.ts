import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Please check .env.local");
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
