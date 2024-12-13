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
                },
                paging: false,          // Desactiva la paginación
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
    const formularioElement = document.getElementById('formAgregarModelo');
    const inputs = formularioElement.querySelectorAll('input, textarea'); // Seleccionar inputs y textareas
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
        
        // Muestra mensaje de éxito
        Swal.fire({
            title: "CONFIRMACIÓN",
            text: data.mensaje || "Modelo agregado correctamente.",
            icon: 'success'
        });

        $('#modalAgregarModelo').modal('hide');

        Swal.fire({
            title: "CONFIRMACIÓN",
            text: "Modelo agregado exitosamente.",
            icon: 'success'
        })
        cargarModelos();
    })
    .catch(error => {
        console.error('Error al agregar el modelo:', error);
        // Manejo de errores específico
        if (error.message.includes('El modelo ya ha sido registrado')) {
            alert('El modelo ingresado ya está registrado.');
        } else {
            alert('Ocurrió un error al agregar el modelo. Intenta nuevamente.');
        }
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
    const formularioElement = document.getElementById('formEditarModelo');
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
        alert("Algunos  campos son necesarios "); // Mensaje de error
        return; // Detener la ejecución de la función
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
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Error desconocido');
            });
        }
        Swal.fire({
            title: "CONFIRMACIÓN",
            text: "Modelo editado",
            icon: 'success'
        })
        $('#modalVerModelo').modal('hide'); 
        cargarModelos();  
    })
    .catch(error => {
        console.error('Error al actualizar el modelo:', error);
        alert(`Error: ${error.message}`); 
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
            Swal.fire({
                title: "ELIMINACIÓN",
                text: "Modelo Eliminado",
                icon: 'error'
            })
            cargarModelos();
        })
        .catch(error => {
            console.error('Error al eliminar el modelo:', error);
            alert(error.message);  
        });
    }
}
