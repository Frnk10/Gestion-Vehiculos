from django.db import models

class Ciudad(models.Model):
    nombre_ciu = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre_ciu
        
class Propietario(models.Model):
    nombre_pro = models.CharField(max_length=100)
    apellido_pro = models.CharField(max_length=100)
    email_pro = models.EmailField()
    telefono_pro = models.CharField(max_length=15)
    fkid_ciu = models.ForeignKey(Ciudad, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.nombre_pro} {self.apellido_pro}'


class Modelo(models.Model):
    nombre_mod = models.CharField(max_length=100)
    fabricacion_mod = models.IntegerField()

    def __str__(self):
        return self.nombre_mod


class Carro(models.Model):
    color_car = models.CharField(max_length=50)
    precio_car = models.DecimalField(max_digits=10, decimal_places=2)
    placa_car = models.CharField(max_length=20, unique=True)
    fkid_mod = models.ForeignKey(Modelo, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.color_car} - {self.placa_com}'


class Historial(models.Model):
    fkid_pro = models.ForeignKey(Propietario, on_delete=models.CASCADE)
    fkid_car = models.ForeignKey(Carro, on_delete=models.CASCADE)

    def __str__(self):
        return f'Historial de {self.fkid_pro} para el carro {self.fkid_car}'
