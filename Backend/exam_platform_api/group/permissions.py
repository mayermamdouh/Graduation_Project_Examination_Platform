from rest_framework.permissions import BasePermission
from rest_framework.request import Request

from .models import Group


class IsGroupOwner(BasePermission):
    """
    Custom permission to check if the requesting user is the owner of the group.
    """
    message = 'You do not have permission to perform this action, You are not the group instructor.'

    def has_permission(self, request: Request, view):
        group_id = request.data.get('pk') or request.query_params.get('pk')
        group_code = request.data.get('group_code') or request.query_params.get('group_code')
        group = None

        # Attempt to retrieve the group by ID
        if group_id is not None:
            try:
                group = Group.objects.get(pk=group_id)
            except Group.DoesNotExist:
                pass

        # If the group was not found by ID, attempt to retrieve by group code
        if group is None and group_code is not None:
            try:
                group = Group.objects.get(code=group_code)
            except Group.DoesNotExist:
                self.message = "Group does not exist"
                return False

        # If the group is still None, it means both retrieval attempts failed
        if group is None:
            self.message = "Group does not exist"
            return False

        # Check if the requesting user is the owner of the group
        return request.user == group.instructor.user