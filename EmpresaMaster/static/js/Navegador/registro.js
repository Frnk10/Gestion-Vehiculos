// Función para obtener el token CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// MOSTRAR Y OCULTAR CONTRASEÑA
document.querySelectorAll(".toggle-password").forEach(icono => {
    icono.addEventListener("click", e => {
        // Obtiene el ID del campo de contraseña a través del atributo data-target
        const passwd = document.getElementById(icono.getAttribute("data-target"));

        if (passwd.type === "password") {
            passwd.type = "text";
            icono.classList.remove("fa-eye");
            icono.classList.add("fa-eye-slash");
        } else {
            passwd.type = "password";
            icono.classList.remove("fa-eye-slash");
            icono.classList.add("fa-eye");
        }
    });
});

// REGISRTAR USUARIO
function registrarUsuario() {
    const formularioElement = document.getElementById('frm_registro');
    const inputs = formularioElement.querySelectorAll('input'); // Seleccionar inputs y textareas
    let allFieldsValid = true; // Variable para verificar si todos los campos son válidos

    // Verifica si todos los campos están llenos
   inputs.forEach(input => {
    if (!input.value) {
        allFieldsValid = false; // Marca como inválido si hay un campo vacío
        input.classList.add('is-invalid'); // Agrega clase para mostrar error
    } else {
        input.classList.remove('is-invalid'); // Remueve la clase de error si el campo es válido
        }
    });

    // Si hay campos vacíos, no envíes el formulario
    if (!allFieldsValid) {
        alert("Todos los campos son obligatorios."); // Mensaje de error
        return; // Detener la ejecución de la función
    }

    const formulario = new FormData(formularioElement); // Crear FormData después de verificar los campos

    fetch('/registro/', {
        method: 'POST',
        body: formulario,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')  
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Error en la red');
            });
        }
        return response.json(); 
    })
    .catch(error => {
        console.error('Error al registrar el usuario:', error);
    });
}