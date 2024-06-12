from rest_framework.permissions import BasePermission

from group.models import Group


class IsGroupStudent(BasePermission):
    """
    Custom permission to check if the requesting user is a student of the group.
    """
    message = 'You do not have permission, you are not a member of the group or the group does not exist.'

    def has_permission(self, request, view):
        # Retrieve the group ID from the URL (assuming it's provided as a URL parameter)
        group_id = view.kwargs.get('pk')

        # Retrieve the group object based on the group ID
        try:
            group = Group.objects.get(pk=group_id)
            student = request.user.student
            return group.students.filter(id=student.id).exists()
        except Group.DoesNotExist:
            return False
