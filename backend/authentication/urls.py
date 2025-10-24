from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    login_view, register_view, profile_view, update_profile_view, 
    users_list_view, user_detail_view, superadmin_list_view,
    update_user_credentials_view
)

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('profile/', profile_view, name='profile'),
    path('profile/update/', update_profile_view, name='update_profile'),
    path('users/', users_list_view, name='users_list'),
    path('users/<int:user_id>/', user_detail_view, name='user_detail'),
    path('users/<int:user_id>/credentials/', update_user_credentials_view, name='update_user_credentials'),
    path('superadmins/', superadmin_list_view, name='superadmin_list'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
