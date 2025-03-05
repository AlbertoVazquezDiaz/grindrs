from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import UserForm

@csrf_exempt
def api_register(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({"success": True, "message": "Usuario registrado correctamente"})
        return JsonResponse({"success": False, "errors": form.errors})
    
    form = UserForm()
    fields = {field.name: field.label for field in form}
    return JsonResponse({"fields": fields})
