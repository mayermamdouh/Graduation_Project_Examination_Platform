from django.contrib.auth import models
from rest_framework import serializers


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ['username', 'first_name', 'last_name', 'email', 'date_joined']
