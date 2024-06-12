import uuid
from django.db import models
from instructor.models import Instructor
from student.models import Student
from django.utils import timezone
# Create your models here.

class Group(models.Model):
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)
    students = models.ManyToManyField(Student)
    name = models.CharField(max_length=50, blank=False)
    description = models.TextField(max_length=200, blank=True)
    code = models.UUIDField(editable=False, unique=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(default=timezone.now)

    def delete(self, *args, **kwargs):
        # Delete associated memberships
        self.membership_set.all().delete()

        # Call the superclass's delete method to delete the group
        super().delete(*args, **kwargs)


class Membership(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    joined_date = models.DateTimeField(auto_now_add=True)