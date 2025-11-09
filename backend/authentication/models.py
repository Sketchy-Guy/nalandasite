from django.db import models
from django.contrib.auth.models import User
import uuid

class UserRole(models.TextChoices):
    ADMIN = 'admin', 'Admin'
    FACULTY = 'faculty', 'Faculty'
    STUDENT = 'student', 'Student'
    ALUMNI = 'alumni', 'Alumni'

class RoleType(models.TextChoices):
    FACULTY = 'faculty', 'Faculty'
    STUDENT = 'student', 'Student'
    ALUMNI = 'alumni', 'Alumni'
    STAFF = 'staff', 'Staff'

class Department(models.Model):
    """Department model for users"""
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    
    def __str__(self):
        return self.name

class Profile(models.Model):
    """Extended user profile with comprehensive information"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Basic Information
    full_name = models.CharField(max_length=200, blank=True, null=True)
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.STUDENT)
    role_type = models.CharField(max_length=20, choices=RoleType.choices, default=RoleType.STUDENT)
    department = models.CharField(max_length=200, blank=True, null=True)
    designation = models.CharField(max_length=200, blank=True, null=True)
    photo_url = models.URLField(blank=True, null=True)
    
    # Academic Information
    qualifications = models.TextField(blank=True, null=True)
    research_areas = models.JSONField(default=list, blank=True)
    
    # Student Specific Fields
    enrollment_year = models.IntegerField(blank=True, null=True)
    semester = models.CharField(max_length=20, blank=True, null=True)
    branch = models.CharField(max_length=100, blank=True, null=True)
    graduation_year = models.IntegerField(blank=True, null=True)
    
    # Alumni Specific Fields
    current_position = models.CharField(max_length=200, blank=True, null=True)
    company = models.CharField(max_length=200, blank=True, null=True)
    
    # Contact Information
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name or self.user.username} - {self.role}"

    class Meta:
        ordering = ['-created_at']
