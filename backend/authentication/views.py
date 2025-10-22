from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db import models
from .serializers import LoginSerializer, RegisterSerializer, ProfileSerializer
from .models import Profile

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        # Get user profile
        try:
            profile = user.profile
            profile_data = ProfileSerializer(profile).data
        except Profile.DoesNotExist:
            profile_data = None
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'profile': profile_data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        # Get user profile
        profile = user.profile
        profile_data = ProfileSerializer(profile).data
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'profile': profile_data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile_view(request):
    try:
        profile = request.user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_profile_view(request):
    try:
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def users_list_view(request):
    """List all users with their profiles or create new user - Admin only"""
    if not request.user.is_staff and (not hasattr(request.user, 'profile') or request.user.profile.role != 'admin'):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        users = User.objects.all().select_related('profile').order_by('-date_joined')
        users_data = []
        
        for user in users:
            try:
                profile = user.profile
                profile_data = ProfileSerializer(profile).data
            except Profile.DoesNotExist:
                # Create profile if it doesn't exist
                profile = Profile.objects.create(user=user)
                profile_data = ProfileSerializer(profile).data
            
            users_data.append({
                'id': str(profile.id),
                'user_id': user.id,
                'full_name': profile_data.get('full_name') or f"{user.first_name} {user.last_name}".strip() or user.username,
                'email': user.email,
                'username': user.username,
                'role': profile_data.get('role', 'student'),
                'role_type': profile_data.get('role_type', 'student'),
                'department': profile_data.get('department', ''),
                'designation': profile_data.get('designation', ''),
                'qualifications': profile_data.get('qualifications', ''),
                'research_areas': profile_data.get('research_areas', []),
                'enrollment_year': profile_data.get('enrollment_year'),
                'semester': profile_data.get('semester', ''),
                'branch': profile_data.get('branch', ''),
                'graduation_year': profile_data.get('graduation_year'),
                'current_position': profile_data.get('current_position', ''),
                'company': profile_data.get('company', ''),
                'phone': profile_data.get('phone', ''),
                'address': profile_data.get('address', ''),
                'photo_url': profile_data.get('photo_url', ''),
                'is_active': user.is_active,
                'is_staff': user.is_staff,
                'date_joined': user.date_joined.isoformat(),
                'created_at': profile_data.get('created_at'),
                'updated_at': profile_data.get('updated_at')
            })
        
        return Response(users_data)
    
    elif request.method == 'POST':
        # Create new user
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User created successfully', 'user_id': user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def user_detail_view(request, user_id):
    """Get, update or delete a specific user - Admin only"""
    if not request.user.is_staff and (not hasattr(request.user, 'profile') or request.user.profile.role != 'admin'):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(id=user_id)
        profile = user.profile
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        profile = Profile.objects.create(user=user)
    
    if request.method == 'GET':
        profile_data = ProfileSerializer(profile).data
        return Response(profile_data)
    
    elif request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def superadmin_list_view(request):
    """Get list of superadmin users for filtering purposes"""
    if not request.user.is_staff and (not hasattr(request.user, 'profile') or request.user.profile.role != 'admin'):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    # Get all superadmin users (superusers, staff users, and admin role users)
    superadmin_users = User.objects.filter(
        models.Q(is_superuser=True) | 
        models.Q(is_staff=True) |
        models.Q(profile__role='admin')
    ).select_related('profile').distinct()
    
    superadmin_data = []
    for user in superadmin_users:
        superadmin_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff,
            'role': getattr(user.profile, 'role', 'student') if hasattr(user, 'profile') else 'student'
        })
    
    return Response(superadmin_data)
