from django.db import IntegrityError
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Empleado,Empresa

def vistaEmpleado(request):
    empresas = Empresa.objects.all()
    empleados = Empleado.objects.all()  # Obtén todos los empleados
    # Combina ambos contextos en un solo diccionario
    context = {
        'empresas': empresas,
        'empleados': empleados,
    }
    return render(request, '../templates/Empleado/vistaEmpleado.html', context)

def obtener_Empresa(request):
    # Obtiene todos los propietarios
    empresas = Empresa.objects.all().values('id', 'nombre')
    return JsonResponse(list(empresas), safe=False)

def agregarEmpleado(request):
    if request.method == 'POST':
        try:
            empresaNueva = get_object_or_404(Empresa, id=request.POST.get('empresa'))
        
            empleado = Empleado(
                nombres=request.POST.get('nombres'),
                apellidos=request.POST.get('apellidos'),
                cedula=request.POST.get('cedula'),
                telefono=request.POST.get('telefono'),
                direccion=request.POST.get('direccion'),
                tiempo_conocimiento=request.POST.get('tiempo_conocimiento'),
                empresa=empresaNueva,
                
            )
            empleado.save()
            return JsonResponse({'message': 'Empleado agregado exitosamente.'}, status=201)
        except IntegrityError:  
            return JsonResponse({'error': 'El empleado ya ha sido registrado.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido.'}, status=405)

def obtenerUnEmpleado(request, empleado_id):
    try:
        empleado = Empleado.objects.get(id=empleado_id)
        data = {
            'id':empleado.id,
            'nombres': empleado.nombres,
            'apellidos': empleado.apellidos,
            'cedula': empleado.cedula,
            'telefono': empleado.telefono,
            'direccion': empleado.direccion,
            'tiempo_conocimiento': empleado.tiempo_conocimiento,
            'empresa': empleado.empresa.id,
        }
        return JsonResponse(data, status=200)
    except Empleado.DoesNotExist:
        return JsonResponse({'error': 'Empleado no encontrado.'}, status=404)
    
def editarUnEmpleado(request, empleado_id):
    if request.method == 'POST':
        
        empleado = get_object_or_404(Empleado, id=empleado_id)

        try:
            # Actualiza los datos del empleado
            empleado.nombres = request.POST.get('nombres')
            empleado.apellidos = request.POST.get('apellidos')
            empleado.cedula = request.POST.get('cedula')
            empleado.telefono = request.POST.get('telefono')
            empleado.direccion = request.POST.get('direccion')
            empleado.tiempo_conocimiento = request.POST.get('tiempo_conocimiento')  # Usa el estado por defecto si no se especifica
            empresa_id = request.POST.get('empresa')
            empresa = get_object_or_404(Empresa, id=empresa_id)
            empleado.empresa = empresa
           
            empleado.save()

            return JsonResponse({'message': 'Empleado actualizado exitosamente.'}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

def eliminarUnEmpleado(request, empleado_id):
    if request.method == 'DELETE': 
        try:
            empleado = get_object_or_404(Empleado, id=empleado_id)
            empleado.delete()
            return JsonResponse({'message': 'Empleado eliminado exitosamente.'}, status=204)  
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400) 

    return JsonResponse({'error': 'Método no permitido.'}, status=405)  