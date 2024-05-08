from django.contrib.auth.models import User
from rest_framework import serializers
from student.serializers import StudentSerializer
from instructor.serializers import InstructorSerializer


class LoginFormSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class StudentUserSerializer(serializers.ModelSerializer):
    student = StudentSerializer()
    
    class Meta:
       model = User
       fields = ['username', 'email', 'first_name', 'student']



class InstructorUserSerializer(serializers.ModelSerializer):
    instructor = InstructorSerializer()
    
    class Meta:
       model = User
       fields = ['username', 'email', 'first_name', 'instructor']