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

function vistaPropietario(){
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = '';

    fetch(`../vistaPropietario`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            contenedorTablas.innerHTML = html;
            const tablaCiudad = document.getElementById('tbl-propietario');

            if (!tablaCiudad) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
            
            $('#tbl-propietario').DataTable({
                language: {
                    search: "Buscar:",
                },
                paging: false,          // Desactiva la paginación
                ordering: false,        // Desactiva las flechas de ordenamiento
                info: false,           // Desactiva el texto de información de la tabla
                scrollX: false,         // Activa el desplazamiento horizontal
                fixedHeader: true,     // Fija el encabezado y el buscador
            });
        })
        .catch(error => {
            console.error('Error al cargar las ciudades:', error);
        });
}

function agregarPropietario() {
    // Obtener los valores de los campos del formulario
    const nombrePro = document.getElementById('nombre_pro').value.trim();
    const apellidoPro = document.getElementById('apellido_pro').value.trim();
    const emailPro = document.getElementById('email_pro').value.trim();
    const telefonoPro = document.getElementById('telefono_pro').value.trim();
    const fkidCiu = document.getElementById('fkid_ciu').value;

    // Validar que los campos no estén vacíos
    if (!nombrePro || !apellidoPro || !emailPro || !telefonoPro || !fkidCiu) {
        iziToast.info({
            title: "AVISO",
            message: "Algunos campos son necesarios", // Mensaje de error
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        return; // Detener la ejecución si algún campo está vacío
    }

    // Validar formato de email (con una expresión regular simple)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(emailPro)) {
        iziToast.warning({
            title: "AVISO",
            message: "Por favor, ingrese un correo electrónico válido.", // Mensaje de error
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        return;
    }

    // Validar teléfono (si se requiere un formato específico)
    const telefonoPattern = /^[0-9]{10}$/; // Ejemplo de validación para 10 dígitos
    if (!telefonoPattern.test(telefonoPro)) {
        iziToast.warning({
            title: "AVISO",
            message: "Por favor, ingrese un número de teléfono válido (10 dígitos).", // Mensaje de error
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        return;
    }

    // Crear un objeto FormData para enviar los datos al backend
    const formData = new FormData();
    formData.append('nombre_pro', nombrePro);
    formData.append('apellido_pro', apellidoPro);
    formData.append('email_pro', emailPro);
    formData.append('telefono_pro', telefonoPro);
    formData.append('fkid_ciu', fkidCiu);

    // Obtener el token CSRF para la protección
    const csrfToken = getCookie('csrftoken'); 

    // Enviar la solicitud POST usando Fetch API
    fetch('../ingresarPropietario/', {  // Asegúrate de que esta URL sea la correcta
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken // Agregar el CSRF token a los encabezados
        },
    })
    .then(response => response.json())
    .then(data => {
        iziToast.success({
            title: "CONFIRMACIÓN",
            message: "Propietario agregado correctamente",
            position: "topLeft", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        if (data.status === 'success') {
            vistaPropietario(); // Refrescar la lista de propietarios
        }
    })
    .catch(error => {
        console.error('Error al agregar propietario:', error);
        iziToast.error({
            title: "ERROR",
            message: "Error al agregar propietario",
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
    });
}

function cargarPropietarioEditar(propietarioId) {
    fetch(`../cargarPropietarioEditar/${propietarioId}/`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('nombre_pro_editar').value = data.nombre_pro;
            document.getElementById('apellido_pro_editar').value = data.apellido_pro;
            document.getElementById('email_pro_editar').value = data.email_pro;
            document.getElementById('telefono_pro_editar').value = data.telefono_pro;
            document.getElementById('fkid_ciu_editar').value = data.fkid_ciu;
        }
    })
    .catch(error => console.error('Error al cargar datos para editar:', error));
}


function editarCiudad(id) {

    const nuevoNombrePro = document.getElementById('nombre_pro').value.trim();
    const nuevoApellidoPro = document.getElementById('apellido_pro').value.trim();
    const nuevoEmailPro = document.getElementById('email_pro').value.trim();
    const nuevoTelefonoPro = document.getElementById('telefono_pro').value.trim();
    const nuevoFkidCiu = document.getElementById('fkid_ciu').value;
    const nuevoNombre = prompt('Ingrese el nuevo nombre de la ciudad:');
    if (!nuevoNombre) {
        iziToast.warning({
            title: "AVISO",
            message: "Ingrese el nuevo nombre de la ciudad", // Mensaje de error
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        return;
    }

    const formData = new FormData();
    formData.append('nombre_ciu', nuevoNombre);

    const csrfToken = getCookie('csrftoken');

    fetch(`/editarCiudad/${id}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken, // Agregar CSRF token
        },
    })
    .then(response => response.json())
    .then(data => {
        iziToast.success({
            title: "CONFIRMACIÓN",
            message: "Propietario editado correctamente",
            position: "topLeft", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        if (data.success) {
            vistaCiudad(); // Refrescar lista
        }
    })
    .catch(error => {
        console.error('Error al actualizar propietario:', error);
        iziToast.error({
            title: "ERROR",
            message: "Error al actualizar propietario",
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
    });
}