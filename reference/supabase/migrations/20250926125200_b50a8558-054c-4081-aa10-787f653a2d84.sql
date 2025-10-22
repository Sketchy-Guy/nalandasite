-- Create academic pages table for dynamic content management
CREATE TABLE public.academic_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create academic downloads table for managing downloadable files
CREATE TABLE public.academic_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_size INTEGER,
  file_type TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  department TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create timetables table for course and exam schedules
CREATE TABLE public.timetables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'course', -- 'course' or 'exam'
  department TEXT,
  semester TEXT,
  academic_year TEXT,
  file_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fees structure table
CREATE TABLE public.fees_structure (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'tuition', -- 'tuition', 'hostel', 'exam', 'other'
  amount DECIMAL(10,2),
  department TEXT,
  semester TEXT,
  academic_year TEXT NOT NULL,
  due_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scholarships table
CREATE TABLE public.scholarships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  eligibility_criteria TEXT,
  amount DECIMAL(10,2),
  application_deadline DATE,
  application_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.academic_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Create policies for public viewing
CREATE POLICY "Public can view active academic pages" ON public.academic_pages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active downloads" ON public.academic_downloads
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active timetables" ON public.timetables
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active fees" ON public.fees_structure
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active scholarships" ON public.scholarships
  FOR SELECT USING (is_active = true);

-- Create admin policies for all operations
CREATE POLICY "Admins can manage academic pages" ON public.academic_pages
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Admins can manage downloads" ON public.academic_downloads
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Admins can manage timetables" ON public.timetables
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Admins can manage fees" ON public.fees_structure
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Admins can manage scholarships" ON public.scholarships
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
  ));

-- Add triggers for updated_at columns
CREATE TRIGGER update_academic_pages_updated_at
  BEFORE UPDATE ON public.academic_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academic_downloads_updated_at
  BEFORE UPDATE ON public.academic_downloads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_timetables_updated_at
  BEFORE UPDATE ON public.timetables
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fees_structure_updated_at
  BEFORE UPDATE ON public.fees_structure
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scholarships_updated_at
  BEFORE UPDATE ON public.scholarships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for academic content
INSERT INTO storage.buckets (id, name, public) VALUES ('academic-documents', 'academic-documents', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('timetables', 'timetables', true);

-- Create storage policies
CREATE POLICY "Public can view academic documents" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'academic-documents');

CREATE POLICY "Admins can upload academic documents" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'academic-documents' AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Admins can update academic documents" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'academic-documents' AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
  ));

CREATE POLICY "Public can view timetable files" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'timetables');

CREATE POLICY "Admins can upload timetable files" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'timetables' AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'::user_role
  ));