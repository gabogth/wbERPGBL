$(function () {
    initializeComponents();
    $('#btnInsertar').unbind();
    $('#btnInsertar').on('click', function () {
        $('#modal_insertar_titulo').html('Insertar');
        $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
        $('#btnGuardar').attr('disabled', false);
        $('#btnCancelar').attr('disabled', false);
        $('#modalInsertar').modal('show');
        clearInputs();
        $('#btnGuardar').unbind();
        $('#btnGuardar').on('click', function () {
            $('#frmInsertar').unbind();
            $('#frmInsertar').submit(function (e) {
                e.preventDefault();
                insertar();
            });
        });
    });
    buscar(1, 10);
    $('#btnSeleccionarFoto').on('change', function () {
        var filename = $('#btnSeleccionarFoto').val();
        filename = filename.toLowerCase();
        filename = filename.replace('c:\\fakepath\\', '');
        $('#txtFoto').val(filename);
        readURL(this);
        $('#btnClearPreviewImage').show();
        $('#btnClearPreviewImage').unbind();
        $('#btnUploadAnexo').show();
        $('#btnClearPreviewImage').on('click', function () {
            filename = '';
            $('#btnSeleccionarFoto').val('');
            $('#txtFoto').val('');
            $('#pbFotoSelected').attr('src', '../img/unknowuser.png');
        });
    });
});

function clearInputs() {
    $('#frmInsertar input').each(function (index, item) {
        $(item).val('');
    });
    $('#frmInsertar textarea').each(function (index, item) {
        $(item).val('');
    });
}

function establecerData(data) {
    $('#txtProyecto').val(data.proyecto);
    $('#cbEmpresa').empty().append('<option value="' + data.idempresa + '">' + data.EMPRESA_ALIAS + '</option>').val(data.idempresa).trigger('change');
    $('#dtpInicio').val(data.fecha_inicio.split('T')[0]);
    $('#dtpFin').val(data.fecha_fin.split('T')[0]);
}

function paginacion() {
    $('#paginacionFoot').pagination({
        items: 1,
        itemsOnPage: 10,
        hrefTextPrefix: window.location.pathname + '#',
        hrefTextSuffix: '',
        cssStyle: 'dark-theme',
        onPageClick: function (pageNumber) {
            buscar(pageNumber, 10);
        }
    });
}

function initializeComponents() {
    paginacion();
    $('#txtBuscar').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#paginacionFoot').pagination('selectPage', 1);
            buscar(1, 10);
        }
    });
    cargarEmpresa();
}

function cargarEmpresa() {
    $('#cbEmpresa').select2({
        theme: "themes-dark",
        ajax: {
            url: 'empresa_frmMantenimientoEmpresa.aspx/buscar',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'GET',
            data: function (params) {
                if (params == null) {
                    return 'q=""&index=' + 1 + '&cantidad=' + 10;
                } else {
                    return 'q="' + (params.term == null ? '' : params.term) + '"&index=' + 1 + '&cantidad=' + 10;
                }
            },
            processResults: function (data, page) {
                var datos = jQuery.parseJSON(data.d);
                datos = datos.body;
                console.log(datos);
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idempresa;
                    datos[i].text = datos[i].alias;
                }
                console.log(datos);
                return {
                    results: datos
                };
            }
        },
        escapeMarkup: function (markup) { return markup; },
        templateResult: format,
        templateSelection: formatRepoSelection
    });
}

function format(e) {
    if (e.loading) {
        return "<div>" + e.text + "</div>";
    }
    var markup = '<div>' + e.text + '</div>';
    return markup;
}
function formatRepoSelection(repo) {
    return repo.text || repo.text;
}

