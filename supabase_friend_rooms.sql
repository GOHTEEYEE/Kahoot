-- Friend rooms only — run in Supabase SQL Editor if the rest of supabase_setup.sql already ran.
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
