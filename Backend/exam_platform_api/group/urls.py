from django.urls import path
from . import views


urlpatterns = [
    path("create/", views.GroupCreateAPIView.as_view(), name="create-group"),
    path("view/", views.GroupListAPIView.as_view(), name="list-groups"),
    path("student-view/", views.StudentGroupListAPIView.as_view(), name="student-list-groups"),
    path("assign-student/", views.AssignStudentCreateAPIView.as_view(), name="assign-student"),
    path("unassign-student/", views.UnassignStudentFromGroup.as_view(), name="unassign-student"),
    path("delete/", views.GroupDestroyAPIView.as_view(), name="delete-group"),
]