function buscar(indexPag, cantidad) {
    var query = 'q="' + $('#txtBuscar').val() + '"&index=' + indexPag + '&cantidad=' + cantidad;
    $.ajax({
        url: 'proyecto_frmMantenimientoProyecto.aspx/buscar',
        type: "GET",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: query,
        beforeSend: function () {
            $('#tbl_body').html('<tr><td colspan="14" class="text-center"><span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;&nbsp;Procesando...</td></tr>');
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
            $('#paginacionFoot').pagination('updateItems', 1);
        } else {
            $('#tbl_body').html('');
            var bodyTable = '';
            $.each(jsonData.body, function (index, item) {
                bodyTable = '';
                bodyTable += '<tr><td>' + (((indexPag - 1) * cantidad) + index + 1) + '</td>';
                bodyTable += '<td>' + item.proyecto + '</td>';
                bodyTable += '<td>' + item.EMPRESA_ALIAS + '</td>';
                bodyTable += '<td class="text-center">' + item.fecha_inicio.split('T')[0] + '</td>';
                bodyTable += '<td class="text-center">' + item.fecha_fin.split('T')[0] + '</td>';
                var fechaFin = moment(item.fecha_fin.split('T')[0], 'YYYY-MM-DD');
                var fechaInicio = moment(item.fecha_inicio.split('T')[0], 'YYYY-MM-DD');
                var fechaHoy = moment();
                var diferenciaDias = fechaInicio.diff(fechaFin, 'days');
                var restanDias = fechaHoy.diff(fechaFin, 'days');
                bodyTable += '<td class="text-center">' + diferenciaDias + ' días</td>';
                bodyTable += '<td class="text-center">' + restanDias + ' días</td>';
                bodyTable += '<td class="text-center">' + getStateIcon(item.estado, 'estado' + item.idproyecto) + '</td>';
                bodyTable += '<td class="text-center"><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idproyecto + '"></span></td>';
                bodyTable += '<td class="text-center"><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idproyecto + '"></span></td>';
                bodyTable += '<td class="text-center"><span class="fa fa-folder-o" style="color:white; cursor: pointer;" id="downloads' + item.idproyecto + '"></span></td></tr>';
                $('#tbl_body').append(bodyTable);
                bodyTable = '';
                $('#modificar' + item.idproyecto).unbind();
                $('#modificar' + item.idproyecto).on('click', function () {
                    establecerData(item);
                    $('#modal_insertar_titulo').html('MODIFICAR');
                    $('#modalInsertar').modal('show');
                    $('#btnGuardar').attr('disabled', false);
                    $('#btnCancelar').attr('disabled', false);
                    $('#btnGuardar').unbind();
                    $('#btnGuardar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
                    $('#btnGuardar').on('click', function () {
                        $('#frmInsertar').unbind();
                        $('#frmInsertar').submit(function (e) {
                            e.preventDefault();
                            modificar(item.idproyecto);
                        });
                    });
                });
                $('#downloads' + item.idproyecto).unbind();
                $('#downloads' + item.idproyecto).on('click', function () {
                    $('#btnUploadAnexo').unbind();
                    $('#btnUploadAnexo').on('click', function () {
                        insertar_anexos_proyecto(item.idproyecto);
                    });
                    $('#modal_anexos_insertar_titulo').html('ARCHIVOS DEL PROYECTO ' + item.proyecto);
                    $('#modalAnexos').modal('show');
                    cargarUploadProyectos(item.idproyecto);
                });
                $('#eliminar' + item.idproyecto).unbind();
                $('#eliminar' + item.idproyecto).on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.proyecto + '</b> permanentemente?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        eliminar(item.idproyecto);
                    });
                });
                $('#estado' + item.idproyecto).unbind();
                $('#estado' + item.idproyecto).on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea cambiar el estado de <b>' + item.proyecto + '</b>?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        modificar_estado(item.idproyecto, Math.abs(item.estado - 1));
                    });
                });

            });
            $('#paginacionFoot').pagination('updateItems', jsonData.registros);
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
    });
}

