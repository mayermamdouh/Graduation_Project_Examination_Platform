from rest_framework.permissions import BasePermission, IsAuthenticated


class IsInstructor(BasePermission):
    def has_permission(self, request, view):
        return IsAuthenticated().has_permission(request, view) and request.user.instructor.is_instructor


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return IsAuthenticated().has_permission(request, view) and request.user.student.is_student
