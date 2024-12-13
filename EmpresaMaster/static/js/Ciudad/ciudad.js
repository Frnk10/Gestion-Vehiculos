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

function vistaCiudad(){
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = '';

    fetch(`../vistaCiudad`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            contenedorTablas.innerHTML = html;
            const tablaCiudad = document.getElementById('tbl-ciudad');

            if (!tablaCiudad) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
            
            $('#tbl-ciudad').DataTable({
                language: {
                    search: "Buscar:",
                },
                paging: false,          // Desactiva la paginación
                ordering: false,        // Desactiva las flechas de ordenamiento
                info: false,           // Desactiva el texto de información de la tabla
                scrollX: true,         // Activa el desplazamiento horizontal
                fixedHeader: true,     // Fija el encabezado y el buscador
            });
        })
        .catch(error => {
            console.error('Error al cargar las ciudades:', error);
        });
}

function agregarCiudad() {
    const nombreCiudad = document.getElementById('nombre_ciu').value.trim(); // Eliminar espacios en blanco

    // Validar que el campo no esté vacío
    if (!nombreCiudad) {
        alert('Por favor, ingrese el nombre de la ciudad.');
        return; // Detener la ejecución de la función
    }

    const formData = new FormData();
    formData.append('nombre_ciu', nombreCiudad); // Ajustar nombre según el campo esperado en Django

    const csrfToken = getCookie('csrftoken'); // Obtener CSRF token

    fetch('/ingresarCiudad/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken // Agregar el CSRF token a los encabezados
        },
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            vistaCiudad(); // Refrescar lista
        }
    })
    .catch(error => console.error('Error al agregar ciudad:', error));
}
function editarCiudad(id) {
    const nuevoNombre = prompt('Ingrese el nuevo nombre de la ciudad:');
    if (!nuevoNombre) return;

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
        alert(data.message);
        if (data.success) {
            vistaCiudad(); // Refrescar lista
        }
    })
    .catch(error => console.error('Error al editar ciudad:', error));
}


function eliminarCiudad(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta ciudad?')) return;

    const csrfToken = getCookie('csrftoken');

    fetch(`/eliminarCiudad/${id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken, // Agregar CSRF token
        },
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            vistaCiudad(); // Refrescar lista
        }
    })
    .catch(error => console.error('Error al eliminar ciudad:', error));
}
