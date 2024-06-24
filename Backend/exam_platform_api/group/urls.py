from django.urls import path
from . import views


urlpatterns = [
    path("", views.GroupListCreateAPIView.as_view()),
    path("<int:pk>/", views.GroupRetrieveUpdateDestroyAPIView.as_view()),
    path("assign-student/", views.AssignStudentCreateAPIView.as_view(), name="assign-student"),
    path("unassign-student/", views.UnassignStudentFromGroup.as_view(), name="unassign-student"),
    path("<int:pk>/student/", views.StudentExamsGroupCreateAPIView.as_view())
]