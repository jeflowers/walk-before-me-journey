/*
# Add time_format preference to profiles

1. Modified Tables
  - `profiles`
    - Added `time_format` (text, not null, default '12h') — stores user's preferred
      clock display: '12h' for 12-hour format, '24h' for 24-hour format.

2. Constraints
  - CHECK constraint ensures value is only '12h' or '24h'.

3. Notes
  - Default is '12h' so existing users see no change in behavior.
  - Column addition is idempotent via DO block.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'time_format'
  ) THEN
    ALTER TABLE profiles ADD COLUMN time_format text NOT NULL DEFAULT '12h';
    ALTER TABLE profiles ADD CONSTRAINT profiles_time_format_check
      CHECK (time_format IN ('12h', '24h'));
  END IF;
END $$;
