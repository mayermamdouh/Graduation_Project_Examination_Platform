from django.urls import path

from . import views

urlpatterns = [
    path("", views.user_login, name="user_login"),
    path("login/", views.user_login),
    path("signup/", views.user_signup, name="user_signup"),
    path("signout/", views.user_signout, name="user_signout"),
]