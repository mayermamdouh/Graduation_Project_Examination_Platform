from django.contrib.auth.models import User
from rest_framework import serializers
from student.serializers import StudentSerializer
from instructor.serializers import InstructorSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class LoginFormSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class StudentUserSerializer(serializers.ModelSerializer):
    student = StudentSerializer()

    class Meta:
        model = User
        fields = ['student']


class InstructorUserSerializer(serializers.ModelSerializer):
    instructor = InstructorSerializer()

    class Meta:
        model = User
        fields = ['instructor']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        if hasattr(user, 'student'):
            token['type'] = 'student'
        elif hasattr(user, 'instructor'):
            token['type'] = 'instructor'
        else:
            token['type'] = 'unknown'
        return token
