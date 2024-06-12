import datetime

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from authentication.permissions import IsStudent
from exam.models import Exam, MCQQuestion, FillGapsQuestion, FreeTextQuestion, TrueFalseQuestion
from exam.serializers import MCQQuestionSerializer, FillGapsQuestionSerializer, FreeTextQuestionSerializer, \
    TrueFalseQuestionSerializer
from group.models import Membership, Group
from group.serializers import StudentGroupSerializerListView, MembershipSerializer
from student.permissions import IsGroupStudent
from exam.models import ExamStatus
from .serializers import StudentExamSerializer


class StudentGroupListAPIView(ListAPIView):
    permission_classes = [IsStudent]
    serializer_class = StudentGroupSerializerListView

    def get_queryset(self):
        student = self.request.user.student
        memberships = Membership.objects.filter(student=student)
        groups = [membership.group for membership in memberships]
        return groups

    def list(self, request, *args, **kwargs):
        memberships = Membership.objects.filter(student=request.user.student)
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StudentGroupExamsAPIView(ListAPIView):
    serializer_class = StudentExamSerializer
    permission_classes = [IsStudent, IsGroupStudent]

    def get_queryset(self):
        group_id = self.kwargs.get('pk')
        try:
            group = Group.objects.get(pk=group_id)
        except Group.DoesNotExist:
            return Exam.objects.none()  # Return an empty queryset if the group does not exist

        return Exam.objects.filter(group=group)

    def list(self, request, *args, **kwargs):
        exams = self.get_queryset()
        serializer = StudentExamSerializer(exams, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class StudentAttemptExamListAPIView(ListAPIView):
    permission_classes = [IsStudent]

    def list(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            exam = Exam.objects.get(id=pk)
        except Exam.DoesNotExist:
            return Response("Error: Exam does not exist.", status=exam_status.HTTP_404_NOT_FOUND)

        user: User = request.user
        student = user.student
        # check if the student is in the exam group.
        if not exam.group.filter(students=student).exists():
            return Response("You are not a part of any exam group.", status=exam_status.HTTP_403_FORBIDDEN)

        print(f"exam id: {exam.id}")
        now = timezone.now()
        print(f"starting date: {exam.starting_date}")
        print(f"finishing date: {exam.finishing_date}")
        print(f"now: {now}")
        if (
                exam.starting_date < now < exam.finishing_date
                and exam.finished == False
        ):
            mcqquestions = MCQQuestion.objects.filter(exam=exam)
            fillgapsquestions = FillGapsQuestion.objects.filter(exam=exam)
            freetextquestions = FreeTextQuestion.objects.filter(exam=exam)
            truefalsequestions = TrueFalseQuestion.objects.filter(exam=exam)

            exam_status = ExamStatus.objects.create(exam=exam, student=student)
            exam_status.attempted = True
            exam_status.attempted_at = datetime.datetime.now()
            exam_status.finished_at = exam_status.attempted_at + datetime.timedelta(minutes=exam.duration_minutes)
            exam_status.save()

            mcqquestionsserializer = MCQQuestionSerializer(mcqquestions, many=True)
            fillgapsquestionsserializer = FillGapsQuestionSerializer(fillgapsquestions, many=True)
            freetextquestionsserializer = FreeTextQuestionSerializer(freetextquestions, many=True)
            truefalsequestionsserializer = TrueFalseQuestionSerializer(truefalsequestions, many=True)
            examstudentserializer = StudentExamSerializer(exam)

            data = [examstudentserializer.data, mcqquestionsserializer.data, fillgapsquestionsserializer.data, freetextquestionsserializer.data, truefalsequestionsserializer.data]

            return Response(data, status=status.HTTP_200_OK)

        return Response("There was an error verifying that you can enter the exam.", status=status.HTTP_400_BAD_REQUEST)


