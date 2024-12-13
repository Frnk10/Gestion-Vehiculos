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
                scrollX: true,         // Activa el desplazamiento horizontal
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
        alert('Por favor, complete todos los campos.');
        return; // Detener la ejecución si algún campo está vacío
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
    fetch('../ingresarPropietario/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken // Agregar el CSRF token a los encabezados
        },
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); 
        if (data.status === 'success') {
            vistaPropietario(); 
        }
    })
    .catch(error => console.error('Error al agregar propietario:', error));
}

function cargarDatosEditar(propietarioId) {
    fetch(`/editar-propietario/${propietarioId}/`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('nombre_pro').value = data.nombre_pro;
            document.getElementById('apellido_pro').value = data.apellido_pro;
            document.getElementById('email_pro').value = data.email_pro;
            document.getElementById('telefono_pro').value = data.telefono_pro;
            document.getElementById('fkid_ciu').value = data.fkid_ciu;
        }
    });
}
