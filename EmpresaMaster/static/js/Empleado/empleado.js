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

function cargarEmpleados() {
    // Limpia el contenedor 
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = ''; 

    fetch(`../vistaEmpleado`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            contenedorTablas.innerHTML = html;
            const tablaEmpleados = document.getElementById('tbl-empleados');
            
            if (!tablaEmpleados) {
                console.error('No se encontró el contenedor de la tabla.');
                return; 
            }
            
            // Inicializa DataTables con los ajustes
            $('#tbl-empleados').DataTable({
                language: {
                    search: "Buscar:",
                    emptyTable: "No hay empleados disponibles",
                    zeroRecords: "No se encontraron coincidencias",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ empleados",
                    infoEmpty: "No hay empleados para mostrar",
                    lengthMenu: "Mostrar _MENU_ empleados",
                },
                paging: false,          // Desactiva la paginación
                ordering: false,        // Desactiva las flechas de ordenamiento
                info: false,            // Desactiva el texto de información de la tabla
                scrollX: true,          // Activa el desplazamiento horizontal
                fixedHeader: true,      // Fija el encabezado y el buscador
                autoWidth: false,       // Desactiva el autoajuste de ancho de columna
            });
        })
        .catch(error => {
            console.error('Error al cargar los empleados:', error);
        });
}

function guardarDatosEmpleados() {
    const formularioElement = document.getElementById('formAgregarEmpleado');
    const inputs = formularioElement.querySelectorAll('input, textarea,select'); // Seleccionar inputs y textareas
    let allFieldsValid = true; // Variable para verificar si todos los campos son válidos

   // Verifica si todos los campos están llenos
   // Verifica si todos los campos están llenos y aplica validaciones específicas
   // Validación específica para el campo de cédula
   
   inputs.forEach(input => {
        if (!input.value) {
            allFieldsValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });

    // Si hay campos vacíos, no envíes el formulario
    if (!allFieldsValid) {
        alert("Todos los campos son obligatorios."); // Mensaje de error
        return; // Detener la ejecución de la función
    }

    const formulario = new FormData(formularioElement); // Crear FormData después de verificar los campos
    fetch('../agregarEmpleado/', {  
        method: 'POST',
        body: formulario,
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
        console.log('Empleado agregado:', data);
        $('#modalAgregarEmpleado').modal('hide');
        Swal.fire({
            title: "CONFIRMACIÓN",
            text: "Empleado agregado exitosamente.",
            icon: 'success'
        })
        cargarEmpleados();
    })
    .catch(error => {
        console.error('Error al agregar el empleado', error);
        alert(error.message);  
    });
}

function abrirModalVerEmpleado(empleado_id) {
    fetch(`../obtenerUnEmpleado/${empleado_id}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el empleado: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('verId').value=data.id;
            document.getElementById('verNombres').value = data.nombres;
            document.getElementById('verApellidos').value = data.apellidos;
            document.getElementById('verCedula').value = data.cedula;
            document.getElementById('verTelefono').value = data.telefono;
            document.getElementById('verDireccion').value = data.direccion;
            document.getElementById('verTiempoConocimiento').value = data.tiempo_conocimiento;
            document.getElementById('verEmpresa').value = data.empresa;

            // Abrir el modal
            $('#modalVerEmpleado').modal('show');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function guardarDatosEditadosEmpleado() {
    const empleado_id = document.getElementById('verId').value; 
    const formularioElement = document.getElementById('formEditarEmpleado');
    const inputs = formularioElement.querySelectorAll('input, textarea, select'); // Seleccionar inputs y textareas
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
    fetch(`../editarUnEmpleado/${empleado_id}/`, {  
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
        $('#modalVerEmpleado').modal('hide'); 
        Swal.fire({
            title: "CONFIRMACIÓN",
            text: "Empleado editado exitosamente.",
            icon: 'success'
        })
        
        cargarEmpleados();  
    })
    .catch(error => {
        console.error('Error al actualizar el empleado:', error);
        alert(`Error: ${error.message}`); 
    });
}

function eliminarUnEmpleado(empleado_id){
    // Confirma si el usuario realmente quiere eliminar el propietario
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este empleado?');

    if (confirmacion) {
        fetch(`../eliminarUnEmpleado/${empleado_id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el empleado');
            }
            Swal.fire({
                title: "ELIMINACIÓN",
                text: "Empleado eliminado exitosamente.",
                icon: 'error'
            })
            
            cargarEmpleados();  
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error: ${error.message}`); 
        });
    }
    }
