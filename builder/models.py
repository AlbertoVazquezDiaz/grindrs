from django.apps import AppConfig
from django.db import models

class Rol(models.Model):
    nmRol = models.CharField(max_length=45, null=False)

class Usuario(models.Model):
    nombre = models.CharField(max_length=200 null=False)
    correo = models.CharField(max_length=200 null=False)
    contra = models.CharField(max_length=200 null=False)
    toke = models


class Usuario(models.Model):
    nombre = models.CharField(max_length=100, null=False)
    apellidos = models.CharField(max_length=100, null=False)
    correo = models.EmailField(max_length=200, unique=True, null=False)
    contraseña = models.CharField(max_length=200, null=False)
    token = models.CharField(max_length=255, null=True, blank=True)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, null=False)

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
    tipo_componente = models.ForeignKey(TipoComponente, on_delete=models.CASCADE, null=False)

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
