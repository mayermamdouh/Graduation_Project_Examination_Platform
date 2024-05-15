from django.urls import path
from . import views


urlpatterns = [
    path("", views.GroupListCreateAPIView.as_view()),
    path("<int:pk>/", views.GroupRetrieveUpdateDestroyAPIView.as_view()),
    path("student-view/", views.StudentGroupListAPIView.as_view(), name="student-list-groups"),
    path("assign-student/", views.AssignStudentCreateAPIView.as_view(), name="assign-student"),
    path("unassign-student/", views.UnassignStudentFromGroup.as_view(), name="unassign-student"),
    path("delete/", views.GroupDestroyAPIView.as_view(), name="delete-group"),
]