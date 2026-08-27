/*
# Create journal_entries table (multi-user, owner-scoped)

1. New Tables
  - `journal_entries`
    - `id` (uuid, primary key)
    - `user_id` (uuid, not null, defaults to the authenticated user)
    - `study_id` (text, not null) — links to the study track
    - `entry_type` (text, not null) — one of 'note', 'prayer', 'request'
    - `body` (text, not null) — the user's written content
    - `visibility` (text, not null, default 'private') — 'private' or 'public'
    - `status` (text) — for requests: 'praying' or 'answered'; null for notes/prayers
    - `prompt_source` (text) — optional, stores the prompt text that inspired this entry
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

2. Security
  - Enable RLS on `journal_entries`.
  - Owner-scoped CRUD: each authenticated user can only access rows they own.

3. Notes
  - Prayers are always private (enforced at app level).
  - Prayer requests can be private or public (group visibility).
  - Notes default to private.
*/

CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  study_id text NOT NULL,
  entry_type text NOT NULL CHECK (entry_type IN ('note', 'prayer', 'request')),
  body text NOT NULL,
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  status text CHECK (status IS NULL OR status IN ('praying', 'answered')),
  prompt_source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_study ON journal_entries(user_id, study_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_type ON journal_entries(user_id, entry_type);

DROP POLICY IF EXISTS "select_own_journal_entries" ON journal_entries;
CREATE POLICY "select_own_journal_entries" ON journal_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_journal_entries" ON journal_entries;
CREATE POLICY "insert_own_journal_entries" ON journal_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_journal_entries" ON journal_entries;
CREATE POLICY "update_own_journal_entries" ON journal_entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_journal_entries" ON journal_entries;
CREATE POLICY "delete_own_journal_entries" ON journal_entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
