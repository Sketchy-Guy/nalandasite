-- Create trigger function to automatically create profiles when users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    'student'::user_role
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create or update profile for chinmaykumarpanda638@gmail.com as admin
DO $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Get the user_id for the email
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = 'chinmaykumarpanda638@gmail.com';
  
  IF user_uuid IS NOT NULL THEN
    -- Insert or update the profile
    INSERT INTO public.profiles (user_id, email, full_name, role)
    VALUES (user_uuid, 'chinmaykumarpanda638@gmail.com', 'Chinmay Kumar Panda', 'admin'::user_role)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      role = 'admin'::user_role,
      email = 'chinmaykumarpanda638@gmail.com',
      full_name = COALESCE(profiles.full_name, 'Chinmay Kumar Panda'),
      updated_at = NOW();
  END IF;
END $$;