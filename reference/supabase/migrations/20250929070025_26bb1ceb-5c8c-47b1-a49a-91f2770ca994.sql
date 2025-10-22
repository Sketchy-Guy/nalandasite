-- Create campus life content table
CREATE TABLE public.campus_life_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  hero_image_url TEXT,
  content TEXT,
  meta_description TEXT,
  features TEXT[],
  highlights TEXT[],
  gallery_images TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student activities table
CREATE TABLE public.student_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'academic',
  image_url TEXT,
  coordinator_name TEXT,
  coordinator_email TEXT,
  meeting_schedule TEXT,
  location TEXT,
  member_count INTEGER DEFAULT 0,
  achievements TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social initiatives table
CREATE TABLE public.social_initiatives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'community_service',
  image_url TEXT,
  start_date DATE,
  end_date DATE,
  impact_metrics TEXT,
  participants_count INTEGER DEFAULT 0,
  organizer TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  gallery_images TEXT[],
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create women forum events table
CREATE TABLE public.women_forum_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'workshop',
  event_date DATE,
  venue TEXT,
  speaker_name TEXT,
  speaker_designation TEXT,
  image_url TEXT,
  registration_link TEXT,
  max_participants INTEGER,
  achievements TEXT[],
  gallery_images TEXT[],
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create incubation centers table
CREATE TABLE public.incubation_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  center_type TEXT NOT NULL,
  grant_amount NUMERIC,
  grant_currency TEXT DEFAULT 'INR',
  establishment_date DATE,
  image_url TEXT,
  logo_url TEXT,
  website_url TEXT,
  features TEXT[],
  success_stories TEXT[],
  current_startups INTEGER DEFAULT 0,
  total_funding_raised NUMERIC DEFAULT 0,
  gallery_images TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.campus_life_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.women_forum_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incubation_centers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for campus_life_content
CREATE POLICY "Admins can manage campus life content" 
ON public.campus_life_content 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

CREATE POLICY "Public can view active campus life content" 
ON public.campus_life_content 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for student_activities
CREATE POLICY "Admins can manage student activities" 
ON public.student_activities 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

CREATE POLICY "Public can view active student activities" 
ON public.student_activities 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for social_initiatives
CREATE POLICY "Admins can manage social initiatives" 
ON public.social_initiatives 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

CREATE POLICY "Public can view active social initiatives" 
ON public.social_initiatives 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for women_forum_events
CREATE POLICY "Admins can manage women forum events" 
ON public.women_forum_events 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

CREATE POLICY "Public can view active women forum events" 
ON public.women_forum_events 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for incubation_centers
CREATE POLICY "Admins can manage incubation centers" 
ON public.incubation_centers 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

CREATE POLICY "Public can view active incubation centers" 
ON public.incubation_centers 
FOR SELECT 
USING (is_active = true);

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES 
('womens-forum-images', 'womens-forum-images', true),
('innovation-images', 'innovation-images', true),
('social-initiatives-images', 'social-initiatives-images', true),
('incubation-center-images', 'incubation-center-images', true),
('student-activities-images', 'student-activities-images', true),
('campus-life-images', 'campus-life-images', true);

-- Create storage policies
CREATE POLICY "Public can view womens forum images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'womens-forum-images');

CREATE POLICY "Admins can upload womens forum images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'womens-forum-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view innovation images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'innovation-images');

CREATE POLICY "Admins can upload innovation images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'innovation-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view social initiatives images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'social-initiatives-images');

CREATE POLICY "Admins can upload social initiatives images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'social-initiatives-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view incubation center images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'incubation-center-images');

CREATE POLICY "Admins can upload incubation center images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'incubation-center-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view student activities images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'student-activities-images');

CREATE POLICY "Admins can upload student activities images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'student-activities-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view campus life images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'campus-life-images');

CREATE POLICY "Admins can upload campus life images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'campus-life-images' AND auth.role() = 'authenticated');

-- Add updated_at trigger for all new tables
CREATE TRIGGER update_campus_life_content_updated_at
BEFORE UPDATE ON public.campus_life_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_activities_updated_at
BEFORE UPDATE ON public.student_activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_initiatives_updated_at
BEFORE UPDATE ON public.social_initiatives
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_women_forum_events_updated_at
BEFORE UPDATE ON public.women_forum_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incubation_centers_updated_at
BEFORE UPDATE ON public.incubation_centers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();