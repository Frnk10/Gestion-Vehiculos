# Generated by Django 5.0.6 on 2024-12-15 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Personal', '0003_alter_carro_placa_car'),
    ]

    operations = [
        migrations.AlterField(
            model_name='carro',
            name='placa_car',
            field=models.CharField(max_length=10, unique=True),
        ),
    ]