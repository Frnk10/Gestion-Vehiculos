from django.db import IntegrityError
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Propietario,Carro,Historial

def vistaHistorial(request):
    historial = Historial.objects.all()
    propetario = Propietario.objects.all()
    auto = Carro.objects.all()
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