function cargarUploadProyectos(id) {
    $.ajax({
        url: 'proyecto_frmMantenimientoProyecto.aspx/buscarUploads',
        type: "GET",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: 'IDPROYECTO=' + id,
        beforeSend: function () {
            $('#tbl_body_anexos').html('<tr><td colspan="14" class="text-center"><span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;&nbsp;Procesando...</td></tr>');
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            $('#tbl_body_anexos').html('<tr><td colspan="14" class="text-center">Error: ' + jsonData.message + '</td></tr>');
        } else {
            $('#tbl_body_anexos').html('');
            var bodyTable = '';
            $.each(jsonData.body, function (index, item) {
                bodyTable = '';
                bodyTable += '<tr><td>' + (index + 1) + '</td>';
                bodyTable += '<td class="text-left"> <a href="../response/upload_anexo_proyecto.ashx?IDUPLOAD_PROYECTO='+item.idupload_proyecto+'" target="_blank">' + item.nombre_archivo + '</a></td>';
                bodyTable += '<td class="text-right">' + item.peso_archivo + '</td>';
                bodyTable += '<td class="text-center">' + item.fecha_creacion.replace('T', ' a las ') + '</td>';
                bodyTable += '<td class="text-center">' + item.extension + '</td>';
                bodyTable += '<td class="text-center"><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar_anexo' + item.idupload_proyecto + '"></span></td></tr>';
                $('#tbl_body_anexos').append(bodyTable);
                bodyTable = '';
                $('#eliminar_anexo' + item.idupload_proyecto).unbind();
                $('#eliminar_anexo' + item.idupload_proyecto).on('click', function () {
                    eiminar_anexos_proyecto(item.idupload_proyecto, id);
                });
            });
        }
    }).fail(function (ort, rt, qrt) {
        $('#tbl_body_anexos').html('<tr><td colspan="14" class="text-center">Error: ' + jsonData.rt + '</td></tr>');
    });
}

function getStateIcon(data, id) {
    if (data == 1) {
        return '<span class="fa fa-circle-o text-success" style="cursor: pointer;" id="' + id + '"></span>';
    } else {
        return '<span class="fa fa-circle-o text-danger" style="cursor: pointer;" id="' + id + '"></span>';
    }
}

