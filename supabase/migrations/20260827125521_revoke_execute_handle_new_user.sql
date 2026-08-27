/*
  # Remove public execute on handle_new_user()

  1. Changes
     - Revoke EXECUTE on `public.handle_new_user()` from PUBLIC, anon and authenticated

  2. Security
     - The function is a SECURITY DEFINER trigger function used only by the
       `on_auth_user_created` trigger on auth.users. It was reachable at
       /rest/v1/rpc/handle_new_user by both anon and authenticated roles.
     - The trigger itself continues to run as the table owner and is unaffected.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
