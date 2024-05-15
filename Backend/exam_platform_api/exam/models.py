from django.db import models
from instructor.models import Instructor
from student.models import Student
from group.models import Group
# Create your models here.


class Exam(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=250, null=True)
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, null=True)
    student = models.ManyToManyField(Student)
    group = models.ManyToManyField(Group)
    duration_minutes = models.IntegerField(default=60)
    starting_date = models.DateTimeField()
    finishing_date = models.DateTimeField(blank=True,null=True)
    started = models.BooleanField(default=False)
    finished = models.BooleanField(default=False)
    max_marks = models.IntegerField(default=100)
    graded = models.BooleanField(default=False)
    randomized = models.BooleanField(default=False)

class ExamResults(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    marks = models.DecimalField(max_digits=5, decimal_places=2) 

class Question(models.Model):
    TEXT = 'text'
    MULTIPLE_CHOICE = 'multiple_choice'
    TRUE_FALSE = 'true_false'

    QUESTION_TYPES = [
        (TEXT, 'Text'),
        (MULTIPLE_CHOICE, 'Multiple Choice'),
        (TRUE_FALSE, 'True/False'),
    ]

    exam = models.ForeignKey(Exam, related_name='questions', on_delete=models.CASCADE)
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    question_answer = models.CharField(max_length=200, null=True, blank=True)
    correct_answer = models.CharField(max_length=200, null=True, blank=True)

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)