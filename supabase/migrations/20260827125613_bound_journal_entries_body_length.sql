/*
  # Bound journal entry body length

  1. Changes
     - Add CHECK constraint limiting `journal_entries.body` to 20000 characters

  2. Security
     - Nothing previously bounded the size of a journal entry, so a signed-in
       member could insert arbitrarily large rows through the API and consume
       unbounded database storage. The limit is generous for real entries.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'journal_entries_body_length'
  ) THEN
    ALTER TABLE public.journal_entries
      ADD CONSTRAINT journal_entries_body_length CHECK (char_length(body) <= 20000);
  END IF;
END $$;
