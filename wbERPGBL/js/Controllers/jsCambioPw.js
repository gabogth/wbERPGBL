$(function () {
    cambiarPassword();
});

function check(input) {
    if (input.value != document.getElementById('txtNewPw').value) {
        input.setCustomValidity('Las contraseñas deben ser iguales.');
    } else {
        input.setCustomValidity('');
    }
}

function cambiarPassword() {
    $('#frmInsertar').submit(function (e) {
        e.preventDefault();
        modificar_pw($('#txtID').val(), $('#txtUS').val());
    });
}

function modificar_pw(id, usuario) {
    var query = 'IDUSUARIO=' + id +
       '&USUARIO="' + encodeURIComponent(usuario) + '"' +
       '&ANTIGUO_PASSWORD="' + encodeURIComponent($('#txtOldPw').val()) + '"' +
       '&NUEVO_PASSWORD="' + encodeURIComponent($('#txtNewPw').val()) + '"';
    $.ajax({
        url: 'usuario_frmMantenimientoUsuario.aspx/cambiar_pw',
        type: "GET",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: query,
        beforeSend: function () {
            $('#btn_mensaje_aceptar').html('<span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;Procesando');
            $('#btn_mensaje_cancelar').attr('disabled', true);
            $('#btn_mensaje_cancelar').attr('disabled', true);
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|Se estableció la nueva contraseña correctamente.');
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
    });
}