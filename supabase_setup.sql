-- 1. Profiles (Linked to Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  grade SMALLINT DEFAULT 1,
  age SMALLINT,
  school TEXT,
  state TEXT,
  contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subject Stats
CREATE TABLE public.subject_stats (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL,
  trophies INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, subject_id)
);

-- 3. Wallet
CREATE TABLE public.wallets (
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  coins INTEGER DEFAULT 120,
  gems INTEGER DEFAULT 8,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Allow users to read/write their own data)
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own stats" ON public.subject_stats FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can update their own stats" ON public.subject_stats FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can update their own wallet" ON public.wallets FOR ALL USING (auth.uid() = profile_id);

-- 6. Friend Rooms (shared across Vercel serverless instances)
-- Replaces the old UUID-linked schema so mock accounts can host/join.
DROP TABLE IF EXISTS public.friend_rooms CASCADE;

CREATE TABLE public.friend_rooms (
  code TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX friend_rooms_updated_at_idx ON public.friend_rooms (updated_at DESC);

ALTER TABLE public.friend_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view friend rooms" ON public.friend_rooms
  FOR SELECT USING (true);
CREATE POLICY "Anyone can create friend rooms" ON public.friend_rooms
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update friend rooms" ON public.friend_rooms
  FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete friend rooms" ON public.friend_rooms
  FOR DELETE USING (true);

-- Optional realtime (lobby polling also works without this)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE friend_rooms;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
