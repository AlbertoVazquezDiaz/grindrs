from django.apps import AppConfig
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class Rol(models.Model):
    nmRol = models.CharField(max_length=45, null=False)

class UsuarioManager(BaseUserManager):
    
    def create_user(self, correo, nombre, apellidos, contraseña=None, **extra_fields):
        if not correo:
            raise ValueError('El correo es obligatorio')
        correo = self.normalize_email(correo) 
        user = self.model(correo=correo, nombre=nombre, apellidos=apellidos, **extra_fields)
        user.set_password(contraseña) 
        user.save(using=self._db)
        return user
    
    def create_superuser(self, correo, nombre, apellidos, contraseña=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(correo, nombre, apellidos, contraseña, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    nombre = models.CharField(max_length=100, null=False)
    apellidos = models.CharField(max_length=100, null=False)
    correo = models.EmailField(max_length=200, unique=True, null=False)
    password = models.CharField(max_length=128, null=False, default="default_password")
    token = models.CharField(max_length=255, null=True, blank=True)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, related_name="usuarios", null=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre', 'apellidos']
    
class TipoComponente(models.Model):
    nombre = models.CharField(max_length=50, null=False)

class Componente(models.Model):
    nombre = models.CharField(max_length=255, null=False)
    marca = models.CharField(max_length=100, null=False)
    modelo = models.CharField(max_length=100, null=False)
    precio = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    imagen1 = models.TextField(null=False)  # URL o base64 de la imagen
    imagen2 = models.TextField(null=True, blank=True)
    imagen3 = models.TextField(null=True, blank=True)
    imagen4 = models.TextField(null=True, blank=True)
    imagen5 = models.TextField(null=True, blank=True)
    stock = models.IntegerField(default=0, null=False)
    tipo_componente = models.ForeignKey(TipoComponente, on_delete=models.CASCADE, related_name="componentes", null=False)

class Compatibilidad(models.Model):
    componente_base = models.ForeignKey(Componente, related_name="base", on_delete=models.CASCADE, null=False)
    componente_compatible = models.ForeignKey(Componente, related_name="compatible", on_delete=models.CASCADE, null=False)

class Computadora(models.Model):
    nombre = models.CharField(max_length=255, null=False)
    descripcion = models.TextField(null=True, blank=True)
    fecha_creacion = models.DateField(auto_now_add=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=False)

class DetalleComputadora(models.Model):
    computadora = models.ForeignKey(Computadora, on_delete=models.CASCADE, null=False)
    componente = models.ForeignKey(Componente, on_delete=models.CASCADE, null=False)
    cantidad = models.IntegerField(default=1, null=False)

class Venta(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=False)
    fecha_venta = models.DateField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, null=False)

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, null=False)
    computadora = models.ForeignKey(Computadora, on_delete=models.CASCADE, null=True, blank=True)
    componente = models.ForeignKey(Componente, on_delete=models.CASCADE, null=True, blank=True)
    cantidad = models.IntegerField(default=1, null=False)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, null=False)
