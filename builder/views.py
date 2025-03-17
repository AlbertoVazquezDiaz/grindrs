from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.shortcuts import render


class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    render_classes = [JSONRenderer]

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    #render_classes = [JSONRenderer]

class TipoComponenteViewSet(viewsets.ModelViewSet):
    queryset = TipoComponente.objects.all()
    serializer_class = TipoComponenteSerializer
    render_classes = [JSONRenderer]

class ComponenteViewSet(viewsets.ModelViewSet):
    queryset = Componente.objects.all()
    serializer_class = ComponenteSerializer
    render_classes = [JSONRenderer]

class LoginJWTView(APIView):    
    def post(self, request):
        correo = request.data.get("correo")
        password = request.data.get("password")

        user = authenticate(username=correo, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'usuario_id': user.id,
                'correo': user.correo
            })
        else:
            return Response({"error": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)
