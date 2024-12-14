from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views.Navegador_views import vistaNavegador,inicio
from .views.Logeo_views import *
from .views.Modelo_views import *

from .views.Ciudad_views import *
from .views.Propietario_views import *
from .views.Carro_views import *


#rom .views.Propietario_views import vistaPropietario,agregarPropietario,obtenerUnPropietario,editarUnPropietario,eliminarUnPropietario



urlpatterns = [
    path('inicio/',inicio, name='inicio'),
    path('',vistaNavegador, name='vistaNavegador'),
    # REGISTRO USUARIO
    path('registro/',registro, name='registro'),
    # LOGIN
    path('iniciarSesion/',iniciarSesion,name='iniciarSesion'),
    # LOGOUT
    path('cerrarSesion/',cerrarSesion,name='cerrarSesion'),

    # aqui van para el crud de empresa
    path('vistaModelo/', vistaModelo, name='vistaModelo'),
    path('agregarModelo/', agregarModelo, name='agregarModelo'),
    path('obtenerUnModelo/<int:id_mod>/', obtenerUnModelo, name='obtenerUnModelo'),
    path('editarUnModelo/<int:id_mod>/', editarUnModelo, name='editarUnModelo'),
    path('eliminarUnModelo/<int:id_mod>/', eliminarUnModelo, name='eliminarUnModelo'),


    path('vistaCiudad/',vistaCiudad,name='vistCiudad'),
    path('ingresarCiudad/',ingresarCiudad,name='ingresarCiudad'),
    path('editarCiudad/<int:id>/',editarCiudad,name='editarCiudad'),
    path('eliminarCiudad/<int:id>/',eliminarCiudad,name='eliminarCiudad'),


    path('vistaPropietario/',vistaPropietario,name='vistaPropietario'),
    path('ingresarPropietario/',ingresarPropietario,name='ingresarPropietario'),
    path('cargarPropietarioEditar/<int:propietario_id>/',cargarPropietarioEditar,name='cargarPropietarioEditar'),


    path('vistaCarro/',vistaCarro,name='vistaCarro'),
    path('ingresarCarro/',ingresarCarro,name='ingresarCarro'),
    path('eliminarCarro/<int:carro_id>/',eliminarCarro,name='eliminarCarro'),
    path('cargarCarroEditar/<int:carro_id>/',cargarCarroEditar,name='cargarCarroEditar'),
    path('editarCarro/<int:carro_id>/',editarCarro,name='editarCarro')
    # aqui van para el crud de propietarios
    # path('vistaPropietario/',vistaPropietario,name='vistaPropietario'),
    # path('agregarPropietario/',agregarPropietario,name='agregarPropietario'),
    # path('obtenerUnPropietario/<int:propietario_id>/',obtenerUnPropietario,name='obtenerUnPropietario'),
    # path('editarUnPropietario/<int:propietario_id>/',editarUnPropietario,name='editarUnPropietario'),
    # path('eliminarUnPropietario/<int:propietario_id>/',eliminarUnPropietario,name='eliminarUnPropietario'),

   


]