from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.generics import ListAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from authentication.permissions import IsInstructor, IsStudent
from group.models import Group
from student.serializers import StudentProfileSerializer
from .serializers import ExamSerializer, TrueFalseQuestionSerializer, FreeTextQuestionSerializer, \
    FillGapsQuestionSerializer, MCQQuestionSerializer, ExamToGroupSerializer, StudentGroupExamsListSerializer, \
    SimpleExamSerializer, ExamStudentSubmissionSerializer, ExamCheatingCaseSerializer, MCQQuestionSubmissionSerializer, \
    FillGapsQuestionSubmissionSerializer, FreeTextQuestionSubmissionSerializer, TrueFalseQuestionSubmissionSerializer, \
    ExamStudentSubmissionCorrectSerializer, SimpleQuestionSerializer
from .models import Exam, ExamStatus, MCQQuestion, FillGapsQuestion, FreeTextQuestion, TrueFalseQuestion, \
    MCQQuestionSubmission, FillGapsQuestionSubmission, FreeTextQuestionSubmission, TrueFalseQuestionSubmission, \
    ExamSubmission


class ExamListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ExamSerializer
    permission_classes = [IsInstructor]

    def get_queryset(self):
        return Exam.objects.filter(instructor=self.request.user.instructor)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        exam: Exam = serializer.save()

        mcqquestions = exam.mcqquestion_set.all()
        mcqquestions = MCQQuestionSerializer(mcqquestions, many=True)

        fillgapsquestions = exam.fillgapsquestion_set.all()
        fillgapsquestions = FillGapsQuestionSerializer(fillgapsquestions, many=True)

        freetextquestions = exam.freetextquestion_set.all()
        freetextquestions = FreeTextQuestionSerializer(freetextquestions, many=True)

        truefalsequestions = exam.truefalsequestion_set.all()
        truefalsequestions = TrueFalseQuestionSerializer(truefalsequestions, many=True)

        # Customize the response data
        response_data = {
            'message': 'Exam created successfully!',
            'exam_details': serializer.data,
            'mcqquestions': mcqquestions.data,
            'fillgapsquestions': fillgapsquestions.data,
            'freetextquestions': freetextquestions.data,
            'truefalsequestions': truefalsequestions.data
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


class ExamRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = []
    permission_classes = [IsInstructor]

    def retrieve(self, request, *args, **kwargs):
        try:
            exam = self.get_object()
            serializer = ExamSerializer(exam)
            return Response(serializer.data)
        except Exam.DoesNotExist:
            return Response({"message": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request: Request, *args, **kwargs):
        instructor = request.user.instructor
        exam = self.get_object()
        if exam.instructor != instructor:
            return Response("Permission denied", status=status.HTTP_401_UNAUTHORIZED)
        exam_password = request.data.pop("password", None)

        if exam_password is not None:
            exam.password = exam.set_password(raw_password=exam_password)
            exam.save()

        serializer = ExamSerializer(exam, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            exam.refresh_from_db()
            if exam_password is not None:
                exam.set_password(raw_password=exam_password)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instructor = request.user.instructor
        exam = self.get_object()
        if exam.instructor != instructor:
            return Response("Permission denied", status=status.HTTP_401_UNAUTHORIZED)
        exam.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AssignExamToGroupCreateAPIView(generics.CreateAPIView):
    permission_classes = [IsInstructor]

    def post(self, request: Request, *args, **kwargs):
        exam_id = kwargs['pk']
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({"detail": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ExamToGroupSerializer(data=request.data)
        if serializer.is_valid():
            group_code = serializer.validated_data['group_code']
            try:
                group: Group = Group.objects.get(code=group_code)
            except Group.DoesNotExist:
                return Response({"detail": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

            exam.group.add(group)
            return Response({"detail": "Exam assigned to group successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExamStudentSubmissionCreateAPIView(generics.CreateAPIView):
    permission_classes = [IsInstructor]
    serializer_class = ExamStudentSubmissionSerializer

    def create(self, request, *args, **kwargs):
        exam_id = kwargs.get('pk')
        if not Exam.objects.filter(id=exam_id).exists():
            return Response("Exam not found", status=status.HTTP_404_NOT_FOUND)

        serializer = ExamStudentSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        student_email = serializer.validated_data.get('email')
        student_user = User.objects.get(email=student_email)
        student = student_user.student

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
        cheating_cases = exam_submission.cheating_cases.all()
        cheating_case_serializer = ExamCheatingCaseSerializer(cheating_cases, many=True)

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
            "Cheating Cases": cheating_case_serializer.data,
        }

        return Response(data=data, status=status.HTTP_200_OK)


class ExamStudentSubmissionCorrectCreateAPIView(generics.CreateAPIView):
    permission_classes = [IsInstructor]

    def create(self, request, *args, **kwargs):
        exam_id = kwargs.get('pk')
        if not Exam.objects.filter(id=exam_id).exists():
            return Response("Exam not found", status=status.HTTP_404_NOT_FOUND)

        serializer = ExamStudentSubmissionCorrectSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        student_email = serializer.validated_data.get('email')
        student_user = User.objects.get(email=student_email)
        student = student_user.student

        exam = Exam.objects.get(id=exam_id)
        student_exam_group = None

        for group in exam.group.all():
            if group.students.filter(id=student.id).exists():
                student_exam_group = group
                break

        if student_exam_group is None:
            return Response("Student is not a part of any of this exam groups, No submission is available",
                            status=status.HTTP_400_BAD_REQUEST)

        instructor = request.user.instructor
        if not instructor == student_exam_group.instructor:
            return Response("You are not the group instructor", status=status.HTTP_403_FORBIDDEN)

        if not ExamStatus.objects.filter(student=student, exam=exam).exists():
            return Response("Student has not taken this exam yet, no submission is available",
                            status=status.HTTP_400_BAD_REQUEST)

        exam_status = ExamStatus.objects.get(student=student, exam=exam)

        if not exam_status.finished:
            return Response("student has not yet finished his attempt, no submission is available",
                            status=status.HTTP_400_BAD_REQUEST)

        mcq_questions = serializer.validated_data.get('mcq_questions')
        fillgaps_questions = serializer.validated_data.get('fillgaps_questions')
        freetext_questions = serializer.validated_data.get('freetext_questions')
        truefalse_questions = serializer.validated_data.get('truefalse_questions')

        mcq_questions_data = SimpleQuestionSerializer(mcq_questions, many=True).data
        fillgaps_questions_data = SimpleQuestionSerializer(fillgaps_questions, many=True).data
        freetext_questions_data = SimpleQuestionSerializer(freetext_questions, many=True).data
        truefalse_questions_data = SimpleQuestionSerializer(truefalse_questions, many=True).data

        for question in mcq_questions_data:
            question_id = question.get('id', None)
            grade = question.get('grade')
            question_submission = MCQQuestionSubmission.objects.get(question_id=question_id, student=student)
            question_submission.points = grade
            question_submission.save()

        for question in fillgaps_questions_data:
            question_id = question.get('id', None)
            grade = question.get('grade')
            question_submission = FillGapsQuestionSubmission.objects.get(question_id=question_id, student=student)
            question_submission.points = grade
            question_submission.save()

        for question in freetext_questions_data:
            question_id = question.get('id', None)
            grade = question.get('grade')
            question_submission = FreeTextQuestionSubmission.objects.get(question_id=question_id, student=student)
            question_submission.points = grade
            question_submission.save()

        for question in truefalse_questions_data:
            question_id = question.get('id', None)
            grade = question.get('grade')
            question_submission = TrueFalseQuestionSubmission.objects.get(question_id=question_id, student=student)
            question_submission.points = grade
            question_submission.save()

        return Response("Corrected successfully", status=status.HTTP_200_OK)