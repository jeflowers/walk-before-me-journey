/*
  # Bound recorded waypoint numbers

  1. Changes
     - Add CHECK constraint requiring `waypoint_progress.waypoint_number`
       to be between 1 and 50

  2. Security
     - The column accepted any integer, so a crafted request could record
       negative or nonexistent waypoints and inflate a member's own progress
       and rank. The upper bound leaves room for longer studies.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'waypoint_progress_number_range'
  ) THEN
    ALTER TABLE public.waypoint_progress
      ADD CONSTRAINT waypoint_progress_number_range
      CHECK (waypoint_number >= 1 AND waypoint_number <= 50);
  END IF;
END $$;
