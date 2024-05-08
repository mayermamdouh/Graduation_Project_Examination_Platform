from django.urls import path

from . import views


urlpatterns = [
    path("signup/", views.user_signup, name="user_signup"),
    path("signin/", views.UserLoginView.as_view(), name="user_signin"),
    path("signout/", views.user_signout, name="user_signout"),
]