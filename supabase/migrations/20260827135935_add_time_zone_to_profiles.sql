/*
# Add time_zone preference to profiles

1. Modified Tables
  - `profiles`
    - Added `time_zone` (text, nullable) — stores the user's preferred IANA time zone
      identifier (e.g. 'America/New_York', 'Europe/London'). When null, the app
      defaults to the meeting's configured time zone (America/Los_Angeles).

2. Notes
  - No constraint on allowed values since IANA identifiers change over time.
  - Nullable so existing users continue to see the meeting's native time zone
    until they explicitly choose one.
  - Column addition is idempotent via DO block.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'time_zone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN time_zone text;
  END IF;
END $$;
