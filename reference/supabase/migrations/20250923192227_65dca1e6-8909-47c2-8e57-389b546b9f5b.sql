-- Create storage buckets for media management
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('hero-images', 'hero-images', true),
  ('magazines', 'magazines', true),
  ('club-images', 'club-images', true),
  ('achievement-photos', 'achievement-photos', true),
  ('academic-docs', 'academic-docs', true);

-- Create admin roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'faculty', 'student', 'alumni');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'student',
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hero images table
CREATE TABLE public.hero_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notices table
CREATE TABLE public.notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  priority TEXT NOT NULL DEFAULT 'Medium',
  is_new BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create magazines table
CREATE TABLE public.magazines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  file_url TEXT,
  issue_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clubs table
CREATE TABLE public.clubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  member_count INTEGER NOT NULL DEFAULT 0,
  event_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create academic services table
CREATE TABLE public.academic_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create toppers table (enhanced)
CREATE TABLE public.toppers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  cgpa DECIMAL(3,2) NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  photo_url TEXT,
  year INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create creative works table
CREATE TABLE public.creative_works (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author_name TEXT NOT NULL,
  author_department TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  content_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  head_name TEXT,
  contact_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magazines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.toppers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public can view hero images" ON public.hero_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view notices" ON public.notices FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view magazines" ON public.magazines FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view clubs" ON public.clubs FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view academic services" ON public.academic_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view toppers" ON public.toppers FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view creative works" ON public.creative_works FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view departments" ON public.departments FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view profiles" ON public.profiles FOR SELECT USING (true);

-- Admin policies - admins can do everything
CREATE POLICY "Admins can manage hero images" ON public.hero_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage notices" ON public.notices FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage magazines" ON public.magazines FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage clubs" ON public.clubs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage academic services" ON public.academic_services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage toppers" ON public.toppers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage creative works" ON public.creative_works FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());

-- Storage policies
CREATE POLICY "Public can view hero images" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');
CREATE POLICY "Public can view magazines" ON storage.objects FOR SELECT USING (bucket_id = 'magazines');
CREATE POLICY "Public can view club images" ON storage.objects FOR SELECT USING (bucket_id = 'club-images');
CREATE POLICY "Public can view achievement photos" ON storage.objects FOR SELECT USING (bucket_id = 'achievement-photos');
CREATE POLICY "Public can view academic docs" ON storage.objects FOR SELECT USING (bucket_id = 'academic-docs');

CREATE POLICY "Admins can upload hero images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'hero-images' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can upload magazines" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'magazines' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can upload club images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'club-images' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can upload achievement photos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'achievement-photos' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can upload academic docs" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'academic-docs' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hero_images_updated_at BEFORE UPDATE ON public.hero_images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON public.notices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_magazines_updated_at BEFORE UPDATE ON public.magazines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON public.clubs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_academic_services_updated_at BEFORE UPDATE ON public.academic_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_toppers_updated_at BEFORE UPDATE ON public.toppers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_creative_works_updated_at BEFORE UPDATE ON public.creative_works FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.departments (name, code, description) VALUES
  ('Computer Science & Engineering', 'CSE', 'Leading department in software and computer systems'),
  ('Information Technology', 'CST', 'Focus on modern IT solutions and technology'),
  ('Master of Computer Applications', 'MCA', 'Advanced computer applications and research'),
  ('Bachelor of Computer Applications', 'BCA', 'Undergraduate computer applications program'),
  ('Mechanical Engineering', 'MECHANICAL', 'Engineering mechanics and manufacturing'),
  ('Electrical Engineering', 'ELECTRICAL', 'Power systems and electrical technology'),
  ('Civil Engineering', 'CIVIL', 'Infrastructure and construction engineering'),
  ('Master of Business Administration', 'MBA', 'Business leadership and management');

INSERT INTO public.clubs (name, description, icon, member_count, event_count) VALUES
  ('Robotics Club', 'Building autonomous robots and competing in national competitions', 'Bot', 150, 12),
  ('Literary Society', 'Promoting reading, writing, and literary discussions', 'BookOpen', 200, 8),
  ('Music Club', 'Organizing concerts and promoting musical talents', 'Music', 180, 15),
  ('Photography Club', 'Capturing campus life and conducting photo walks', 'Camera', 120, 10),
  ('Coding Club', 'Competitive programming and hackathons', 'Code', 250, 20),
  ('Drama Society', 'Stage performances and dramatic arts', 'Theater', 90, 6);

INSERT INTO public.academic_services (name, description, icon, link_url) VALUES
  ('Timetable', 'Access current semester timetables and schedules', 'Calendar', '/academic/timetable'),
  ('Fees & Scholarships', 'Fee structure and scholarship opportunities', 'Bookmark', '/academic/fees'),
  ('Academic Transcripts', 'Request transcripts and academic documents', 'FileText', '/academic/transcripts'),
  ('Online Library', 'Digital resources and research materials', 'Library', '/academic/library');

INSERT INTO public.notices (title, description, category, priority) VALUES
  ('Semester Registration Open', 'Registration for Spring 2024 semester is now open. Students must complete registration by March 15th.', 'Academic', 'High'),
  ('Annual Sports Meet', 'The annual inter-departmental sports meet will be held from March 20-25, 2024.', 'Sports', 'Medium'),
  ('Guest Lecture Series', 'Industry experts will deliver lectures on emerging technologies. Schedule available on website.', 'Academic', 'Medium'),
  ('Hostel Fee Payment', 'Hostel fees for the current semester are due by March 10th. Late fees will apply after the deadline.', 'Financial', 'High');

INSERT INTO public.toppers (name, department, cgpa, achievements, year, rank) VALUES
  ('Priya Sharma', 'Computer Science & Engineering', 9.85, ARRAY['Gold Medal', 'Best Project Award', 'Academic Excellence'], 2024, 1),
  ('Rahul Kumar', 'Information Technology', 9.72, ARRAY['Silver Medal', 'Innovation Award'], 2024, 2),
  ('Anjali Singh', 'Master of Computer Applications', 9.68, ARRAY['Research Excellence', 'Leadership Award'], 2024, 3);

INSERT INTO public.creative_works (title, description, author_name, author_department, category, is_featured) VALUES
  ('Digital Art Exhibition', 'A collection of digital artwork exploring technology and humanity', 'Arjun Patel', 'Computer Science & Engineering', 'Art', true),
  ('Poetry Collection: Campus Life', 'Poems reflecting the experiences of college life and friendship', 'Sneha Reddy', 'Master of Computer Applications', 'Literature', true),
  ('Innovation Project: Smart Campus', 'IoT-based solution for campus management and automation', 'Tech Team', 'Electrical Engineering', 'Technology', false);

INSERT INTO public.magazines (title, description, issue_date) VALUES
  ('NIT Chronicle - Spring 2024', 'Latest news, achievements, and student stories from campus', '2024-03-01'),
  ('Innovation Digest', 'Showcasing student projects and research breakthroughs', '2024-02-15'),
  ('Cultural Express', 'Arts, literature, and cultural activities magazine', '2024-01-30');