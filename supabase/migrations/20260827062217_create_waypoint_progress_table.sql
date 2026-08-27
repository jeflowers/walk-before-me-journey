/*
# Create waypoint_progress table (multi-user, owner-scoped)

Tracks which waypoints a user has completed for a given study.

1. New Tables
  - `waypoint_progress`
    - `id` (uuid, primary key)
    - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users)
    - `study_id` (text, not null) — e.g. "psalm-26"
    - `waypoint_number` (integer, not null) — 1-based waypoint index
    - `completed_at` (timestamptz, defaults to now())
  - Unique constraint on (user_id, study_id, waypoint_number) prevents duplicates.

2. Security
  - Enable RLS.
  - Owner-scoped CRUD: each authenticated user can only access their own progress rows.
*/

CREATE TABLE IF NOT EXISTS waypoint_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  study_id text NOT NULL,
  waypoint_number integer NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE (user_id, study_id, waypoint_number)
);

ALTER TABLE waypoint_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON waypoint_progress;
CREATE POLICY "select_own_progress" ON waypoint_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON waypoint_progress;
CREATE POLICY "insert_own_progress" ON waypoint_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON waypoint_progress;
CREATE POLICY "update_own_progress" ON waypoint_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_progress" ON waypoint_progress;
CREATE POLICY "delete_own_progress" ON waypoint_progress FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
