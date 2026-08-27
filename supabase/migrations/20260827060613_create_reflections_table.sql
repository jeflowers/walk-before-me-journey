/*
# Create reflections table (single-tenant, no auth)

1. New Tables
  - `reflections`
    - `id` (uuid, primary key)
    - `study_id` (text, not null) — identifies which study this belongs to
    - `prompt_key` (text, not null) — identifies which prompt card (e.g. "Note 01", "Note 02", "Prayer")
    - `body` (text, not null, default '') — user's journal text
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  - Unique constraint on (study_id, prompt_key) so each prompt has at most one saved entry.

2. Security
  - Enable RLS on `reflections`.
  - Allow anon + authenticated full CRUD (no sign-in in this app).
*/

CREATE TABLE IF NOT EXISTS reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id text NOT NULL,
  prompt_key text NOT NULL,
  body text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (study_id, prompt_key)
);

ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reflections" ON reflections;
CREATE POLICY "anon_select_reflections" ON reflections FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reflections" ON reflections;
CREATE POLICY "anon_insert_reflections" ON reflections FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_reflections" ON reflections;
CREATE POLICY "anon_update_reflections" ON reflections FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_reflections" ON reflections;
CREATE POLICY "anon_delete_reflections" ON reflections FOR DELETE
  TO anon, authenticated USING (true);
