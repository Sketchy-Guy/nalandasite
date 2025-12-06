from django.contrib import admin
from .models import (
    Department, HeroImage, Notice, Magazine, Club, CampusEvent,
    AcademicService, Topper, CreativeWork, StudentSubmission, Timetable,
    FeesStructure
)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'head_name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'code', 'head_name']
    ordering = ['name']

@admin.register(HeroImage)
class HeroImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'display_order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title']
    ordering = ['display_order']

@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'priority', 'is_new', 'is_active', 'created_at']
    list_filter = ['category', 'priority', 'is_new', 'is_active', 'created_at']
    search_fields = ['title', 'description']
    ordering = ['-created_at']

@admin.register(Magazine)
class MagazineAdmin(admin.ModelAdmin):
    list_display = ['title', 'issue_date', 'has_cover_image', 'has_file_url', 'is_active', 'created_at']
    list_filter = ['is_active', 'issue_date', 'created_at']
    search_fields = ['title', 'description']
    ordering = ['-issue_date']
    fields = ['title', 'description', 'cover_image', 'file_url', 'issue_date', 'is_active']
    
    def has_cover_image(self, obj):
        return bool(obj.cover_image)
    has_cover_image.boolean = True
    has_cover_image.short_description = 'Cover Image'
    
    def has_file_url(self, obj):
        return bool(obj.file_url or obj.file)
    has_file_url.boolean = True
    has_file_url.short_description = 'File Available'

@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ['name', 'member_count', 'event_count', 'website_link', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']
    fields = ['name', 'description', 'icon', 'member_count', 'event_count', 'website_link', 'is_active']


@admin.register(CampusEvent)
class CampusEventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'start_date', 'organizer', 'club', 'is_featured', 'is_active', 'created_at']
    list_filter = ['event_type', 'is_featured', 'is_active', 'start_date', 'club', 'created_at']
    search_fields = ['title', 'description', 'organizer', 'venue']
    ordering = ['-start_date', '-created_at']
    
    fieldsets = (
        ('Event Details', {
            'fields': ('title', 'description', 'event_type', 'club')
        }),
        ('Schedule & Location', {
            'fields': ('start_date', 'end_date', 'venue', 'organizer')
        }),
        ('Registration', {
            'fields': ('registration_required', 'registration_url', 'max_participants')
        }),
        ('Media & Display', {
            'fields': ('image_url', 'is_featured', 'is_active')
        })
    )


@admin.register(AcademicService)
class AcademicServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'link_url', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']

@admin.register(Topper)
class TopperAdmin(admin.ModelAdmin):
    list_display = ['name', 'department', 'cgpa', 'rank', 'year', 'is_active']
    list_filter = ['department', 'year', 'is_active', 'created_at']
    search_fields = ['name', 'department']
    ordering = ['rank', 'year']

@admin.register(CreativeWork)
class CreativeWorkAdmin(admin.ModelAdmin):
    list_display = ['title', 'author_name', 'category', 'is_featured', 'is_active', 'created_at']
    list_filter = ['category', 'is_featured', 'is_active', 'created_at']
    search_fields = ['title', 'author_name', 'description']
    ordering = ['-is_featured', '-created_at']


@admin.register(StudentSubmission)
class StudentSubmissionAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'status', 'is_featured', 'submitted_at', 'reviewed_at']
    list_filter = ['status', 'category', 'department', 'is_featured', 'is_active', 'submitted_at']
    search_fields = ['title', 'description', 'user__username', 'user__first_name', 'user__last_name']
    ordering = ['-submitted_at']
    readonly_fields = ['submitted_at', 'reviewed_at']
    
    fieldsets = (
        ('Submission Details', {
            'fields': ('title', 'description', 'category', 'department', 'user')
        }),
        ('Files & Media', {
            'fields': ('image', 'file', 'image_url', 'file_url')
        }),
        ('Review Information', {
            'fields': ('status', 'is_featured', 'review_comments', 'submitted_at', 'reviewed_at')
        }),
        ('Display Settings', {
            'fields': ('is_active',)
        })
    )
    
    def save_model(self, request, obj, form, change):
        if change and 'status' in form.changed_data and obj.status in ['approved', 'rejected']:
            from django.utils import timezone
            obj.reviewed_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ['title', 'department', 'timetable_type', 'semester', 'academic_year', 'is_featured', 'is_active', 'created_at']
    list_filter = ['department', 'timetable_type', 'semester', 'academic_year', 'is_featured', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'department__name', 'department__code']
    ordering = ['display_order', '-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'department', 'timetable_type')
        }),
        ('Academic Details', {
            'fields': ('semester', 'academic_year', 'valid_from', 'valid_to')
        }),
        ('Files & Links', {
            'fields': ('timetable_file', 'timetable_image', 'external_link')
        }),
        ('Display Settings', {
            'fields': ('is_featured', 'display_order', 'is_active')
        }),
        ('Advanced', {
            'fields': ('schedule_data',),
            'classes': ('collapse',)
        })
    )


@admin.register(FeesStructure)
class FeesStructureAdmin(admin.ModelAdmin):
    list_display = ['title', 'academic_year', 'semester', 'get_total_amount', 'due_date', 'is_active', 'created_at']
    list_filter = ['academic_year', 'semester', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'department']
    ordering = ['-created_at']
    
    def get_total_amount(self, obj):
        return f"₹{obj.total_amount:,.2f}"
    get_total_amount.short_description = 'Total Amount'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description')
        }),
        ('Academic Details', {
            'fields': ('academic_year', 'semester', 'department')
        }),
        ('Fee Items', {
            'fields': ('fee_items',),
            'description': 'Add fee items as JSON: [{"category": "tuition", "label": "Tuition Fees", "amount": 120000}]'
        }),
        ('Payment Information', {
            'fields': ('due_date',)
        }),
        ('Display Settings', {
            'fields': ('is_active',)
        })
    )
