from django import forms # Importar formulario
from django.core import validators # Importar validaciones

from django.contrib.auth.forms import UserCreationForm # Importar para crear formulario
from django.contrib.auth.models import User # Importar clase User

class RegistroForm(UserCreationForm):    
    username = forms.CharField(
        label='Nombre de usuario',
        required=True,
        min_length=5,
        max_length=30,
        error_messages={
            'required': 'Este campo es obligatorio.',
            'min_length': 'Usuario debe tener más de 5 caracteres',
            'max_length': 'Usuario debe tener menos de 30 caracteres',
        },
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese un nombre de usuario'})
    )
    email = forms.EmailField(
        label='Correo Electrónico',
        min_length=10,
        max_length=254,
        required=True,
        error_messages={
            'required': 'Este campo es obligatorio.',
            'min_length': 'Correo incorrecto',
            'max_length': 'Correo demasiado largo',
        },
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'ejemplo@ejemplo.com'})
    )
    first_name = forms.CharField(
        label='Nombre',
        min_length=3,
        max_length=30,
        required=True,
        error_messages={
            'required': 'Este campo es obligatorio.',
            'min_length': 'Nombre debe tener más 3 caracteres.',
            'max_length': 'Nombre debe tener menos de 30 caracteres.',
        },
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese su nombre'})
    )
    last_name = forms.CharField(
        label='Apellido',
        min_length=3,
        max_length=30,
        required=True,
        error_messages={
            'required': 'Este campo es obligatorio.',
            'min_length': 'Apellido debe tener más 3 caracteres.',
            'max_length': 'Apellido debe tener menos de 30 caracteres.',
        },
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese su apellido'}),
    )
    password1 = forms.CharField(
        label='Contraseña',
        required=True,
        error_messages={
            'required': 'Este campo es obligatorio.',
        },
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Ingrese su contraseña'})
    )
    password2 = forms.CharField(
        label='Confirmar Contraseña',
        required=True,
        error_messages={
            'required': 'Este campo es obligatorio.',
        },
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirme su contraseña'})
    )

    class Meta:
        model = User # Modelo basado en modelo de User
        fields = ['first_name','last_name','email','username','password1','password2'] # Campos del formulario
        