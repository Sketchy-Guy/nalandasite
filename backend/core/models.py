from django.db import models
from django.contrib.auth.models import User
import uuid

class BaseModel(models.Model):
    """Base model with common fields"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True

class Program(BaseModel):
    """Academic programs (UG, PG, etc.)"""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    is_predefined = models.BooleanField(default=False, help_text="UG, PG are predefined")
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-is_predefined', 'name']


class Trade(BaseModel):
    """Trades within programs (B.Tech, M.Tech, etc.)"""
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='trades')
    description = models.TextField(blank=True, null=True)
    is_predefined = models.BooleanField(default=False, help_text="B.Tech, M.Tech are predefined")
    
    def __str__(self):
        return f"{self.program.name} - {self.name}"
    
    class Meta:
        ordering = ['program', '-is_predefined', 'name']
        unique_together = [['program', 'code']]


def department_hero_upload_path(instance, filename):
    """Generate upload path for department hero images"""
    return f'departments/{instance.code.lower()}/hero/{filename}'

def department_gallery_upload_path(instance, filename):
    """Generate upload path for department gallery images"""
    return f'departments/{instance.department.code.lower()}/gallery/{filename}'

class Department(BaseModel):
    """Department model"""
    # Hierarchy fields
    program = models.ForeignKey(Program, on_delete=models.PROTECT, related_name='departments', null=True, blank=True)
    trade = models.ForeignKey(Trade, on_delete=models.SET_NULL, null=True, blank=True, related_name='departments')
    is_direct_branch = models.BooleanField(default=False, help_text="True if department is directly under program without trade")
    
    # Basic fields
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    head_name = models.CharField(max_length=200, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    
    # Additional fields for department pages
    hero_image = models.ImageField(upload_to=department_hero_upload_path, blank=True, null=True)
    mission = models.TextField(blank=True, null=True)
    vision = models.TextField(blank=True, null=True)
    location_details = models.CharField(max_length=500, blank=True, null=True)
    
    # JSON fields for arrays
    facilities = models.JSONField(default=list, blank=True)
    programs_offered = models.JSONField(default=list, blank=True)
    achievements = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        """Override delete to remove hero image, gallery images, and entire department folder from storage"""
        import os
        import shutil
        from django.conf import settings
        
        # Delete hero image
        if self.hero_image:
            if self.hero_image.storage.exists(self.hero_image.name):
                self.hero_image.storage.delete(self.hero_image.name)
        
        # Delete all gallery images
        for gallery_image in self.gallery_images.all():
            gallery_image.delete()
        
        # Delete the entire department folder
        department_folder = os.path.join(settings.MEDIA_ROOT, 'departments', self.code)
        if os.path.exists(department_folder):
            try:
                shutil.rmtree(department_folder)
            except Exception as e:
                # Log the error but don't prevent deletion
                print(f"Warning: Could not delete department folder {department_folder}: {str(e)}")
        
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        """Override save to delete old hero image when replacing"""
        if self.pk:
            try:
                old_instance = Department.objects.get(pk=self.pk)
                if old_instance.hero_image and old_instance.hero_image != self.hero_image:
                    if old_instance.hero_image.storage.exists(old_instance.hero_image.name):
                        old_instance.hero_image.storage.delete(old_instance.hero_image.name)
            except Department.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['name']

class DepartmentGalleryImage(BaseModel):
    """Gallery images and videos for departments"""
    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]
    
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='gallery_images')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default='image')
    image = models.ImageField(upload_to=department_gallery_upload_path, blank=True, null=True)
    video = models.FileField(upload_to=department_gallery_upload_path, blank=True, null=True)
    caption = models.CharField(max_length=200, blank=True, null=True)
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.department.name} - Gallery {self.media_type.title()} {self.display_order}"

    def delete(self, *args, **kwargs):
        """Override delete to remove media files from storage"""
        if self.image:
            if self.image.storage.exists(self.image.name):
                self.image.storage.delete(self.image.name)
        if self.video:
            if self.video.storage.exists(self.video.name):
                self.video.storage.delete(self.video.name)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        """Override save to delete old media when replacing"""
        if self.pk:
            try:
                old_instance = DepartmentGalleryImage.objects.get(pk=self.pk)
                if old_instance.image and old_instance.image != self.image:
                    if old_instance.image.storage.exists(old_instance.image.name):
                        old_instance.image.storage.delete(old_instance.image.name)
                if old_instance.video and old_instance.video != self.video:
                    if old_instance.video.storage.exists(old_instance.video.name):
                        old_instance.video.storage.delete(old_instance.video.name)
            except DepartmentGalleryImage.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    @property
    def media_url(self):
        """Return the URL of the media file (image or video)"""
        if self.media_type == 'image' and self.image:
            return self.image.url
        elif self.media_type == 'video' and self.video:
            return self.video.url
        return None

    class Meta:
        ordering = ['department', 'display_order', 'created_at']

class HeroImage(BaseModel):
    """Hero images for homepage carousel"""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='hero_images/')
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        """Override delete to remove the image file from storage"""
        if self.image:
            # Delete the file from storage
            if self.image.storage.exists(self.image.name):
                self.image.storage.delete(self.image.name)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        """Override save to delete old image when replacing with new one"""
        if self.pk:
            try:
                old_instance = HeroImage.objects.get(pk=self.pk)
                if old_instance.image and old_instance.image != self.image:
                    # Delete the old file if it exists
                    if old_instance.image.storage.exists(old_instance.image.name):
                        old_instance.image.storage.delete(old_instance.image.name)
            except HeroImage.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['display_order', 'created_at']

class Notice(BaseModel):
    """Notices and announcements"""
    CATEGORY_CHOICES = [
        ('General', 'General'),
        ('Academic', 'Academic'),
        ('Sports', 'Sports'),
        ('Financial', 'Financial'),
        ('Events', 'Events'),
    ]
    
    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    title = models.CharField(max_length=300)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='General')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    is_new = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, help_text="Show in featured section on homepage")
    link = models.URLField(blank=True, null=True, help_text="Optional Google Drive or external link")

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class Magazine(BaseModel):
    """College magazines and publications"""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    cover_image = models.ImageField(upload_to='magazines/covers/', blank=True, null=True)
    file = models.FileField(upload_to='magazines/files/', blank=True, null=True)
    file_url = models.URLField(max_length=500, blank=True, null=True, help_text="External URL for magazine file (Google Drive, Dropbox, etc.)")
    issue_date = models.DateField(blank=True, null=True)
    
    @property
    def get_file_url(self):
        """Return external URL if available, otherwise local file URL"""
        if self.file_url:
            return self.file_url
        elif self.file:
            return self.file.url
        return None

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        """Override delete to remove files from storage"""
        if self.cover_image:
            if self.cover_image.storage.exists(self.cover_image.name):
                self.cover_image.storage.delete(self.cover_image.name)
        if self.file:
            if self.file.storage.exists(self.file.name):
                self.file.storage.delete(self.file.name)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        """Override save to delete old files when replacing"""
        if self.pk:
            try:
                old_instance = Magazine.objects.get(pk=self.pk)
                if old_instance.cover_image and old_instance.cover_image != self.cover_image:
                    if old_instance.cover_image.storage.exists(old_instance.cover_image.name):
                        old_instance.cover_image.storage.delete(old_instance.cover_image.name)
                if old_instance.file and old_instance.file != self.file:
                    if old_instance.file.storage.exists(old_instance.file.name):
                        old_instance.file.storage.delete(old_instance.file.name)
            except Magazine.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-issue_date', '-created_at']

class Club(BaseModel):
    """Student clubs and societies"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100)  # Icon name for frontend
    member_count = models.IntegerField(default=0)
    event_count = models.IntegerField(default=0)
    website_link = models.URLField(blank=True, null=True, help_text="Club website or social media link")

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class CampusEvent(BaseModel):
    """Campus events and activities"""
    EVENT_TYPE_CHOICES = [
        ('festival', 'Festival'),
        ('competition', 'Competition'),
        ('workshop', 'Workshop'),
        ('seminar', 'Seminar'),
        ('cultural', 'Cultural Event'),
        ('sports', 'Sports Event'),
        ('technical', 'Technical Event'),
        ('club_activity', 'Club Activity'),
        ('notice', 'Notice/Announcement'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPE_CHOICES, default='festival')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    venue = models.CharField(max_length=200, blank=True, null=True)
    organizer = models.CharField(max_length=200, blank=True, null=True, help_text="Organizing club or department")
    max_participants = models.IntegerField(blank=True, null=True)
    registration_required = models.BooleanField(default=False)
    registration_url = models.URLField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    is_featured = models.BooleanField(default=False, help_text="Show in featured section")
    club = models.ForeignKey(Club, on_delete=models.SET_NULL, null=True, blank=True, related_name='events', help_text="Associated club (if any)")

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-start_date', '-created_at']
        verbose_name = 'Campus Event'
        verbose_name_plural = 'Campus Events'

class AcademicService(BaseModel):
    """Academic services and links"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100)  # Icon name for frontend
    link_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class Topper(BaseModel):
    """Academic toppers"""
    name = models.CharField(max_length=200)
    department = models.CharField(max_length=200)
    cgpa = models.DecimalField(max_digits=4, decimal_places=2)
    achievements = models.JSONField(default=list, blank=True)
    photo = models.ImageField(upload_to='toppers/', blank=True, null=True)
    year = models.IntegerField()
    rank = models.IntegerField()

    def __str__(self):
        return f"{self.name} - Rank {self.rank}"

    def delete(self, *args, **kwargs):
        """Override delete to remove photo from storage"""
        if self.photo:
            if self.photo.storage.exists(self.photo.name):
                self.photo.storage.delete(self.photo.name)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        """Override save to delete old photo when replacing"""
        if self.pk:
            try:
                old_instance = Topper.objects.get(pk=self.pk)
                if old_instance.photo and old_instance.photo != self.photo:
                    if old_instance.photo.storage.exists(old_instance.photo.name):
                        old_instance.photo.storage.delete(old_instance.photo.name)
            except Topper.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['rank', 'year']

class CreativeWork(BaseModel):
    """Creative works and student projects for homepage gallery"""
    CATEGORY_CHOICES = [
        ('Art & Design', 'Art & Design'),
        ('Photography', 'Photography'),
        ('Poetry & Literature', 'Poetry & Literature'),
        ('Music & Dance', 'Music & Dance'),
        ('Digital Media', 'Digital Media'),
        ('Innovation & Projects', 'Innovation & Projects'),
        ('Digital Art', 'Digital Art'),
        ('Music Composition', 'Music Composition'),
        ('Writing', 'Writing'),
        ('Design', 'Design'),
        ('Video', 'Video'),
        ('Innovation', 'Innovation'),
        ('Technology', 'Technology'),
        ('Research', 'Research'),
        ('Startup', 'Startup'),
        ('Other', 'Other')
    ]
    
    DEPARTMENT_CHOICES = [
        ('Computer Science & Engineering', 'Computer Science & Engineering'),
        ('Information Technology', 'Information Technology'),
        ('Mechanical Engineering', 'Mechanical Engineering'),
        ('Electrical Engineering', 'Electrical Engineering'),
        ('Civil Engineering', 'Civil Engineering'),
        ('MBA', 'MBA'),
        ('MCA', 'MCA'),
        ('BCA', 'BCA'),
        ('Other', 'Other')
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    author_name = models.CharField(max_length=100)
    author_department = models.CharField(max_length=100, choices=DEPARTMENT_CHOICES, blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    image_url = models.URLField(blank=True, null=True, help_text="External image URL")
    content_url = models.URLField(blank=True, null=True, help_text="External content file URL")
    instagram_url = models.URLField(blank=True, null=True, help_text="Instagram post/reel URL")
    youtube_url = models.URLField(blank=True, null=True, help_text="YouTube video URL")
    image = models.ImageField(upload_to='creative_works/', blank=True, null=True)
    file = models.FileField(upload_to='creative_works/files/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        """Override delete to remove files from storage"""
        if self.image:
            if self.image.storage.exists(self.image.name):
                self.image.storage.delete(self.image.name)
        if self.file:
            if self.file.storage.exists(self.file.name):
                self.file.storage.delete(self.file.name)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        """Override save to delete old files when replacing"""
        if self.pk:
            try:
                old_instance = CreativeWork.objects.get(pk=self.pk)
                if old_instance.image and old_instance.image != self.image:
                    if old_instance.image.storage.exists(old_instance.image.name):
                        old_instance.image.storage.delete(old_instance.image.name)
                if old_instance.file and old_instance.file != self.file:
                    if old_instance.file.storage.exists(old_instance.file.name):
                        old_instance.file.storage.delete(old_instance.file.name)
            except CreativeWork.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    @property
    def get_image_url(self):
        """Return external image URL if available, otherwise local image URL"""
        if self.image_url:
            return self.image_url
        elif self.image:
            return self.image.url
        return None

    @property
    def get_content_url(self):
        """Return external content URL if available, otherwise local file URL"""
        if self.content_url:
            return self.content_url
        elif self.file:
            return self.file.url
        return None

    class Meta:
        ordering = ['-created_at']


class StudentSubmission(BaseModel):
    """Student creative work submissions for review"""
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    CATEGORY_CHOICES = [
        ('Art & Design', 'Art & Design'),
        ('Photography', 'Photography'),
        ('Poetry & Literature', 'Poetry & Literature'),
        ('Music & Dance', 'Music & Dance'),
        ('Digital Media', 'Digital Media'),
        ('Innovation & Projects', 'Innovation & Projects'),
        ('Digital Art', 'Digital Art'),
        ('Music Composition', 'Music Composition'),
        ('Writing', 'Writing'),
        ('Design', 'Design'),
        ('Video', 'Video'),
        ('Innovation', 'Innovation'),
        ('Technology', 'Technology'),
        ('Research', 'Research'),
        ('Startup', 'Startup'),
        ('Other', 'Other')
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    department = models.CharField(max_length=100, blank=True, null=True, help_text="Department name")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_featured = models.BooleanField(default=False)
    
    # File uploads
    image = models.ImageField(upload_to='student_submissions/', blank=True, null=True)
    file = models.FileField(upload_to='student_submissions/files/', blank=True, null=True)
    
    # External URLs
    image_url = models.URLField(blank=True, null=True, help_text="External image URL")
    file_url = models.URLField(blank=True, null=True, help_text="External file URL")
    instagram_url = models.URLField(blank=True, null=True, help_text="Instagram post/reel URL")
    youtube_url = models.URLField(blank=True, null=True, help_text="YouTube video URL")
    
    # Review information
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    review_comments = models.TextField(blank=True, null=True)
    
    # User relationship
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='creative_submissions')

    def __str__(self):
        return f"{self.title} by {self.user.get_full_name() or self.user.username}"

    @property
    def get_image_url(self):
        """Return external image URL if available, otherwise local image URL"""
        if self.image_url:
            return self.image_url
        elif self.image:
            return self.image.url
        return None

    @property
    def get_file_url(self):
        """Return external file URL if available, otherwise local file URL"""
        if self.file_url:
            return self.file_url
        elif self.file:
            return self.file.url
        return None

    def delete(self, *args, **kwargs):
        """Override delete to remove files from storage"""
        if self.image:
            if self.image.storage.exists(self.image.name):
                self.image.storage.delete(self.image.name)
        if self.file:
            if self.file.storage.exists(self.file.name):
                self.file.storage.delete(self.file.name)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        """Override save to delete old files when replacing"""
        if self.pk:
            try:
                old_instance = StudentSubmission.objects.get(pk=self.pk)
                if old_instance.image and old_instance.image != self.image:
                    if old_instance.image.storage.exists(old_instance.image.name):
                        old_instance.image.storage.delete(old_instance.image.name)
                if old_instance.file and old_instance.file != self.file:
                    if old_instance.file.storage.exists(old_instance.file.name):
                        old_instance.file.storage.delete(old_instance.file.name)
            except StudentSubmission.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-submitted_at']


class CampusStats(BaseModel):
    """Campus statistics for homepage"""
    stat_name = models.CharField(max_length=100)
    stat_value = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.stat_name}: {self.stat_value}"

    class Meta:
        ordering = ['display_order']
        verbose_name_plural = "Campus Statistics"


class News(BaseModel):
    """News and announcements"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    content = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=[
        ('Academic', 'Academic'),
        ('Events', 'Events'),
        ('Achievements', 'Achievements'),
        ('General', 'General'),
        ('Sports', 'Sports'),
        # Additional newspaper categories
        ('Achievement', 'Achievement'),
        ('News', 'News'),
        ('Announcement', 'Announcement'),
        ('Admission', 'Admission'),
        ('Event', 'Event'),
        ('Placement', 'Placement'),
        ('Research', 'Research'),
        ('Alumni', 'Alumni'),
        ('Cultural', 'Cultural')
    ], default='General')
    priority = models.CharField(max_length=20, choices=[
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High')
    ], default='Medium')
    image = models.ImageField(upload_to='news/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=True)
    published_date = models.DateTimeField(auto_now_add=True)
    
    # Additional newspaper fields
    author = models.CharField(max_length=200, blank=True, null=True)
    publish_date = models.DateField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    external_link = models.URLField(blank=True, null=True)
    pdf_link = models.URLField(blank=True, null=True, help_text="Google Drive link to PDF document")
    tags = models.JSONField(default=list, blank=True)
    is_breaking = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        """Override delete to remove image from storage"""
        if self.image:
            if self.image.storage.exists(self.image.name):
                self.image.storage.delete(self.image.name)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        """Override save to delete old image when replacing"""
        if self.pk:
            try:
                old_instance = News.objects.get(pk=self.pk)
                if old_instance.image and old_instance.image != self.image:
                    if old_instance.image.storage.exists(old_instance.image.name):
                        old_instance.image.storage.delete(old_instance.image.name)
            except News.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-published_date']
        verbose_name_plural = "News"


class ContactInfo(BaseModel):
    """Contact information for departments and offices"""
    office_name = models.CharField(max_length=200, default="General Office")
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    office_hours = models.CharField(max_length=100, blank=True, null=True)
    contact_person = models.CharField(max_length=200, blank=True, null=True)
    designation = models.CharField(max_length=200, blank=True, null=True)
    department = models.CharField(max_length=200, blank=True, null=True)
    location_map_url = models.URLField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return self.office_name

    class Meta:
        ordering = ['display_order']


class OfficeLocation(BaseModel):
    """Detailed office location information"""
    name = models.CharField(max_length=200)
    building = models.CharField(max_length=200, blank=True, null=True)
    floor = models.CharField(max_length=50, blank=True, null=True)
    room_number = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    landmark = models.CharField(max_length=200, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    office_hours = models.CharField(max_length=100, blank=True, null=True)
    map_coordinates = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    is_main_office = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-is_main_office', 'name']


class QuickContactInfo(BaseModel):
    """Quick contact information for general display"""
    main_phone = models.CharField(max_length=20, blank=True, null=True)
    main_email = models.EmailField(blank=True, null=True)
    main_address = models.TextField(blank=True, null=True)
    general_inquiries_email = models.EmailField(blank=True, null=True)
    admissions_email = models.EmailField(blank=True, null=True)
    placement_email = models.EmailField(blank=True, null=True)
    emergency_phone = models.CharField(max_length=20, blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    social_media_links = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Quick Contact Info - {self.main_email or 'No email'}"

    class Meta:
        verbose_name = "Quick Contact Information"
        verbose_name_plural = "Quick Contact Information"


class Timetable(BaseModel):
    """Class timetables and schedules"""
    TIMETABLE_TYPE_CHOICES = [
        ('class', 'Class Timetable'),
        ('exam', 'Exam Schedule'),
        ('event', 'Event Schedule'),
        ('lab', 'Lab Schedule'),
    ]
    
    SEMESTER_CHOICES = [
        ('1', 'Semester 1'),
        ('2', 'Semester 2'),
        ('3', 'Semester 3'),
        ('4', 'Semester 4'),
        ('5', 'Semester 5'),
        ('6', 'Semester 6'),
        ('7', 'Semester 7'),
        ('8', 'Semester 8'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    timetable_type = models.CharField(max_length=20, choices=TIMETABLE_TYPE_CHOICES, default='class')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='timetables')
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES, blank=True, null=True)
    academic_year = models.CharField(max_length=20, blank=True, null=True)
    
    # File uploads
    timetable_file = models.FileField(upload_to='timetables/', blank=True, null=True)
    timetable_image = models.ImageField(upload_to='timetables/images/', blank=True, null=True)
    
    # External links
    external_link = models.URLField(blank=True, null=True, help_text="Google Drive or external link to timetable")
    
    # Schedule data as JSON for programmatic access
    schedule_data = models.JSONField(default=dict, blank=True, help_text="JSON data for schedule if needed")
    
    # Validity period
    valid_from = models.DateField(blank=True, null=True)
    valid_to = models.DateField(blank=True, null=True)
    
    # Display settings
    is_featured = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} - {self.department.name}"

    @property
    def get_file_url(self):
        """Return external URL if available, otherwise local file URL"""
        if self.external_link:
            return self.external_link
        elif self.timetable_file:
            return self.timetable_file.url
        return None

    def delete(self, *args, **kwargs):
        """Override delete to remove files from storage"""
        if self.timetable_file:
            if self.timetable_file.storage.exists(self.timetable_file.name):
                self.timetable_file.storage.delete(self.timetable_file.name)
        if self.timetable_image:
            if self.timetable_image.storage.exists(self.timetable_image.name):
                self.timetable_image.storage.delete(self.timetable_image.name)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        """Override save to delete old files when replacing"""
        if self.pk:
            try:
                old_instance = Timetable.objects.get(pk=self.pk)
                if old_instance.timetable_file and old_instance.timetable_file != self.timetable_file:
                    if old_instance.timetable_file.storage.exists(old_instance.timetable_file.name):
                        old_instance.timetable_file.storage.delete(old_instance.timetable_file.name)
                if old_instance.timetable_image and old_instance.timetable_image != self.timetable_image:
                    if old_instance.timetable_image.storage.exists(old_instance.timetable_image.name):
                        old_instance.timetable_image.storage.delete(old_instance.timetable_image.name)
            except Timetable.DoesNotExist:
                pass
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['display_order', '-created_at']
