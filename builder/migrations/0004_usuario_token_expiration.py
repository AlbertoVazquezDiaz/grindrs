# Generated by Django 5.1.4 on 2025-04-07 00:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('builder', '0003_componente_descripcion_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='token_expiration',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
