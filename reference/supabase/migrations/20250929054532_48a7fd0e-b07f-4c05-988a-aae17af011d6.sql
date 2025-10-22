-- Create student_submissions table for creativity hub workflow
CREATE TABLE public.student_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  file_url TEXT,
  image_url TEXT,
  department TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES profiles(user_id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_comments TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on student_submissions
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_submissions
CREATE POLICY "Users can submit their own works" ON public.student_submissions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own submissions" ON public.student_submissions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view approved submissions" ON public.student_submissions
FOR SELECT USING (status = 'approved');

CREATE POLICY "Admins can manage all submissions" ON public.student_submissions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_roles ar
    WHERE ar.user_id = auth.uid() 
    AND ar.is_active = true
    AND (ar.role_level <= 3 OR ar.expires_at IS NULL OR ar.expires_at > NOW())
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_student_submissions_updated_at
BEFORE UPDATE ON public.student_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add storage bucket for student submissions
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-submissions', 'student-submissions', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for student submissions
CREATE POLICY "Users can upload submission files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'student-submissions' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view approved submission files" ON storage.objects
FOR SELECT USING (bucket_id = 'student-submissions');

CREATE POLICY "Users can update their own submission files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'student-submissions' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can manage submission files" ON storage.objects
FOR ALL USING (
  bucket_id = 'student-submissions' 
  AND EXISTS (
    SELECT 1 FROM admin_roles ar
    WHERE ar.user_id = auth.uid() 
    AND ar.is_active = true
    AND ar.role_level <= 3
  )
);