function modificar(id) {
    var query = 'IDPROYECTO=' + id +
        '&PROYECTO="' + encodeURIComponent($('#txtProyecto').val()) + '"' +
        '&IDEMPRESA=' + encodeURIComponent($('#cbEmpresa').val()) +
        '&FECHA_INICIO="' + encodeURIComponent($('#dtpInicio').val()) + '"' +
        '&LATITUD=' + encodeURIComponent('0') +
        '&LONGITUD=' + encodeURIComponent('0') +
        '&FECHA_FIN="' + encodeURIComponent($('#dtpFin').val()) + '"';
    $.ajax({
        url: 'proyecto_frmMantenimientoProyecto.aspx/modificar',
        type: "GET",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: query,
        beforeSend: function () {
            $('#btnGuardar').html('<span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;Procesando');
            $('#btnGuardar').attr('disabled', true);
            $('#btnCancelar').attr('disabled', true);
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
            $('#modalInsertar').modal('toggle');
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|El registro fue modificado correctamente.');
            $('#modalInsertar').modal('toggle');
            var actualIndex = $('#paginacionFoot').pagination('getCurrentPage');
            buscar(actualIndex, 10);
            console.log(actualIndex);
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modalInsertar').modal('toggle');
    });
}

function insertar() {
    var query = 'PROYECTO="' + encodeURIComponent($('#txtProyecto').val()) + '"' +
        '&IDEMPRESA=' + encodeURIComponent($('#cbEmpresa').val()) +
        '&FECHA_INICIO="' + encodeURIComponent($('#dtpInicio').val()) + '"' +
        '&LATITUD=' + encodeURIComponent('0') +
        '&LONGITUD=' + encodeURIComponent('0') +
        '&FECHA_FIN="' + encodeURIComponent($('#dtpFin').val()) + '"';

    $.ajax({
        url: 'proyecto_frmMantenimientoProyecto.aspx/insertar',
        type: "GET",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: query,
        beforeSend: function () {
            $('#btnGuardar').html('<span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;Procesando');
            $('#btnGuardar').attr('disabled', true);
            $('#btnCancelar').attr('disabled', true);
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
            $('#modalInsertar').modal('toggle');
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|El registro fue insertado correctamente.');
            $('#modalInsertar').modal('toggle');
            var actualIndex = $('#paginacionFoot').pagination('getCurrentPage');
            buscar(actualIndex, 10);
            console.log(actualIndex);
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modalInsertar').modal('toggle');
    });
}

function eliminar(id) {
    var query = 'IDPROYECTO=' + id;
    $.ajax({
        url: 'proyecto_frmMantenimientoProyecto.aspx/eliminar',
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
            $('#modal_mensaje').modal('toggle');
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|El registro fue eliminado correctamente.');
            $('#modal_mensaje').modal('toggle');
            var actualIndex = $('#paginacionFoot').pagination('getCurrentPage');
            buscar(actualIndex, 10);
            console.log(actualIndex);
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
    });
}


function insertar_anexos_proyecto(idproyecto) {
    var data = new FormData();
    console.log($('#btnSeleccionarFoto')[0].files);
    jQuery.each($('#btnSeleccionarFoto')[0].files, function (i, file) {
        data.append('file-' + i, file);
    });
    var filename = $('#btnSeleccionarFoto').val();
    var fileType = $('#btnSeleccionarFoto')[0].files[0].type;
    filename = filename.toLowerCase();
    filename = filename.replace('c:\\fakepath\\', '');
    data.append('OP', 'INSERTAR');
    data.append('NOMBRE_ARCHIVO', filename);
    data.append('FILE_TYPE', fileType);
    data.append('IDPROYECTO', idproyecto);
    console.log(data);
    $.ajax({
        url: '../response/upload_anexo_proyecto.ashx',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        beforeSend: function () {
            $('#pbUploadAnexo').attr('aria-valuenow', '0');
            $('#pbUploadAnexo').css('width', 0);
        },
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    percentComplete = parseInt(percentComplete * 100);
                    $('#pbUploadAnexo').attr('aria-valuenow', percentComplete + '%');
                    $('#pbUploadAnexo').css('width', percentComplete + '%');
                    $('#lblStatus').html('<i>' + percentComplete + '% completado</i>');
                    if (percentComplete === 100) {
                        $('#pbUploadAnexo').attr('aria-valuenow', '0%');
                        $('#pbUploadAnexo').css('width', '0%');
                    }
                }
            }, false);
            return xhr;
        }
    }).done(function (data) {
        $('#lblStatus').html('<i>Subido correctamente.</i>');
        $('#pbUploadAnexo').attr('aria-valuenow', '0%');
        $('#pbUploadAnexo').css('width', '0%');
        cargarUploadProyectos(idproyecto);
    }).fail(function (ort, rt, qrt) {
        $('#lblStatus').html('<i>Un error ha ocurrido.</i>');
        $('#pbUploadAnexo').attr('aria-valuenow', '0%');
        $('#pbUploadAnexo').css('width', '0%');
        cargarUploadProyectos(idproyecto);
    });
}

function eiminar_anexos_proyecto(idUpload, idproyecto) {
    var data = new FormData();
    data.append('OP', 'ELIMINAR');
    data.append('IDUPLOAD_PROYECTO', idUpload);
    console.log(data);
    $.ajax({
        url: '../response/upload_anexo_proyecto.ashx',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {
            
        }
    }).done(function (data) {
        if (data.result != 'success') {
            alert('Un error ah ocurrido: ' + data.message);
        } else {
            cargarUploadProyectos(idproyecto);
        }
    }).fail(function (ort, rt, qrt) {
        alert('Un error ah ocurrido: ' + rt);
        cargarUploadProyectos(idproyecto);
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function modificar_estado(id, estado) {
    var query = 'IDPROYECTO=' + id +
       '&ESTADO=' + estado;;
    $.ajax({
        url: 'proyecto_frmMantenimientoProyecto.aspx/modificar_estado',
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
            $('#modal_mensaje').modal('toggle');
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|El registro fue modificado correctamente.');
            $('#modal_mensaje').modal('toggle');
            var actualIndex = $('#paginacionFoot').pagination('getCurrentPage');
            buscar(actualIndex, 10);
            console.log(actualIndex);
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
    });
}