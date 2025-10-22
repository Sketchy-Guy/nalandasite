from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from core.models import HeroImage, Notice, Magazine, Club, AcademicService, Topper, CreativeWork, CampusStats, News, ContactInfo
import os
from PIL import Image
import io

class Command(BaseCommand):
    help = 'Add demo data with sample images for testing admin managers'

    def handle(self, *args, **options):
        self.stdout.write('Adding demo data with sample images...')

        # Create demo images
        self.create_demo_images()
        
        # Add hero images with demo images
        self.add_hero_images()
        
        # Add more notices
        self.add_notices()
        
        # Add magazines
        self.add_magazines()
        
        # Add more clubs
        self.add_clubs()
        
        # Add more toppers
        self.add_toppers()
        
        # Add creative works
        self.add_creative_works()
        
        # Add campus stats
        self.add_campus_stats()
        
        # Add news
        self.add_news()
        
        # Add contact info
        self.add_contact_info()

        self.stdout.write(
            self.style.SUCCESS('Successfully added demo data with sample images!')
        )

    def create_demo_images(self):
        """Create sample images for testing"""
        # Create sample images of different sizes and colors
        colors = [
            (255, 99, 71),   # Tomato
            (135, 206, 235), # Sky Blue
            (144, 238, 144), # Light Green
            (255, 182, 193), # Light Pink
            (221, 160, 221), # Plum
        ]
        
        for i, color in enumerate(colors, 1):
            # Create a simple colored rectangle image
            img = Image.new('RGB', (800, 400), color)
            
            # Save to BytesIO
            img_io = io.BytesIO()
            img.save(img_io, format='JPEG', quality=85)
            img_io.seek(0)
            
            # Save to media folder
            filename = f'demo_hero_{i}.jpg'
            default_storage.save(f'hero_images/{filename}', ContentFile(img_io.read()))
            
            self.stdout.write(f'Created demo image: {filename}')

    def add_hero_images(self):
        """Add hero images with demo images"""
        hero_data = [
            {
                'title': 'Welcome to Nalanda Institute of Technology',
                'description': 'Excellence in Education, Innovation in Research',
                'display_order': 1,
                'image_path': 'hero_images/demo_hero_1.jpg'
            },
            {
                'title': 'State-of-the-Art Campus',
                'description': 'Modern facilities for comprehensive learning experience',
                'display_order': 2,
                'image_path': 'hero_images/demo_hero_2.jpg'
            },
            {
                'title': 'Research & Innovation Hub',
                'description': 'Fostering creativity and technological advancement',
                'display_order': 3,
                'image_path': 'hero_images/demo_hero_3.jpg'
            },
            {
                'title': 'Student Life & Activities',
                'description': 'Vibrant campus life with diverse opportunities',
                'display_order': 4,
                'image_path': 'hero_images/demo_hero_4.jpg'
            },
            {
                'title': 'Industry Partnerships',
                'description': 'Connecting academia with industry leaders',
                'display_order': 5,
                'image_path': 'hero_images/demo_hero_5.jpg'
            }
        ]

        for data in hero_data:
            hero_image, created = HeroImage.objects.get_or_create(
                title=data['title'],
                defaults={
                    'description': data['description'],
                    'display_order': data['display_order'],
                    'image': data['image_path'],
                    'is_active': True
                }
            )
            if created:
                self.stdout.write(f'Created hero image: {data["title"]}')

    def add_notices(self):
        """Add more notices for testing"""
        notices_data = [
            {
                'title': 'Mid-Semester Examinations Schedule',
                'description': 'Mid-semester examinations will be conducted from April 15-20, 2024. Students are advised to check the detailed schedule on the academic portal.',
                'category': 'Academic',
                'priority': 'High',
                'is_new': True
            },
            {
                'title': 'Technical Symposium 2024',
                'description': 'Annual technical symposium "TechFest 2024" will be held on April 25-27. Registration is now open for all students.',
                'category': 'Events',
                'priority': 'Medium',
                'is_new': True
            },
            {
                'title': 'Library Extended Hours',
                'description': 'Library will remain open 24/7 during examination period from April 10-30, 2024.',
                'category': 'General',
                'priority': 'Medium',
                'is_new': False
            },
            {
                'title': 'Scholarship Applications Open',
                'description': 'Merit-based scholarship applications are now open. Last date for submission is April 30, 2024.',
                'category': 'Financial',
                'priority': 'High',
                'is_new': True
            },
            {
                'title': 'Sports Week 2024',
                'description': 'Annual sports week will be conducted from May 1-7, 2024. Registration for various events is now open.',
                'category': 'Sports',
                'priority': 'Medium',
                'is_new': True
            }
        ]

        for notice_data in notices_data:
            notice, created = Notice.objects.get_or_create(
                title=notice_data['title'],
                defaults=notice_data
            )
            if created:
                self.stdout.write(f'Created notice: {notice_data["title"]}')

    def add_magazines(self):
        """Add magazines for testing"""
        magazines_data = [
            {
                'title': 'NIT Chronicle - April 2024',
                'description': 'Monthly newsletter featuring student achievements, faculty research, and campus events.',
                'issue_date': '2024-04-01'
            },
            {
                'title': 'Tech Today - March 2024',
                'description': 'Technical magazine showcasing innovative projects and research papers.',
                'issue_date': '2024-03-15'
            },
            {
                'title': 'Campus Life Quarterly',
                'description': 'Quarterly magazine covering student life, clubs, and cultural activities.',
                'issue_date': '2024-03-01'
            }
        ]

        for magazine_data in magazines_data:
            magazine, created = Magazine.objects.get_or_create(
                title=magazine_data['title'],
                defaults=magazine_data
            )
            if created:
                self.stdout.write(f'Created magazine: {magazine_data["title"]}')

    def add_clubs(self):
        """Add more clubs for testing"""
        clubs_data = [
            {
                'name': 'AI & Machine Learning Club',
                'description': 'Exploring artificial intelligence and machine learning technologies through workshops and projects.',
                'icon': 'Brain',
                'member_count': 180,
                'event_count': 15
            },
            {
                'name': 'Entrepreneurship Cell',
                'description': 'Fostering entrepreneurial spirit and supporting startup initiatives among students.',
                'icon': 'Lightbulb',
                'member_count': 120,
                'event_count': 8
            },
            {
                'name': 'Environmental Club',
                'description': 'Promoting environmental awareness and sustainability practices on campus.',
                'icon': 'Leaf',
                'member_count': 95,
                'event_count': 12
            },
            {
                'name': 'Debate Society',
                'description': 'Enhancing communication skills through debates, discussions, and public speaking events.',
                'icon': 'MessageSquare',
                'member_count': 75,
                'event_count': 18
            }
        ]

        for club_data in clubs_data:
            club, created = Club.objects.get_or_create(
                name=club_data['name'],
                defaults=club_data
            )
            if created:
                self.stdout.write(f'Created club: {club_data["name"]}')

    def add_toppers(self):
        """Add more toppers for testing"""
        toppers_data = [
            {
                'name': 'Arjun Mehta',
                'department': 'Computer Science & Engineering',
                'cgpa': 9.78,
                'achievements': ['Dean\'s List', 'Best Coding Project', 'Research Publication'],
                'year': 2024,
                'rank': 4
            },
            {
                'name': 'Kavya Patel',
                'department': 'Information Technology',
                'cgpa': 9.65,
                'achievements': ['Academic Excellence', 'Internship Award'],
                'year': 2024,
                'rank': 5
            },
            {
                'name': 'Rohit Sharma',
                'department': 'Mechanical Engineering',
                'cgpa': 9.58,
                'achievements': ['Design Competition Winner', 'Industry Project'],
                'year': 2024,
                'rank': 6
            }
        ]

        for topper_data in toppers_data:
            topper, created = Topper.objects.get_or_create(
                name=topper_data['name'],
                year=topper_data['year'],
                defaults=topper_data
            )
            if created:
                self.stdout.write(f'Created topper: {topper_data["name"]}')

    def add_creative_works(self):
        """Add creative works for testing"""
        works_data = [
            {
                'title': 'Smart City IoT Dashboard',
                'description': 'Interactive dashboard for monitoring smart city infrastructure using IoT sensors.',
                'author_name': 'Team Alpha',
                'author_department': 'Computer Science & Engineering',
                'category': 'Technology',
                'is_featured': True
            },
            {
                'title': 'Sustainable Energy Solutions',
                'description': 'Research project on renewable energy integration in urban environments.',
                'author_name': 'Green Team',
                'author_department': 'Electrical Engineering',
                'category': 'Technology',
                'is_featured': True
            },
            {
                'title': 'Campus Photography Series',
                'description': 'Artistic photography capturing the beauty and essence of campus life.',
                'author_name': 'Priya Gupta',
                'author_department': 'Master of Computer Applications',
                'category': 'Art',
                'is_featured': False
            },
            {
                'title': 'Student Life Chronicles',
                'description': 'Collection of short stories and poems about college experiences.',
                'author_name': 'Literary Circle',
                'author_department': 'Bachelor of Computer Applications',
                'category': 'Literature',
                'is_featured': False
            }
        ]

        for work_data in works_data:
            work, created = CreativeWork.objects.get_or_create(
                title=work_data['title'],
                defaults=work_data
            )
            if created:
                self.stdout.write(f'Created creative work: {work_data["title"]}')

    def add_campus_stats(self):
        """Add campus statistics for testing"""
        stats_data = [
            {
                'stat_name': 'Students Enrolled',
                'stat_value': '2,500+',
                'description': 'Total number of students across all programs',
                'icon': 'Users',
                'display_order': 1
            },
            {
                'stat_name': 'Faculty Members',
                'stat_value': '150+',
                'description': 'Experienced and qualified faculty',
                'icon': 'GraduationCap',
                'display_order': 2
            },
            {
                'stat_name': 'Placement Rate',
                'stat_value': '95%',
                'description': 'Students placed in top companies',
                'icon': 'TrendingUp',
                'display_order': 3
            },
            {
                'stat_name': 'Research Projects',
                'stat_value': '50+',
                'description': 'Ongoing research initiatives',
                'icon': 'Award',
                'display_order': 4
            }
        ]

        for stat_data in stats_data:
            stat, created = CampusStats.objects.get_or_create(
                stat_name=stat_data['stat_name'],
                defaults=stat_data
            )
            if created:
                self.stdout.write(f'Created campus stat: {stat_data["stat_name"]}')

    def add_news(self):
        """Add news for testing"""
        news_data = [
            {
                'title': 'NIT Wins National Coding Championship',
                'description': 'Our computer science students secured first place in the national coding competition.',
                'content': 'The team consisting of final year students from CSE department showcased exceptional programming skills...',
                'category': 'Achievements',
                'priority': 'High',
                'is_featured': True,
                'is_new': True
            },
            {
                'title': 'New Research Lab Inaugurated',
                'description': 'State-of-the-art AI and Machine Learning research lab opened for students and faculty.',
                'content': 'The new lab is equipped with latest hardware and software for advanced research in artificial intelligence...',
                'category': 'Academic',
                'priority': 'Medium',
                'is_featured': True,
                'is_new': True
            },
            {
                'title': 'Annual Cultural Fest Announced',
                'description': 'Three-day cultural extravaganza featuring music, dance, and literary competitions.',
                'content': 'The annual cultural fest will showcase talent from students across all departments...',
                'category': 'Events',
                'priority': 'Medium',
                'is_featured': False,
                'is_new': True
            }
        ]

        for news_item in news_data:
            news, created = News.objects.get_or_create(
                title=news_item['title'],
                defaults=news_item
            )
            if created:
                self.stdout.write(f'Created news: {news_item["title"]}')

    def add_contact_info(self):
        """Add contact information for testing"""
        contact_data = [
            {
                'contact_type': 'General',
                'title': 'Main Office',
                'phone': '+91-1234567890',
                'email': 'info@nalanda.edu.in',
                'address': 'Nalanda Institute of Technology, Education City, Bihar - 803111',
                'office_hours': '9:00 AM - 5:00 PM (Mon-Fri)',
                'display_order': 1
            },
            {
                'contact_type': 'Admissions',
                'title': 'Admissions Office',
                'phone': '+91-1234567891',
                'email': 'admissions@nalanda.edu.in',
                'address': 'Admissions Block, Ground Floor',
                'office_hours': '9:00 AM - 4:00 PM (Mon-Sat)',
                'display_order': 2
            },
            {
                'contact_type': 'Academic',
                'title': 'Academic Office',
                'phone': '+91-1234567892',
                'email': 'academic@nalanda.edu.in',
                'address': 'Academic Block, First Floor',
                'office_hours': '10:00 AM - 4:00 PM (Mon-Fri)',
                'display_order': 3
            },
            {
                'contact_type': 'Placement',
                'title': 'Training & Placement Cell',
                'phone': '+91-1234567893',
                'email': 'placement@nalanda.edu.in',
                'address': 'T&P Block, Second Floor',
                'office_hours': '9:30 AM - 5:30 PM (Mon-Fri)',
                'display_order': 4
            }
        ]

        for contact in contact_data:
            contact_info, created = ContactInfo.objects.get_or_create(
                contact_type=contact['contact_type'],
                title=contact['title'],
                defaults=contact
            )
            if created:
                self.stdout.write(f'Created contact info: {contact["title"]}')
