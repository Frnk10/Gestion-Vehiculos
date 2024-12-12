from django.shortcuts import redirect, render
from django.contrib import messages
from django.contrib.auth import authenticate,login,logout # Importar funciones para autenticar,logueo y cerrar sesion
from django.contrib.auth.forms import UserCreationForm # Modulo para crear formulario
from ..forms import RegistroForm # Importar formulario creado
from django.http import JsonResponse

# Formulario Registro con Django
def registro(request):
    if(request.user.is_authenticated): # Verificar si esta logeado
        return redirect('vistaNavegador')
    else:
        registro = RegistroForm()      
        if(request.method == 'POST'): # Comprobar metodo POST
            registro = RegistroForm(request.POST)
            if(registro.is_valid()): # Validar formulario
                try:
                    print('valido')
                    registro.save()
                    messages.success(request,"Usuario registrado exitosamente.")
                    return render(request,'Navegador/inicio.html')
                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=500)

    return render(request,'Navegador/registro.html',{
        'registro': registro,
    })


# FORMULARIO LOGEO
def iniciarSesion(request):
    if(request.user.is_authenticated): # Verificar usuario esta logeado
        return redirect('vistaNavegador')
    else:
        if(request.method == 'POST'): # Comprobar metodo POST
            try:
                username =  request.POST.get('username') # Recibe dato de usuario o email
                clave = request.POST.get('password') # Recibe dato de contraseña

                usuario = authenticate(request,username = username,password = clave)

                if(usuario is not None): # Validar que existe un usuario
                    username = request.POST.get('username').strip().upper()  # Convertir a mayúsculas
                    login(request,usuario)
                    print("Correcto")
                    return JsonResponse({
                        'estado': True,
                        'mensaje': f"BIENVENIDO {username} !!"
                    })                   
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
            
    return render(request,'Navegador/inicio.html')


# Cerrar sesion
def cerrarSesion(request):
    logout(request)

    return redirect('inicio')