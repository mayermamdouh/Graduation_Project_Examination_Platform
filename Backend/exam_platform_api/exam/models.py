from django.contrib.auth.hashers import make_password, check_password
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
    password = models.CharField(max_length=1024, null=True, blank=True)
    review = models.BooleanField(default=False)

    def set_password(self, raw_password):
        if raw_password:
            passw = make_password(raw_password)
            self.password = passw
        else:
            self.password = None
        try:
            self.save()
        except Exception as e:
            print(f"Error saving password: {e}")

    def check_password(self, raw_password) -> bool:
        if self.password is None:
            # No password set, automatically return True
            return True
        return check_password(raw_password, self.password)


class ExamStatus(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    attempted = models.BooleanField(default=False)
    finished = models.BooleanField(default=False)
    attempted_at = models.DateTimeField(null=True)
    finished_at = models.DateTimeField(null=True)


class ExamSubmission(models.Model):
    exam_status = models.ForeignKey(ExamStatus, on_delete=models.CASCADE)
    new_tab = models.IntegerField(default=0)


class CheatingCase(models.Model):
    time_spent_cheating = models.FloatField(default=0.0)
    time_no_person_present = models.FloatField(default=0.0)
    image = models.ImageField()
    submission = models.ForeignKey(ExamSubmission, related_name='cheating_cases', on_delete=models.CASCADE)


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


class MCQQuestionSubmission(models.Model):
    question = models.ForeignKey(MCQQuestion, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    answer = models.JSONField()
    points = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)


class FillGapsQuestionSubmission(models.Model):
    question = models.ForeignKey(FillGapsQuestion, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    answer = models.JSONField()
    points = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)


class FreeTextQuestionSubmission(models.Model):
    question = models.ForeignKey(FreeTextQuestion, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    answer = models.JSONField()
    points = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)


class TrueFalseQuestionSubmission(models.Model):
    question = models.ForeignKey(TrueFalseQuestion, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    answer = models.BooleanField()
    points = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
