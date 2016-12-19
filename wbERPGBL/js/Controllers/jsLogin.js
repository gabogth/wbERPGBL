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
            assignCockies($('#txtUsuario').val(), $('#txtContrasena').val());
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

function assignCockies(username, password) {
    var expiration_date = new Date();
    var cookie_string_username = '',
        cookie_string_password = '';
    expiration_date.setFullYear(expiration_date.getFullYear() + 1);
    cookie_string_username = 'username=' + username + '; path=/; expires=' + expiration_date.toUTCString();
    cookie_string_password = 'password=' + password + '; path=/; expires=' + expiration_date.toUTCString();
    document.cookie = cookie_string_username;
    document.cookie = cookie_string_password;
}