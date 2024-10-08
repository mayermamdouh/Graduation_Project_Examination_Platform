import datetime
import json

from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status, generics
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.response import Response

from authentication.permissions import IsStudent
from exam.models import Exam, MCQQuestion, FillGapsQuestion, FreeTextQuestion, TrueFalseQuestion, ExamSubmission
from exam.serializers import MCQQuestionSerializer, FillGapsQuestionSerializer, FreeTextQuestionSerializer, \
    TrueFalseQuestionSerializer, McqQuestionStudentSerializer, FillGapsQuestionStudentSerializer, \
    FreeTextQuestionStudentSerializer, TrueFalseQuestionStudentSerializer, ExamCheatingCaseSerializer, \
    MCQQuestionSubmissionSerializer, FillGapsQuestionSubmissionSerializer, FreeTextQuestionSubmissionSerializer, \
    TrueFalseQuestionSubmissionSerializer
from group.models import Membership, Group
from group.serializers import StudentGroupSerializerListView, MembershipSerializer
from student.permissions import IsGroupStudent
from exam.models import ExamStatus
from .serializers import StudentExamSerializer, StudentJoinGroupSerializer, StudentExamSubmissionSerializer, \
    CheatingCaseSerializer
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
        size = len(exams)
        serializer = StudentExamSerializer(exams, many=True)
        for i in range(size):
            if exams[i].password is not None:
                serializer.data[i]['password'] = True
            else:
                serializer.data[i]['password'] = False
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

            if not ExamStatus.objects.filter(exam=exam, student=student).exists():
                exam_status = ExamStatus.objects.create(exam=exam, student=student)
                exam_status.attempted = True
                exam_status.attempted_at = datetime.datetime.now()
                exam_status.finished_at = exam_status.attempted_at + datetime.timedelta(minutes=exam.duration_minutes)
                exam_status.save()
            else:
                print("no additional exam status is created")

            mcqquestionsserializer = McqQuestionStudentSerializer(mcqquestions, many=True)
            fillgapsquestionsserializer = FillGapsQuestionStudentSerializer(fillgapsquestions, many=True)
            freetextquestionsserializer = FreeTextQuestionStudentSerializer(freetextquestions, many=True)
            truefalsequestionsserializer = TrueFalseQuestionStudentSerializer(truefalsequestions, many=True)
            examstudentserializer = StudentExamSerializer(exam)

            size = len(mcqquestions)
            for question in range(size):
                if len(mcqquestions[question].correct_answers) > 1:
                    mcqquestionsserializer.data[question]['multiple_answers'] = True
                else:
                    mcqquestionsserializer.data[question]['multiple_answers'] = False

            data = {
                "exam_details": examstudentserializer.data,
                "mcq_questions": mcqquestionsserializer.data,
                "fill_gaps_questions": fillgapsquestionsserializer.data,
                "free_text_questions": freetextquestionsserializer.data,
                "true_false_questions": truefalsequestionsserializer.data
            }

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

        serializer = StudentExamSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        new_tab = serializer.data.pop('new_tab', None)
        questions = serializer.data.pop('questions', None)

        exam_status: ExamStatus = ExamStatus.objects.filter(exam=exam, student=student).last()
        if exam_status.finished:
            return Response("You have already submitted this exam", status=status.HTTP_400_BAD_REQUEST)

        if ExamSubmission.objects.filter(exam_status=exam_status, new_tab=new_tab).exists():
            exam_submission = ExamSubmission.objects.get(exam_status=exam_status, new_tab=new_tab)
        else:
            exam_submission = ExamSubmission.objects.create(exam_status=exam_status, new_tab=new_tab)
            exam_submission.refresh_from_db()

        exam_status.finished = True
        exam_status.finished_at = timezone.now()
        exam_status.save()

        for question in questions:
            question_type = question.pop('question_type', None)
            if question_type == "mcq":
                pk = question.pop('id', None)
                answer = question.pop('answer', None)
                question = MCQQuestion.objects.get(id=pk)
                try:
                    # Ensure you are passing the correct instances
                    MCQQuestionSubmission.objects.create(
                        question=question,  # Ensure this is an MCQQuestion instance
                        answer=answer,  # Ensure this is a valid answer (e.g., JSON serializable)
                        student=student  # Ensure this is a Student instance
                    )
                except Exception as e:
                    # Print the error message for debugging
                    print(f"Error creating MCQQuestionSubmission: {e}")

            elif question_type == "fill_gaps":
                pk = question.pop('id', None)
                answer = question.pop('answer', None)
                question = FillGapsQuestion.objects.get(id=pk)
                FillGapsQuestionSubmission.objects.create(question=question, answer=answer, student=student)

            elif question_type == "free_text":
                pk = question.pop('id', None)
                answer = question.pop('answer', None)
                question = FreeTextQuestion.objects.get(id=pk)
                FreeTextQuestionSubmission.objects.create(question=question, answer=answer, student=student)

            elif question_type == "true_false":
                pk = question.pop('id', None)
                answer = question.pop('answer', None)
                question = TrueFalseQuestion.objects.get(id=pk)
                TrueFalseQuestionSubmission.objects.create(question=question, answer=answer, student=student)

            else:
                print("Invalid question type")

        return Response("OK", status=status.HTTP_200_OK)


