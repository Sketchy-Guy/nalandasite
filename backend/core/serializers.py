from rest_framework import serializers
from .models import (
    Program, Trade, Department, DepartmentGalleryImage, HeroImage, Notice, Magazine, Club, CampusEvent,
    AcademicService, Topper, CreativeWork, StudentSubmission, CampusStats, News, ContactInfo, OfficeLocation, QuickContactInfo, Timetable
)

class ProgramSerializer(serializers.ModelSerializer):
    trades_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Program
        fields = '__all__'
    
    def get_trades_count(self, obj):
        return obj.trades.count()


class TradeSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='program.name', read_only=True)
    program_code = serializers.CharField(source='program.code', read_only=True)
    departments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Trade
        fields = '__all__'
    
    def get_departments_count(self, obj):
        return obj.departments.count()


class DepartmentGalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()
    media_url = serializers.SerializerMethodField()
    
    class Meta:
        model = DepartmentGalleryImage
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None
    
    def get_video_url(self, obj):
        if obj.video:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video.url)
        return None
    
    def get_media_url(self, obj):
        if obj.media_type == 'image' and obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        elif obj.media_type == 'video' and obj.video:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video.url)
        return None

class DepartmentSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.SerializerMethodField()
    gallery_images = DepartmentGalleryImageSerializer(many=True, read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)
    program_code = serializers.CharField(source='program.code', read_only=True)
    trade_name = serializers.CharField(source='trade.name', read_only=True, allow_null=True)
    trade_code = serializers.CharField(source='trade.code', read_only=True, allow_null=True)
    
    class Meta:
        model = Department
        fields = '__all__'
    
    def get_hero_image_url(self, obj):
        if obj.hero_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hero_image.url)
        return None

class HeroImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HeroImage
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None

class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = '__all__'

class MagazineSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    delete_cover_image = serializers.BooleanField(write_only=True, required=False)
    
    class Meta:
        model = Magazine
        fields = '__all__'
    
    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
        return None
    
    def get_download_url(self, obj):
        """Return the download URL - external URL if available, otherwise local file URL"""
        return obj.get_file_url
    
    def create(self, validated_data):
        """Handle magazine creation, removing delete_cover_image field"""
        # Remove delete_cover_image field as it's not needed for creation
        validated_data.pop('delete_cover_image', False)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Handle cover image deletion during update"""
        delete_cover_image = validated_data.pop('delete_cover_image', False)
        
        # Delete current cover image if requested
        if delete_cover_image and instance.cover_image:
            if instance.cover_image.storage.exists(instance.cover_image.name):
                instance.cover_image.storage.delete(instance.cover_image.name)
            instance.cover_image = None
        
        # Update other fields
        return super().update(instance, validated_data)

class ClubSerializer(serializers.ModelSerializer):
    events_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Club
        fields = '__all__'
    
    def get_events_count(self, obj):
        """Get count of active events for this club"""
        return obj.events.filter(is_active=True).count()


class CampusEventSerializer(serializers.ModelSerializer):
    club_name = serializers.CharField(source='club.name', read_only=True)
    
    class Meta:
        model = CampusEvent
        fields = '__all__'


class AcademicServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicService
        fields = '__all__'

class TopperSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Topper
        fields = '__all__'
    
    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
        return None

class CreativeWorkSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    content_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CreativeWork
        fields = '__all__'
    
    def get_image_url(self, obj):
        """Get image URL - external URL if available, otherwise local image URL"""
        return obj.get_image_url
    
    def get_content_url(self, obj):
        """Get content URL - external URL if available, otherwise local file URL"""
        return obj.get_content_url


class StudentSubmissionSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    
    class Meta:
        model = StudentSubmission
        fields = '__all__'
        read_only_fields = ['user', 'submitted_at', 'reviewed_at']
    
    def get_image_url(self, obj):
        """Get image URL - external URL if available, otherwise local image URL"""
        return obj.get_image_url
    
    def get_file_url(self, obj):
        """Get file URL - external URL if available, otherwise local file URL"""
        return obj.get_file_url
    
    def get_user_name(self, obj):
        """Get user's full name or username"""
        return obj.user.get_full_name() or obj.user.username
    
    def get_user_email(self, obj):
        """Get user's email"""
        return obj.user.email
    
    def create(self, validated_data):
        """Set the user from the request context"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)


class CampusStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampusStats
        fields = '__all__'


class NewsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = News
        fields = '__all__'
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None


class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = '__all__'


class OfficeLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfficeLocation
        fields = '__all__'


class QuickContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickContactInfo
        fields = '__all__'


class TimetableSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    department_code = serializers.CharField(source='department.code', read_only=True)
    file_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Timetable
        fields = '__all__'
    
    def get_file_url(self, obj):
        """Get the file URL (external or local)"""
        if obj.external_link:
            return obj.external_link
        elif obj.timetable_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.timetable_file.url)
        return None
    
    def get_image_url(self, obj):
        """Get the image URL"""
        if obj.timetable_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.timetable_image.url)
        return None
