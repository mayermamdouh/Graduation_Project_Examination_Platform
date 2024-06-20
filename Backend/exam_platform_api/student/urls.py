from django.urls import path

from . import views

urlpatterns = [
    path("group/", views.StudentGroupListAPIView.as_view()),
    path("group/<int:pk>/exams/", views.StudentGroupExamsAPIView.as_view()),
    path("exam/<int:pk>/", views.StudentAttemptExamCreateAPIView.as_view()),
    path("exam/<int:pk>/submit", views.StudentSubmitExamCreateAPIView.as_view()),
    path("group/join/", views.StudentJoinGroupCreateAPIView.as_view())
]
