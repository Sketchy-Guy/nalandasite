-- Phase 1 Continued: About Pages, Campus Life, Leadership and Sample Content
-- Populate about_pages with essential content

INSERT INTO about_pages (page_type, title, content, meta_description, image_url, display_order, is_active) VALUES
('vision-mission', 'Vision & Mission', 'Our Vision: To emerge as a premier National Institute of Technology recognized globally for excellence in engineering education, research, and innovation. We aspire to produce competent and ethical engineers who contribute significantly to society and industry.

Our Mission: To provide world-class technical education through innovative teaching-learning processes, cutting-edge research, and industry partnerships. We are committed to developing human resources with strong technical competence, leadership qualities, and ethical values.', 'Learn about NIT Nalanda vision, mission, and core values driving educational excellence', 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', 1, true),

('history', 'History', 'National Institute of Technology Nalanda was established in 2010 as one of the premier technical institutions in India. Located in the historically rich region of Nalanda, Bihar, the institute carries forward the legacy of learning and knowledge dissemination that this land has been known for since ancient times.

The institute started its journey with undergraduate programs in various engineering disciplines and has since expanded to include postgraduate and doctoral programs. With state-of-the-art infrastructure, world-class faculty, and modern laboratories, NIT Nalanda has established itself as a center of excellence in technical education.', 'Discover the rich history and heritage of NIT Nalanda since its establishment in 2010', 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', 2, true),

('awards', 'Awards & Recognitions', 'NIT Nalanda has received numerous awards and recognitions for its excellence in education, research, and innovation. Our achievements reflect our commitment to maintaining the highest standards in technical education.

Key Awards:
• NAAC A+ Grade for Academic Excellence
• NBA Accreditation for Engineering Programs  
• NIRF Ranking among Top Engineering Institutes
• Excellence in Research and Innovation Awards
• Industry Partnership Awards
• Best Campus Infrastructure Recognition', 'Explore awards, recognitions and achievements of NIT Nalanda in education and research', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', 3, true);

-- Populate leadership messages
INSERT INTO leadership_messages (position, name, designation, message, photo_url, qualifications, is_active) VALUES
('director', 'Prof. Dr. Rajesh Kumar Singh', 'Director, NIT Nalanda', 'Welcome to the National Institute of Technology Nalanda. As we stand on the threshold of a new era in technical education, I am proud to lead an institution that embodies the spirit of innovation, excellence, and holistic development.

At NIT Nalanda, we are committed to nurturing young minds who will shape the future of technology and society. Our focus extends beyond academic excellence to include character building, leadership development, and social responsibility.

I encourage all our students to embrace challenges, think creatively, and strive for excellence in all endeavors. Together, we will build a brighter future for our nation and the world.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'Ph.D. in Computer Science, M.Tech, B.Tech', true),

('chairman', 'Shri Anil Kumar Jha', 'Chairman, Board of Governors', 'It gives me immense pleasure to address the NIT Nalanda community. As Chairman of the Board of Governors, I have witnessed the remarkable growth and transformation of this institution since its inception.

Our commitment to providing world-class technical education while maintaining our cultural values remains unwavering. The institute has consistently produced graduates who excel in their chosen fields and contribute meaningfully to society.

I am confident that NIT Nalanda will continue to be a beacon of excellence, fostering innovation and nurturing talent that will drive India technological advancement.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'M.A., LL.B., Former IAS Officer', true);

-- Populate campus_life_content
INSERT INTO campus_life_content (page_slug, title, content, hero_image_url, features, highlights, gallery_images, display_order, is_active) VALUES
('student-activities', 'Student Activities', 'Student life at NIT Nalanda is vibrant and diverse, offering numerous opportunities for personal growth, skill development, and leadership. Our students actively participate in various technical, cultural, and social activities that enhance their overall personality development.

The institute encourages students to explore their interests beyond academics through clubs, societies, and competitions. These activities not only provide a platform for creativity and innovation but also help in building lasting friendships and professional networks.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', ARRAY['Technical Societies', 'Cultural Clubs', 'Sports Teams', 'Leadership Programs', 'Community Service', 'Innovation Hubs'], ARRAY['Active participation in national competitions', 'Regular cultural events and festivals', 'Strong alumni network', 'Industry mentorship programs'], ARRAY['https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'], 1, true),

('sports', 'Sports & Recreation', 'Physical fitness and sports play a crucial role in the holistic development of our students. NIT Nalanda provides excellent sports facilities and encourages participation in various indoor and outdoor games.

Our sports complex includes modern facilities for cricket, football, basketball, volleyball, tennis, badminton, and athletics. The institute also has a well-equipped gymnasium and swimming pool for fitness enthusiasts.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', ARRAY['Modern Sports Complex', 'Swimming Pool', 'Gymnasium', 'Indoor Games Arena', 'Athletic Track', 'Professional Coaching'], ARRAY['Inter-NIT sports competitions', 'State and national level participation', 'Regular fitness programs', 'Professional sports coaching'], ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'], 2, true),

('hostel', 'Hostel Life', 'The hostel experience at NIT Nalanda is an integral part of student life, fostering independence, friendship, and personal growth. Our well-maintained hostels provide a safe and comfortable living environment for students.

Each hostel is equipped with modern amenities including high-speed internet, common rooms, study areas, and recreational facilities. The hostel mess provides nutritious and hygienic food with diverse menu options.', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', ARRAY['Separate hostels for boys and girls', '24/7 security', 'Wi-Fi connectivity', 'Common rooms and study areas', 'Mess facilities', 'Medical facilities'], ARRAY['Comfortable accommodation for 2000+ students', 'Experienced wardens and staff', 'Cultural and recreational activities', 'Peer learning environment'], ARRAY['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'], 3, true);