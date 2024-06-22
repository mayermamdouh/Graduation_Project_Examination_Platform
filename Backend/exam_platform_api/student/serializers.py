from rest_framework import serializers

from exam.models import Exam, CheatingCase
from .models import Student
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Student
        fields = ['user', 'is_student']


class StudentExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'name', 'duration_minutes']


class StudentJoinGroupSerializer(serializers.Serializer):
    group_code = serializers.UUIDField()


class StudentExamSubmissionSerializer(serializers.Serializer):
    questions = serializers.JSONField()
    new_tab = serializers.IntegerField(default=0)


class CheatingCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheatingCase
        fields = '__all__'
