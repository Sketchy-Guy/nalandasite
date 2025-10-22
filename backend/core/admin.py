from django.contrib import admin
from .models import (
    Department, HeroImage, Notice, Magazine, Club, 
    AcademicService, Topper, CreativeWork, Timetable
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
    list_display = ['name', 'member_count', 'event_count', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']

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
