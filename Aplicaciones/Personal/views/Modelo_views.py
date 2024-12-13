from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Modelo

# Vista para listar las empresas
def vistaModelo(request):
    modelos = Modelo.objects.all()  # Elimina la coma para obtener un QuerySet
    context = {
        'modelos': modelos,
    }
    return render(request, '../templates/Modelo/vistaModelo.html', context)


def agregarModelo(request):
    if request.method == 'POST':
        try:
            modelo = request.POST.get('modelo')

            # Verificar si el Modelo ya existe en la base de datos
            if Modelo.objects.filter(nombre_mod=modelo).exists():
                return JsonResponse({'error': 'El Modelo ya ha sido registrado.'}, status=400)

            modelo = Modelo(
                nombre_mod=request.POST.get('modelo'),
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
            # Actualiza los datos de la empresa
            modelo.nombre_mod = request.POST.get('modelo')
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
