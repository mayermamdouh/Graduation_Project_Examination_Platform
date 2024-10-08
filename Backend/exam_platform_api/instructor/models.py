from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Instructor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_instructor = models.BooleanField(default=False)
