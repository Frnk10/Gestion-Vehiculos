from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Ciudad)
admin.site.register(Propietario)
admin.site.register(Modelo)
admin.site.register(Carro)
admin.site.register(Historial)
