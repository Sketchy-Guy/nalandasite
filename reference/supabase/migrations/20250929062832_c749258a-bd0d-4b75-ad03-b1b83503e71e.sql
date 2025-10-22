-- Drop the existing foreign key constraint that's referencing profiles incorrectly
ALTER TABLE public.admin_roles DROP CONSTRAINT IF EXISTS admin_roles_user_id_fkey;

-- Add correct foreign key constraint referencing auth.users
ALTER TABLE public.admin_roles 
ADD CONSTRAINT admin_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Also fix granted_by to reference auth.users
ALTER TABLE public.admin_roles DROP CONSTRAINT IF EXISTS admin_roles_granted_by_fkey;
ALTER TABLE public.admin_roles 
ADD CONSTRAINT admin_roles_granted_by_fkey 
FOREIGN KEY (granted_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Now insert the super admin
INSERT INTO public.admin_roles (user_id, role_level, granted_by, permissions, is_active)
VALUES (
  'e0f184b9-a964-498d-9c30-1ed979ae95aa',
  1, -- Super Admin level
  'e0f184b9-a964-498d-9c30-1ed979ae95aa', -- Self-granted initially
  '{"manage_users": true, "manage_content": true, "manage_departments": true, "manage_submissions": true, "manage_roles": true}'::jsonb,
  true
);