from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseBadRequest
import json
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
@csrf_exempt
def user_login(request: HttpRequest):
    if request.method != "POST":
        return HttpResponse()


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


def user_signup(request: HttpRequest):
    pass

def user_signout(request: HttpRequest):
    pass