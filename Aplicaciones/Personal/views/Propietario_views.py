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
        # Obtener los datos del formulario
        nombre_pro = request.POST.get('nombre_pro')
        apellido_pro = request.POST.get('apellido_pro')
        email_pro = request.POST.get('email_pro')
        telefono_pro = request.POST.get('telefono_pro')
        fkid_ciu = request.POST.get('fkid_ciu')

        # Validar que los campos no estén vacíos
        if not nombre_pro or not apellido_pro or not email_pro or not telefono_pro or not fkid_ciu:
            return JsonResponse({'message': 'Todos los campos son requeridos', 'status': 'error'}, status=400)

        # Buscar al propietario por su ID
        propietario = get_object_or_404(Propietario, pk=propietario_id)

        # Actualizar los campos del propietario
        propietario.nombre_pro = nombre_pro
        propietario.apellido_pro = apellido_pro
        propietario.email_pro = email_pro
        propietario.telefono_pro = telefono_pro
        propietario.fkid_ciu_id = fkid_ciu

        # Guardar los cambios
        propietario.save()

        return JsonResponse({'message': 'Propietario actualizado con éxito', 'status': 'success'})

    return JsonResponse({'message': 'Método no permitido', 'status': 'error'}, status=405)


def eliminar_propietario(request, propietario_id):
    if request.method == 'DELETE':
        try:
            propietario = Propietario.objects.get(id=propietario_id)
            propietario.delete()
            return JsonResponse({'message': 'Propietario eliminado con éxito', 'status': 'success'})
        except Propietario.DoesNotExist:
            return JsonResponse({'message': 'Propietario no encontrado', 'status': 'error'})
    return JsonResponse({'message': 'Método no permitido', 'status': 'error'})