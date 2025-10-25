#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# Create superuser and demo data
python manage.py shell -c "
from django.contrib.auth import get_user_model
from authentication.models import UserProfile
from core.models import Club, CampusEvent
from datetime import date, timedelta

User = get_user_model()

# Create superuser if it doesn't exist
if not User.objects.filter(email='chinmaypanda@thenalanda.com').exists():
    user = User.objects.create_user(
        email='chinmaypanda@thenalanda.com',
        password='NIT2025'
    )
    UserProfile.objects.create(
        user=user,
        role='admin',
        full_name='Chinmay Panda',
        phone_number='+91-9876543210'
    )
    print('Superuser created')

# Create demo clubs if they don't exist
if not Club.objects.exists():
    print('Creating demo clubs...')
    Club.objects.bulk_create([
        Club(name='Robotics Club', description='Build and program robots, participate in competitions, and explore automation technology.', icon='Bot', member_count=45, event_count=8, website_link='https://example.com/robotics', is_active=True),
        Club(name='Photography Club', description='Capture moments, learn photography techniques, and showcase your creative vision.', icon='Camera', member_count=62, event_count=12, website_link='https://instagram.com/college_photography', is_active=True),
        Club(name='Music Society', description='Express yourself through music, organize concerts, and collaborate with fellow musicians.', icon='Music', member_count=78, event_count=15, website_link='https://example.com/music', is_active=True),
        Club(name='Coding Club', description='Learn programming, participate in hackathons, and build innovative software projects.', icon='Code', member_count=95, event_count=20, website_link='https://github.com/college-coding-club', is_active=True),
        Club(name='Drama Society', description='Perform plays, develop acting skills, and bring stories to life on stage.', icon='Theater', member_count=52, event_count=10, is_active=True),
        Club(name='Literary Club', description='Explore literature, organize book discussions, and publish creative writing.', icon='BookOpen', member_count=38, event_count=6, website_link='https://example.com/literary', is_active=True)
    ])
    print('Demo clubs created')

# Create demo events if they don't exist
if not CampusEvent.objects.exists():
    print('Creating demo events...')
    today = date.today()
    clubs = list(Club.objects.all())
    
    events = [
        CampusEvent(title='Annual Tech Fest 2025', description='Three-day technology festival featuring workshops, competitions, and guest lectures from industry experts.', event_type='festival', start_date=today + timedelta(days=30), end_date=today + timedelta(days=32), venue='Main Auditorium', organizer='Technical Department', max_participants=500, registration_required=True, registration_url='https://example.com/techfest', is_featured=True, is_active=True),
        CampusEvent(title='Photography Exhibition', description='Annual photography exhibition showcasing student work.', event_type='cultural', start_date=today + timedelta(days=20), end_date=today + timedelta(days=22), venue='Art Gallery', organizer='Photography Club', is_featured=True, is_active=True),
        CampusEvent(title='Coding Hackathon', description='24-hour coding marathon to build innovative solutions.', event_type='competition', start_date=today + timedelta(days=45), end_date=today + timedelta(days=46), venue='Computer Lab', organizer='Coding Club', max_participants=100, registration_required=True, registration_url='https://example.com/hackathon', is_featured=True, is_active=True),
        CampusEvent(title='Robotics Workshop', description='Hands-on workshop on Arduino programming and robot building.', event_type='workshop', start_date=today + timedelta(days=15), venue='Robotics Lab', organizer='Robotics Club', max_participants=30, registration_required=True, registration_url='https://example.com/robotics-workshop', is_active=True),
        CampusEvent(title='Music Concert', description='Annual music concert featuring student performances.', event_type='cultural', start_date=today + timedelta(days=25), venue='Main Auditorium', organizer='Music Society', is_active=True),
        CampusEvent(title='Drama Club Meeting', description='Weekly meeting for drama club members.', event_type='club_activity', start_date=today + timedelta(days=7), venue='Drama Room', organizer='Drama Society', is_active=True),
        CampusEvent(title='Book Discussion', description='Monthly book discussion session.', event_type='club_activity', start_date=today + timedelta(days=14), venue='Library', organizer='Literary Club', is_active=True),
        CampusEvent(title='Photo Walk Notice', description='Photography club photo walk this weekend.', event_type='notice', start_date=today + timedelta(days=5), venue='Campus Grounds', organizer='Photography Club', is_active=True),
        CampusEvent(title='AI & Machine Learning Seminar', description='Seminar on latest trends in AI and ML.', event_type='seminar', start_date=today + timedelta(days=40), venue='Conference Hall', organizer='Coding Club', max_participants=150, registration_required=True, is_active=True),
        CampusEvent(title='Inter-College Sports Meet', description='Annual sports competition between colleges.', event_type='sports', start_date=today + timedelta(days=60), end_date=today + timedelta(days=62), venue='Sports Complex', organizer='Sports Department', is_active=True)
    ]
    
    if clubs:
        events[0].club = clubs[0] if len(clubs) > 0 else None
        events[1].club = clubs[1] if len(clubs) > 1 else clubs[0]
        events[2].club = clubs[3] if len(clubs) > 3 else clubs[0]
        events[3].club = clubs[0] if len(clubs) > 0 else None
        events[4].club = clubs[2] if len(clubs) > 2 else clubs[0]
        events[5].club = clubs[4] if len(clubs) > 4 else clubs[0]
        events[6].club = clubs[5] if len(clubs) > 5 else clubs[0]
        events[7].club = clubs[1] if len(clubs) > 1 else clubs[0]
        events[8].club = clubs[3] if len(clubs) > 3 else clubs[0]
    
    CampusEvent.objects.bulk_create(events)
    print('Demo events created')

print('Database setup completed successfully!')
"

echo "Build completed successfully!"
