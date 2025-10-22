-- Phase 1: Department Data Enhancement - Fix array syntax
-- Update existing departments with comprehensive information

UPDATE departments SET 
  hero_image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  mission = 'To provide comprehensive postgraduate education in computer applications, emphasizing practical skills and research capabilities.',
  vision = 'To be a premier MCA program producing highly skilled professionals ready for leadership roles in the IT industry.',
  facilities = ARRAY['Advanced Programming Lab', 'Software Engineering Lab', 'Data Analytics Lab', 'Project Development Center', 'Research Lab', 'Seminar Hall'],
  programs_offered = ARRAY['Master of Computer Applications (MCA)', 'Research Programs', 'Industry Collaboration Projects', 'Internship Programs'],
  achievements = ARRAY['High employment rate in top IT companies', 'Outstanding academic performance', 'Industry-relevant curriculum', 'Strong alumni network'],
  gallery_images = ARRAY['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
WHERE code = 'MCA';

UPDATE departments SET 
  hero_image_url = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  mission = 'To provide quality undergraduate education in computer applications and prepare students for successful careers in IT and software industry.',
  vision = 'To be a leading BCA program known for academic excellence and industry readiness of graduates.',
  facilities = ARRAY['Programming Laboratory', 'Computer Fundamentals Lab', 'Web Design Studio', 'Project Lab', 'Digital Library', 'Student Computing Center'],
  programs_offered = ARRAY['Bachelor of Computer Applications (BCA)', 'Add-on Courses', 'Skill Development Programs', 'Industry Training'],
  achievements = ARRAY['Excellent academic results', 'Strong industry placements', 'Student innovation projects', 'Active coding clubs'],
  gallery_images = ARRAY['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1515378791036-0648a814c963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
WHERE code = 'BCA';

UPDATE departments SET 
  hero_image_url = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  mission = 'To provide world-class business education, develop ethical business leaders, and contribute to the advancement of management knowledge and practice.',
  vision = 'To be a premier business school recognized for academic excellence, industry relevance, and global perspective.',
  facilities = ARRAY['Executive Classroom', 'Case Study Hall', 'Business Simulation Lab', 'Corporate Boardroom', 'Management Library', 'Entrepreneurship Center'],
  programs_offered = ARRAY['Master of Business Administration (MBA)', 'Executive MBA', 'Management Development Programs', 'Industry Workshops'],
  achievements = ARRAY['High placement rates in top companies', 'Industry mentorship programs', 'Student entrepreneurship initiatives', 'International collaborations'],
  gallery_images = ARRAY['https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1515378791036-0648a814c963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
WHERE code = 'MBA';

UPDATE departments SET 
  hero_image_url = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  mission = 'To provide comprehensive IT education, develop technical expertise, and create industry-ready professionals capable of driving digital innovation.',
  vision = 'To be a leading department in information technology education, fostering innovation and entrepreneurship in the digital age.',
  facilities = ARRAY['Network Administration Lab', 'Database Management Lab', 'Web Development Studio', 'Mobile App Development Lab', 'Cloud Computing Center', 'IT Infrastructure Lab'],
  programs_offered = ARRAY['B.Tech Information Technology', 'M.Tech IT', 'Diploma in IT', 'Industry Certification Programs'],
  achievements = ARRAY['Industry partnerships with leading tech companies', '95% placement rate in IT sector', 'Award-winning student projects', 'Active research in emerging technologies'],
  gallery_images = ARRAY['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
WHERE code = 'IT';

UPDATE departments SET 
  hero_image_url = 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  mission = 'To provide excellent education in electrical engineering, conduct impactful research, and develop professionals who can contribute to technological advancement.',
  vision = 'To be a center of excellence in electrical engineering education and research, addressing societal needs through innovation.',
  facilities = ARRAY['Power Systems Laboratory', 'Electronics & Communication Lab', 'Control Systems Lab', 'Electrical Machines Lab', 'Renewable Energy Lab', 'High Voltage Lab'],
  programs_offered = ARRAY['B.Tech Electrical Engineering', 'M.Tech Electrical Engineering', 'Ph.D. in Electrical Engineering', 'Diploma in Electrical Engineering'],
  achievements = ARRAY['Modern laboratory infrastructure', 'Research in renewable energy', 'Industry partnerships', 'Student achievements in competitions'],
  gallery_images = ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1581092446248-4efdf17fb23b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
WHERE code = 'EEE';

UPDATE departments SET 
  hero_image_url = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  mission = 'To provide comprehensive civil engineering education, promote sustainable development practices, and develop engineers capable of building better infrastructure.',
  vision = 'To be a leading civil engineering department contributing to infrastructure development and environmental sustainability.',
  facilities = ARRAY['Structural Engineering Lab', 'Geotechnical Engineering Lab', 'Environmental Engineering Lab', 'Transportation Engineering Lab', 'Materials Testing Lab', 'Survey Laboratory'],
  programs_offered = ARRAY['B.Tech Civil Engineering', 'M.Tech Civil Engineering', 'Ph.D. in Civil Engineering', 'Diploma in Civil Engineering'],
  achievements = ARRAY['Well-equipped laboratories', 'Research in sustainable construction', 'Government project collaborations', 'Student fieldwork and site visits'],
  gallery_images = ARRAY['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
WHERE code = 'CIVIL';

UPDATE departments SET 
  hero_image_url = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  mission = 'To provide cutting-edge education in computer science and engineering, fostering innovation and research excellence.',
  vision = 'To be a premier department producing world-class computer science professionals and researchers.',
  facilities = ARRAY['Advanced Programming Labs', 'AI/ML Research Lab', 'Data Science Center', 'Cybersecurity Lab', 'Software Engineering Lab', 'High Performance Computing Center'],
  programs_offered = ARRAY['B.Tech Computer Science', 'M.Tech CSE', 'Ph.D. in CSE', 'Integrated M.Tech Programs'],
  achievements = ARRAY['Top placement records', 'Research publications in reputed journals', 'Industry collaborations', 'Student achievements in coding competitions'],
  gallery_images = ARRAY['https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
WHERE code = 'CSE';

UPDATE departments SET 
  hero_image_url = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  mission = 'To provide comprehensive mechanical engineering education with emphasis on innovation, design, and manufacturing excellence.',
  vision = 'To be a leading mechanical engineering department contributing to technological advancement and sustainable development.',
  facilities = ARRAY['Machine Shop', 'CAD/CAM Lab', 'Thermal Engineering Lab', 'Fluid Mechanics Lab', 'Manufacturing Lab', 'Robotics Workshop'],
  programs_offered = ARRAY['B.Tech Mechanical Engineering', 'M.Tech Mechanical Engineering', 'Ph.D. in Mechanical Engineering', 'Design and Manufacturing Programs'],
  achievements = ARRAY['Industry partnerships', 'Research in sustainable technologies', 'Student projects in automation', 'Government consultancy projects'],
  gallery_images = ARRAY['https://images.unsplash.com/photo-1565043666747-69f6646db940?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1581094651181-35942459ef62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
WHERE code = 'MECHANICAL';