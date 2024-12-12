from django.urls import reverse
from django.utils import timezone # Obtener zonda horaria
from django.template.loader import get_template # Obtener una plantilla
from weasyprint import HTML
from django.core.files.base import ContentFile
from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse

from ..models import *

def vistaReporte(request):
    reportes = Reporte.objects.all().select_related('fk_empleado').order_by('-id')

    # DATOS PARA EL CERTIFICADO
    empresas = Empresa.objects.filter(estado='ACTIVO')
    propietarios = Propietario.objects.filter(estado='ACTIVO')
    empleados = Empleado.objects.all()
    
    datos_reporte = {
        'reportes':reportes,
        'empresas':empresas,
        'propietarios':propietarios,
        'empleados':empleados
    }
    return render(request,'Reporte/vistaReporte.html',datos_reporte)


    
def listarEmpresas(request):
    # Filtra los periodos académicos que tienen el estado "ACTIVO"
    empresas = list(Empresa.objects.filter(estado='ACTIVO').values())
    if(len(empresas)>0 ):
        data={
            'message': "okey",
            'empresas':empresas,
        }
    else:
        data={
            'message':"no hay datos"
        }  
    return JsonResponse(data)

def listarEmpleados(request, empresa_id):
    # Filtra los empleados de la empresa seleccionada
    empleados = Empleado.objects.filter(empresa=empresa_id)  # Asegúrate de que la relación esté bien definida
    if empleados.exists():
        data = {
            'message': "okey",
            'empleados': [
                {
                    'id': empleado.id,
                    'nombre': f"{empleado.nombres} {empleado.apellidos}"  # Concatenando nombres y apellidos
                } for empleado in empleados
            ],
        }
    else:
        data = {
            'message': "no hay datos"
        }
    return JsonResponse(data)

def listarPropietario(request, empresa_id):
    # Filtra los propietarios de la empresa seleccionada
    propietarios = Propietario.objects.filter(empresa__id=empresa_id)  # Asegúrate de que la relación esté correcta
    if propietarios.exists():
        data = {
            'message': "okey",
            'propietario': [
                {
                    'id': propietario.id,
                    'nombre': f"{propietario.nombres} {propietario.apellidos}"  # Concatenando nombres y apellidos
                } for propietario in propietarios
            ],
        }
    else:
        data = {
            'message': "no hay datos"
        }
    return JsonResponse(data)



# CREAR CERTIFICADO
def generarCertificado(request):
    if(request.method == 'POST'):
        try:
            empresa_id = request.POST.get('empresa')
            propietario_id = request.POST.get('propietario')
            empleado_id = request.POST.get('empleado')
            
            # Obtener instancias de Empresa,Propietario y Empleado de forma segura
            empresas = get_object_or_404(Empresa, id=empresa_id)
            propietarios = get_object_or_404(Propietario, id=propietario_id)
            empleados = get_object_or_404(Empleado, id=empleado_id)
            # LOGO EMPRESA
            logo_empresas = request.build_absolute_uri(empresas.logo.url) # Obtiene el logo y lo envia(en WeasyPrint se hace así)
            # FIRMA PROPIETARIO
            firmas = request.build_absolute_uri(propietarios.firma.url) # Obtiene el logo y lo envia(en WeasyPrint se hace así)
            datos = {
                'fecha': timezone.now().strftime("%d de %B del %Y"),
                'propietarios':propietarios,
                'empleados':empleados,
                'empresas':empresas,
                'logo_empresas': logo_empresas,  # Pasar request al contexto
                'firmas': firmas,  # Pasar request al contexto
            }
            
            #     return render(request, 'Reporte/certificado_pdf.html',datos)

            # return render(request, 'Reporte/certificado_pdf.html')

            plantilla = get_template('Reporte/certificado_pdf.html')
            html_string = plantilla.render(datos)

            # Generar el PDF con WeasyPrint
            pdf = HTML(string=html_string).write_pdf(encoding='utf-8')

            # Guardar el PDF en la tabla Reporte
            nombre_pdf = f"Certificado_Honorabilidad {empleados.nombres} {empleados.apellidos}.pdf"
            reporte = Reporte(
                fk_empleado=empleados,
                descripcion = "Certificado",
                reporte=ContentFile(pdf, nombre_pdf)  # Guarda el PDF en el campo reporte
            )
            reporte.save()
            return JsonResponse({
                'estado': True,
                'mensaje': 'Certificado generado exitosamente',
            })

            # Redirigir a la misma vista (o a otra vista)
            # return redirect(reverse('vistaReporte'))

            # Configurar la respuesta HTTP para un PDF
            # response = HttpResponse(content_type='application/pdf')
            # response['Content-Disposition'] = f'attachment; filename="{nombre_pdf}"'

            # # Escribir el contenido PDF en la respuesta
            # response.write(pdf)
            # return response
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido.'}, status=405)

