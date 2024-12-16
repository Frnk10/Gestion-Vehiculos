import json
from django.db import IntegrityError
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Propietario,Carro,Historial

def vistaHistorial(request):
    historial = Historial.objects.all().order_by('-id')
    propetario = Propietario.objects.all().order_by('-id')
    auto = Carro.objects.all().order_by('-id')
    contexto = {
        'historiales': historial,
        'propietarios': propetario,
        'autos': auto
    }
    return render(request, "Historial/vistaHistorial.html",contexto)

def agregarHistorial(request):
    if request.method == 'POST':
        fkid_pro = request.POST.get('fkid_pro')
        fkid_car = request.POST.get('fkid_car')
        # Convertir a entero
        fkid_pro = int(fkid_pro)
        fkid_car = int(fkid_car)
        # Obtener las instancias de la relacion
        propietario = Propietario.objects.get(pk=fkid_pro)
        auto = Carro.objects.get(pk=fkid_car)
        # Crear el historial
        historial = Historial.objects.create(
            fkid_pro=propietario,
            fkid_car=auto,
        )
        return JsonResponse({'message': 'Historial agregado con éxito', 'status': 'success'})
    return JsonResponse({'message': 'Método no permitido', 'status': 'error'})


@csrf_exempt
def eliminarHistorial(request, historial_id):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            if body.get('_method') == 'DELETE':  # Asegurarse de que es una eliminación lógica
                historial = Historial.objects.get(id=historial_id)
                historial.delete()
                return JsonResponse({'success': True, 'message': 'Historial eliminado correctamente'})
            else:
                return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=400)
        except Historial.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Historial no encontrado'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Error en los datos enviados'}, status=400)
    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)