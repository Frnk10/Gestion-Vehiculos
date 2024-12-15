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

function cargarModelos() {
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = '';

    fetch(`../vistaModelo`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            contenedorTablas.innerHTML = html;
            const tablaModelos = document.getElementById('tbl-modelo');

            if (!tablaModelos) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
            
            $('#tbl-modelo').DataTable({
                language: {
                    search: "Buscar:",
                    paginate: {
                        first: "Primero",
                        previous: "Anterior",
                        next: "Siguiente",
                        last: "Último"
                    },
                },
                paging: true,          // Desactiva la paginación
                ordering: false,        // Desactiva las flechas de ordenamiento
                info: false,           // Desactiva el texto de información de la tabla
                scrollX: false,         // Activa el desplazamiento horizontal
                fixedHeader: true,     // Fija el encabezado y el buscador
            });
        })
        .catch(error => {
            console.error('Error al cargar los modelos:', error);
        });
}

function guardarDatosModelo() {
    // Obtener los valores de los campos del formulario
    const modelo = document.getElementById('modelo').value.trim();
    const fabricacion = document.getElementById('fabricacion').value.trim();
    const formularioElement = document.getElementById('formAgregarModelo');
    // Validar que los campos no estén vacíos
    if (!modelo || !fabricacion) {
        iziToast.info({
            title: "AVISO",
            message: "Por favor, complete todos los campos.",
            position: "topCenter",
            timeout: 3000
        });
        return;
    }
    // Expresión regular para verificar solo números
    const regex = /^\d+$/;

    if (!regex.test(fabricacion)) {
        iziToast.info({
            title: "AVISO",
            message: "Por favor, ingrese solo números.",
            position: "topCenter",
            timeout: 3000
        });
    }

    const formulario = new FormData(formularioElement); // Crear FormData después de verificar los campos
    
    fetch('/agregarModelo/', {  
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
    .then(data => {
        console.log('Modelo agregado:', data);
        $('#modalAgregarModelo').modal('hide');
        // Muestra mensaje de éxito
        iziToast.success({
            title: "CONFIRMACIÓN",
            message: data.message,
            position: "topLeft", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        cargarModelos();
    })
    .catch(error => {
        console.error('Error al agregar el modelo:', error);
        // Muestra mensaje de advertencia
        iziToast.warning({
            title: "AVISO",
            message: "El modelo ya existe o Hay un " + error.message,
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
    });
}

function abrirmodalVerModelo(id_mod) {
    fetch(`/obtenerUnModelo/${id_mod}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el modelo: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('verId').value = data.id;
            document.getElementById('verModelo').value = data.modelo; 
            document.getElementById('verFabricacion').value = data.fabricacion; 
            $('#modalVerModelo').modal('show');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function guardarDatosEditadosModelo() {
    const id_mod = document.getElementById('verId').value; 
    const modelo = document.getElementById('verModelo').value.trim();
    const fabricacion = document.getElementById('verFabricacion').value.trim();
    const formularioElement = document.getElementById('formEditarModelo');

    // Validar que los campos no estén vacíos
    if (!modelo || !fabricacion) {
        iziToast.info({
            title: "AVISO",
            message: "Por favor, complete todos los campos.",
            position: "topCenter",
            timeout: 3000
        });
        return;
    }
    // Expresión regular para verificar solo números
    const regex = /^\d+$/;
    if (!regex.test(fabricacion)) {
        iziToast.info({
            title: "AVISO",
            message: "El año de fabricación debe contener solo números",
            position: "topCenter",
            timeout: 3000
        });
        return; // Detener la ejecución si el campo no es válido
    }

    const formulario = new FormData(formularioElement);

    fetch(`/editarUnModelo/${id_mod}/`, {  
        method: 'POST',
        body: formulario,
        headers: {
            'X-CSRFToken': getCookie('csrftoken') 
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data  => {
                throw new Error(data .error || 'Error desconocido');
            });
        }
        return response.json();
    })
    .then(data =>{
        $('#modalVerModelo').modal('hide'); 
        // Muestra mensaje de advertencia
        iziToast.success({
            title: "CONFIRMACIÓN",
            message: data.message,
            position: "topLeft", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        cargarModelos();
    })
    .catch(error => {
        console.error('Error al actualizar el modelo:', error);
        // Muestra mensaje de advertencia
        iziToast.warning({
            title: "AVISO",
            message: error.message,
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
    });
}

function eliminarUnModelo(id_mod) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este modelo?');
    if (confirmacion) {
        fetch(`/eliminarUnModelo/${id_mod}/`, {
            method: 'DELETE',
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
            iziToast.warning({
                title: "ELIMINACIÓN",
                message: "Modelo Eliminado correctamente",
                position: "topLeft", // Opcional: puedes ajustar la posición
                timeout: 3000 // Opcional: duración de la notificación en milisegundos
            })
            cargarModelos();
        })
        .catch(error => {
            console.error('Error al eliminar el modelo:', error);
            iziToast.error({
                title: "ERROR",
                message: "Error al eliminar el modelo",
                position: "topCenter", // Opcional: puedes ajustar la posición
                timeout: 3000 // Opcional: duración de la notificación en milisegundos
            })  
        });
    }
}
