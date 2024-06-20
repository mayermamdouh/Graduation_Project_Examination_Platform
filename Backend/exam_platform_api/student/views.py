import datetime

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status, generics
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.response import Response

from authentication.permissions import IsStudent
from exam.models import Exam, MCQQuestion, FillGapsQuestion, FreeTextQuestion, TrueFalseQuestion
from exam.serializers import MCQQuestionSerializer, FillGapsQuestionSerializer, FreeTextQuestionSerializer, \
    TrueFalseQuestionSerializer
from group.models import Membership, Group
from group.serializers import StudentGroupSerializerListView, MembershipSerializer
from student.permissions import IsGroupStudent
from exam.models import ExamStatus
from .serializers import StudentExamSerializer, StudentJoinGroupSerializer, StudentExamSubmissionSerializer
from group.models import Membership
from exam.models import MCQQuestionSubmission, FillGapsQuestionSubmission, FreeTextQuestionSubmission, \
    TrueFalseQuestionSubmission


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


class StudentAttemptExamCreateAPIView(generics.CreateAPIView):
    permission_classes = [IsStudent]

    def post(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            exam = Exam.objects.get(id=pk)
        except Exam.DoesNotExist:
            return Response("Error: Exam does not exist.", status=status.HTTP_404_NOT_FOUND)

        user: User = request.user
        student = user.student
        # check if the student is in the exam group.
        if not exam.group.filter(students=student).exists():
            return Response("You are not a part of any exam group.", status=status.HTTP_403_FORBIDDEN)

        request_password = request.POST.get('password')
        if exam.password is not None:
            # If a password is required and not provided or incorrect, return a 403 response
            if request_password is None or (not exam.check_password(request_password)):
                return Response("Wrong password.", status=status.HTTP_403_FORBIDDEN)

        exam.student.add(student)
        now = timezone.now()
        print(f"starting date: {exam.starting_date}")
        print(f"finishing date: {exam.finishing_date}")
        print(f"now: {now}")

        if ExamStatus.objects.filter(exam=exam, student=student).exists():
            exam_status = ExamStatus.objects.filter(exam=exam, student=student).last()
            print(f"Exam id: {exam.id}")
            print(f"exam status attempted at: {exam_status.attempted_at}")
            print(f"exam status finished at: {exam_status.finished_at}")
            if exam_status.finished_at > exam.finishing_date or exam_status.finished_at < now or exam_status.finished:
                exam_status.finished = True
                return Response("Error: Exam attempt duration is over.", status=status.HTTP_400_BAD_REQUEST)

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

            data = [examstudentserializer.data, mcqquestionsserializer.data, fillgapsquestionsserializer.data,
                    freetextquestionsserializer.data, truefalsequestionsserializer.data]

            return Response(data, status=status.HTTP_200_OK)

        return Response("There was an error verifying that you can enter the exam. This might be due to the available "
                        "timings of the exam", status=status.HTTP_403_FORBIDDEN)


class StudentJoinGroupCreateAPIView(generics.CreateAPIView):
    serializer_class = StudentJoinGroupSerializer
    permission_classes = [IsStudent]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['group_code']
            student = request.user.student
            if Group.objects.filter(code=code).exists():
                group = Group.objects.get(code=code)
                group.students.add(student)
                Membership.objects.create(group=group, student=student)
                return Response("Student joined group successfully.", status=status.HTTP_201_CREATED)
            else:
                return Response("Group Does not exist.", status=status.HTTP_400_BAD_REQUEST)

        return Response("Failed to join group.", status=status.HTTP_400_BAD_REQUEST)


class StudentSubmitExamCreateAPIView(generics.CreateAPIView):
    permission_classes = [IsStudent]
    serializer_class = StudentExamSubmissionSerializer

    def post(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        print(f"exam id: {pk}")
        if not Exam.objects.filter(id=pk).exists():
            return Response("Error: Exam does not exist.", status=status.HTTP_400_BAD_REQUEST)

        exam = Exam.objects.get(id=pk)
        student = request.user.student
        if not exam.student.filter(id=student.id).exists():
            return Response("Error: Student does not take this exam", status=status.HTTP_400_BAD_REQUEST)

        exam_status: ExamStatus = get_object_or_404(ExamStatus, exam=exam, student=student)
        exam_status.finished = True
        exam_status.save()
        serializer = StudentExamSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        questions = serializer.data.pop('questions', None)
        for question in questions:
            question_type = question.pop('question_type', None)
            if question_type == "mcq":
                pk = question.pop('id', None)
                answer = question.pop('answer', None)
                question = MCQQuestion.objects.get(id=pk)
                MCQQuestionSubmission.objects.create(question=question, answer=answer)

            elif question_type == "fill_gaps":
                pk = question.pop('id', None)
                answer = question.pop('answer', None)
                question = FillGapsQuestion.objects.get(id=pk)
                FillGapsQuestionSubmission.objects.create(question=question, answer=answer)

            elif question_type == "free_text":
                pk = question.pop('id', None)
                answer = question.pop('answer', None)
                question = FreeTextQuestion.objects.get(id=pk)
                FreeTextQuestionSubmission.objects.create(question=question, answer=answer)

            elif question_type == "true_false":
                pk = question.pop('id', None)
                answer = question.pop('answer', None)
                question = TrueFalseQuestion.objects.get(id=pk)
                TrueFalseQuestionSubmission.objects.create(question=question, answer=answer)

            else:
                print("Invalid question type")

        return Response("OK", status=status.HTTP_200_OK)
