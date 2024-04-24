from django import forms
from django.http import HttpRequest, HttpResponse, JsonResponse
import json
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


# Create your views here.
@csrf_exempt
def user_login(request: HttpRequest):
    if request.method != "POST":
        return JsonResponse({'error': 'Method is not POST'}, status=400)

    if request.user.is_authenticated:
        return JsonResponse({'error' : 'Already logged in'}, status=400)

    username = request.POST['username']
    password = request.POST['password']
    
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        user_data: dict[str: str] = {
            'username' : user.get_username(),
            'email' : user.email,
            'first_name' : user.first_name,
        }
        jason_data = json.dumps(user_data)
        return JsonResponse(jason_data, safe=False)
    else:
        messages.error(request, "User not registered", fail_silently=True)
        response_data = {'error': 'User not registered'}
        return JsonResponse(response_data, status=400)


class CustomUserCreationForm(UserCreationForm):
    model = User
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(required=True)
    class Meta(UserCreationForm.Meta):
        fields = UserCreationForm.Meta.fields + ('first_name', 'last_name', 'email')


@csrf_exempt
def user_signup(request: HttpRequest):
    if request.method != "POST":
        return JsonResponse({'error': 'Method is not set to post SOMEHOW'}, status=400)

    form = CustomUserCreationForm(request.POST)
    if form.is_valid():
        user = form.save(commit=False)
        user.first_name = form.cleaned_data["first_name"]
        user.last_name = form.cleaned_data["last_name"]
        user.email = form.cleaned_data["email"]
        user.save()
            
        user_data: dict[str: str] = {
        'username' : user.get_username(),
        'email' : user.email,
        'first_name' : user.first_name,
        }   
        return JsonResponse(json.dumps(user_data), status=200, safe=False)

    return JsonResponse({'Error' : 'Form sent is not valid', 'Reason' : form.errors.get_json_data()}, status=400, safe=False)

def user_signout(request: HttpRequest):
    logout(request)
    return JsonResponse({"Success!" : "User is logged out"}, status=200)