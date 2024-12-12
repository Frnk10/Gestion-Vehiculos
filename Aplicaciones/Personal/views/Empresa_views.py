from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Empresa, Propietario

# Vista para listar las empresas
def vistaEmpresa(request):
    empresas = Empresa.objects.all()  # Elimina la coma para obtener un QuerySet
    propietarios = Propietario.objects.all()
    
    # Combina ambos contextos en un solo diccionario
    context = {
        'empresas': empresas,
        'propietarios': propietarios
    }
    
    return render(request, '../templates/Empresa/vistaEmpresa.html', context)

def obtener_propietarios(request):
    # Obtiene todos los propietarios
    propietarios = Propietario.objects.all().values('id', 'nombre')
    return JsonResponse(list(propietarios), safe=False)

# Vista para agregar una nueva empresa
@csrf_exempt  # Solo si estás usando AJAX y necesitas omitir CSRF (no recomendado en producción)
def agregarEmpresa(request):
    if request.method == 'POST':
        try:
            ruc = request.POST.get('ruc')

            # Verificar si el RUC ya existe en la base de datos
            if Empresa.objects.filter(ruc=ruc).exists():
                return JsonResponse({'error': 'El RUC ya ha sido registrado.'}, status=400)

            empresa = Empresa(
                nombre=request.POST.get('nombre'),
                ruc=ruc,
                actividadeconomica=request.POST.get('actividadeconomica'),
                direccion=request.POST.get('direccion'),
                telefono=request.POST.get('telefono'),
                email=request.POST.get('email'),
                logo=request.FILES.get('logo') if 'logo' in request.FILES else None,
                estado=request.POST.get('estado', 'ACTIVO'),
                propietario_id=request.POST.get('propietario'),
                link=request.POST.get('link')  # Nuevo campo link
            )
            empresa.save()
            return JsonResponse({'message': 'Empresa agregada exitosamente.'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido.'}, status=405)

# Vista para obtener los detalles de una empresa específica
def obtenerUnaEmpresa(request, empresa_id):
    try:
        empresa = get_object_or_404(Empresa, id=empresa_id)
        data = {
            'id': empresa.id,
            'nombre': empresa.nombre,
            'ruc': empresa.ruc,
            'actividadeconomica': empresa.actividadeconomica,
            'direccion': empresa.direccion,
            'telefono': empresa.telefono,
            'email': empresa.email,
            'logo': empresa.logo.url if empresa.logo else None,
            'estado': empresa.estado,
            'propietario': empresa.propietario.id,
            'link': empresa.link  # Añadido el campo link
        }
        return JsonResponse(data, status=200)
    except Empresa.DoesNotExist:
        return JsonResponse({'error': 'Empresa no encontrada.'}, status=404)

# Vista para editar una empresa existente
def editarUnaEmpresa(request, empresa_id):
    if request.method == 'POST':
        empresa = get_object_or_404(Empresa, id=empresa_id)

        try:
            # Actualiza los datos de la empresa
            empresa.nombre = request.POST.get('nombre')
            empresa.ruc = request.POST.get('ruc')
            empresa.actividadeconomica = request.POST.get('actividadeconomica')
            empresa.direccion = request.POST.get('direccion')
            empresa.telefono = request.POST.get('telefono')
            empresa.email = request.POST.get('email')
            empresa.link = request.POST.get('link')  # Actualiza el campo link

            # Si hay un nuevo logo, actualiza el campo logo
            if request.FILES.get('logoNuevo'):
                empresa.logo = request.FILES.get('logoNuevo')

            empresa.estado = request.POST.get('estado', 'ACTIVO')  # Usa el estado por defecto si no se especifica
            propietario_id = request.POST.get('propietario')
            propietario = get_object_or_404(Propietario, id=propietario_id)
            empresa.propietario = propietario
            empresa.save()

            return JsonResponse({'message': 'Empresa actualizada exitosamente.'}, status=200)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

# Vista para eliminar una empresa
def eliminarUnaEmpresa(request, empresa_id):
    if request.method == 'DELETE':
        try:
            empresa = get_object_or_404(Empresa, id=empresa_id)
            empresa.delete()
            return JsonResponse({'message': 'Empresa eliminada exitosamente.'}, status=204)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)
