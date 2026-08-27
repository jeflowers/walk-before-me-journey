/*
# Add user_id to reflections table

1. Modified Tables
  - `reflections`
    - Added `user_id` (uuid, nullable for backwards compatibility, defaults to auth.uid())
    - Added index on (user_id, study_id, prompt_key)

2. Security Changes
  - Replaced anon-open policies with authenticated owner-scoped policies.
  - Users can only read, insert, update, and delete their own reflections.
  - Kept anon SELECT/INSERT for users who haven't signed in yet (graceful degradation).

3. Important Notes
  - Existing rows without a user_id will still be readable by anon.
  - New rows from authenticated users are automatically scoped via DEFAULT auth.uid().
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reflections' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE reflections ADD COLUMN user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_reflections_user_study ON reflections(user_id, study_id, prompt_key);

-- Drop old open policies
DROP POLICY IF EXISTS "anon_select_reflections" ON reflections;
DROP POLICY IF EXISTS "anon_insert_reflections" ON reflections;
DROP POLICY IF EXISTS "anon_update_reflections" ON reflections;
DROP POLICY IF EXISTS "anon_delete_reflections" ON reflections;

-- New owner-scoped policies for authenticated users
DROP POLICY IF EXISTS "select_own_reflections" ON reflections;
CREATE POLICY "select_own_reflections" ON reflections FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reflections" ON reflections;
CREATE POLICY "insert_own_reflections" ON reflections FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reflections" ON reflections;
CREATE POLICY "update_own_reflections" ON reflections FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reflections" ON reflections;
CREATE POLICY "delete_own_reflections" ON reflections FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Also drop the unique constraint that doesn't account for user_id and recreate
ALTER TABLE reflections DROP CONSTRAINT IF EXISTS reflections_study_id_prompt_key_key;

-- Add a new unique constraint scoped to user
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reflections_user_study_prompt_key'
  ) THEN
    ALTER TABLE reflections ADD CONSTRAINT reflections_user_study_prompt_key UNIQUE (user_id, study_id, prompt_key);
  END IF;
END $$;
