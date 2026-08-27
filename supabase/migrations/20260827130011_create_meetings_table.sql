/*
  # Create meetings table

  1. New Tables
     - `meetings`
       - `id` (uuid, PK)
       - `slug` (text, UNIQUE) — URL-safe identifier like 'family-prayer'
       - `join_url` (text) — the Zoom join link
       - `meeting_id` (text) — the Zoom numeric meeting ID
       - `passcode` (text) — the Zoom passcode
       - `dial_in` (text) — phone dial-in info, newline-separated
       - `ics_url` (text) — link to downloadable calendar invite
       - `note` (text) — optional display note
       - `updated_at` (timestamptz)

  2. Security
     - Enable RLS on `meetings`.
     - SELECT: approved members only (via `is_approved_member()`).
     - INSERT/UPDATE/DELETE: admin only (via `is_admin()`).
     - No seed row — credentials never committed to the repo.
*/

CREATE TABLE IF NOT EXISTS public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  join_url text,
  meeting_id text,
  passcode text,
  dial_in text,
  ics_url text,
  note text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "approved_select_meetings" ON public.meetings;
CREATE POLICY "approved_select_meetings" ON public.meetings FOR SELECT
  TO authenticated USING (public.is_approved_member());

DROP POLICY IF EXISTS "admin_insert_meetings" ON public.meetings;
CREATE POLICY "admin_insert_meetings" ON public.meetings FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_update_meetings" ON public.meetings;
CREATE POLICY "admin_update_meetings" ON public.meetings FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_meetings" ON public.meetings;
CREATE POLICY "admin_delete_meetings" ON public.meetings FOR DELETE
  TO authenticated USING (public.is_admin());
