from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views.Navegador_views import vistaNavegador,inicio
from .views.Logeo_views import *
from .views.Modelo_views import *
from .views.Auto_views import *
from .views.Ciudad_views import *
from .views.Propietario_views import *
from .views.Historial_views import *
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

    # aqui van para el crud de modelo
    path('vistaModelo/', vistaModelo, name='vistaModelo'),
    path('agregarModelo/', agregarModelo, name='agregarModelo'),
    path('obtenerUnModelo/<int:id_mod>/', obtenerUnModelo, name='obtenerUnModelo'),
    path('editarUnModelo/<int:id_mod>/', editarUnModelo, name='editarUnModelo'),
    path('eliminarUnModelo/<int:id_mod>/', eliminarUnModelo, name='eliminarUnModelo'),

    # aqui van para el crud de carro
    path('vistaAuto/', vistaAuto, name='vistaAuto'),
    path('ingresarAuto/', ingresarAuto, name='ingresarAuto'),
    path('cargarAutoEditar/<int:id_auto>/', cargarAutoEditar, name='cargarAutoEditar'),
    path('editar_auto/<int:id_auto>/', editar_auto, name='editar_auto'),
    path('eliminar_auto/<int:id_auto>/', eliminar_auto, name='eliminar_auto'),

    path('vistaCiudad/',vistaCiudad,name='vistCiudad'),
    path('ingresarCiudad/',ingresarCiudad,name='ingresarCiudad'),
    path('editarCiudad/<int:id>/',editarCiudad,name='editarCiudad'),
    path('eliminarCiudad/<int:id>/',eliminarCiudad,name='eliminarCiudad'),


    path('vistaPropietario/',vistaPropietario,name='vistaPropietario'),
    path('ingresarPropietario/',ingresarPropietario,name='ingresarPropietario'),
    path('cargarPropietarioEditar/<int:propietario_id>/',cargarPropietarioEditar,name='cargarPropietarioEditar'),
    path('editarPropietario/<int:propietario_id>/',editarPropietario,name='editarPropietario'),
    path('eliminarPropietario/<int:propietario_id>/',eliminarPropietario,name='eliminarPropietario'),
    # aqui van para el crud de historial
    path('vistaHistorial/', vistaHistorial, name='vistaHistorial'),
    path('agregarHistorial/', agregarHistorial, name='agregarHistorial'),
    path('eliminarHistorial/<int:historial_id>/',eliminarHistorial,name='eliminarHistorial'),
    path('eliminarHistorial/<int:historial_id>/',eliminarHistorial,name="eliminarHistorial"),
]