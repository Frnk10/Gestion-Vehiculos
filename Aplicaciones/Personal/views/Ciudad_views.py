from django.db import IntegrityError
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Ciudad

def vistaCiudad (request):
    ciudadesbdd=Ciudad.objects.all().order_by('-id')
    return render(request,"Ciudad/vistaCiudad.html",{'ciudades':ciudadesbdd})

def ingresarCiudad(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre_ciu')
        try:
            nueva_ciudad = Ciudad(nombre_ciu=nombre)
            nueva_ciudad.save()
            return JsonResponse({'success': True, 'message': 'Ciudad agregada exitosamente'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)


def editarCiudad(request, id):
    if request.method == 'POST':
        nuevo_nombre = request.POST.get('nombre_ciu')
        try:
            ciudad = get_object_or_404(Ciudad, id=id)
            ciudad.nombre_ciu = nuevo_nombre
            ciudad.save()
            return JsonResponse({'success': True, 'message': 'Ciudad editada exitosamente'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)


def eliminarCiudad(request, id):
    if request.method == 'DELETE':
        try:
            ciudad = get_object_or_404(Ciudad, id=id)
            ciudad.delete()
            return JsonResponse({'success': True, 'message': 'Ciudad eliminada correctamente'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)
