from django.db import models

# Create your models here.
class Propietario(models.Model):
    ESTADO_CHOICES = [
        ('ACTIVO', 'ACTIVO'),
        ('INACTIVO', 'INACTIVO'),
    ]
    
    nombres = models.CharField(max_length=200)
    apellidos = models.CharField(max_length=200)
    cedula = models.CharField(max_length=12, unique=True) 
    telefono = models.CharField(max_length=15)
    email = models.EmailField(blank=True,null=True) 
    direccion = models.TextField()
    foto = models.ImageField(upload_to='fotos_propietarios/', blank=True, null=True)
    firma= models.ImageField(upload_to='firma_propietarios/',blank=True,null=True)
    estado = models.CharField(max_length=8, choices=ESTADO_CHOICES, default='ACTIVO')
    def save(self, *args, **kwargs):
        # Convertir nombres y apellidos a mayúsculas antes de guardar
        self.nombres = self.nombres.upper()
        self.apellidos = self.apellidos.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombres} {self.apellidos} ({self.estado})"
    
# MODELO EMPRESA
class Empresa(models.Model):
    ESTADO_CHOICES = [
        ('ACTIVO', 'ACTIVO'),
        ('INACTIVO', 'INACTIVO'),
    ]
    nombre = models.CharField(max_length=300)
    ruc = models.CharField(max_length=13, unique=True) 
    actividadeconomica = models.CharField(max_length=200)
    direccion = models.TextField()
    telefono = models.CharField(max_length=15)  
    email = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='logo_empresa/', blank=True, null=True)
    estado = models.CharField(max_length=8, choices=ESTADO_CHOICES, default='ACTIVO')
    propietario = models.ForeignKey(Propietario, on_delete=models.CASCADE, related_name="empresa",blank=True,null=True)
    link =models.CharField(max_length=300,default='1')

    def save(self, *args, **kwargs):
        self.nombre = self.nombre.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre}"
    
class Empleado(models.Model):    
    nombres = models.CharField(max_length=200)
    apellidos = models.CharField(max_length=200)
    cedula = models.CharField(max_length=12, unique=True) 
    telefono = models.CharField(max_length=15)  
    direccion = models.TextField()
    tiempo_conocimiento = models.IntegerField()
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE,blank=True,null=True)

    def save(self, *args, **kwargs):
        # Convertir nombres y apellidos a mayúsculas antes de guardar
        self.nombres = self.nombres.upper()
        self.apellidos = self.apellidos.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombres} {self.apellidos} "

# MODELO REPORTE
class Reporte(models.Model):
    reporte = models.FileField(upload_to='Reportes/',null=True,blank=True)
    descripcion = models.TextField(null=True)
    fecha_emision = models.DateField(auto_now_add=True,verbose_name='Fecha creación:')
    fecha_actualizacion = models.DateTimeField(auto_now=True,verbose_name='Última actualización:')
    # Clave foranea Empleado
    fk_empleado = models.ForeignKey(Empleado,verbose_name='Empleado:',on_delete=models.CASCADE)
    
    def __str__(self):
        fila = "Reporte: {0} - {1}"
        return fila.format(self.fk_empleado.nombres,self.fecha_emision)    