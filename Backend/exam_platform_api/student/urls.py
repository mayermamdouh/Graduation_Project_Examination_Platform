from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("group/", views.StudentGroupListAPIView.as_view()),
    path("group/<int:pk>/exams/", views.StudentGroupExamsAPIView.as_view()),
    path("exam/<int:pk>/", views.StudentAttemptExamCreateAPIView.as_view()),
    path("exam/<int:pk>/submit/", views.StudentSubmitExamCreateAPIView.as_view()),
    path("group/join/", views.StudentJoinGroupCreateAPIView.as_view()),
    path("exam/<int:pk>/cheating-case/", views.StudentCheatingCaseCreateAPIView.as_view())
] + static(settings.STATIC_URL, document_root=settings.MEDIA_ROOT)
