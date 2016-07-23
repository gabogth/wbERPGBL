$(function () {
    $('#btnLog').unbind();
    $('#btnLog').on('click', function () {
        $('#box-login').unbind();
        $('#box-login').submit(function (e) {
            e.preventDefault();
            Login();
        });
    });
    
});

function Login() {
    var query = 'usuario="' + $('#txtUsuario').val() + '"&contrasena="' + $('#txtContrasena').val() + '"';
    $.ajax({
        url: 'default.aspx/login',
        type: "GET",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: query,
        beforeSend: function () {
            $('#txtLoading').html('Cargando...');
            $('#btnLog').hide();
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        console.log(jsonData);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
            $('#txtLoading').html('');
            $('#btnLog').show();
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Correcto:|Empezemos!');
            document.location.href = 'ASP/default.aspx';
            $('#txtLoading').html('');
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#txtLoading').html('');
        $('#btnLog').show();
    });
}