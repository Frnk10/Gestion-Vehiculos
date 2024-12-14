from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Carro, Modelo

# Vista para listar las empresas
def vistaCarro(request):
    carros= Carro.objects.all()  # Elimina la coma para obtener un QuerySet
    modelos=Modelo.objects.all()
    context = {
        'autos': carros,
        'modelos':modelos
    }
    return render(request, '../templates/Carro/vistaCarro.html', context)


def ingresarCarro(request):
    if request.method == 'POST':
        # Obtén los datos enviados
        color_car = request.POST.get('color_car')
        precio_car = request.POST.get('precio_car')
        placa_car = request.POST.get('placa_car')
        fkid_mod = request.POST.get('fkid_mod')

        print(f"Datos recibidos: {color_car}, {precio_car}, {placa_car}, {fkid_mod}")

        try:
            fkid_mod = int(fkid_mod)
            modelo = Modelo.objects.get(id=fkid_mod)
            Carro.objects.create(
                color_car=color_car,
                precio_car=precio_car,
                placa_car=placa_car,
                fkid_mod=modelo
            )
            return JsonResponse({'success': True, 'message': 'Carro agregado exitosamente'})
        except Modelo.DoesNotExist:
            print("Modelo no encontrado")
            return JsonResponse({'success': False, 'message': 'Modelo no encontrado'})
        except Exception as e:
            print(f"Error inesperado: {e}")
            return JsonResponse({'success': False, 'message': str(e)})
    else:
        return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)
    

def eliminarCarro(request, carro_id):
    try:
        # Obtener el carro por el ID
        carro = Carro.objects.get(id=carro_id)
        carro.delete()  # Eliminar el carro de la base de datos
        return JsonResponse({'success': True, 'message': 'Carro eliminado exitosamente'})
    except Carro.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Carro no encontrado'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})
    
def cargarCarroEditar(request, carro_id):
    # Buscar el vehículo por su ID
    carro = get_object_or_404(Carro, pk=carro_id)

    # Recuperar todos los modelos de coche disponibles
    modelos = Modelo.objects.all().values('id', 'nombre_mod')  # Devuelve una lista de diccionarios con los modelos

    # Enviar los datos en formato JSON
    return JsonResponse({
        'status': 'success',
        'color_car': carro.color_car,
        'precio_car': carro.precio_car,
        'placa_car': carro.placa_car,
        'fkid_mod': carro.fkid_mod.id if carro.fkid_mod else None,  # Devuelve el ID si existe
        'modelos': list(modelos)  # Envía la lista de modelos disponibles
    })

def editarCarro(request,carro_id):
    if request.method == 'POST':
        carro_id = request.POST.get('carro_id_editar')
        color_car = request.POST.get('color_car_editar')
        precio_car = request.POST.get('precio_car_editar')
        placa_car = request.POST.get('placa_car_editar')
        fkid_mod = request.POST.get('fkid_mod_editar')

        try:
            carro = Carro.objects.get(id=carro_id)
            carro.color_car = color_car
            carro.precio_car = precio_car
            carro.placa_car = placa_car
            carro.fkid_mod = fkid_mod
            carro.save()

            return JsonResponse({'success': True, 'message': 'Carro actualizado exitosamente'})
        except Carro.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Carro no encontrado'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    else:
        return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)

