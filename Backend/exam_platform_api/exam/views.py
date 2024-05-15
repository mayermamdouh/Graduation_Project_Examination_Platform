from rest_framework import generics, status
from rest_framework.response import Response
from authentication.permissions import IsInstructor, IsStudent
from .serializers import ExamSerializer
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