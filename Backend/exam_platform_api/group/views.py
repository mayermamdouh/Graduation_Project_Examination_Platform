from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView
from .permissions import IsGroupOwner
from student.models import Student
from authentication.permissions import IsInstructor, IsStudent
from .models import Group, Membership
from .serializers import GroupSerializer, GroupSerializerListView, MembershipSerializer, StudentGroupSerializerListView
from django.contrib.auth.models import User
from django.utils import timezone

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


class StudentGroupListAPIView(ListAPIView):
    permission_classes = [IsStudent]
    serializer_class = StudentGroupSerializerListView
    def get_queryset(self):
        student = self.request.user.student
        memberships = Membership.objects.filter(student=student)
        groups = [membership.group for membership in memberships]
        return groups

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
            return Response({"Error: " : "no such student exists"}, status.HTTP_404_NOT_FOUND)

        if group.students.filter(user__email=email).exists():
            return Response({"Error: " : "Student is already a member."}, status.HTTP_400_BAD_REQUEST)
        # Add the student to the group
        group.students.add(student)

        # Create a membership record for the student and the group
        membership = Membership.objects.create(student=student, group=group)

        # Serialize the created membership
        serializer = MembershipSerializer(membership)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class GroupDestroyAPIView(generics.DestroyAPIView):
    permission_classes = [IsInstructor, IsGroupOwner]
    queryset = Group.objects.all()
    serializer_class = []

    def delete(self, request, *args, **kwargs):
        group_code = self.request.POST.get('group_code')
        
        try:
            group = Group.objects.get(code=group_code)
            group.delete()
            return Response(status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({"error": "Group with code {} does not exist.".format(group_code)}, status=status.HTTP_404_NOT_FOUND)

class GroupRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

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
            membership = Membership.objects.get(group=group,  student__user__email=student_email)
        except Membership.DoesNotExist:
            return Response({"error": "The student is not assigned to this group."}, status=status.HTTP_400_BAD_REQUEST)

        # Unassign the student from the group
        group.students.remove(membership.student)
        membership.delete()

        return Response({"message": "Student unassigned from group successfully."}, status=status.HTTP_200_OK)