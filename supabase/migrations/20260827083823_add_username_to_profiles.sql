/*
# Add username column to profiles

1. Modified Tables
  - `profiles`
    - `username` (text, nullable) — display username chosen by the user

2. Important Notes
  - Column is nullable so existing rows are unaffected.
  - Uses IF NOT EXISTS via DO block for idempotency.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE profiles ADD COLUMN username text;
  END IF;
END $$;
