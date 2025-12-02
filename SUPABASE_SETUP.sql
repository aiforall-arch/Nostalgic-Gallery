-- Supabase SQL to create the media table
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  title TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  description TEXT,
  aspect_ratio TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  liked BOOLEAN DEFAULT FALSE,
  poetic_caption TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add columns if they don't exist
ALTER TABLE media ADD COLUMN IF NOT EXISTS uploaded_by TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS liked BOOLEAN DEFAULT FALSE;
ALTER TABLE media ADD COLUMN IF NOT EXISTS poetic_caption TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);

-- Disable RLS for public anonymous access (simpler for demo)
-- If you need more control, use the RLS policies below
ALTER TABLE media DISABLE ROW LEVEL SECURITY;

-- Uncomment the lines below if you want to use RLS instead

-- -- Set up RLS (Row Level Security)
-- ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- -- Drop existing policies if they exist
-- DROP POLICY IF EXISTS "Allow public read" ON media;
-- DROP POLICY IF EXISTS "Allow public insert" ON media;
-- DROP POLICY IF EXISTS "Allow public update" ON media;
-- DROP POLICY IF EXISTS "Allow public delete" ON media;

-- -- Allow public read access
-- CREATE POLICY "Allow public read" ON media
--   FOR SELECT USING (true);

-- -- Allow public insert
-- CREATE POLICY "Allow public insert" ON media
--   FOR INSERT WITH CHECK (true);

-- -- Allow public update for likes and captions
-- CREATE POLICY "Allow public update" ON media
--   FOR UPDATE USING (true) WITH CHECK (true);

-- -- Allow public delete
-- CREATE POLICY "Allow public delete" ON media
--   FOR DELETE USING (true);
