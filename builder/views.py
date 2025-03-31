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
    def get_queryset(self):
        rol_id = self.request.query_params.get('rol')
        if rol_id:
            return Usuario.objects.filter(rol=rol_id)
        return Usuario.objects.all()

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
            rol_completo = RolSerializer(user.rol).data
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'correo': user.correo,
                'rol': rol_completo
            })
        else:
            return Response({"error": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)


class RegistroCompatibilidadView(APIView):
    def post(self, request):
        serializer = multipleCompatibilidadSerializer(data = request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Compatibilidades registrada correctamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ComputadoraCreateView(APIView):
    def post(self, request):
        serializer = ComputadoraSerializer(data=request.data)

        if serializer.is_valid():
            computadora = serializer.save()
            return Response({
                "message": "Computadora creada exitosamente",
                "computadoira_id": computadora.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        computadoras = Computadora.objects.all()
        serializer = ComputadoraSerializer(computadoras, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class VentaCreteView(APIView):
    def post(self, request):
        serializer = VentaSerializer(data=request.data)

        if serializer.is_valid():
            venta = serializer.save()
            return Response({
                "message": "Venta creada exitosamente",
                "venta_id": venta.id
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
