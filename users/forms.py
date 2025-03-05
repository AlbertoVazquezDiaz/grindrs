from django import forms
from .models import User  # Importa el modelo de usuarios

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        widgets = {
            "password": forms.PasswordInput(),
        }
