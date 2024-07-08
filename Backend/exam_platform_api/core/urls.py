from django.urls import path
from .views import UserProfileRetrieveUpdateAPIView

urlpatterns = [
    path('profile/', UserProfileRetrieveUpdateAPIView.as_view())
]