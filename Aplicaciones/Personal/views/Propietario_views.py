from django.db import IntegrityError
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Ciudad, Propietario
from django.views.decorators.csrf import csrf_protect

def vistaPropietario(request):
    propietariosbdd = Propietario.objects.all().order_by('-id')
    ciudades = Ciudad.objects.all().order_by('-id') # Obtener todas las ciudades
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
        'id':propietario.id,
        'nombre_pro': propietario.nombre_pro,
        'apellido_pro': propietario.apellido_pro,
        'email_pro': propietario.email_pro,
        'telefono_pro': propietario.telefono_pro,
        'fkid_ciu': propietario.fkid_ciu.id,  
    })


def editarPropietario(request, propietario_id):
    if request.method == 'POST':
        try:
            propietario = get_object_or_404(Propietario, id=propietario_id)
            propietario.nombre_pro = request.POST.get('nombre_pro_editar')
            propietario.apellido_pro = request.POST.get('apellido_pro_editar')
            propietario.email_pro = request.POST.get('email_pro_editar')
            propietario.telefono_pro = request.POST.get('telefono_pro_editar')
            ciudad_id = request.POST.get('fkid_ciu_editar')
            if ciudad_id:
                propietario.fkid_ciu = get_object_or_404(Ciudad, id=ciudad_id)

            propietario.save()

            return JsonResponse({'success': True, 'message': 'Propietario actualizado correctamente'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)

@csrf_protect
def eliminarPropietario(request, propietario_id):
    if request.method == 'POST':
        try:
            # Verifica si `_method` es DELETE
            import json
            body = json.loads(request.body)
            if body.get('_method') == 'DELETE':
                propietario = Propietario.objects.get(id=propietario_id)
                propietario.delete()
                return JsonResponse({'message': 'Propietario eliminado con éxito', 'status': 'success'})
        except Propietario.DoesNotExist:
            return JsonResponse({'message': 'Propietario no encontrado', 'status': 'error'})
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Cuerpo JSON inválido', 'status': 'error'})
    return JsonResponse({'message': 'Método no permitido', 'status': 'error'})