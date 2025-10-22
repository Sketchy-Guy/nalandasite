-- Create campus_pages table for general campus life content
CREATE TABLE public.campus_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  hero_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sports_facilities table
CREATE TABLE public.sports_facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  facility_type TEXT NOT NULL DEFAULT 'outdoor',
  capacity INTEGER,
  operating_hours TEXT,
  booking_required BOOLEAN NOT NULL DEFAULT false,
  contact_person TEXT,
  contact_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hostel_info table
CREATE TABLE public.hostel_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  hostel_type TEXT NOT NULL DEFAULT 'boys',
  capacity INTEGER NOT NULL DEFAULT 0,
  rooms_available INTEGER NOT NULL DEFAULT 0,
  facilities TEXT[],
  rules TEXT,
  fee_structure JSONB,
  warden_name TEXT,
  warden_contact TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_governance table
CREATE TABLE public.student_governance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position TEXT NOT NULL,
  student_name TEXT NOT NULL,
  department TEXT,
  year INTEGER,
  bio TEXT,
  photo_url TEXT,
  term_start DATE,
  term_end DATE,
  contact_email TEXT,
  responsibilities TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campus_events table
CREATE TABLE public.campus_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'festival',
  start_date DATE,
  end_date DATE,
  venue TEXT,
  organizer TEXT,
  image_url TEXT,
  registration_required BOOLEAN NOT NULL DEFAULT false,
  registration_url TEXT,
  max_participants INTEGER,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create publications table
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  publication_type TEXT NOT NULL DEFAULT 'magazine',
  issue_number TEXT,
  publication_date DATE,
  cover_image_url TEXT,
  file_url TEXT,
  author TEXT,
  department TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create amenities table
CREATE TABLE public.amenities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  location TEXT,
  operating_hours TEXT,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  image_url TEXT,
  features TEXT[],
  booking_required BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wellness_programs table
CREATE TABLE public.wellness_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  program_type TEXT NOT NULL DEFAULT 'fitness',
  instructor TEXT,
  schedule TEXT,
  duration_minutes INTEGER,
  max_participants INTEGER,
  location TEXT,
  fee NUMERIC DEFAULT 0,
  image_url TEXT,
  registration_required BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.campus_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_governance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_programs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access and admin write access
-- Campus Pages policies
CREATE POLICY "Public can view active campus pages" ON public.campus_pages
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage campus pages" ON public.campus_pages
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Sports Facilities policies
CREATE POLICY "Public can view active sports facilities" ON public.sports_facilities
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage sports facilities" ON public.sports_facilities
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Hostel Info policies
CREATE POLICY "Public can view active hostel info" ON public.hostel_info
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage hostel info" ON public.hostel_info
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Student Governance policies
CREATE POLICY "Public can view active governance" ON public.student_governance
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage governance" ON public.student_governance
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Campus Events policies
CREATE POLICY "Public can view active events" ON public.campus_events
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage events" ON public.campus_events
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Publications policies
CREATE POLICY "Public can view active publications" ON public.publications
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage publications" ON public.publications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Amenities policies
CREATE POLICY "Public can view active amenities" ON public.amenities
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage amenities" ON public.amenities
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Wellness Programs policies
CREATE POLICY "Public can view active wellness programs" ON public.wellness_programs
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage wellness programs" ON public.wellness_programs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Create storage buckets for campus life content
INSERT INTO storage.buckets (id, name, public) VALUES 
('campus-images', 'campus-images', true),
('event-media', 'event-media', true),
('wellness-images', 'wellness-images', true);

-- Create storage policies
CREATE POLICY "Public can view campus images" ON storage.objects
FOR SELECT USING (bucket_id = 'campus-images');

CREATE POLICY "Admins can upload campus images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'campus-images' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

CREATE POLICY "Public can view event media" ON storage.objects
FOR SELECT USING (bucket_id = 'event-media');

CREATE POLICY "Admins can upload event media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'event-media' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

CREATE POLICY "Public can view wellness images" ON storage.objects
FOR SELECT USING (bucket_id = 'wellness-images');

CREATE POLICY "Admins can upload wellness images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'wellness-images' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_campus_pages_updated_at
BEFORE UPDATE ON public.campus_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sports_facilities_updated_at
BEFORE UPDATE ON public.sports_facilities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hostel_info_updated_at
BEFORE UPDATE ON public.hostel_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_governance_updated_at
BEFORE UPDATE ON public.student_governance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campus_events_updated_at
BEFORE UPDATE ON public.campus_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_publications_updated_at
BEFORE UPDATE ON public.publications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_amenities_updated_at
BEFORE UPDATE ON public.amenities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wellness_programs_updated_at
BEFORE UPDATE ON public.wellness_programs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();