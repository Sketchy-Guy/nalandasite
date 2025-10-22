-- Create about_pages table for general about us content
CREATE TABLE public.about_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leadership_messages table for chairman, vice chairman, director messages
CREATE TABLE public.leadership_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position TEXT NOT NULL, -- 'chairman', 'vice_chairman', 'director'
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT,
  designation TEXT,
  qualifications TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create awards_achievements table
CREATE TABLE public.awards_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  award_date DATE,
  category TEXT NOT NULL DEFAULT 'institutional', -- 'institutional', 'academic', 'research'
  image_url TEXT,
  certificate_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create accreditation_info table
CREATE TABLE public.accreditation_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  accreditation_type TEXT NOT NULL, -- 'naac', 'nba', 'siro'
  title TEXT NOT NULL,
  grade_rating TEXT,
  validity_period TEXT,
  certificate_url TEXT,
  description TEXT,
  benefits TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.about_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accreditation_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for about_pages
CREATE POLICY "Public can view active about pages" 
ON public.about_pages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage about pages" 
ON public.about_pages 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));

-- Create RLS policies for leadership_messages
CREATE POLICY "Public can view active leadership messages" 
ON public.leadership_messages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage leadership messages" 
ON public.leadership_messages 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));

-- Create RLS policies for awards_achievements
CREATE POLICY "Public can view active awards" 
ON public.awards_achievements 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage awards" 
ON public.awards_achievements 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));

-- Create RLS policies for accreditation_info
CREATE POLICY "Public can view active accreditation info" 
ON public.accreditation_info 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage accreditation info" 
ON public.accreditation_info 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));

-- Create update triggers for all tables
CREATE TRIGGER update_about_pages_updated_at
BEFORE UPDATE ON public.about_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leadership_messages_updated_at
BEFORE UPDATE ON public.leadership_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_awards_achievements_updated_at
BEFORE UPDATE ON public.awards_achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accreditation_info_updated_at
BEFORE UPDATE ON public.accreditation_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for about images
INSERT INTO storage.buckets (id, name, public) VALUES ('about-images', 'about-images', true);

-- Create storage policies for about-images bucket
CREATE POLICY "About images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'about-images');

CREATE POLICY "Admins can upload about images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'about-images' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));

CREATE POLICY "Admins can update about images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'about-images' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));

CREATE POLICY "Admins can delete about images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'about-images' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
));