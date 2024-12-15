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
            iziToast.success({
                title:"CONFIRMACIÓN",
                message:data.mensaje,
                position: "topCenter", // Opcional: puedes ajustar la posición
                timeout: 2000 // Opcional: duración de la notificación en milisegundos
            });
            // Esperar a que se muestre la notificación antes de continuar
            setTimeout(() => {
                // Ocultar el modal de login
                $('#logeoModal').modal('hide');
                // Redirigir a una nueva plantilla
                window.location.href = "/"; 
            }, 2000); // Espera el mismo tiempo que el timeout de iziToast
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        iziToast.error({
            title: "ERROR",
            message:"Debe ingresar usuario y contraseña correctamente",
            position: "topCenter",
            timeout: 2000,  // 2 segundos antes de que se cierre automáticamente
        });
    });
}