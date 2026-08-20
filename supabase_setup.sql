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

-- 6. Friend Rooms
CREATE TABLE public.friend_rooms (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  host_id UUID REFERENCES public.profiles(id) NOT NULL,
  guest_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'waiting',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.friend_rooms ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view rooms (to join)
CREATE POLICY "Anyone can view rooms" ON public.friend_rooms FOR SELECT USING (true);
-- Allow everyone to create rooms
CREATE POLICY "Anyone can insert rooms" ON public.friend_rooms FOR INSERT WITH CHECK (true);
-- Allow host and guest to update rooms
CREATE POLICY "Host and guest can update rooms" ON public.friend_rooms FOR UPDATE USING (
  auth.uid() = host_id OR auth.uid() = guest_id OR guest_id IS NULL
);

-- 7. Enable Realtime for Friend Rooms
ALTER publication supabase_realtime ADD TABLE friend_rooms;
