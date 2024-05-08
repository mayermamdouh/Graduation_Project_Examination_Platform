from rest_framework.permissions import BasePermission
from .models import Group

class IsGroupOwner(BasePermission):
    """
    Custom permission to check if the requesting user is the owner of the group.
    """
    message = 'You do not have permission to perform this action or the group does not exist'
    def has_permission(self, request, view):

        # Retrieve the group ID from the request (assuming it's provided in the URL or request data)
        group_code = request.data.get('group_code')

        # Retrieve the group object based on the group ID
        if Group.objects.filter(code=group_code).exists():
            group = Group.objects.get(code=group_code)
        else:
            return False
        # Check if the requesting user is the owner of the group
        return request.user == group.instructor.user
