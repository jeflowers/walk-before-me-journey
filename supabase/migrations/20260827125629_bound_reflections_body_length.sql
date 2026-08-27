/*
  # Bound reflection body length

  1. Changes
     - Add CHECK constraint limiting `reflections.body` to 20000 characters

  2. Security
     - Reflection answers were unbounded text, so a signed-in member could
       insert arbitrarily large rows through the API and consume unbounded
       database storage. The limit is generous for real reflections.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reflections_body_length'
  ) THEN
    ALTER TABLE public.reflections
      ADD CONSTRAINT reflections_body_length CHECK (char_length(body) <= 20000);
  END IF;
END $$;
