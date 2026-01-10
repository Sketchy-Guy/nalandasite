from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import (
    Program, Trade, Department, DepartmentGalleryImage, HeroImage, Notice, Magazine, Club, CampusEvent,
    AcademicService, Topper, CreativeWork, StudentSubmission, CampusStats, News, ContactInfo, OfficeLocation, QuickContactInfo, Timetable,
    FeesStructure, Scholarship, TranscriptService, AdminRole, AdminActivityLog, Hostel, HostelImage, SportsFacility, SportsFacilityImage
)
from .serializers import (
    ProgramSerializer, TradeSerializer, DepartmentSerializer, DepartmentGalleryImageSerializer, HeroImageSerializer, NoticeSerializer,
    MagazineSerializer, ClubSerializer, CampusEventSerializer, AcademicServiceSerializer,
    TopperSerializer, CreativeWorkSerializer, StudentSubmissionSerializer, CampusStatsSerializer, 
    NewsSerializer, ContactInfoSerializer, OfficeLocationSerializer, QuickContactInfoSerializer, TimetableSerializer,
    FeesStructureSerializer, ScholarshipSerializer, TranscriptServiceSerializer, AdminRoleSerializer, AdminActivityLogSerializer,
    HostelSerializer, SportsFacilitySerializer
)
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to admin users.
        return request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.role == 'admin'

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_predefined', 'is_active']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'created_at']
    
    @action(detail=False, methods=['get'], permission_classes=[])
    def hierarchy(self, request):
        """Get hierarchical structure of programs, trades, and departments for navigation"""
        programs = Program.objects.filter(is_active=True).prefetch_related(
            'trades__departments'
        ).order_by('-is_predefined', 'name')
        
        hierarchy_data = []
        for program in programs:
            program_data = {
                'id': program.id,
                'name': program.name,
                'code': program.code,
                'is_predefined': program.is_predefined,
                'trades': [],
                'direct_branches': []
            }
            
            # Get trades with their departments
            trades = program.trades.filter(is_active=True).order_by('-is_predefined', 'name')
            for trade in trades:
                departments = trade.departments.filter(is_active=True, is_direct_branch=False).order_by('name')
                if departments.exists():  # Only include trades that have departments
                    trade_data = {
                        'id': trade.id,
                        'name': trade.name,
                        'code': trade.code,
                        'is_predefined': trade.is_predefined,
                        'departments': [
                            {
                                'id': dept.id,
                                'name': dept.name,
                                'code': dept.code
                            }
                            for dept in departments
                        ]
                    }
                    program_data['trades'].append(trade_data)
            
            # Get direct branches (departments without trade)
            direct_branches = program.departments.filter(
                is_active=True,
                is_direct_branch=True
            ).order_by('name')
            
            program_data['direct_branches'] = [
                {
                    'id': dept.id,
                    'name': dept.name,
                    'code': dept.code
                }
                for dept in direct_branches
            ]
            
            hierarchy_data.append(program_data)
        
        return Response(hierarchy_data)


