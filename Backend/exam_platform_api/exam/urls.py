from django.urls import path
from . import views


urlpatterns = [
    path("", views.ExamListCreateAPIView.as_view()),
    path("<int:pk>/", views.ExamRetrieveUpdateDestroyView.as_view()),
    path("<int:pk>/group/", views.AssignExamToGroupCreateAPIView.as_view())
]