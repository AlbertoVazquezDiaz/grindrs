from django.contrib import admin
from django.urls import path, include
from .views import *
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register(r'rol',RolViewSet)
router.register(r'usuario',UsuarioViewSet)
router.register(r'tipoComponente',TipoComponenteViewSet)
router.register(r'componente',ComponenteViewSet)
router.register(r'slider',FotoSliderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginJWTView.as_view(), name='login-jwt'),
    path('send-code/', send_reset_email, name='send-reset-email'),
    path('reset-password/', reset_password, name='reset-password'),
    path('compatibilidades/', RegistroCompatibilidadView.as_view(), name='multiplesCompatibilidades'),
    path('compatibilidades/<int:pk>/', RegistroCompatibilidadView.as_view(), name='compatibilidadDetalle'),
    path('computadoras/', ComputadoraCreateView.as_view(), name='computadoras'),
    path('computadoras/<int:pk>/', ComputadoraChangeView.as_view(), name='computadorasDetalle'),
    path('ventas/', VentaCreteView.as_view(), name='crearVenta'),
    path('ventas/total/', VentaTotalView.as_view(), name='ventas-total'),
]