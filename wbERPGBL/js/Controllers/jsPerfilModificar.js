var binaryString = null;
$(function () {
    cambiarPassword();
    $('#rowProgress').hide();
    $('#txtFile').on('change', function () {
        var reader = new FileReader();
        reader.onload = function (e) {
            var image = new Image();
            binaryString = this.result;
            document.getElementById('pbImagen').src = e.target.result;
        };
        try {
            reader.readAsDataURL(this.files[0]);
        } catch (Excepcion) {
            binaryString = null;
            document.getElementById('pbImagen').src = '#';
        }
    });
});

function cambiarPassword() {
    $('#frmInsertar').submit(function (e) {
        e.preventDefault();
        modificar();
    });
}

function modificar() {
    var formData = $('#frmInsertar').serializeJSON();
    formData["img_data"] = binaryString;
    $.ajax({
        url: 'usuario_frmMantenimientoUsuario.aspx/modificar_perfil',
        type: "POST",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(formData),
        beforeSend: function () {
            $('#btnGuardar').html('<span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;Procesando');
            $('#btnGuardar').attr('disabled', true);
            $('#btnGuardar').attr('disabled', true);
            $('#rowProgress').show();
            $('#pbProgress').css('width', 0 + '%').attr('aria-valuenow', 0);
        },
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            // Upload progress
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    console.log(percentComplete);
                    $('#pbProgress').css('width', (percentComplete * 100) + '%').attr('aria-valuenow', (percentComplete * 100));
                }
            }, false);
            // Download progress
            xhr.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    // Do something with download progress
                    console.log(percentComplete);
                }
            }, false);

            return xhr;
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|Se estableció la nueva contraseña correctamente.');
            document.location.reload();
        }
        $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
        $('#btnGuardar').attr('disabled', false);
        $('#btnGuardar').attr('disabled', false);
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
        $('#btnGuardar').attr('disabled', false);
        $('#btnGuardar').attr('disabled', false);
    }).always(function (ort, rt, qrt) {
        $('#rowProgress').hide('slow');
        $('#pbProgress').css('width', 0 + '%').attr('aria-valuenow', 0);
    });
}