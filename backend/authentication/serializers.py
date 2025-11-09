from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
                user = authenticate(username=user.username, password=password)
                if user:
                    if user.is_active:
                        data['user'] = user
                    else:
                        raise serializers.ValidationError('User account is disabled.')
                else:
                    raise serializers.ValidationError('Unable to log in with provided credentials.')
            except User.DoesNotExist:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include email and password.')

        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    # Accept all profile fields that might be sent from frontend
    full_name = serializers.CharField(required=False, allow_blank=True)
    role = serializers.CharField(required=False, allow_blank=True)
    role_type = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    designation = serializers.CharField(required=False, allow_blank=True)
    qualifications = serializers.CharField(required=False, allow_blank=True)
    research_areas = serializers.ListField(required=False, allow_empty=True)
    enrollment_year = serializers.IntegerField(required=False, allow_null=True)
    semester = serializers.CharField(required=False, allow_blank=True)
    branch = serializers.CharField(required=False, allow_blank=True)
    graduation_year = serializers.IntegerField(required=False, allow_null=True)
    current_position = serializers.CharField(required=False, allow_blank=True)
    company = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    photo_url = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'full_name', 'role', 'role_type', 'department', 'designation', 'qualifications',
            'research_areas', 'enrollment_year', 'semester', 'branch',
            'graduation_year', 'current_position', 'company', 'phone',
            'address', 'photo_url'
        ]

    def create(self, validated_data):
        # Extract all profile fields
        profile_fields = [
            'full_name', 'role', 'role_type', 'department', 'designation', 'qualifications',
            'research_areas', 'enrollment_year', 'semester', 'branch',
            'graduation_year', 'current_position', 'company', 'phone',
            'address', 'photo_url'
        ]
        
        # Extract profile data from validated_data
        profile_data = {}
        for field in profile_fields:
            if field in validated_data:
                profile_data[field] = validated_data.pop(field)
        
        # Set default role if not provided
        if 'role' not in profile_data:
            profile_data['role'] = 'student'

        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Update the profile created by the signal with all data
        profile = user.profile
        for field, value in profile_data.items():
            if hasattr(profile, field):
                # Only set the field if it has a meaningful value
                if value is not None and value != '' and value != []:
                    setattr(profile, field, value)
                # For integer fields, convert empty strings to None
                elif field in ['enrollment_year', 'graduation_year'] and value == '':
                    setattr(profile, field, None)
        profile.save()
        
        return user