class TradeViewSet(viewsets.ModelViewSet):
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['program', 'is_predefined', 'is_active']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['program', 'name', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        program_id = self.request.query_params.get('program_id')
        if program_id:
            queryset = queryset.filter(program_id=program_id)
        return queryset

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.filter(is_active=True)
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'created_at']

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upload_gallery_image(self, request, pk=None):
        """Upload a gallery image for a department"""
        department = self.get_object()
        serializer = DepartmentGalleryImageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(department=department)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        """Custom update to handle hero image deletion"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Check if user wants to delete the hero image
        if request.data.get('delete_hero_image') == 'true' and instance.hero_image:
            # Delete the old hero image file
            instance.hero_image.delete(save=False)
            instance.hero_image = None
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

class DepartmentGalleryImageViewSet(viewsets.ModelViewSet):
    queryset = DepartmentGalleryImage.objects.all()
    serializer_class = DepartmentGalleryImageSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['department', 'is_active']
    search_fields = ['caption']
    ordering_fields = ['display_order', 'created_at']

class HeroImageViewSet(viewsets.ModelViewSet):
    queryset = HeroImage.objects.all()  # Show all images for admin
    serializer_class = HeroImageSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['display_order', 'created_at']

class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()  # Show all notices for admin (like hero images)
    serializer_class = NoticeSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'priority', 'is_new', 'is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'priority']

class MagazineViewSet(viewsets.ModelViewSet):
    queryset = Magazine.objects.filter(is_active=True)
    serializer_class = MagazineSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['issue_date', 'created_at']
    
    def get_queryset(self):
        """Override to show all magazines for admin users"""
        if self.request.user.is_staff or (hasattr(self.request.user, 'profile') and self.request.user.profile.role == 'admin'):
            return Magazine.objects.all()
        return Magazine.objects.filter(is_active=True)
    
    def perform_destroy(self, instance):
        """Override to ensure files are cleaned up on delete"""
        # The model's delete method will handle file cleanup
        instance.delete()

class ClubViewSet(viewsets.ModelViewSet):
    queryset = Club.objects.filter(is_active=True)
    serializer_class = ClubSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'member_count', 'event_count']
    
    @action(detail=True, methods=['get'])
    def events(self, request, pk=None):
        """Get all events for a specific club"""
        club = self.get_object()
        events = club.events.filter(is_active=True).order_by('-start_date')
        serializer = CampusEventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)


class CampusEventViewSet(viewsets.ModelViewSet):
    queryset = CampusEvent.objects.filter(is_active=True)
    serializer_class = CampusEventSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['event_type', 'is_featured', 'is_active', 'club']
    search_fields = ['title', 'description', 'organizer', 'venue']
    ordering_fields = ['start_date', 'created_at', 'title']
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events"""
        from django.utils import timezone
        current_date = timezone.now().date()
        
        events = self.queryset.filter(
            start_date__gte=current_date
        ).order_by('start_date')
        
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured events"""
        events = self.queryset.filter(is_featured=True).order_by('-start_date')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_club(self, request):
        """Get events filtered by club"""
        club_id = request.query_params.get('club_id')
        if club_id:
            events = self.queryset.filter(club__id=club_id).order_by('-start_date')
            serializer = self.get_serializer(events, many=True)
            return Response(serializer.data)
        return Response({'error': 'club_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)


class AcademicServiceViewSet(viewsets.ModelViewSet):
    queryset = AcademicService.objects.all()  # Show all documents, not just active
    serializer_class = AcademicServiceSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'category', 'department']
    search_fields = ['title', 'description', 'category']  # Fixed: was 'name'
    ordering_fields = ['title', 'created_at', 'download_count']
    ordering = ['-created_at']  # Default ordering

class TopperViewSet(viewsets.ModelViewSet):
    queryset = Topper.objects.filter(is_active=True)
    serializer_class = TopperSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['department', 'year', 'is_active']
    search_fields = ['name', 'department']
    ordering_fields = ['rank', 'year', 'cgpa']

class CreativeWorkViewSet(viewsets.ModelViewSet):
    queryset = CreativeWork.objects.filter(is_active=True)
    serializer_class = CreativeWorkSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_featured', 'is_active']
    search_fields = ['title', 'author_name', 'description']
    ordering_fields = ['created_at', 'is_featured']


class StudentSubmissionViewSet(viewsets.ModelViewSet):
    queryset = StudentSubmission.objects.all()
    serializer_class = StudentSubmissionSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'category', 'department', 'is_featured', 'is_active']
    search_fields = ['title', 'description', 'user__username', 'user__first_name', 'user__last_name']
    ordering_fields = ['submitted_at', 'reviewed_at', 'status']

    def get_permissions(self):
        """
        Instantiate and return the list of permissions for this view.
        Students can create and view their own submissions.
        Admins can view and modify all submissions.
        """
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdminOrReadOnly]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Filter submissions based on user role.
        Students can only see their own submissions.
        Admins can see all submissions.
        """
        user = self.request.user
        if not user.is_authenticated:
            return StudentSubmission.objects.none()
        
        # Check if user is admin
        if user.is_staff or (hasattr(user, 'profile') and user.profile.role == 'admin'):
            return StudentSubmission.objects.all()
        
        # Regular users can only see their own submissions
        return StudentSubmission.objects.filter(user=user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrReadOnly])
    def review(self, request, pk=None):
        """Review a submission (approve/reject)"""
        submission = self.get_object()
        action_type = request.data.get('action')  # 'approve' or 'reject'
        is_featured = request.data.get('is_featured', False)
        review_comments = request.data.get('review_comments', '')

        if action_type not in ['approve', 'reject']:
            return Response({'error': 'Action must be either "approve" or "reject"'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        from django.utils import timezone
        # Map action_type to proper status values
        status_mapping = {'approve': 'approved', 'reject': 'rejected'}
        submission.status = status_mapping.get(action_type, action_type)
        submission.is_featured = is_featured if action_type == 'approve' else False
        submission.is_active = True if action_type == 'approve' else submission.is_active
        submission.review_comments = review_comments
        submission.reviewed_at = timezone.now()
        submission.save()

        return Response({
            'message': f'Submission {action_type}d successfully',
            'submission': StudentSubmissionSerializer(submission, context={'request': request}).data
        })

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending submissions (admin only)"""
        if not (request.user.is_staff or (hasattr(request.user, 'profile') and request.user.profile.role == 'admin')):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        pending_submissions = StudentSubmission.objects.filter(status='pending')
        serializer = self.get_serializer(pending_submissions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def approved(self, request):
        """Get all approved submissions"""
        approved_submissions = StudentSubmission.objects.filter(status='approved', is_active=True)
        serializer = self.get_serializer(approved_submissions, many=True)
        return Response(serializer.data)


class CampusStatsViewSet(viewsets.ModelViewSet):
    queryset = CampusStats.objects.filter(is_active=True)
    serializer_class = CampusStatsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['stat_name', 'description']
    ordering_fields = ['display_order', 'created_at']


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.filter(is_active=True)
    serializer_class = NewsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'priority', 'is_featured', 'is_new', 'is_active']
    search_fields = ['title', 'description', 'content']
    ordering_fields = ['published_date', 'created_at']


class ContactInfoViewSet(viewsets.ModelViewSet):
    queryset = ContactInfo.objects.all()  # Show all for admin
    serializer_class = ContactInfoSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['office_name', 'contact_person', 'phone', 'email', 'department']
    ordering_fields = ['display_order', 'created_at']


class OfficeLocationViewSet(viewsets.ModelViewSet):
    queryset = OfficeLocation.objects.all()  # Show all for admin
    serializer_class = OfficeLocationSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_main_office', 'is_active']
    search_fields = ['name', 'building', 'phone', 'email']
    ordering_fields = ['is_main_office', 'name', 'created_at']


class QuickContactInfoViewSet(viewsets.ModelViewSet):
    queryset = QuickContactInfo.objects.all()  # Show all for admin
    serializer_class = QuickContactInfoSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['main_phone', 'main_email', 'general_inquiries_email']
    ordering_fields = ['created_at']


class TimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.filter(is_active=True)
    serializer_class = TimetableSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['department', 'timetable_type', 'semester', 'academic_year', 'is_featured', 'is_active']
    search_fields = ['title', 'description', 'department__name', 'department__code']
    ordering_fields = ['display_order', 'created_at', 'valid_from', 'valid_to']

    @action(detail=False, methods=['get'])
    def by_department(self, request):
        """Get timetables filtered by department"""
        department_id = request.query_params.get('department_id')
        if department_id:
            timetables = self.queryset.filter(department__id=department_id)
            serializer = self.get_serializer(timetables, many=True)
            return Response(serializer.data)
        return Response({'error': 'department_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current active timetables"""
        from django.utils import timezone
        current_date = timezone.now().date()
        
        timetables = self.queryset.filter(
            valid_from__lte=current_date,
            valid_to__gte=current_date
        )
        serializer = self.get_serializer(timetables, many=True)
        return Response(serializer.data)


class FeesStructureViewSet(viewsets.ModelViewSet):
    queryset = FeesStructure.objects.all()  # Show all for admin
    serializer_class = FeesStructureSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['academic_year', 'semester', 'department', 'is_active']
    search_fields = ['title', 'description', 'department']
    ordering_fields = ['created_at', 'due_date']
    
    def get_queryset(self):
        """Override to show only active fees for non-admin users"""
        if self.request.user.is_staff or (hasattr(self.request.user, 'profile') and self.request.user.profile.role == 'admin'):
            return FeesStructure.objects.all()
        return FeesStructure.objects.filter(is_active=True)
    
    @action(detail=False, methods=['get'], permission_classes=[])
    def category_choices(self, request):
        """Return available fee category choices"""
        return Response([
            {'value': choice[0], 'label': choice[1]} 
            for choice in FeesStructure.CATEGORY_CHOICES
        ])


class ScholarshipViewSet(viewsets.ModelViewSet):
    queryset = Scholarship.objects.filter(is_active=True)
    serializer_class = ScholarshipSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['title', 'description', 'eligibility_criteria']
    ordering_fields = ['created_at', 'application_deadline', 'amount']
    
    def get_queryset(self):
        """Override to show all scholarships for admin users"""
        if self.request.user.is_staff or (hasattr(self.request.user, 'profile') and self.request.user.profile.role == 'admin'):
            return Scholarship.objects.all()
        return Scholarship.objects.filter(is_active=True)


class TranscriptServiceViewSet(viewsets.ModelViewSet):
    queryset = TranscriptService.objects.filter(is_active=True)
    serializer_class = TranscriptServiceSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'is_online']
    search_fields = ['service_name', 'description']
    ordering_fields = ['created_at', 'processing_time', 'fees_amount']
    
    def get_queryset(self):
        """Override to show all services for admin users"""
        if self.request.user.is_staff or (hasattr(self.request.user, 'profile') and self.request.user.profile.role == 'admin'):
            return TranscriptService.objects.all()
        return TranscriptService.objects.filter(is_active=True)


class IsSuperAdmin(permissions.BasePermission):
    """
    Custom permission to only allow superadmins to access role management.
    Also allows admins who have been granted 'roles' page access.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Check if user has AdminRole with level 1 (Super Admin)
        try:
            admin_role = request.user.admin_role
            if admin_role.is_active and admin_role.role_level == 1:
                return True
            # Allow admins who have 'roles' in their allowed_pages
            if admin_role.is_active and 'roles' in admin_role.allowed_pages:
                return True
            return False
        except:
            return False


class AdminRoleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing admin roles and permissions.
    Accessible by Super Admins and Admins with 'roles' page permission.
    Non-super-admins cannot see or modify super admin roles.
    """
    queryset = AdminRole.objects.select_related('user', 'granted_by').all()
    serializer_class = AdminRoleSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role_level', 'is_active']
    search_fields = ['user__username', 'user__email', 'user__profile__full_name']
    ordering_fields = ['role_level', 'granted_at', 'created_at']
    
    def get_queryset(self):
        """
        Override to hide super admin roles from non-super-admin users.
        Only super admins can see other super admins.
        """
        queryset = super().get_queryset()
        
        try:
            admin_role = self.request.user.admin_role
            # If not a super admin, exclude super admin roles from the list
            if admin_role.role_level != 1:
                queryset = queryset.exclude(role_level=1)
        except:
            pass
        
        return queryset
    
    def perform_create(self, serializer):
        """Automatically set granted_by to current user"""
        serializer.save(granted_by=self.request.user)
        
        # Log the activity
        AdminActivityLog.objects.create(
            admin=self.request.user,
            action='grant_role',
            resource_type='admin_role',
            resource_id=str(serializer.instance.id),
            details={
                'target_user': serializer.instance.user.email,
                'role_level': serializer.instance.role_level,
                'allowed_pages': serializer.instance.allowed_pages
            },
            ip_address=self.get_client_ip(),
            user_agent=self.request.META.get('HTTP_USER_AGENT', '')
        )
    
    def perform_update(self, serializer):
        """Log permission changes"""
        old_instance = self.get_object()
        serializer.save()
        
        # Log the activity
        AdminActivityLog.objects.create(
            admin=self.request.user,
            action='update_role',
            resource_type='admin_role',
            resource_id=str(serializer.instance.id),
            details={
                'target_user': serializer.instance.user.email,
                'old_role_level': old_instance.role_level,
                'new_role_level': serializer.instance.role_level,
                'old_pages': old_instance.allowed_pages,
                'new_pages': serializer.instance.allowed_pages
            },
            ip_address=self.get_client_ip(),
            user_agent=self.request.META.get('HTTP_USER_AGENT', '')
        )
    
    def perform_destroy(self, instance):
        """Soft delete by setting is_active to False"""
        instance.is_active = False
        instance.save()
        
        # Log the activity
        AdminActivityLog.objects.create(
            admin=self.request.user,
            action='revoke_role',
            resource_type='admin_role',
            resource_id=str(instance.id),
            details={
                'target_user': instance.user.email,
                'role_level': instance.role_level
            },
            ip_address=self.get_client_ip(),
            user_agent=self.request.META.get('HTTP_USER_AGENT', '')
        )
    
    def get_client_ip(self):
        """Get client IP address from request"""
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip
    
    
    @action(detail=False, methods=['get'])
    def available_pages(self, request):
        """Return list of available admin pages that can be assigned"""
        pages = [
            # Content
            {'slug': 'notices', 'name': 'Notices'},
            {'slug': 'news', 'name': 'News & Announcements'},
            {'slug': 'contact', 'name': 'Contact Management'},
            {'slug': 'campus-stats', 'name': 'Campus Statistics'},
            
            # Media
            {'slug': 'hero-images', 'name': 'Hero Images'},
            {'slug': 'photo-gallery', 'name': 'Photo Gallery'},
            {'slug': 'magazines', 'name': 'Magazines'},
            {'slug': 'creative-gallery', 'name': 'Creative Gallery'},
            {'slug': 'submissions', 'name': 'Submissions Manager'},
            
            # Academic Management
            {'slug': 'timetables', 'name': 'Timetables'},
            {'slug': 'downloads', 'name': 'Downloads'},
            {'slug': 'fees', 'name': 'Fees Management'},
            {'slug': 'scholarships', 'name': 'Scholarships'},
            {'slug': 'transcripts', 'name': 'Transcripts'},
            
            # Academic Content
            {'slug': 'academic-content', 'name': 'Academic Content'},
            {'slug': 'academic-excellence', 'name': 'Academic Excellence'},
            {'slug': 'clubs-activities', 'name': 'Clubs & Activities'},
            {'slug': 'departments', 'name': 'Departments'},
            
            # Campus Life
            {'slug': 'campus-life', 'name': 'Campus Life Content'},
            {'slug': 'campus-pages', 'name': 'Campus Pages'},
            {'slug': 'student-activities', 'name': 'Student Activities'},
            {'slug': 'sports-facilities', 'name': 'Sports Facilities'},
            {'slug': 'hostel', 'name': 'Hostel Management'},
            {'slug': 'events', 'name': 'Events Manager'},
            {'slug': 'wellness', 'name': 'Wellness Programs'},
            {'slug': 'governance', 'name': 'Student Governance'},
            {'slug': 'publications', 'name': 'Publications'},
            {'slug': 'amenities', 'name': 'Amenities'},
            {'slug': 'womens-forum', 'name': "Women's Forum"},
            {'slug': 'social-initiatives', 'name': 'Social Initiatives'},
            {'slug': 'innovation', 'name': 'Innovation Centers'},
            
            # About Us
            {'slug': 'awards', 'name': 'Awards & Achievements'},
            {'slug': 'leadership', 'name': 'Leadership Messages'},
            
            # Management
            {'slug': 'users', 'name': 'User Management'},
            {'slug': 'roles', 'name': '⚠️ Role Management (Delegate with caution)'},
            {'slug': 'settings', 'name': 'Settings'},
        ]
        return Response(pages)
    
    @action(detail=False, methods=['post'])
    def create_admin_account(self, request):
        """Create a dedicated admin account"""
        from django.contrib.auth.hashers import make_password
        from django.contrib.auth.models import User
        from authentication.models import Profile
        
        # Validate required fields
        required_fields = ['full_name', 'email', 'username', 'contact', 'password']
        for field in required_fields:
            if not request.data.get(field):
                return Response(
                    {'error': f'{field} is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        full_name = request.data.get('full_name')
        email = request.data.get('email')
        username = request.data.get('username')
        contact = request.data.get('contact')
        password = request.data.get('password')
        
        # Validate password length
        if len(password) < 8:
            return Response(
                {'error': 'Password must be at least 8 characters long'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        
        try:
            from django.db import transaction
            
            with transaction.atomic():
                # Create Django User with staff privileges
                user = User.objects.create(
                    username=username,
                    email=email,
                    password=make_password(password),
                    is_staff=True,  # Mark as staff to distinguish from regular users
                    is_active=True
                )
                
                # Update or create profile
                profile, created = Profile.objects.get_or_create(user=user)
                profile.full_name = full_name
                profile.phone = contact
                profile.role = 'admin'  # Mark profile as admin
                profile.save()
                
                # Log the activity (temporarily disabled for debugging)
                # self.log_activity(
                #     request,
                #     'CREATE_ADMIN_ACCOUNT',
                #     f'Created admin account: {username} ({email})'
                # )
            
            return Response({
                'message': 'Admin account created successfully',
                'user_id': user.id,
                'username': username,
                'email': email,
                'full_name': full_name
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"Error creating admin account: {error_trace}")  # Log to console
            return Response(
                {'error': f'Failed to create admin account: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    
    @action(detail=False, methods=['get'], permission_classes=[])
    def my_permissions(self, request):
        """Get current user's admin permissions"""
        # Allow any authenticated user to see their own permissions
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=401)
            
        try:
            admin_role = request.user.admin_role
            serializer = self.get_serializer(admin_role)
            return Response(serializer.data)
        except AdminRole.DoesNotExist:
            return Response({'detail': 'No admin role found'}, status=404)


class AdminActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing admin activity logs.
    Only accessible by Super Admins.
    Read-only - logs cannot be modified or deleted.
    """
    queryset = AdminActivityLog.objects.select_related('admin').all()
    serializer_class = AdminActivityLogSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['action', 'resource_type', 'admin']
    search_fields = ['action', 'resource_type', 'admin__username', 'admin__email']
    ordering_fields = ['created_at']
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent activity logs (last 50)"""
        logs = self.queryset[:50]
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)


class HostelViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing hostels with image upload support.
    Supports up to 4 images per hostel.
    """
    queryset = Hostel.objects.prefetch_related('images').all()
    serializer_class = HostelSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['hostel_type', 'is_active']
    search_fields = ['name', 'description', 'warden_name']
    ordering_fields = ['name', 'created_at', 'capacity']
    ordering = ['-created_at']
    
    def get_serializer_context(self):
        """Add request to serializer context for building absolute URLs"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['delete'], url_path='images/(?P<image_id>[^/.]+)')
    def delete_image(self, request, pk=None, image_id=None):
        """Delete a specific image from a hostel"""
        hostel = self.get_object()
        try:
            image = hostel.images.get(id=image_id)
            image.delete()
            return Response({'message': 'Image deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except HostelImage.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def by_admin(self, request):
        """Get activity logs for a specific admin"""
        admin_id = request.query_params.get('admin_id')
        if not admin_id:
            return Response({'error': 'admin_id parameter required'}, status=400)
        
        logs = self.queryset.filter(admin_id=admin_id)
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)


class SportsFacilityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing sports facilities with image upload support.
    """
    queryset = SportsFacility.objects.prefetch_related('images').all()
    serializer_class = SportsFacilitySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['facility_type', 'is_active', 'booking_required']
    search_fields = ['name', 'description', 'contact_person']
    ordering_fields = ['name', 'created_at', 'capacity']
    ordering = ['-created_at']
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['delete'], url_path='images/(?P<image_id>[^/.]+)')
    def delete_image(self, request, pk=None, image_id=None):
        """Delete a specific image from a sports facility"""
        facility = self.get_object()
        try:
            image = facility.images.get(id=image_id)
            image.delete()
            serializer = self.get_serializer(facility)
            return Response(serializer.data)
        except SportsFacilityImage.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
