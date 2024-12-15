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

function vistaHistorial(){
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = '';

    fetch(`../vistaHistorial`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            contenedorTablas.innerHTML = html;
            const tablaHistorial = document.getElementById('tbl-historial');

            if (!tablaHistorial) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
            
            $('#tbl-historial').DataTable({
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
            console.error('Error al cargar los historiales:', error);
        }
    );
}

function agregarHistorial() {
    // Obtener los valores de los campos del formulario
    const propietario = document.getElementById('fkid_pro').value.trim(); // trim elimina espacios en blanco al inicio y final de un campo
    const auto = document.getElementById('fkid_car').value.trim();

    // Validar que los campos no estén vacíos
    if (!propietario || !auto) {
        iziToast.info({
            title: "AVISO",
            message: "Por favor, complete todos los campos.",
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        return; // Detener la ejecución si algún campo está vacío
    }

    // Crear un objeto FormData para enviar los datos al backend
    const formData = new FormData();
    formData.append('fkid_pro', propietario);
    formData.append('fkid_car', auto);

    // Obtener el token CSRF para la protección
    const csrfToken = getCookie('csrftoken'); 

    // Enviar la solicitud POST usando Fetch API
    fetch('../agregarHistorial/', {  // Asegúrate de que esta URL sea la correcta
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
            message: data.message,
            position: "topLeft", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        $('#modalAgregarHistorial').modal('hide');
        vistaHistorial(); // Refrescar la lista de historiales
    })
    .catch(
        error => {console.error('Error al agregar historial:', error);
        iziToast.error({
            title: "ERROR",
            message: "Error al agregar historial",
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
    });
}


function eliminarHistorial(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este historial?')) return;

    const csrfToken = getCookie('csrftoken'); // Asegúrate de tener esta función definida para obtener el token CSRF.

    fetch(`../eliminarHistorial/${id}/`, {
        method: 'POST',
        body: JSON.stringify({ _method: 'DELETE' }),
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            iziToast.warning({
                title: "ELIMINACIÓN",
                message: data.message,
                position: "topLeft",
                timeout: 3000,
            });
            vistaHistorial(); // Función para actualizar la lista de historiales
        } else {
            iziToast.error({
                title: "ERROR",
                message: data.message,
                position: "topCenter",
                timeout: 3000,
            });
        }
    })
    .catch(error => {
        console.error('Error al eliminar el historial:', error);
        iziToast.error({
            title: "ERROR",
            message: "Error al eliminar el historial",
            position: "topCenter",
            timeout: 3000,
        });
    });
}