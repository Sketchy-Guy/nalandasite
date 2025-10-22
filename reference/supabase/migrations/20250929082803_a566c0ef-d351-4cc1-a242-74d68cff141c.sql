-- Phase 1 Final: Sample Activities, Events, News and Campus Statistics
-- Populate student_activities
INSERT INTO student_activities (name, description, category, member_count, coordinator_name, coordinator_email, meeting_schedule, location, achievements, image_url, is_active) VALUES
('Robotics Club', 'A platform for students to explore robotics, automation, and artificial intelligence through hands-on projects and competitions.', 'technical', 85, 'Dr. Amit Sharma', 'robotics@nitnalanda.ac.in', 'Every Saturday 2:00 PM', 'Lab Block - Room 205', ARRAY['Winner at Inter-NIT Robotics Competition 2023', 'Best Innovation Award at State Tech Fest', 'Published research in automation journals'], 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true),

('Cultural Society', 'Organizing cultural events, festivals, and promoting artistic talents among students.', 'cultural', 120, 'Prof. Priya Verma', 'culture@nitnalanda.ac.in', 'Every Wednesday 5:00 PM', 'Auditorium Complex', ARRAY['Best Cultural Event - Annual Tech Fest 2023', 'State Youth Festival Winners', 'International Cultural Exchange Programs'], 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true),

('Debate Society', 'Enhancing communication skills, critical thinking, and public speaking abilities of students.', 'academic', 45, 'Dr. Rajesh Kumar', 'debate@nitnalanda.ac.in', 'Every Friday 4:00 PM', 'Seminar Hall 1', ARRAY['National Parliamentary Debate Champions', 'Inter-college debate winners', 'Model UN participation'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true),

('Entrepreneurship Cell', 'Fostering entrepreneurial spirit and supporting startup initiatives among students.', 'innovation', 65, 'Dr. Sunita Agarwal', 'ecell@nitnalanda.ac.in', 'Every Tuesday 6:00 PM', 'Innovation Hub', ARRAY['5 successful startups launched', 'Funding support of Rs. 50 lakhs secured', 'Industry mentorship programs'], 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true);

-- Populate social_initiatives
INSERT INTO social_initiatives (title, description, category, start_date, end_date, organizer, participants_count, impact_metrics, status, image_url, gallery_images, is_featured, is_active) VALUES
('Digital Literacy Campaign', 'Teaching basic computer skills and digital literacy to rural communities around NIT Nalanda.', 'education', '2024-01-15', '2024-06-30', 'NSS Unit - NIT Nalanda', 150, 'Trained 500+ villagers in basic computer skills and internet usage', 'active', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'], true, true),

('Clean Campus Initiative', 'Environmental conservation and waste management program for sustainable campus development.', 'environment', '2024-02-01', '2024-12-31', 'Green Campus Committee', 200, 'Reduced campus waste by 40%, planted 1000+ trees', 'active', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['https://images.unsplash.com/photo-1542739074-c943b0d4acb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'], false, true),

('Health Awareness Drive', 'Organizing health camps and awareness programs for local communities.', 'healthcare', '2024-03-10', '2024-03-17', 'Medical Club & NSS', 75, 'Conducted health checkups for 1000+ people, distributed medicines', 'completed', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['https://images.unsplash.com/photo-1559757175-0eb30cd3392b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'], false, true);

-- Populate campus_events
INSERT INTO campus_events (title, description, event_type, start_date, end_date, venue, organizer, registration_required, max_participants, image_url, is_featured, is_active) VALUES
('TechnoNIT 2024', 'Annual technical festival featuring competitions, workshops, and guest lectures by industry experts.', 'festival', '2024-04-15', '2024-04-17', 'Main Campus', 'Technical Committee', true, 2000, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true, true),

('Cultural Euphoria', 'Three-day cultural extravaganza showcasing music, dance, drama, and literary events.', 'cultural', '2024-03-25', '2024-03-27', 'Auditorium Complex', 'Cultural Committee', true, 1500, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', true, true),

('Sports Carnival', 'Inter-department sports competition featuring various indoor and outdoor games.', 'sports', '2024-02-20', '2024-02-25', 'Sports Complex', 'Sports Committee', false, 800, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', false, true),

('Innovation Summit', 'Showcasing student innovations, startup pitches, and technology demonstrations.', 'workshop', '2024-05-10', '2024-05-11', 'Innovation Hub', 'Entrepreneurship Cell', true, 300, 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', false, true);

-- Populate campus_stats with meaningful data
INSERT INTO campus_stats (stat_name, stat_value, description, icon, display_order, is_active) VALUES
('Total Students', '3,500+', 'Enrolled students across all departments and programs', 'Users', 1, true),
('Faculty Members', '150+', 'Experienced faculty with Ph.D. and industry expertise', 'BookOpen', 2, true),
('Campus Area', '125 Acres', 'Sprawling green campus with modern infrastructure', 'MapPin', 3, true),
('Placement Rate', '92%', 'Average placement rate in top companies', 'TrendingUp', 4, true),
('Research Papers', '200+', 'Published research papers in international journals', 'FileText', 5, true),
('Industry Partners', '50+', 'Active collaborations with leading companies', 'Building', 6, true);

-- Populate news_announcements
INSERT INTO news_announcements (title, content, summary, category, author, publish_date, image_url, tags, is_featured, is_active) VALUES
('NIT Nalanda Achieves NAAC A+ Grade', 'National Institute of Technology Nalanda has been awarded the prestigious NAAC A+ grade for its excellence in academic quality, infrastructure, and student outcomes. This recognition places NIT Nalanda among the top engineering institutions in India.', 'NIT Nalanda receives NAAC A+ accreditation for academic excellence', 'achievement', 'Admin Office', '2024-01-15', 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['NAAC', 'Accreditation', 'Achievement'], true, true),

('Annual Convocation 2024 Announced', 'The Annual Convocation ceremony for the graduating batch of 2024 will be held on March 30, 2024. Distinguished alumni and industry leaders will grace the occasion.', 'Annual Convocation 2024 scheduled for March 30', 'announcement', 'Academic Section', '2024-01-20', 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['Convocation', 'Graduation', '2024'], false, true),

('New Research Laboratory Inaugurated', 'A state-of-the-art AI and Machine Learning research laboratory has been inaugurated in the Computer Science department, equipped with latest hardware and software tools.', 'New AI/ML research lab opens in CSE department', 'infrastructure', 'CSE Department', '2024-01-25', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['Research', 'Laboratory', 'AI', 'ML'], false, true);