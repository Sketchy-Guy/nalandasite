from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProgramViewSet, TradeViewSet, DepartmentViewSet, DepartmentGalleryImageViewSet, HeroImageViewSet, NoticeViewSet,
    MagazineViewSet, ClubViewSet, CampusEventViewSet, AcademicServiceViewSet,
    TopperViewSet, CreativeWorkViewSet, StudentSubmissionViewSet, CampusStatsViewSet,
    NewsViewSet, ContactInfoViewSet, OfficeLocationViewSet, QuickContactInfoViewSet, TimetableViewSet
)

router = DefaultRouter()
router.register(r'programs', ProgramViewSet)
router.register(r'trades', TradeViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'department-gallery-images', DepartmentGalleryImageViewSet)
router.register(r'hero-images', HeroImageViewSet)
router.register(r'notices', NoticeViewSet)
router.register(r'magazines', MagazineViewSet)
router.register(r'clubs', ClubViewSet)
router.register(r'campus-events', CampusEventViewSet)
router.register(r'academic-services', AcademicServiceViewSet)
router.register(r'toppers', TopperViewSet)
router.register(r'creative-works', CreativeWorkViewSet)
router.register(r'student-submissions', StudentSubmissionViewSet)
router.register(r'campus-stats', CampusStatsViewSet)
router.register(r'news', NewsViewSet)
router.register(r'contact-info', ContactInfoViewSet)
router.register(r'office-locations', OfficeLocationViewSet)
router.register(r'quick-contact-info', QuickContactInfoViewSet)
router.register(r'timetables', TimetableViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
