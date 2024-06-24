from django.urls import path
from . import views

urlpatterns = [
    path("", views.ExamListCreateAPIView.as_view()),
    path("<int:pk>/", views.ExamRetrieveUpdateDestroyView.as_view()),
    path("<int:pk>/group/", views.AssignExamToGroupCreateAPIView.as_view()),
    path("<int:pk>/submission/", views.ExamStudentSubmissionCreateAPIView.as_view()),
    path("<int:pk>/submission/correct/", views.ExamStudentSubmissionCorrectCreateAPIView.as_view())
]
