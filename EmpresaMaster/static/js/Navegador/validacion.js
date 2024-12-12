$(document).ready(function() {
    $("#formAgregarEmpleado").validate({
        rules:{
            //USER
            nombres:{
                required:true,
                minlength:3,
                maxlength:30,
            },
    
            apellidos:{
                required:true,
                minlength:3,
                maxlength:30,
            },
    
            cedula:{
                required:true,
                minlength:10,
                maxlength:10,
            },
    
            telefono:{
                required:true,
                minlength:10,
                maxlength:15,
            },
        },
        messages:{
            //USER
            nombres:{
                required:'Dato obligatorio',
                minlength:'Nombre debe tener más de 3 caracteres',
                maxlength:'Nombre debe tener menos de 30 caracteres',
            },
    
            apellidos:{
                required:'Dato obligatorio',
                minlength:'Apellido debe tener más de 3 caracteres',
                maxlength:'Apellido debe tener menos de 30 caracteres',
            },
    
            cedula:{
                required:'Dato obligatorio',
                minlength:'Cédula de 10 dígitos',
                maxlength:'Cédula muy larga',
            },
    
            telefono:{
                required:'Dato obligatorio',
                minlength:'Usuario debe tener más de 5 caracteres',
                maxlength:'Usuario debe tener menos de 30 caracteres',
            },
        },
    });
});

