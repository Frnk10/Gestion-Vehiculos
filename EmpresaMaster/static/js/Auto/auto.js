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

function vistaAuto(){
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = '';

    fetch(`../vistaAuto`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            contenedorTablas.innerHTML = html;
            const tablaAuto = document.getElementById('tbl-auto');

            if (!tablaAuto) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
            
            $('#tbl-auto').DataTable({
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
            console.error('Error al cargar los automóviles:', error);
        }
    );
}

function agregarAuto() {
    // Obtener los valores de los campos del formulario
    const color = document.getElementById('color').value.trim();
    const precio = document.getElementById('precio').value.trim();
    const placa = document.getElementById('placa').value.trim();
    const fkid_mod = document.getElementById('fkid_mod').value;

    // Validar que los campos no estén vacíos
    if (!color || !precio || !placa || !fkid_mod) {
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
    formData.append('color_car', color);
    formData.append('precio_car', precio);
    formData.append('placa_car', placa);
    formData.append('fkid_mod', fkid_mod);

    // Obtener el token CSRF para la protección
    const csrfToken = getCookie('csrftoken'); 

    // Enviar la solicitud POST usando Fetch API
    fetch('../ingresarAuto/', {  // Asegúrate de que esta URL sea la correcta
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
            message: "Automóvil agregado correctamente",
            position: "topLeft", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        $('#modalAgregarAuto').modal('hide');
        vistaAuto(); // Refrescar la lista de propietarios
    })
    .catch(
        error => console.error('Error al agregar automóvil:', error)
    );
    iziToast.error({
        title: "ERROR",
        message: "Error al agregar automóvil",
        position: "topCenter", // Opcional: puedes ajustar la posición
        timeout: 3000 // Opcional: duración de la notificación en milisegundos
    })
}

function cargarAutoEditar(id_auto) {
    fetch(`../cargarAutoEditar/${id_auto}/`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('verId').value = data.id;
            document.getElementById('verModelo').value = data.fkid_mod_editar;
            document.getElementById('verColor').value = data.color_car_editar;
            document.getElementById('verPrecio').value = data.precio_car_editar;
            document.getElementById('verPlaca').value = data.placa_car_editar;
            $('#modalVerAuto').modal('show');
        }
    })
    .catch(error => console.error('Error al cargar datos para editar:', error));
}

function editarAuto() {
    const id_auto = document.getElementById('verId').value; 
    const formularioElement = document.getElementById('formEditarAuto');
    const inputs = formularioElement.querySelectorAll('input, textarea'); // Seleccionar inputs y textareas
    let allFieldsValid = true;
    inputs.forEach(input => {
        if (!input.value && input.type !== "select" && input.type !== "file") {
            allFieldsValid = false; // Marca como inválido si hay un campo vacío
            input.classList.add('is-invalid'); // Agrega clase para mostrar error
        } else {
            input.classList.remove('is-invalid'); // Remueve la clase de error si el campo es válido
        }
    });

    // Si hay campos vacíos, no envíes el formulario
    if (!allFieldsValid) {
        iziToast.info({
            title: "AVISO",
            message: "Algunos campos son necesarios", // Mensaje de error
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        return; // Detener la ejecución de la función
    }

    const formulario = new FormData(formularioElement);

    fetch(`/editar_auto/${id_auto}/`, {  
        method: 'POST',
        body: formulario,
        headers: {
            'X-CSRFToken': getCookie('csrftoken') 
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Error desconocido');
            });
        }
        iziToast.success({
            title: "CONFIRMACIÓN",
            message: "Automóvil editado correctamente",
            position: "topLeft", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
        $('#modalVerAuto').modal('hide');
        vistaAuto(); 
    })
    .catch(error => {
        console.error('Error al actualizar el automóvil:', error);
        iziToast.error({
            title: "ERROR",
            message: "Error al actualizar el automóvil",
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        })
    });
}

function eliminarAuto(id_auto) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este auto?');
    if (confirmacion) {
        fetch(`/eliminar_auto/${id_auto}/`, {
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
                message: "Auto eliminado correctamente",
                position: "topLeft", // Opcional: puedes ajustar la posición
                timeout: 3000 // Opcional: duración de la notificación en milisegundos
            })
            vistaAuto();
        })
        .catch(error => {
            console.error('Error al eliminar el automóvil:', error);
            iziToast.error({
                title: "ERROR",
                message: "Error al eliminar el automóvil",
                position: "topCenter", // Opcional: puedes ajustar la posición
                timeout: 3000 // Opcional: duración de la notificación en milisegundos
            })
        });
    }
}