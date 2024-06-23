from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView

from exam.models import Exam, ExamStatus
from exam.serializers import SimpleExamSerializer, StudentGroupExamsListSerializer
from .permissions import IsGroupOwner
from student.models import Student
from authentication.permissions import IsInstructor, IsStudent
from .models import Group, Membership
from .serializers import GroupSerializer, GroupSerializerListView, MembershipSerializer, StudentGroupSerializerListView
from django.contrib.auth.models import User
from django.utils import timezone
from student.serializers import StudentSerializer, StudentProfileSerializer
from instructor.serializers import InstructorSerializer


class GroupListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsInstructor]
    serializer_class = GroupSerializerListView

    def get_queryset(self):
        instructor = self.request.user.instructor
        queryset = Group.objects.filter(instructor=instructor)
        return queryset

    def post(self, request, *args, **kwargs):
        self.permission_classes = [IsInstructor]
        self.serializer_class = GroupSerializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AssignStudentCreateAPIView(CreateAPIView):
    permission_classes = [IsInstructor]
    serializer_class = []
    queryset = []

    def post(self, request, *args, **kwargs):
        # Verify that the provided group code exists
        group_code = request.data.get('group_code')
        group = get_object_or_404(Group, code=group_code)

        # Retrieve the student based on the provided email
        email = request.data.get('student_email')
        print("got past the email in the form")
        student = get_object_or_404(Student, user__email=email)
        print("got passed the database lookup")
        if student is None:
            return Response({"Error: ": "no such student exists"}, status.HTTP_404_NOT_FOUND)

        if group.students.filter(user__email=email).exists():
            return Response({"Error: ": "Student is already a member."}, status.HTTP_400_BAD_REQUEST)
        # Add the student to the group
        group.students.add(student)

        # Create a membership record for the student and the group
        membership = Membership.objects.create(student=student, group=group)

        # Serialize the created membership
        serializer = MembershipSerializer(membership)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GroupRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsInstructor, IsGroupOwner]

    def retrieve(self, request, *args, **kwargs):
        group: Group = self.get_object()
        serializer = GroupSerializerListView(group)
        students = group.students.all()
        instructor = group.instructor
        students_serializer = StudentSerializer(students, many=True)
        instructor_serializer = InstructorSerializer(instructor)
        exams = Exam.objects.filter(group=group)
        exam_serializer = SimpleExamSerializer(exams, many=True)
        data = [{"Group data": serializer.data}, {"Students": students_serializer.data}, {"Instructors": instructor_serializer.data}, {"Exams": exam_serializer.data}]
        return Response(data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        # Set the updated_at field to the current datetime
        serializer.save(updated_at=timezone.now())

    # Optionally, if you want to restrict which fields can be updated:
    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True  # Allow partial updates
        return super().get_serializer(*args, **kwargs)


class UnassignStudentFromGroup(generics.DestroyAPIView):
    permission_classes = [IsInstructor, IsGroupOwner]
    queryset = []
    serializer_class = []

    def delete(self, request, *args, **kwargs):
        # Get the group ID from the request data
        group_code = request.data.get('group_code')

        # Get the student ID from the request data
        student_email = request.data.get('student_email')

        group = get_object_or_404(Group, code=group_code)

        # Check if the student is assigned to the group
        try:
            membership = Membership.objects.get(group=group, student__user__email=student_email)
        except Membership.DoesNotExist:
            return Response({"error": "The student is not assigned to this group."}, status=status.HTTP_400_BAD_REQUEST)

        # Unassign the student from the group
        group.students.remove(membership.student)
        membership.delete()

        return Response({"message": "Student unassigned from group successfully."}, status=status.HTTP_200_OK)


class StudentExamsGroupListAPIView(ListAPIView):
    permission_classes = [IsInstructor]
    serializer_class = StudentGroupExamsListSerializer

    def list(self, request, *args, **kwargs):
        instructor = request.user.instructor
        group_id = self.kwargs.get('pk')
        group: Group = Group.objects.get(id=group_id)
        if not instructor == group.instructor:
            return Response("You are not the group instructor", status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        student_email = serializer.validated_data.get('email')
        student_user = User.objects.get(email=student_email)
        student = student_user.student

        if not group.students.filter(id=student.id).exists():
            return Response("Student is not a part of this group", status=status.HTTP_400_BAD_REQUEST)

        all_exams = Exam.objects.filter(student=student, group=group, instructor=instructor)

        exams_list = []
        for exam in all_exams:
            if ExamStatus.objects.filter(exam=exam, student=student).exists():
                exam_status = ExamStatus.objects.get(exam=exam, student=student)
                if exam_status.finished:
                    exams_list.append(exam)

        exam_serializer = SimpleExamSerializer(exams_list, many=True)
        student_profile = StudentProfileSerializer(student, many=False)
        data = {
            'Student': student_profile.data,
            'Exams': exam_serializer.data
        }

        return Response(data, status=status.HTTP_200_OK)
