from django.contrib.auth.models import AbstractUser
from django.db import models
from student.models import Student
from instructor.models import Instructor
from django.contrib.auth.models import User
from django import forms
from django.contrib.auth.forms import UserCreationForm


class CustomUserCreationForm(UserCreationForm):
    USER_TYPES = [
        ('instructor', 'Instructor'),
        ('student', 'Student'),
    ]

    model = User
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(required=True)
    type = forms.ChoiceField(choices=USER_TYPES, required=True)

    class Meta(UserCreationForm.Meta):
        fields = UserCreationForm.Meta.fields + ('first_name', 'last_name', 'email', 'type')