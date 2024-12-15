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
            position: "topCenter",
            timeout: 3000
        });
        return;
    }
    // Validar que 'color' solo contenga letras
    const colorRegex = /^[a-zA-Z\s]+$/; // Expresión regular para solo letras y espacios
    if (!colorRegex.test(color)) {
        iziToast.info({
            title: "AVISO",
            message: "El color solo debe contener letras.",
            position: "topCenter",
            timeout: 3000
        });
        return;
    }
    // Validar que 'precio' sea un número decimal
    if (isNaN(parseFloat(precio)) || !isFinite(precio)) {
        iziToast.info({
            title: "AVISO",
            message: "El precio debe ser un número.",
            position: "topCenter",
            timeout: 3000
        });
        return;
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
    fetch('../ingresarAuto/', {  
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
        return response.json();  
    })
    .then(data => {
        console.log('Auto agregado:', data);
        $('#modalAgregarAuto').modal('hide');
        iziToast.success({
            title: "CONFIRMACIÓN",
            message: data.message,
            position: "topLeft",
            timeout: 3000
        });
        vistaAuto(); // Refrescar la lista de propietarios
    })
    .catch(error => {
        console.error('Error al agregar automóvil:', error);
        // Ajusta el mensaje de acuerdo al error específico del backend
        iziToast.warning({
            title: "AVISO",
            message: error.message,
            position: "topCenter",
            timeout: 3000
        });
    });
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
        });
        return; // Detener la ejecución de la función
    }

    // Obtener los valores del formulario
    const color = document.getElementById('verColor').value.trim();
    const precio = document.getElementById('verPrecio').value.trim();
    const placa = document.getElementById('verPlaca').value.trim();
    const fkid_mod = document.getElementById('verModelo').value;
    // Validar que 'color' solo contenga letras
    const colorRegex = /^[a-zA-Z\s]+$/; // Expresión regular para solo letras y espacios
    if (!colorRegex.test(color)) {
        iziToast.info({
            title: "AVISO",
            message: "El color solo debe contener letras.",
            position: "topCenter",
            timeout: 3000
        });
        return;
    }
    // Validar que 'precio' sea un número decimal
    if (isNaN(parseFloat(precio)) || !isFinite(precio)) {
        iziToast.info({
            title: "AVISO",
            message: "El precio debe ser un número.",
            position: "topCenter",
            timeout: 3000
        });
        return;
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
            return response.json().then(data => {
                throw new Error(data.error || 'Error en la red');
            });
        }
        return response.json();
    })
    .then(data => {
        $('#modalVerAuto').modal('hide');
        iziToast.success({
            title: "CONFIRMACIÓN",
            message: data.message,
            position: "topLeft", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        });
        vistaAuto(); // Refrescar la lista de propietarios
    })
    .catch(error => {
        console.error('Error al actualizar el automóvil:', error);
        iziToast.warning({
            title: "AVISO",
            message: error.message,
            position: "topCenter", // Opcional: puedes ajustar la posición
            timeout: 3000 // Opcional: duración de la notificación en milisegundos
        });
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