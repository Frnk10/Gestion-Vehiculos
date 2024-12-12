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

function cargarPropietarios() {
    // Limpia el contenedor 
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
            const tablaPropietarios = document.getElementById('tbl-propietarios');
            
            if (!tablaPropietarios) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
            $('#tbl-propietarios').DataTable({
                language: {
                    search: "Buscar:",
                },
                paging: false,          // Desactiva la paginación
                ordering: false,        // Desactiva las flechas de ordenamiento
                info: false,             // Desactiva el texto de información de la tabla
                scrollX: true,          // Activa el desplazamiento horizontal
                fixedHeader: true,      // Fija el encabezado y el buscador
            });
        })
        .catch(error => {
            console.error('Error al cargar los propietarios:', error);
        });
}

function guardarDatosPropietario() {
    const formulario = document.getElementById('formAgregarPropietario');
    const inputs = formulario.querySelectorAll('input, select'); // Selecciona todos los inputs y selects
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

    // Si todos los campos son válidos, proceder a enviar el formulario
    const formularioData = new FormData(formulario);
    fetch('/agregarPropietario/', {  
        method: 'POST',
        body: formularioData,
        headers: {
            'X-CSRFToken': getCookie('csrftoken')  
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {  //aqui estan los mensajes de error 
                throw new Error(data.error || 'Error en la red');
            });
        }
        
        return response.json(); 
    })
    .then(data => {
        Swal.fire({
            title: "CONFIRMACIÓN",
            text: "Propietario agregado correctamente.",
            icon: 'success'
        });
        
        $('#modalAgregarPropietario').modal('hide');
        cargarPropietarios();
    })
    .catch(error => {
        console.error('Error al agregar el propietario:', error);
        alert(error.message);  
    });
}




function cargarCertificados() {
    // Limpia el contenedor 
    const contenedorTablas = document.getElementById('contenedor_certificados');
    contenedorTablas.innerHTML = ''; 
    fetch('{% url "vistaReporte" %}')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('contenedor_certificados').innerHTML=data;
        let table = new DataTable('#tbl_certificados'); // Inicializar DataTable si es necesario
        
        if (!tablaCertificados) {
            console.error('No se encontró el contenedor de la tabla.');
            return; 
        }
    })
    .catch(error => {
        console.error('Error al cargar los certificados:', error);
    });
}



function abrirModalVerPropietario(propietario_id) {
    fetch(`/obtenerUnPropietario/${propietario_id}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el propietario: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('verId').value=data.id;
            document.getElementById('verNombres').value = data.nombres;
            document.getElementById('verApellidos').value = data.apellidos;
            document.getElementById('verCedula').value = data.cedula;
            document.getElementById('verTelefono').value = data.telefono;
            document.getElementById('verEmail').value = data.email;
            document.getElementById('verDireccion').value = data.direccion;
            document.getElementById('verEstado').value = data.estado;
            document.getElementById('verFoto').src = data.foto ? data.foto : ''; 
            document.getElementById('verFirma').src = data.firma ? data.firma : ''; 

            // Abrir el modal
            $('#modalVerPropietario').modal('show');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function guardarDatosEditados() {
    const propietario_id = document.getElementById('verId').value; 
    const formularioElement = document.getElementById('formEditarPropietario');
    const inputs = formularioElement.querySelectorAll('input'); // Selecciona solo los inputs
    let allFieldsValid = true; // Variable para verificar si todos los campos son válidos

        // Verifica si todos los inputs están llenos, excepto los selects y campos de tipo file
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
            alert("Algunos campos estan vacios "); // Mensaje de error
            return; // Detener la ejecución de la función
        }

        // Si todos los campos son válidos, proceder a enviar el formulario
        const formularioData = new FormData(formularioElement);
    
    fetch(`/editarUnPropietario/${propietario_id}/`, {  
        method: 'POST',
        body: formularioData,
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
            text: "Propietario actualizado correctamente.",
            icon: 'success'
        });
        $('#modalVerPropietario').modal('hide'); 
        cargarPropietarios();

    })
    .catch(error => {
        console.error('Error al actualizar el propietario:', error);
        alert(`Error: ${error.message}`); 
    });
}

function eliminarUnPropietario(propietario_id){
     // Confirma si el usuario realmente quiere eliminar el propietario
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este propietario?');

    if (confirmacion) {
        fetch(`/eliminarUnPropietario/${propietario_id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken') 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el propietario');
            }
            
            Swal.fire({
                title: "ELIMINACIÓN",
                text: "Propietario eliminado Exitosamente",
                icon: 'error'
            })
            cargarPropietarios();  
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error: ${error.message}`); 
        });
    }
}



function cargarReportes() {

    // CERTIFICADOS
    // Funcion para cargar el listado de certificados con Fetch
    function cargarCertificados() {
        // Limpia el contenedor 
        const contenedorTablas = document.getElementById('contenedor_certificados');
        contenedorTablas.innerHTML = ''; 
        fetch('{% url "vistaReporte" %}')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('contenedor_certificados').innerHTML = data;
            let table = new DataTable('#tbl_certificados'); // Inicializar DataTable si es necesario
            
            if (!table) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
        })
        .catch(error => {
            console.error('Error al cargar los certificados:', error);
        });
    }
    
    // AGREGAR CERTIFICADO
    const formData = new FormData(this);
    fetch('/datosCertificado/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then(data => {
        if (data.estado) {
            Swal.fire({
                title: "CONFIRMACIÓN",
                text: data.mensaje,
                icon: 'success'
            });

            $('#certificadoModal').modal('hide'); // Ocultar el modal
            this.reset(); // Resetear el formulario
        } else {
            Swal.fire({
                title: "ERROR",
                text: "Error al generar el certificado",
                icon: 'error'
            });
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        Swal.fire({
            title: "ERROR",
            text: "Error al generar el certificado",
            icon: 'error'
        });
    });
}
    

