from django.urls import path

from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path("signup/", views.user_signup, name="user_signup"),
    path("signout/", views.user_signout, name="user_signout"),

    path("signin/", TokenObtainPairView.as_view(), name="user_signin"),
    path("token/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view())
]