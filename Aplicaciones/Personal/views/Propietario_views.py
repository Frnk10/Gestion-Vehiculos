from django.db import IntegrityError
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Ciudad, Propietario

def vistaPropietario(request):
    propietariosbdd = Propietario.objects.all()
    ciudades = Ciudad.objects.all()  # Obtener todas las ciudades
    return render(request, "Propietario/vistaPropietario.html", {'propietarios': propietariosbdd, 'ciudades': ciudades})

def ingresarPropietario(request):
    if request.method == 'POST':
        nombre_pro = request.POST.get('nombre_pro')
        apellido_pro = request.POST.get('apellido_pro')
        email_pro = request.POST.get('email_pro')
        telefono_pro = request.POST.get('telefono_pro')
        fkid_ciu = request.POST.get('fkid_ciu')

        # Crear el propietario
        propietario = Propietario.objects.create(
            nombre_pro=nombre_pro,
            apellido_pro=apellido_pro,
            email_pro=email_pro,
            telefono_pro=telefono_pro,
            fkid_ciu_id=fkid_ciu
        )

        return JsonResponse({'message': 'Propietario agregado con éxito', 'status': 'success'})
    return JsonResponse({'message': 'Método no permitido', 'status': 'error'})


def cargarPropietarioEditar(request, propietario_id):
    # Buscar al propietario por su ID
    propietario = get_object_or_404(Propietario, pk=propietario_id)

    # Devolver los datos en formato JSON
    return JsonResponse({
        'status': 'success',
        'nombre_pro': propietario.nombre_pro,
        'apellido_pro': propietario.apellido_pro,
        'email_pro': propietario.email_pro,
        'telefono_pro': propietario.telefono_pro,
        'fkid_ciu': propietario.fkid_ciu.id,  # Asumiendo que 'fkid_ciu' es una relación con el modelo Ciudad
    })


def editar_propietario(request, propietario_id):
    if request.method == 'POST':
        # Obtén los datos del formulario
        nombre = request.POST.get('nombre_pro_editar')
        apellido = request.POST.get('apellido_pro__editar')
        email = request.POST.get('email_pro_editar')
        telefono = request.POST.get('telefono_pro_editar')
        fkid_ciu = request.POST.get('fkid_ciu')

        # Encuentra el propietario y actualízalo
        propietario = get_object_or_404(Propietario, id=propietario_id)
        propietario.nombre_pro = nombre
        propietario.apellido_pro = apellido
        propietario.email_pro = email
        propietario.telefono_pro = telefono
        propietario.fkid_ciu = fkid_ciu  

        # Guarda los cambios en la base de datos
        propietario.save()

        # Devuelve una respuesta JSON de éxito
        return JsonResponse({'status': 'success', 'message': 'Propietario actualizado exitosamente'})

    return JsonResponse({'status': 'error', 'message': 'No se pudo actualizar el propietario'})


def eliminar_propietario(request, propietario_id):
    if request.method == 'DELETE':
        try:
            propietario = Propietario.objects.get(id=propietario_id)
            propietario.delete()
            return JsonResponse({'message': 'Propietario eliminado con éxito', 'status': 'success'})
        except Propietario.DoesNotExist:
            return JsonResponse({'message': 'Propietario no encontrado', 'status': 'error'})
    return JsonResponse({'message': 'Método no permitido', 'status': 'error'})