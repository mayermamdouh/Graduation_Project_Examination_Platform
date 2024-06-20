from rest_framework import generics, status
from rest_framework.request import Request
from rest_framework.response import Response

from authentication.permissions import IsInstructor, IsStudent
from group.models import Group
from .serializers import ExamSerializer, TrueFalseQuestionSerializer, FreeTextQuestionSerializer, \
    FillGapsQuestionSerializer, MCQQuestionSerializer, ExamToGroupSerializer
from .models import Exam


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
