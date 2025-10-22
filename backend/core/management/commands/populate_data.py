from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import (
    Department, Club, AcademicService, Notice, Topper, CreativeWork, Magazine
)
from authentication.models import Profile

class Command(BaseCommand):
    help = 'Populate database with initial data from Supabase migration'

    def handle(self, *args, **options):
        self.stdout.write('Populating database with initial data...')

        # Create departments
        departments_data = [
            {'name': 'Computer Science & Engineering', 'code': 'CSE', 'description': 'Leading department in software and computer systems'},
            {'name': 'Information Technology', 'code': 'CST', 'description': 'Focus on modern IT solutions and technology'},
            {'name': 'Master of Computer Applications', 'code': 'MCA', 'description': 'Advanced computer applications and research'},
            {'name': 'Bachelor of Computer Applications', 'code': 'BCA', 'description': 'Undergraduate computer applications program'},
            {'name': 'Mechanical Engineering', 'code': 'MECHANICAL', 'description': 'Engineering mechanics and manufacturing'},
            {'name': 'Electrical Engineering', 'code': 'ELECTRICAL', 'description': 'Power systems and electrical technology'},
            {'name': 'Civil Engineering', 'code': 'CIVIL', 'description': 'Infrastructure and construction engineering'},
            {'name': 'Master of Business Administration', 'code': 'MBA', 'description': 'Business leadership and management'},
        ]

        for dept_data in departments_data:
            Department.objects.get_or_create(
                code=dept_data['code'],
                defaults=dept_data
            )

        # Create clubs
        clubs_data = [
            {'name': 'Robotics Club', 'description': 'Building autonomous robots and competing in national competitions', 'icon': 'Bot', 'member_count': 150, 'event_count': 12},
            {'name': 'Literary Society', 'description': 'Promoting reading, writing, and literary discussions', 'icon': 'BookOpen', 'member_count': 200, 'event_count': 8},
            {'name': 'Music Club', 'description': 'Organizing concerts and promoting musical talents', 'icon': 'Music', 'member_count': 180, 'event_count': 15},
            {'name': 'Photography Club', 'description': 'Capturing campus life and conducting photo walks', 'icon': 'Camera', 'member_count': 120, 'event_count': 10},
            {'name': 'Coding Club', 'description': 'Competitive programming and hackathons', 'icon': 'Code', 'member_count': 250, 'event_count': 20},
            {'name': 'Drama Society', 'description': 'Stage performances and dramatic arts', 'icon': 'Theater', 'member_count': 90, 'event_count': 6},
        ]

        for club_data in clubs_data:
            Club.objects.get_or_create(
                name=club_data['name'],
                defaults=club_data
            )

        # Create academic services
        services_data = [
            {'name': 'Timetable', 'description': 'Access current semester timetables and schedules', 'icon': 'Calendar', 'link_url': '/academic/timetable'},
            {'name': 'Fees & Scholarships', 'description': 'Fee structure and scholarship opportunities', 'icon': 'Bookmark', 'link_url': '/academic/fees'},
            {'name': 'Academic Transcripts', 'description': 'Request transcripts and academic documents', 'icon': 'FileText', 'link_url': '/academic/transcripts'},
            {'name': 'Online Library', 'description': 'Digital resources and research materials', 'icon': 'Library', 'link_url': '/academic/library'},
        ]

        for service_data in services_data:
            AcademicService.objects.get_or_create(
                name=service_data['name'],
                defaults=service_data
            )

        # Create notices
        notices_data = [
            {'title': 'Semester Registration Open', 'description': 'Registration for Spring 2024 semester is now open. Students must complete registration by March 15th.', 'category': 'Academic', 'priority': 'High'},
            {'title': 'Annual Sports Meet', 'description': 'The annual inter-departmental sports meet will be held from March 20-25, 2024.', 'category': 'Sports', 'priority': 'Medium'},
            {'title': 'Guest Lecture Series', 'description': 'Industry experts will deliver lectures on emerging technologies. Schedule available on website.', 'category': 'Academic', 'priority': 'Medium'},
            {'title': 'Hostel Fee Payment', 'description': 'Hostel fees for the current semester are due by March 10th. Late fees will apply after the deadline.', 'category': 'Financial', 'priority': 'High'},
        ]

        for notice_data in notices_data:
            Notice.objects.get_or_create(
                title=notice_data['title'],
                defaults=notice_data
            )

        # Create toppers
        toppers_data = [
            {'name': 'Priya Sharma', 'department': 'Computer Science & Engineering', 'cgpa': 9.85, 'achievements': ['Gold Medal', 'Best Project Award', 'Academic Excellence'], 'year': 2024, 'rank': 1},
            {'name': 'Rahul Kumar', 'department': 'Information Technology', 'cgpa': 9.72, 'achievements': ['Silver Medal', 'Innovation Award'], 'year': 2024, 'rank': 2},
            {'name': 'Anjali Singh', 'department': 'Master of Computer Applications', 'cgpa': 9.68, 'achievements': ['Research Excellence', 'Leadership Award'], 'year': 2024, 'rank': 3},
        ]

        for topper_data in toppers_data:
            Topper.objects.get_or_create(
                name=topper_data['name'],
                year=topper_data['year'],
                defaults=topper_data
            )

        # Create creative works
        works_data = [
            {'title': 'Digital Art Exhibition', 'description': 'A collection of digital artwork exploring technology and humanity', 'author_name': 'Arjun Patel', 'author_department': 'Computer Science & Engineering', 'category': 'Art', 'is_featured': True},
            {'title': 'Poetry Collection: Campus Life', 'description': 'Poems reflecting the experiences of college life and friendship', 'author_name': 'Sneha Reddy', 'author_department': 'Master of Computer Applications', 'category': 'Literature', 'is_featured': True},
            {'title': 'Innovation Project: Smart Campus', 'description': 'IoT-based solution for campus management and automation', 'author_name': 'Tech Team', 'author_department': 'Electrical Engineering', 'category': 'Technology', 'is_featured': False},
        ]

        for work_data in works_data:
            CreativeWork.objects.get_or_create(
                title=work_data['title'],
                defaults=work_data
            )

        # Create magazines
        magazines_data = [
            {'title': 'NIT Chronicle - Spring 2024', 'description': 'Latest news, achievements, and student stories from campus', 'issue_date': '2024-03-01'},
            {'title': 'Innovation Digest', 'description': 'Showcasing student projects and research breakthroughs', 'issue_date': '2024-02-15'},
            {'title': 'Cultural Express', 'description': 'Arts, literature, and cultural activities magazine', 'issue_date': '2024-01-30'},
        ]

        for magazine_data in magazines_data:
            Magazine.objects.get_or_create(
                title=magazine_data['title'],
                defaults=magazine_data
            )

        # Create admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@college.edu',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            
            # Update profile to admin role
            profile, _ = Profile.objects.get_or_create(user=admin_user)
            profile.role = 'admin'
            profile.full_name = 'Admin User'
            profile.save()

        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with initial data!')
        )
