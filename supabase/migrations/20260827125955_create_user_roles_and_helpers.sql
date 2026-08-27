/*
  # Create user_roles table and helper functions

  1. New Tables
     - `user_roles`
       - `user_id` (uuid, PK, references auth.users on delete cascade)
       - `role` (text, default 'member', CHECK IN ('member','admin'))
       - `approved` (boolean, default false)
       - `created_at` (timestamptz)
       - `updated_at` (timestamptz)

  2. Security
     - Enable RLS on `user_roles`.
     - Only two SELECT policies: members can read their own role row,
       and admins (via the helper function) can read all role rows.
     - No INSERT/UPDATE/DELETE policies — row management is done by
       triggers and by admins in the SQL editor only.

  3. Helper Functions
     - `public.is_admin()` — returns true if caller has role='admin'
       and approved=true. SECURITY DEFINER.
     - `public.is_approved_member()` — returns true if caller has
       approved=true (any role). SECURITY DEFINER.
     - Both SET search_path = '' and EXECUTE revoked from PUBLIC.

  4. Trigger modification
     - Replaces `public.handle_new_user()` to also insert a user_roles
       row (role='member', approved=false) alongside the profiles row.

  5. Backfill
     - Existing users get role='member', approved=true.
*/

-- Table first (no policies yet)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper functions (needed by the admin policy below)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
      AND approved = true
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.is_approved_member()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND approved = true
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_approved_member() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_approved_member() TO authenticated;

-- Policies (functions exist now)
DROP POLICY IF EXISTS "select_own_role" ON public.user_roles;
CREATE POLICY "select_own_role" ON public.user_roles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_all_roles" ON public.user_roles;
CREATE POLICY "admin_select_all_roles" ON public.user_roles FOR SELECT
  TO authenticated USING (public.is_admin());

-- Replace handle_new_user to also insert user_roles row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role, approved)
  VALUES (new.id, 'member', false)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- Backfill existing users as approved members
INSERT INTO public.user_roles (user_id, role, approved)
SELECT id, 'member', true FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id) DO NOTHING;
