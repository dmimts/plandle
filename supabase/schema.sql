-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- LESSONS TABLE
-- Stores individual lessons for specific weeks
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_key TEXT NOT NULL, -- e.g. "2024-W42" (ISO week)
  day INTEGER NOT NULL CHECK (day >= 0 AND day <= 5), -- 0=Monday, 5=Saturday
  subject TEXT NOT NULL,
  teacher TEXT,
  room TEXT,
  start_time TEXT NOT NULL, -- "HH:MM" format
  end_time TEXT NOT NULL,   -- "HH:MM" format
  color TEXT NOT NULL DEFAULT '#0058be',
  notes TEXT,
  is_cancelled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast week lookups
CREATE INDEX IF NOT EXISTS idx_lessons_week_key ON lessons(week_key);
CREATE INDEX IF NOT EXISTS idx_lessons_day ON lessons(day);

-- ============================================================
-- SHARE CODES TABLE
-- Read-only access codes for sharing the timetable
-- ============================================================
CREATE TABLE IF NOT EXISTS share_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  label TEXT, -- optional description
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ, -- NULL = never expires
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast code lookups
CREATE INDEX IF NOT EXISTS idx_share_codes_code ON share_codes(code);

-- ============================================================
-- APP SETTINGS TABLE
-- Global settings like the active share code
-- ============================================================
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- LESSONS: Authenticated users (admin) can do everything
CREATE POLICY "Admin full access to lessons"
  ON lessons FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- LESSONS: Anonymous users can only read (for share code access)
CREATE POLICY "Public read access to lessons"
  ON lessons FOR SELECT
  TO anon
  USING (true);

-- SHARE CODES: Only authenticated users can manage
CREATE POLICY "Admin full access to share_codes"
  ON share_codes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- SHARE CODES: Anonymous can read active codes (for validation)
CREATE POLICY "Public read active share_codes"
  ON share_codes FOR SELECT
  TO anon
  USING (is_active = true);

-- APP SETTINGS: Admin full access
CREATE POLICY "Admin full access to app_settings"
  ON app_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- APP SETTINGS: Public read
CREATE POLICY "Public read app_settings"
  ON app_settings FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
