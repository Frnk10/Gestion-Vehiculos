$("#frm_nuevo_certificado").validate({
    rules:{
        empresa:{ required:true },
        propietario:{ required:true },
        empleado:{ required:true },
    },
    messages:{
        empresa:{ required:'Obligatorio' },
        propietario:{ required:'Obligatorio' },
        empleado:{ required:'Obligatorio' },
    },
    submitHandler: function(form) {
        generarCertificado();  // Ejecutar solo si el formulario es válido
    }
});

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

// CARGAR CERTIFICADOS
function cargarCertificados() {
    // Limpia el contenedor 
    const contenedorTablas = document.getElementById('contenedor-tablas');
    contenedorTablas.innerHTML = '';

    fetch(`../vistaReporte`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.statusText);
        }
        return response.text();
    })
    .then(html => {
        contenedorTablas.innerHTML = html;
        const tablaCertificados = document.getElementById('tbl_certificados');
        // let table = new DataTable('#tbl_certificados'); // Inicializar DataTable si es necesario
        
        if (!tablaCertificados) {
            console.error('No se encontró el contenedor de la tabla.');
            return; 
        }
        // Inicializa DataTables con los ajustes
        $('#tbl_certificados').DataTable({
            language: {
                search: "Buscar",
                emptyTable: "No hay empleados disponibles",
                zeroRecords: "No se encontraron coincidencias",
                info: "Mostrando _START_ a _END_ de _TOTAL_ certificados",
                infoEmpty: "No hay certificados para mostrar",
                lengthMenu: "Mostrar _MENU_ certificados",
                paginate: {
                    previous: "Anterior",
                    next: "Siguiente"
                }
            },
            paging: true,           // Activar la paginación
            ordering: false,        // Desactiva las flechas de ordenamiento
            info: false,            // Desactiva el texto de información de la tabla
            scrollX: true,          // Activa el desplazamiento horizontal
            fixedHeader: true,      // Fija el encabezado y el buscador
            autoWidth: false,       // Desactiva el autoajuste de ancho de columna
            // dom: 'rtp'              // Oculta el control de cantidad de registros por página
        });
    })
    .catch(error => {
        console.error('Error al cargar los certificados:', error);
    });
}

// GENERAR CERTIFICADOS
function generarCertificado() {
    const formulario = new FormData(document.getElementById('frm_nuevo_certificado'));

    fetch('../generarCertificado/', {
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
        if (data.estado) {
            Swal.fire({
                title: "CONFIRMACIÓN",
                text: data.mensaje,
                icon: 'success'
            }).then(() => {
                const modalElement = document.getElementById('certificadoModal');
                const modal = bootstrap.Modal.getInstance(modalElement);

                if (modal) {
                    modal.hide(); // Cierra el modal
                }

                // Elimina el backdrop manualmente
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove(); // Asegúrate de que se elimine el backdrop
                }

                cargarCertificados(); // Carga nuevamente los certificados
            });
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
            text: "Debe seleccionar una opción en los 3 campos",
            icon: 'error'
        });
    });
}

async function abrirModalYListarEmpresas() {
    // Primero abre el modal usando Bootstrap
    const modalElement = new bootstrap.Modal(document.getElementById('certificadoModal'));
    modalElement.show();
    await cargaParaCertificado();
    // Agrega un evento al modal para cuando se cierra
    modalElement._element.addEventListener('hidden.bs.modal', () => {
        // Asegúrate de remover el backdrop y la clase modal-open
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    });
    
}



const listarEmpresaCertificado = async()=>{
    try {
        const  response = await fetch("../listarEmpresas/")
        const data = await response.json();
        if(data.message === "okey"){
            let opciones = `<option value="" disabled selected hidden>Seleccione la empresa</option>`;
            
            // Itera sobre las empresas y crea opciones en el select
            data.empresas.forEach((empresa) => {
                opciones += `<option value='${empresa.id}'>${empresa.nombre}</option>`;
            });
            // Asigna las opciones generadas al select de empresas
            cboEmpresa.innerHTML = opciones;
            //listarCursos(data.periodos[0].id)
            
        } else {
            alert('No hay empresas disponibles');
        }
    } catch (error) {
        console.error('Error al listar empresas:', error);
    }
};

async function listarPropietario(empresa_id) {
    try {
        // Realiza la petición Fetch para obtener el propietario de la empresa seleccionada
        const response = await fetch(`listarPropietario/${empresa_id}/`);
        const data = await response.json();

        // Obtiene el select de propietarios
        const cboPropietario = document.getElementById('cboPropietario');

        if (data.message === "okey") {
            // Limpiar las opciones previas
            cboPropietario.innerHTML = '<option value="" disabled hidden></option>';

            // Agregar el propietario al select
            if (data.propietario.length > 0) {
                const prop = data.propietario[0]; // Solo hay un propietario
                let option = document.createElement('option');
                option.value = prop.id; // Aquí se usa el id del propietario
                option.text = prop.nombre; // Concatenando nombres y apellidos
                cboPropietario.appendChild(option);
                
                // Selecciona automáticamente el propietario
                cboPropietario.disabled = false;
                cboPropietario.value = prop.id; // Establece el valor del select
            } else {
                alert('No hay propietarios disponibles para esta empresa');
            }
        } else {
            alert('Error al obtener propietarios');
            cboPropietario.disabled = true;
        }
    } catch (error) {
        console.error('Error al listar propietario:', error);
    }
}


async function listarEmpleados(empresa_id) {
    try {
        // Realiza la petición Fetch para obtener los empleados de la empresa seleccionada
        const response = await fetch(`listarEmpleados/${empresa_id}/`);
        const data = await response.json();

        // Obtiene el select de empleados
        const cboEmpleado = document.getElementById('cboEmpleado');

        if (data.message === "okey") {
            // Limpiar las opciones previas (excepto la primera que es "Seleccione al empleado")
            cboEmpleado.innerHTML = '<option value="" disabled selected hidden>Seleccione al empleado</option>';

            // Itera sobre los empleados y crea opciones en el select
            data.empleados.forEach((emp) => {
                let option = document.createElement('option');
                option.value = emp.id;  // Aquí se usa el id del empleado
                option.text = emp.nombre;  // Aquí se usa el nombre completo del empleado (nombres + apellidos)
                cboEmpleado.appendChild(option);
            });
        } else {
            alert('No hay empleados disponibles para esta empresa');
        }
    } catch (error) {
        console.error('Error al listar empleados:', error);
    }
}
const cargaParaCertificado=async()=>{
    await listarEmpresaCertificado();
    cboEmpresa.addEventListener("change",(event)=>{
        listarPropietario(event.target.value);
        listarEmpleados(event.target.value)
    })

    
}