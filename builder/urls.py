from django.contrib import admin
from django.urls import path, include
from .views import *
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register(r'rol',RolViewSet)
router.register(r'usuario',UsuarioViewSet)
router.register(r'tipoComponente',TipoComponenteViewSet)
router.register(r'componente',ComponenteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginJWTView.as_view(), name='login-jwt'),
    path('compatibilidades/', RegistroCompatibilidadView.as_view(), name='multiplesCompatibilidades'),
    path('computadoras/', ComputadoraCreateView.as_view(), name='computadoras'),
    path('computadoras/<int:pk>/', ComputadoraChangeView.as_view(), name='computadorasDetalle'),
    path('ventas/', VentaCreteView.as_view(), name='crearVenta'),
]