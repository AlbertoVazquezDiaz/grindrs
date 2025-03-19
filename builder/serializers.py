from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        usuario = Usuario(**validated_data)
        if password:
            usuario.set_password(password)
        usuario.save()
        return usuario


class TipoComponenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoComponente
        fields = '__all__'

class ComponenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Componente
        fields = '__all__'

class CompatibilidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compatibilidad
        fields = '__all__'

class multipleCompatibilidadSerializer(serializers.Serializer):
    compatibilidades = CompatibilidadSerializer(many=True)

    def create(self, validated_data):
        compatibilidad_data = validated_data['compatibilidades']
        return Compatibilidad.objects.bulk_create([Compatibilidad(**data) for data in compatibilidad_data])

class DetalleComputadoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleComputadora
        fields = ['componente', 'cantidad']

class ComputadoraSerializer(serializers.ModelSerializer):
    detalles = DetalleComputadoraSerializer(many=True)
    
    class Meta:
        model = Computadora
        fields = ['id', 'nombre', 'descripcion', 'usuario', 'detalles']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        computadora = Computadora.objects.create(**validated_data)

        detalles = [DetalleComputadora(computadora=computadora, **detalle) for detalle in detalles_data]
        DetalleComputadora.objects.bulk_create(detalles)

        return computadora

class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model: DetalleVenta
        fields: ['computadora', 'componente', 'cantidad', 'subtotal']

class VentaSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True)

    class Meta:
        model = Venta
        fields = ['id', 'usuario', 'total', 'detalles']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        venta = Venta.objects.create(**validated_data)

        ventasDetalle = []

        for detalle in detalles_data:
            computadora = detalle.get('computadora', None)
            componente = detalle.get('componente', None)
            cantidad = detalle['cantidad']

            if componente:
                stock_actual = componente.stock
                if cantidad > stock_actual:
                    raise serializers.ValidationError(
                        f"Stock insuficiente para el componente {componente.id}. Disponible: {stock_actual}"
                    )
                componente.stock -= cantidad
                componente.save()
            
            ventasDetalle.append(DetalleVenta(venta=venta, **detalle))

        DetalleVenta.objects.bulk_create(ventasDetalle)
        return venta
