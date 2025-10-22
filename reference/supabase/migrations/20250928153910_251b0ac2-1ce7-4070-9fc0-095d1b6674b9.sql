-- Enhance profiles table for faculty, student, alumni roles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role_type TEXT DEFAULT 'student' CHECK (role_type IN ('faculty', 'student', 'alumni'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS designation TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS qualifications TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS research_areas TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS enrollment_year INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS semester TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS branch TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS graduation_year INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_position TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Enhance departments table
ALTER TABLE departments ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS gallery_images TEXT[];
ALTER TABLE departments ADD COLUMN IF NOT EXISTS mission TEXT;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS vision TEXT;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS facilities TEXT[];
ALTER TABLE departments ADD COLUMN IF NOT EXISTS programs_offered TEXT[];
ALTER TABLE departments ADD COLUMN IF NOT EXISTS achievements TEXT[];
ALTER TABLE departments ADD COLUMN IF NOT EXISTS location_details TEXT;

-- Create faculty_departments junction table
CREATE TABLE IF NOT EXISTS faculty_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  is_hod BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(faculty_id, department_id)
);

-- Enable RLS on faculty_departments
ALTER TABLE faculty_departments ENABLE ROW LEVEL SECURITY;

-- Create policies for faculty_departments
CREATE POLICY "Public can view faculty departments" 
ON faculty_departments FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage faculty departments" 
ON faculty_departments FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('department-images', 'department-images', true),
  ('faculty-photos', 'faculty-photos', true),
  ('department-gallery', 'department-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for department images
CREATE POLICY "Department images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'department-images');

CREATE POLICY "Admins can upload department images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'department-images' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

-- Create storage policies for faculty photos
CREATE POLICY "Faculty photos are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'faculty-photos');

CREATE POLICY "Admins can upload faculty photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'faculty-photos' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

-- Create storage policies for department gallery
CREATE POLICY "Department gallery is publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'department-gallery');

CREATE POLICY "Admins can upload gallery images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'department-gallery' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));