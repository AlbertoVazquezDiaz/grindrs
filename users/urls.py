from django.urls import path
from .views import api_register

urlpatterns = [
    path("api/register/", api_register, name="api_register"),
]
