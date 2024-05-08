from django.http import HttpRequest
from django.contrib.auth import authenticate, login, logout
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import InstructorUserSerializer
from .serializers import StudentUserSerializer
from rest_framework.status import HTTP_201_CREATED
from .models import CustomUserCreationForm
from student.models import Student
from instructor.models import Instructor
from django.contrib.auth.models import User
from .serializers import LoginFormSerializer


@api_view(['POST'])
def user_signup(request: HttpRequest):
    form = CustomUserCreationForm(request.POST)
    if form.is_valid():
        if User.objects.filter(email=form.cleaned_data.get('email')).exists():
            return Response({"Error: ": "User Already exists with this email"}, status.HTTP_400_BAD_REQUEST) 
        form.save(commit=True)
        user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
        serializer = None
        if user is not None:
            print("attempting to log in..")
            login(request, user)
            print("logged in!")
            print(form.cleaned_data["type"])
            if form.cleaned_data["type"] == "student":
                Student.objects.create(user=user, is_student=True)
                serializer= StudentUserSerializer(user)
            elif form.cleaned_data["type"] == "instructor":
                Instructor.objects.create(user=user, is_instructor=True)
                serializer = InstructorUserSerializer(user)             
        else:
            return Response({"Error:" "User is not found and couldn't authenticate for some reason"})

        return Response(serializer.data, status=HTTP_201_CREATED)
    else:
        return Response(form.errors)


class UserLoginView(generics.GenericAPIView):
    serializer_class = LoginFormSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def user_signout(request: HttpRequest):
    logout(request)
    return Response({"Success!" : "User is logged out"}, status=200)