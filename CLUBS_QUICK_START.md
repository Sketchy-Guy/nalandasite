# Clubs & Activities - Quick Start Guide

## 🚀 Getting Started

### For Administrators

#### 1. **Access Admin Panel**
```
URL: http://localhost:8080/admin/clubs-activities
or
Django Admin: http://localhost:8000/logi-admin/
```

#### 2. **Add a New Club**

**Via Custom Admin Panel:**
1. Navigate to "Clubs & Activities" in sidebar
2. Click "Clubs" tab
3. Click "Add Club" button
4. Fill in the form:
   - **Club Name** (required): e.g., "Robotics Club"
   - **Description**: Brief description of the club
   - **Icon**: Lucide icon name (e.g., "Bot", "Users", "Trophy")
   - **Website Link**: Club website or social media URL (optional)
   - **Member Count**: Number of members
   - **Event Count**: Number of events organized
5. Click "Create Club"

**Via Django Admin:**
1. Go to http://localhost:8000/logi-admin/
2. Click "Clubs" under CORE section
3. Click "Add Club" button
4. Fill in all fields
5. Save

#### 3. **Add Campus Events/Notices**

**Via Custom Admin Panel:**
1. Navigate to "Clubs & Activities"
2. Click "Events & Activities" tab
3. Click "Add Event" button
4. Fill in the form:
   - **Event Title** (required)
   - **Description**: Event details
   - **Event Type**: Select from dropdown
     - Festival
     - Competition
     - Workshop
     - Seminar
     - Cultural Event
     - Sports Event
     - Technical Event
     - Club Activity ← For club-specific activities
     - Notice/Announcement ← For club notices
   - **Start Date & End Date**
   - **Venue**: Event location
   - **Organizer**: Organizing club/department
   - **Max Participants**: Capacity (optional)
   - **Registration Required**: Check if registration needed
   - **Registration URL**: Link to registration form
   - **Image URL**: Event poster/image URL
   - **Featured Event**: Check to show in featured section
5. Click "Create Event"

#### 4. **Associate Events with Clubs**

When creating/editing an event, you can optionally select a club from the dropdown. This links the event to that specific club, making it appear when users click "View Events" on that club's card.

---

## 👥 For Website Visitors

### Viewing Clubs

1. Navigate to the Clubs & Activities section on homepage
2. Browse available clubs with:
   - Club name and description
   - Member count
   - Event count
   - Club icon

### Accessing Club Information

**Visit Club Website:**
- Click "Visit Site" button (if club has a website)
- Opens club's website/social media in new tab

**View Club Events:**
- Click "View Events" button on any club card
- See all events and notices for that club
- View event details, dates, and descriptions

---

## 🔧 API Usage

### For Developers

#### Fetch All Clubs
```javascript
const response = await api.clubs.list({ is_active: true });
const data = await response.json();
console.log(data.results); // Array of clubs
```

#### Fetch Club Events
```javascript
const response = await api.clubs.events(clubId);
const events = await response.json();
console.log(events); // Array of events for this club
```

#### Fetch All Campus Events
```javascript
const response = await api.campusEvents.list();
const data = await response.json();
console.log(data.results); // Array of all events
```

#### Fetch Upcoming Events
```javascript
const response = await api.campusEvents.upcoming();
const events = await response.json();
console.log(events); // Events with start_date >= today
```

#### Fetch Featured Events
```javascript
const response = await api.campusEvents.featured();
const events = await response.json();
console.log(events); // Events marked as featured
```

#### Fetch Events by Club
```javascript
const response = await api.campusEvents.byClub(clubId);
const events = await response.json();
console.log(events); // Events associated with specific club
```

---

## 📝 Common Tasks

### Task 1: Create a Club with Website
```
1. Go to Admin Panel → Clubs & Activities → Clubs
2. Click "Add Club"
3. Fill in:
   - Name: "Photography Club"
   - Description: "Capture moments, create memories"
   - Icon: "Camera"
   - Website Link: "https://instagram.com/college_photography"
   - Member Count: 45
   - Event Count: 12
4. Click "Create Club"
```

### Task 2: Create a Club Notice
```
1. Go to Admin Panel → Clubs & Activities → Events & Activities
2. Click "Add Event"
3. Fill in:
   - Title: "Photography Club Meeting"
   - Description: "Monthly meeting to discuss upcoming photo walk"
   - Event Type: "Notice/Announcement" or "Club Activity"
   - Start Date: Select date
   - Organizer: "Photography Club"
4. Click "Create Event"
```

### Task 3: Create a Featured Event
```
1. Go to Admin Panel → Clubs & Activities → Events & Activities
2. Click "Add Event"
3. Fill in event details
4. Check "Featured Event" checkbox
5. Click "Create Event"
```

### Task 4: Update Club Information
```
1. Go to Admin Panel → Clubs & Activities → Clubs
2. Find the club card
3. Click the Edit button (pencil icon)
4. Update fields
5. Click "Update Club"
```

---

## 🎯 Best Practices

### For Club Management:
1. **Keep member counts updated** - Update when new members join
2. **Add website links** - Help students find club social media
3. **Use appropriate icons** - Choose icons that represent the club
4. **Write clear descriptions** - Help students understand club purpose

### For Event Management:
1. **Use correct event types** - Makes filtering easier
2. **Add start dates** - Helps with "upcoming events" feature
3. **Include venue information** - Students need to know where
4. **Add registration URLs** - Direct link to sign up
5. **Mark important events as featured** - Increases visibility
6. **Associate with clubs** - Links events to organizing clubs

### For Notices:
1. **Use "Notice/Announcement" type** - Clear categorization
2. **Keep descriptions concise** - Easy to read quickly
3. **Update regularly** - Remove outdated notices
4. **Associate with relevant club** - Shows on club's event list

---

## 🐛 Troubleshooting

### Issue: Club not showing on website
**Solution:** Check that `is_active` is set to `true` in admin panel

### Issue: Events not showing for club
**Solution:** Ensure event is associated with the club and `is_active` is `true`

### Issue: Website link not working
**Solution:** Ensure URL includes `https://` or `http://` prefix

### Issue: Form doesn't fit on screen
**Solution:** Forms are now scrollable - scroll down to see all fields

### Issue: Can't create club/event
**Solution:** Ensure you're logged in as admin user

---

## 📞 Support

For technical issues or questions:
1. Check the CLUBS_MIGRATION_SUMMARY.md for detailed documentation
2. Review API endpoints in backend/core/urls.py
3. Check Django admin logs for errors
4. Verify PostgreSQL connection

---

## 🎉 Quick Tips

- **Icon Names**: Use Lucide React icon names (Bot, Users, Trophy, Music, Camera, Code, Theater, BookOpen)
- **Event Types**: Choose the most specific type for better organization
- **Featured Events**: Limit to 3-5 most important events
- **Club Notices**: Use for announcements, meetings, and updates
- **Website Links**: Can be Instagram, Facebook, Discord, or custom websites

---

**Happy Managing! 🚀**
