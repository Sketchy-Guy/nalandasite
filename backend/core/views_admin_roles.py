# Add this at the end of views.py after TranscriptServiceViewSet

class IsSuperAdmin(permissions.BasePermission):
    """
    Custom permission to only allow superadmins to access role management.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Check if user has AdminRole with level 1 (Super Admin)
        try:
            admin_role = request.user.admin_role
            return admin_role.is_active and admin_role.role_level == 1
        except:
            return False


class AdminRoleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing admin roles and permissions.
    Only accessible by Super Admins.
    """
    queryset = AdminRole.objects.select_related('user', 'granted_by').all()
    serializer_class = AdminRoleSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role_level', 'is_active']
    search_fields = ['user__username', 'user__email', 'user__profile__full_name']
    ordering_fields = ['role_level', 'granted_at', 'created_at']
    
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
            {'slug': 'users', 'name': 'User Management'},
            {'slug': 'scholarships', 'name': 'Scholarships'},
            {'slug': 'transcripts', 'name': 'Transcripts'},
            {'slug': 'events', 'name': 'Events'},
            {'slug': 'hostel', 'name': 'Hostel'},
            {'slug': 'wellness', 'name': 'Wellness'},
            {'slug': 'sports', 'name': 'Sports Facilities'},
            {'slug': 'social-initiatives', 'name': 'Social Initiatives'},
            {'slug': 'governance', 'name': 'Governance'},
            {'slug': 'campus-pages', 'name': 'Campus Pages'},
            {'slug': 'campus-life', 'name': 'Campus Life'},
            {'slug': 'academic-content', 'name': 'Academic Content'},
            {'slug': 'women-forum', 'name': 'Women Forum'},
        ]
        return Response(pages)
    
    @action(detail=False, methods=['get'])
    def my_permissions(self, request):
        """Get current user's admin permissions"""
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
    
    @action(detail=False, methods=['get'])
    def by_admin(self, request):
        """Get activity logs for a specific admin"""
        admin_id = request.query_params.get('admin_id')
        if not admin_id:
            return Response({'error': 'admin_id parameter required'}, status=400)
        
        logs = self.queryset.filter(admin_id=admin_id)
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)
