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

function vistaCarro() {
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = ''; // Limpiar la tabla antes de recargarla

    fetch('../vistaCarro/') // Asegúrate de que la URL esté correcta
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text(); // Usamos text() si estamos esperando HTML
        })
        .then(html => {
            contenedorTablas.innerHTML = html; // Cargar la nueva tabla
            const tablaCiudad = document.getElementById('tbl-auto');

            if (!tablaCiudad) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
            
            // Inicializar la tabla de DataTable si se encuentra
            $('#tbl-auto').DataTable({
                language: {
                    search: "Buscar:",
                },
                paging: false,
                ordering: false,
                info: false,
                scrollX: true,
                fixedHeader: true,
            });
        })
        .catch(error => {
            console.error('Error al cargar los carros:', error);
        });
}
function agregarCarro() {
    // Obtener el formulario
    const form = document.getElementById('formAgregarCarro');
    
    // Capturar los valores directamente del formulario
    const colorCar = form.querySelector('#color_car').value;
    const precioCar = form.querySelector('#precio_car').value;
    const placaCar = form.querySelector('#placa_car').value;
    const fkidMod = form.querySelector('#fkid_mod').value;
    
    // Validar que se haya seleccionado un modelo
    if (!fkidMod) {
        alert('Debe seleccionar un modelo');
        return;
    }

    // Crear un objeto FormData
    const formData = new FormData();
    formData.append('color_car', colorCar);
    formData.append('precio_car', precioCar);
    formData.append('placa_car', placaCar);
    formData.append('fkid_mod', fkidMod);

    const csrfToken = getCookie('csrftoken'); 
    // Enviar la solicitud mediante fetch
    fetch('../ingresarCarro/', {
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
            vistaCarro(); // Llamar a la función vistaCarro después de agregar el carro
        }
    })
    .catch(error => console.error('Error al agregar automóvil:', error));
}


function eliminarCarro(carroId) {
    const csrfToken = getCookie('csrftoken'); // Obtén el CSRF token

    // Enviar la solicitud DELETE mediante fetch
    fetch(`../eliminarCarro/${carroId}/`, {
        method: 'DELETE', // Usamos DELETE para eliminar
        headers: {
            'X-CSRFToken': csrfToken  // Incluir el CSRF token en los encabezados
        },
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            vistaCarro(); // Actualiza la vista de carros después de eliminar
        }
    })
    .catch(error => {
        console.error('Error al eliminar el carro:', error);
    });
}

function abrirmodalVerCarro(carroId) {
    fetch(`/cargarCarroEditar/${carroId}/`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Rellenar los campos del formulario con los datos
                document.getElementById('carro_id_editar').value = carroId;
                document.getElementById('color_car_editar').value = data.color_car;
                document.getElementById('precio_car_editar').value = data.precio_car;
                document.getElementById('placa_car_editar').value = data.placa_car;

                // Cargar el select con todas las opciones de modelos
                const selectModelo = document.getElementById('fkid_mod_editar');
                selectModelo.innerHTML = ''; // Limpiar las opciones previas
                data.modelos.forEach(modelo => {
                    const option = document.createElement('option');
                    option.value = modelo.id;
                    option.textContent = modelo.nombre_mod;
                    if (modelo.id === data.fkid_mod) {
                        option.selected = true; // Seleccionar el modelo actual por defecto
                    }
                    selectModelo.appendChild(option);
                });

                // Mostrar el modal
                $('#modalEditarCarro').modal('show');
            } else {
                alert('Error al cargar los datos del vehículo');
            }
        })
        .catch(error => console.error('Error al cargar el vehículo:', error));
}
    

function editarCarro() {
    const form = document.getElementById('formEditarCarro');
    const carroId = form.querySelector('#carro_id_editar').value;
    const colorCar = form.querySelector('#color_car_editar').value;
    const precioCar = form.querySelector('#precio_car_editar').value;
    const placaCar = form.querySelector('#placa_car_editar').value;
    const fkidMod = form.querySelector('#fkid_mod_editar').value;

    const formData = new FormData();
    formData.append('carro_id_editar', carroId);
    formData.append('color_car_editar', colorCar);
    formData.append('precio_car_editar', precioCar);
    formData.append('placa_car_editar', placaCar);
    formData.append('fkid_mod_editar', fkidMod);

    const csrfToken = getCookie('csrftoken'); // Obtener el token CSRF

    fetch(`/editarCarro/${carroId}/`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) {
            vistaCarro(); // Actualiza la lista de carros después de la edición
        }
    })
    .catch(error => console.error('Error al editar el carro:', error));
}