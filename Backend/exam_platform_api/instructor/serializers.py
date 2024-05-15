from rest_framework import serializers
from .models import Instructor
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']


class InstructorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Instructor
        fields = ['user', 'is_instructor']