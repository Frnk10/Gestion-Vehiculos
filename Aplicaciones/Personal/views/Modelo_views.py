from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Modelo

# Vista para listar las empresas
def vistaModelo(request):
    modelos = Modelo.objects.all().order_by('-id')  # Elimina la coma para obtener un QuerySet
    context = {
        'modelos': modelos,
    }
    return render(request, '../templates/Modelo/vistaModelo.html', context)


def agregarModelo(request):
    if request.method == 'POST':
        try:
            nuevo_nombre = request.POST.get('modelo').upper()

            # Verificar si el Modelo ya existe en la base de datos
            if Modelo.objects.filter(nombre_mod=nuevo_nombre).exists():
                return JsonResponse({'message': 'El Modelo ya ha sido registrado.'}, status=400)

            modelo = Modelo(
                nombre_mod=nuevo_nombre,
                fabricacion_mod=request.POST.get('fabricacion')
            )
            modelo.save()
            return JsonResponse({'message': 'Modelo agregado exitosamente.'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido.'}, status=405)

# Vista para obtener los detalles de una empresa específica
def obtenerUnModelo(request, id_mod):
    try:
        modelo = get_object_or_404(Modelo, id=id_mod)
        data = {
            'id': modelo.id,
            'modelo': modelo.nombre_mod,
            'fabricacion': modelo.fabricacion_mod,
        }
        return JsonResponse(data, status=200)
    except Modelo.DoesNotExist:
        return JsonResponse({'error': 'Modelo no encontrado.'}, status=404)

# Vista para editar una empresa existente
def editarUnModelo(request, id_mod):
    if request.method == 'POST':
        modelo = get_object_or_404(Modelo, id=id_mod)

        try:            
            # Verificar si el Modelo ya existe en la base de datos
            nuevo_nombre= request.POST.get('modelo').upper()
            # Verificar si el nuevo modelo ya está registrado, excepto si es el mismo nombre actual
            if Modelo.objects.filter(nombre_mod=nuevo_nombre).exists() and modelo.nombre_mod != nuevo_nombre:
                return JsonResponse({'error': 'El Modelo ya ha sido registrado.'}, status=400)
            modelo.nombre_mod = nuevo_nombre
            modelo.fabricacion_mod = request.POST.get('fabricacion')
            modelo.save()
            return JsonResponse({'message': 'Modelo actualizado exitosamente.'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

# Vista para eliminar una empresa
def eliminarUnModelo(request, id_mod):
    if request.method == 'DELETE':
        try:
            modelo = get_object_or_404(Modelo, id=id_mod)
            modelo.delete()
            return JsonResponse({'message': 'Modelo eliminado exitosamente.'}, status=204)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)
