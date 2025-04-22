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
    componente_base = serializers.PrimaryKeyRelatedField(queryset=Componente.objects.all())
    componente_compatible = serializers.PrimaryKeyRelatedField(queryset=Componente.objects.all())

    class Meta:
        model = Compatibilidad
        fields = ['componente_base', 'componente_compatible']

class CompatibilidadReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compatibilidad
        fields = '__all__'
        depth = 1

class multipleCompatibilidadSerializer(serializers.Serializer):
    compatibilidades = CompatibilidadSerializer(many=True)

    def create(self, validated_data):
        compatibilidad_data = validated_data['compatibilidades']

        objetos = []

        for data in compatibilidad_data:
            base = data["componente_base"]
            compatible = data["componente_compatible"]

            objetos.append(Compatibilidad(
                componente_base=base,
                componente_compatible=compatible
            ))
        
        return Compatibilidad.objects.bulk_create(objetos)

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

    def update(self, instance, validated_data):
        detalles_data = validated_data.pop('detalles', None)

        # Actualizar campos principales
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion)
        instance.usuario = validated_data.get('usuario', instance.usuario)
        instance.save()

        if detalles_data is not None:
            # Eliminar detalles anteriores
            instance.detalles.all().delete()

            # Crear nuevos detalles
            nuevos_detalles = [
                DetalleComputadora(computadora=instance, **detalle)
                for detalle in detalles_data
            ]
            DetalleComputadora.objects.bulk_create(nuevos_detalles)

        return instance

class DetalleVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleVenta
        fields = ['computadora', 'componente', 'cantidad', 'subtotal']

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
