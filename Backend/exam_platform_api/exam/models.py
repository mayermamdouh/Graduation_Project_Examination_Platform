from django.db import models
from instructor.models import Instructor
from student.models import Student
from group.models import Group


class Exam(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=250, null=True)
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, null=True)
    student = models.ManyToManyField(Student)
    group = models.ManyToManyField(Group)
    duration_minutes = models.IntegerField(default=60)
    starting_date = models.DateTimeField(null=True)
    finishing_date = models.DateTimeField(blank=True, null=True)
    started = models.BooleanField(default=False)
    finished = models.BooleanField(default=False)
    max_marks = models.IntegerField(default=100)
    graded = models.BooleanField(default=False)


class ExamResults(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    marks = models.DecimalField(max_digits=5, decimal_places=2)


class MCQQuestion(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.CharField(max_length=200)
    points = models.DecimalField(max_digits=4, decimal_places=2)
    answer_options = models.JSONField()
    correct_answers = models.JSONField()


class FillGapsQuestion(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.CharField(max_length=200)
    points = models.DecimalField(max_digits=4, decimal_places=2)
    correct_answers = models.JSONField()


class FreeTextQuestion(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.CharField(max_length=200)
    points = models.DecimalField(max_digits=4, decimal_places=2)


class TrueFalseQuestion(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.CharField(max_length=200)
    points = models.DecimalField(max_digits=4, decimal_places=2)
    correct_answer = models.BooleanField()