from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import (
    Department, DepartmentGalleryImage, HeroImage, Notice, Magazine, Club,
    AcademicService, Topper, CreativeWork, StudentSubmission, CampusStats, News, ContactInfo, OfficeLocation, QuickContactInfo, Timetable
)
from .serializers import (
    DepartmentSerializer, DepartmentGalleryImageSerializer, HeroImageSerializer, NoticeSerializer,
    MagazineSerializer, ClubSerializer, AcademicServiceSerializer,
    TopperSerializer, CreativeWorkSerializer, StudentSubmissionSerializer, CampusStatsSerializer, 
    NewsSerializer, ContactInfoSerializer, OfficeLocationSerializer, QuickContactInfoSerializer, TimetableSerializer
)

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

class AcademicServiceViewSet(viewsets.ModelViewSet):
    queryset = AcademicService.objects.filter(is_active=True)
    serializer_class = AcademicServiceSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

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

