/*
# Create roles lookup table and link user_roles to it

1. New Tables
   - `roles`
     - `id` (text, primary key) — the role slug used as the identifier
       (e.g. 'member', 'admin'). Matches values already stored in
       user_roles.role.
     - `label` (text, not null) — human-readable display name
       (e.g. 'Member', 'Admin').
     - `created_at` (timestamptz) — when the role was created.

2. Seed Data
   - 'member' with label 'Member'
   - 'admin' with label 'Admin'

3. Modified Tables
   - `user_roles`
     - Drops the old CHECK constraint (role IN ('member','admin')).
     - Adds a FOREIGN KEY on `role` referencing `roles(id)`.
     - Existing data is unchanged because both 'member' and 'admin'
       now exist in the roles table.

4. Security
   - RLS enabled on `roles`.
   - All authenticated users can read the roles table (it is a
     reference/lookup table with no sensitive data).
   - No INSERT/UPDATE/DELETE policies — roles are managed by
     migrations only.

5. Notes
   - To add new roles in the future, insert a row into `roles` and
     the FK on user_roles will accept the new value immediately.
   - The helper functions is_admin() and is_approved_member() continue
     to work unchanged because they compare role text values directly.
*/

-- 1. Create the roles lookup table
CREATE TABLE IF NOT EXISTS public.roles (
  id text PRIMARY KEY,
  label text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all roles (lookup table)
DROP POLICY IF EXISTS "authenticated_select_roles" ON public.roles;
CREATE POLICY "authenticated_select_roles" ON public.roles FOR SELECT
  TO authenticated USING (true);

-- 2. Seed the two existing roles
INSERT INTO public.roles (id, label) VALUES ('member', 'Member')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.roles (id, label) VALUES ('admin', 'Admin')
ON CONFLICT (id) DO NOTHING;

-- 3. Remove the old CHECK constraint and add a FK to roles
DO $$ BEGIN
  -- Drop the CHECK constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'user_roles'
      AND constraint_type = 'CHECK'
      AND constraint_name = 'user_roles_role_check'
  ) THEN
    ALTER TABLE public.user_roles DROP CONSTRAINT user_roles_role_check;
  END IF;

  -- Add FK if it doesn't already exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'user_roles'
      AND constraint_name = 'user_roles_role_fkey'
  ) THEN
    ALTER TABLE public.user_roles
      ADD CONSTRAINT user_roles_role_fkey
      FOREIGN KEY (role) REFERENCES public.roles(id);
  END IF;
END $$;
