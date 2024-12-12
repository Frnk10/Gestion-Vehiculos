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

//LOGEARSE
function logeo(){
    const formulario = new FormData(document.getElementById('frm_inicio_sesion'));
    fetch(`../iniciarSesion/`, {  
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
        if (data.estado) {
            Swal.fire({
                title:"CONFIRMACIÓN",
                text:data.mensaje,
                icon:'success',
                allowOutsideClick: false,  // Evita que se cierre al hacer clic fuera
                allowEscapeKey: false,     // Evita que se cierre con la tecla ESC
                confirmButtonText: 'Aceptar'  // Espera a que el usuario confirme
            }).then(() => {
                // Ocultar el modal de login
                $('#logeoModal').modal('hide');
                // Redirigir a una nueva plantilla
                window.location.href = "/"; 
            });
        }else{
            Swal.fire({
                title:"ERROR",
                text: "Usuario o Contraseña Incorrectos",
                icon:'error',
                timer: 2000,  // 2 segundos antes de que se cierre automáticamente
                timerProgressBar: true,  // Muestra una barra de progreso del temporizador
            });
            // alert('USUARIO Y CONTRASEÑA INCORRECTOS')
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        // alert('ERROR LOGEO')
        Swal.fire({
            title: "ERROR",
            text:"Debe ingresar usuario y contraseña correctamente",
            icon:'error',
            timer: 2000,  // 2 segundos antes de que se cierre automáticamente
            timerProgressBar: true,  // Muestra una barra de progreso del temporizador
        });
    });
}
