-- Create contact_info table for managing contact details
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  office_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  office_hours TEXT,
  contact_person TEXT,
  designation TEXT,
  department TEXT,
  location_map_url TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create photo_galleries table for centralized photo management
CREATE TABLE public.photo_galleries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'academic', 'campus_life', 'departments', 'about_us', 'contact', 'events'
  subcategory TEXT, -- specific section like 'hostel', 'sports', 'cse_department'
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  photographer TEXT,
  photo_date DATE,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campus_stats table for homepage statistics
CREATE TABLE public.campus_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_name TEXT NOT NULL,
  stat_value TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create news_announcements table
CREATE TABLE public.news_announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  summary TEXT,
  category TEXT NOT NULL DEFAULT 'news',
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  publish_date DATE,
  expiry_date DATE,
  author TEXT,
  tags TEXT[],
  external_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create office_locations table for contact page
CREATE TABLE public.office_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  building TEXT,
  floor TEXT,
  room_number TEXT,
  address TEXT,
  landmark TEXT,
  phone TEXT,
  email TEXT,
  office_hours TEXT,
  map_coordinates TEXT, -- lat,lng format
  image_url TEXT,
  is_main_office BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_info
CREATE POLICY "Public can view active contact info" 
ON public.contact_info 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage contact info" 
ON public.contact_info 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));

-- Create policies for photo_galleries
CREATE POLICY "Public can view active photos" 
ON public.photo_galleries 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage photos" 
ON public.photo_galleries 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));

-- Create policies for campus_stats
CREATE POLICY "Public can view campus stats" 
ON public.campus_stats 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage campus stats" 
ON public.campus_stats 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));

-- Create policies for news_announcements
CREATE POLICY "Public can view active news" 
ON public.news_announcements 
FOR SELECT 
USING (is_active = true AND (publish_date IS NULL OR publish_date <= CURRENT_DATE) AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE));

CREATE POLICY "Admins can manage news" 
ON public.news_announcements 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));

-- Create policies for office_locations
CREATE POLICY "Public can view office locations" 
ON public.office_locations 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage office locations" 
ON public.office_locations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));

-- Create storage buckets for new images
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('contact-images', 'contact-images', true),
  ('office-images', 'office-images', true),
  ('staff-photos', 'staff-photos', true),
  ('news-images', 'news-images', true),
  ('gallery-photos', 'gallery-photos', true);

-- Create storage policies for new buckets
CREATE POLICY "Public can view contact images" ON storage.objects FOR SELECT USING (bucket_id = 'contact-images');
CREATE POLICY "Admins can upload contact images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'contact-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view office images" ON storage.objects FOR SELECT USING (bucket_id = 'office-images');
CREATE POLICY "Admins can upload office images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'office-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view staff photos" ON storage.objects FOR SELECT USING (bucket_id = 'staff-photos');
CREATE POLICY "Admins can upload staff photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'staff-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view news images" ON storage.objects FOR SELECT USING (bucket_id = 'news-images');
CREATE POLICY "Admins can upload news images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view gallery photos" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-photos');
CREATE POLICY "Admins can upload gallery photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-photos' AND auth.role() = 'authenticated');

-- Create update triggers
CREATE TRIGGER update_contact_info_updated_at
BEFORE UPDATE ON public.contact_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_photo_galleries_updated_at
BEFORE UPDATE ON public.photo_galleries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campus_stats_updated_at
BEFORE UPDATE ON public.campus_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_announcements_updated_at
BEFORE UPDATE ON public.news_announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_office_locations_updated_at
BEFORE UPDATE ON public.office_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();