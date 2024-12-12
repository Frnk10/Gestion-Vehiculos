from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Propietario)
admin.site.register(Empleado)
admin.site.register(Empresa)
admin.site.register(Reporte)
