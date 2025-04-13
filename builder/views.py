from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import secrets
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password

from django.shortcuts import render

from rest_framework.generics import get_object_or_404

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

@csrf_exempt
def send_reset_email(request):
    if request.method == "POST":
        import json
        body_unicode = request.body.decode('utf-8')
        body_data = json.loads(body_unicode)
        email = body_data.get("email")

        user = Usuario.objects.filter(correo=email).first()

        if user:
            token = secrets.token_urlsafe(20)
            user.token = token
            user.token_expiration = timezone.now() + timedelta(hours=1)
            user.save()

            reset_link = f"http://localhost:5173/reset-password/{token}"

            send_mail(
                subject="🔐 Recuperación de contraseña",
                message=f"Hola, usa este enlace para restablecer tu contraseña: {reset_link}",
                from_email="no-reply@grindrs.com",
                recipient_list=[email],
                fail_silently=False,
                html_message=f"""
                    <html>
                    <body>
                        <h2>Recuperación de contraseña</h2>
                        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                        <a href="{reset_link}">{reset_link}</a>
                    </body>
                    </html>
                """
            )
            return JsonResponse({"message": "Correo enviado correctamente."}, status=200)
        return JsonResponse({"error": "Correo no registrado."}, status=404)


@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        import json
        body_unicode = request.body.decode('utf-8')
        body_data = json.loads(body_unicode)
        
        token = body_data.get("token")
        password = body_data.get("password")

        user = Usuario.objects.filter(token=token, token_expiration__gte=timezone.now()).first()

        if user:
            user.password = make_password(password)
            user.token = None
            user.token_expiration = None
            user.save()

            send_mail(
                subject="🔐 Contraseña restablecida",
                message=f"Tu contraseña fue cambiada con éxito.",
                from_email="no-reply@grindrs.com",
                recipient_list=[user.correo],
                fail_silently=False,
                html_message=f"""
                    <html>
                    <body>
                        <h2>¡Tu contraseña fue cambiada!</h2>
                        <p>Haz clic <a href="http://localhost:5173/login/">aquí</a> para iniciar sesión.</p>
                    </body>
                    </html>
                """
            )
            return JsonResponse({"message": "Contraseña cambiada correctamente."})
        return JsonResponse({"error": "Token inválido o expirado."}, status=400)

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
    def get(self, request):
        compatibilidades = Compatibilidad.objects.all()
        serializer = CompatibilidadReadSerializer(compatibilidades, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

        
    def post(self, request):
        serializer = multipleCompatibilidadSerializer(data = request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Compatibilidades registrada correctamente"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            compatibilidad = Compatibilidad.objects.get(id=pk)
            compatibilidad.delete()
            return Response({"message": "Compatibilidad eliminada correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except Compatibilidad.DoesNotExist:
            return Response({"error": "Compatibilidad no encontrada"}, status=status.HTTP_404_NOT_FOUND)

class ComputadoraCreateView(APIView):
    def get(self, request):
        computadora = Computadora.objects.all()
        serializer = ComputadoraSerializer(computadora, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ComputadoraSerializer(data=request.data)

        if serializer.is_valid():
            computadora = serializer.save()
            return Response({
                "message": "Computadora creada exitosamente",
                "computadoira_id": computadora.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ComputadoraChangeView(APIView):
    
    def get(self, request, pk):
        computadora = get_object_or_404(Computadora, pk=pk)
        serializer = ComputadoraSerializer(computadora)
        return Response(serializer.data)

    def put(self, request, pk):
        computadora = get_object_or_404(Computadora, pk=pk)
        serializer = ComputadoraSerializer(computadora, data=request.data)
        
        if serializer.is_valid():
            computadora = serializer.save()
            return Response({
                "message": "Computadora actualizada exitosamente",
                "computadora_id": computadora.id
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        computadora = get_object_or_404(Computadora, pk=pk)
        computadora.delete()
        return Response({"message": "Computadora eliminada exitosamente"}, status=status.HTTP_204_NO_CONTENT)

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
