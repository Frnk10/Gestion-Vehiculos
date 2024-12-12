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

function cargarEmpresas() {
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = '';

    fetch(`../vistaEmpresa`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            contenedorTablas.innerHTML = html;
            const tablaEmpresas = document.getElementById('tbl-empresa');

            if (!tablaEmpresas) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
            
            $('#tbl-empresa').DataTable({
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
            console.error('Error al cargar las empresas:', error);
        });
}

function guardarDatosEmpresa() {
    const formularioElement = document.getElementById('formAgregarEmpresa');
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

    fetch('/agregarEmpresa/', {  
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
        console.log('Empresa agregada:', data);
        
        // Muestra mensaje de éxito
        Swal.fire({
            title: "CONFIRMACIÓN",
            text: data.mensaje || "Empresa agregada correctamente.",
            icon: 'success'
        });

        $('#modalAgregarEmpresa').modal('hide');

        Swal.fire({
            title: "CONFIRMACIÓN",
            text: "Empresa agregada exitosamente.",
            icon: 'success'
        })
        cargarEmpresas();
    })
    .catch(error => {
        console.error('Error al agregar la empresa:', error);
        // Manejo de errores específico
        if (error.message.includes('RUC ya ha sido registrado')) {
            alert('El RUC ingresado ya está registrado. Por favor, utiliza otro RUC.');
        } else {
            alert('Ocurrió un error al agregar la empresa. Intenta nuevamente.');
        }
    });
}

function abrirModalVerEmpresa(empresa_id) {
    fetch(`/obtenerUnaEmpresa/${empresa_id}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la empresa: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('verId').value = data.id;
            document.getElementById('verNombre').value = data.nombre; 
            document.getElementById('verRuc').value = data.ruc; 
            document.getElementById('verActividadEconomica').value = data.actividadeconomica; 
            document.getElementById('verDireccion').value = data.direccion;
            document.getElementById('verTelefono').value = data.telefono;
            document.getElementById('verEmail').value = data.email;
            document.getElementById('verEstado').value = data.estado;
            document.getElementById('verPropietario').value = data.propietario;
            document.getElementById('verLogo').value=data.logo;
            document.getElementById('verLink').value = data.link; // Nueva línea para el link

            if (data.logo) {
                document.getElementById('verLogo').src = data.logo;
            } else {
                document.getElementById('verLogo').src = ''; // o una imagen por defecto
            }

            $('#modalVerEmpresa').modal('show');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function guardarDatosEditadosEmpresa() {
    const empresa_id = document.getElementById('verId').value; 
    const formularioElement = document.getElementById('formEditarEmpresa');
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

    fetch(`/editarUnaEmpresa/${empresa_id}/`, {  
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
            text: "Empresa editada",
            icon: 'success'
        })
        $('#modalVerEmpresa').modal('hide'); 
        cargarEmpresas();  
    })
    .catch(error => {
        console.error('Error al actualizar la empresa:', error);
        alert(`Error: ${error.message}`); 
    });
}

function eliminarUnaEmpresa(empresa_id) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta empresa?');
    if (confirmacion) {
        fetch(`/eliminarUnaEmpresa/${empresa_id}/`, {
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
                text: "Empresa Eliminada",
                icon: 'error'
            })
            cargarEmpresas();
        })
        .catch(error => {
            console.error('Error al eliminar la empresa:', error);
            alert(error.message);  
        });
    }
}
