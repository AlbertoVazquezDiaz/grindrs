from django.contrib import admin
from django.urls import path, include
from .views import *
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register(r'rol',RolViewSet) #Check
router.register(r'usuario',UsuarioViewSet) #Check
router.register(r'tipoComponente',TipoComponenteViewSet) #Check
router.register(r'componente',ComponenteViewSet) #Check

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginJWTView.as_view(), name='login-jwt'), #Check
    path('compatibilidades/', RegistroCompatibilidadView.as_view(), name='multiplesCompatibilidades'),
    path('computadoras/', ComputadoraCreateView.as_view(), name='crearComputadora'),
    path('ventas/', VentaCreteView.as_view(), name='crearVenta'),
]