from django.db import IntegrityError
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Modelo,Carro

def vistaAuto(request):
    autosbdd = Carro.objects.all()
    modelos = Modelo.objects.all()  # Obtener todas los modelos
    return render(request, "Auto/vistaAuto.html", {'autos': autosbdd, 'modelos': modelos})

def ingresarAuto(request):
    if request.method == 'POST':
        color_car = request.POST.get('color_car').upper()
        precio_car = request.POST.get('precio_car')
        placa_car = request.POST.get('placa_car').upper()
        fkid_mod = request.POST.get('fkid_mod')
        # Verificar si la placa ya existe en la base de datos
        if Carro.objects.filter(placa_car=placa_car).exists():
            return JsonResponse({'error': 'La placa ya ha sido registrada.'}, status=400)
        
        # Convertir fkid_mod a entero
        fkid_mod = int(fkid_mod)
        # Obtener la instancia del modelo relacionado
        modelo = Modelo.objects.get(pk=fkid_mod)
        # Crear el auto
        auto = Carro(
            color_car=color_car,
            precio_car=precio_car,
            placa_car=placa_car,
            fkid_mod=modelo
        )
        auto.save()
        return JsonResponse({'message': 'Automóvil agregado con éxito'}, status=201)
    return JsonResponse({'message': 'Método no permitido', 'status': 'error'})


def cargarAutoEditar(request,id_auto):
    # Buscar al propietario por su ID
    auto = get_object_or_404(Carro, pk=id_auto)

    # Devolver los datos en formato JSON
    return JsonResponse({
        'status': 'success',
        'id': auto.id,
        'color_car_editar': auto.color_car,
        'precio_car_editar': auto.precio_car,
        'placa_car_editar': auto.placa_car,
        'fkid_mod_editar': auto.fkid_mod.id,  # Asumiendo que 'fkid_mod' es una relación con el Modelo
    })


def editar_auto(request, id_auto):
    if request.method == 'POST':
        # Obtén los datos del formulario
        color_car = request.POST.get('color').upper()
        precio_car = request.POST.get('precio')
        placa_car = request.POST.get('placa').upper()
        fkid_mod = request.POST.get('verModelo')
        # Convertir fkid_mod a entero
        fkid_mod = int(fkid_mod)
        # Obtener la instancia del modelo relacionado
        modelo = get_object_or_404(Modelo, pk=fkid_mod)
        # Encuentra el propietario y actualízalo
        auto = get_object_or_404(Carro, id=id_auto)
        # Verificar si el nuevo modelo ya está registrado, excepto si es el mismo nombre actual
        if Carro.objects.filter(placa_car=placa_car).exists() and auto.placa_car != placa_car:
            return JsonResponse({'error': 'La placa ya ha sido registrada.'}, status=400)
        auto.color_car = color_car
        auto.precio_car = precio_car
        auto.placa_car = placa_car
        auto.fkid_mod = modelo  

        # Guarda los cambios en la base de datos
        auto.save()

        # Devuelve una respuesta JSON de éxito
        return JsonResponse({'status': 'success', 'message': 'Automóvil actualizado exitosamente'})

    return JsonResponse({'status': 'error', 'message': 'No se pudo actualizar el automóvil'})


def eliminar_auto(request, id_auto):
    if request.method == 'DELETE':
        try:
            auto = Carro.objects.get(id=id_auto)
            auto.delete()
            return JsonResponse({'message': 'Automóvil eliminado con éxito', 'status': 'success'})
        except auto.DoesNotExist:
            return JsonResponse({'message': 'Automóvil no encontrado', 'status': 'error'})
    return JsonResponse({'message': 'Método no permitido', 'status': 'error'})