class StudentCheatingCaseCreateAPIView(generics.CreateAPIView):
    permission_classes = [IsStudent]
    serializer_class = CheatingCaseSerializer

    def post(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        student = request.user.student

        if not Exam.objects.filter(id=pk).exists():
            return Response("Exam does not exist", status=status.HTTP_400_BAD_REQUEST)
        exam = Exam.objects.get(id=pk)

        if not ExamStatus.objects.filter(exam=exam, student=student).exists():
            return Response("Student have not attempted this exam yet", status=status.HTTP_400_BAD_REQUEST)

        exam_status = ExamStatus.objects.get(student=student, exam=exam)

        submission = None
        if ExamSubmission.objects.filter(exam_status=exam_status).exists():
            submission = ExamSubmission.objects.get(exam_status=exam_status)
        else:
            submission = ExamSubmission.objects.create(exam_status=exam_status)
            submission.refresh_from_db()

        data = request.data.copy()
        data['submission'] = submission.id

        # Combine data and files
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class StudentExamReviewListAPIView(ListAPIView):
    permission_classes = [IsStudent]

    def list(self, request, *args, **kwargs):
        student = request.user.student
        exam_id = kwargs.get('pk')

        if not Exam.objects.filter(id=exam_id).exists():
            return Response("Exam does not exist", status=status.HTTP_400_BAD_REQUEST)

        exam = Exam.objects.get(id=exam_id)

        student_exam_group = None
        for group in exam.group.all():
            if group.students.filter(id=student.id).exists():
                student_exam_group = group
                break

        if student_exam_group is None:
            return Response("Student is not a part of any of this exam groups, No submission is available",
                            status=status.HTTP_400_BAD_REQUEST)

        if not ExamStatus.objects.filter(student=student, exam=exam).exists():
            return Response("Student has not taken this exam yet, no submission is available",
                            status=status.HTTP_400_BAD_REQUEST)

        exam_status = ExamStatus.objects.get(student=student, exam=exam)

        if not exam_status.finished:
            return Response("student has not yet finished his attempt, no submission is available",
                            status=status.HTTP_400_BAD_REQUEST)

        exam_mcq_questions = MCQQuestion.objects.filter(exam_id=exam.id)
        exam_fillgaps_questions = FillGapsQuestion.objects.filter(exam_id=exam.id)
        exam_freetext_questions = FreeTextQuestion.objects.filter(exam_id=exam.id)
        exam_truefalse_questions = TrueFalseQuestion.objects.filter(exam_id=exam.id)

        student_mcq_answers = []
        student_fillgaps_answers = []
        student_freetext_answers = []
        student_truefalse_answers = []

        for mcq_question in exam_mcq_questions:
            mcq_answer = MCQQuestionSubmission.objects.get(question_id=mcq_question.id, student=student)
            student_mcq_answers.append(mcq_answer)

        for fillgaps_question in exam_fillgaps_questions:
            fillgaps_answer = FillGapsQuestionSubmission.objects.get(question=fillgaps_question, student=student)
            student_fillgaps_answers.append(fillgaps_answer)

        for freetext_question in exam_freetext_questions:
            freetext_answer = FreeTextQuestionSubmission.objects.get(question=freetext_question, student=student)
            student_freetext_answers.append(freetext_answer)

        for truefalse_question in exam_truefalse_questions:
            truefalse_answer = TrueFalseQuestionSubmission.objects.get(question=truefalse_question, student=student)
            student_truefalse_answers.append(truefalse_answer)

        exam_submission: ExamSubmission = ExamSubmission.objects.get(exam_status=exam_status)

        mcq_question_serializer = MCQQuestionSubmissionSerializer(many=True, instance=student_mcq_answers)

        fillgaps_question_serializer = FillGapsQuestionSubmissionSerializer(many=True,
                                                                            instance=student_fillgaps_answers)

        freetext_question_serializer = FreeTextQuestionSubmissionSerializer(many=True,
                                                                            instance=student_freetext_answers)

        truefalse_question_serializer = TrueFalseQuestionSubmissionSerializer(many=True,
                                                                              instance=student_truefalse_answers)

        data = {
            "MCQ Questions": mcq_question_serializer.data,
            "Fillgaps Questions": fillgaps_question_serializer.data,
            "Freetext Questions": freetext_question_serializer.data,
            "TrueFalse Questions": truefalse_question_serializer.data,
        }

        return Response(data=data, status=status.HTTP_200_OK)