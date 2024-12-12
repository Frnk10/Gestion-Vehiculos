from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views.Navegador_views import vistaNavegador,inicio
from .views.Logeo_views import *
from .views.Reportes_views import *
from .views.Propietario_views import vistaPropietario,agregarPropietario,obtenerUnPropietario,editarUnPropietario,eliminarUnPropietario
from .views.Empleado_views import vistaEmpleado,agregarEmpleado,obtenerUnEmpleado,editarUnEmpleado,eliminarUnEmpleado
from .views.Empresa_views import vistaEmpresa,agregarEmpresa,obtenerUnaEmpresa,editarUnaEmpresa,eliminarUnaEmpresa


urlpatterns = [
    path('inicio/',inicio, name='inicio'),
    path('',vistaNavegador, name='vistaNavegador'),
    # REGISTRO USUARIO
    path('registro/',registro, name='registro'),
    # LOGIN
    path('iniciarSesion/',iniciarSesion,name='iniciarSesion'),
    # LOGOUT
    path('cerrarSesion/',cerrarSesion,name='cerrarSesion'),

    # aqui van para el crud de propietarios
    path('vistaPropietario/',vistaPropietario,name='vistaPropietario'),
    path('agregarPropietario/',agregarPropietario,name='agregarPropietario'),
    path('obtenerUnPropietario/<int:propietario_id>/',obtenerUnPropietario,name='obtenerUnPropietario'),
    path('editarUnPropietario/<int:propietario_id>/',editarUnPropietario,name='editarUnPropietario'),
    path('eliminarUnPropietario/<int:propietario_id>/',eliminarUnPropietario,name='eliminarUnPropietario'),

    # REPORTES
    path('vistaReporte/',vistaReporte,name='vistaReporte'),
    path('generarCertificado/',generarCertificado,name='generarCertificado'),
    path('listarEmpresas/',listarEmpresas,name='listarEmpresas'),
    path('listarPropietario/<int:empresa_id>/',listarPropietario,name=' listarPropietario'),
    path('listarEmpleados/<int:empresa_id>/',listarEmpleados,name='listarEmpleados'),

    # aqui van para el crud de empleados
    path('vistaEmpleado/',vistaEmpleado,name='vistaEmpleado'),
    path('agregarEmpleado/',agregarEmpleado,name='agregarEmpleado'),
    path('obtenerUnEmpleado/<int:empleado_id>/',obtenerUnEmpleado,name='obtenerUnEmpleado'),
    path('editarUnEmpleado/<int:empleado_id>/',editarUnEmpleado,name='editarUnEmpleado'),
    path('eliminarUnEmpleado/<int:empleado_id>/',eliminarUnEmpleado,name='eliminarUnEmpleado'),
    
    # aqui van para el crud de empresa
    path('vistaEmpresa/', vistaEmpresa, name='vistaEmpresa'),
    path('agregarEmpresa/', agregarEmpresa, name='agregarEmpresa'),
    path('obtenerUnaEmpresa/<int:empresa_id>/', obtenerUnaEmpresa, name='obtenerUnaEmpresa'),
    path('editarUnaEmpresa/<int:empresa_id>/', editarUnaEmpresa, name='editarUnaEmpresa'),
    path('eliminarUnaEmpresa/<int:empresa_id>/', eliminarUnaEmpresa, name='eliminarUnaEmpresa'),

]