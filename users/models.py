from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.utils.timezone import now

# Create your models here.

class CustomUser(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=255, unique=True, not_null=True)
    name = models.CharField(max_length=255, not_null=True)
    surname = models.CharField(max_length=255, not_null=True)
    password = models.CharField(max_length=255, not_null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.name