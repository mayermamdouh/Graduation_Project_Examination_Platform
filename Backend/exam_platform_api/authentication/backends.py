from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

class CustomUserBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        User = get_user_model()
        try:
            # Check if the user exists in StudentUser model
            user = User.objects.get_student_user(username=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            pass
        
        try:
            # Check if the user exists in InstructorUser model
            user = User.objects.get_instructor_user(username=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            pass
        
        return None

    def get_user(self, user_id):
        User = get_user_model()
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
