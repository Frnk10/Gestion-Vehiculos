from django.db import IntegrityError
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Propietario

def vistaPropietario(request):
    propietarios = Propietario.objects.all()  # Obtén todos los propietarios
    return render(request, '../templates/Propietario/vistaPropietario.html', {'propietarios': propietarios})



def agregarPropietario(request):
    if request.method == 'POST':
        try:
            propietario = Propietario(
                nombres=request.POST.get('nombres'),
                apellidos=request.POST.get('apellidos'),
                cedula=request.POST.get('cedula'),
                telefono=request.POST.get('telefono'),
                email=request.POST.get('email'),
                direccion=request.POST.get('direccion'),
                estado=request.POST.get('estado'),
                foto=request.FILES.get('foto') if 'foto' in request.FILES else None,
                firma=request.FILES.get('firma') if 'firma' in request.FILES else None
            )
            propietario.save()
            return JsonResponse({'message': 'Propietario agregado exitosamente.'}, status=201)
        except IntegrityError:  
            return JsonResponse({'error': 'El propietario ya ha sido registrado.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido.'}, status=405)

def obtenerUnPropietario(request, propietario_id):
    try:
        propietario = Propietario.objects.get(id=propietario_id)
        data = {
            'id':propietario.id,
            'nombres': propietario.nombres,
            'apellidos': propietario.apellidos,
            'cedula': propietario.cedula,
            'telefono': propietario.telefono,
            'email':propietario.email,
            'direccion': propietario.direccion,
            'foto': propietario.foto.url if propietario.foto else None,
            'firma': propietario.firma.url if propietario.firma else None,
            'estado': propietario.estado,
        }
        return JsonResponse(data, status=200)
    except Propietario.DoesNotExist:
        return JsonResponse({'error': 'Propietario no encontrado.'}, status=404)
    
def editarUnPropietario(request, propietario_id):
    if request.method == 'POST':
        
        propietario = get_object_or_404(Propietario, id=propietario_id)

        try:
            # Actualiza los datos del propietario
            propietario.nombres = request.POST.get('nombres')
            propietario.apellidos = request.POST.get('apellidos')
            propietario.cedula = request.POST.get('cedula')
            propietario.telefono = request.POST.get('telefono')
            propietario.email=request.POST.get('email')
            propietario.direccion = request.POST.get('direccion')

            # Si hay una nueva foto, actualiza el campo foto
            if request.FILES.get('fotoNueva'):
                propietario.foto = request.FILES['fotoNueva']
                
            # Si hay una nueva firma, actualiza el campo firma
            if request.FILES.get('firmaNueva'):
                propietario.firma = request.FILES['firmaNueva']

            propietario.estado = request.POST.get('estado', 'ACTIVO')  # Usa el estado por defecto si no se especifica
            propietario.save()

            return JsonResponse({'message': 'Propietario actualizado exitosamente.'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

def eliminarUnPropietario(request, propietario_id):
    if request.method == 'DELETE': 
        try:
            propietario = get_object_or_404(Propietario, id=propietario_id)
            propietario.delete()
            return JsonResponse({'message': 'Propietario eliminado exitosamente.'}, status=204)  
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400) 

    return JsonResponse({'error': 'Método no permitido.'}, status=405)  