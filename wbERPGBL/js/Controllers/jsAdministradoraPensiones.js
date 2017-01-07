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
    $('#txtAdministradora').val(data.administradora_pension);
    $('#txtCodigo').val(data.codigo);
    $('#cbSistema').empty().append('<option value="' + data.idsistema_pension + '">' + data.sistema_pension + '</option>').val(data.idsistema_pension).trigger('change');
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
    cargarSistemaPensiones();
}

function cargarSistemaPensiones() {
    $('#cbSistema').select2({
        
        ajax: {
            url: 'sistema_pensiones_frmMantenimientoSistemaPensiones.aspx/buscar',
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
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idsistema_pension;
                    datos[i].text = datos[i].sistema_pension;
                }
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
        url: 'administradorapensiones_frmAdministradoraPensiones.aspx/buscar',
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
            if (jsonData.body != null) {
                $.each(jsonData.body, function (index, item) {
                    bodyTable = '';
                    bodyTable += '<tr><td>' + (((indexPag - 1) * cantidad) + index + 1) + '</td>';
                    bodyTable += '<td>' + item.administradora_pension + '</td>';
                    bodyTable += '<td>' + item.sistema_pension + '</td>';
                    bodyTable += '<td>' + item.codigo + '</td>';
                    bodyTable += '<td class="text-center">' + getStateIcon(item.estado, 'estado' + item.idadministradora_pension) + '</td>';
                    bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idadministradora_pension + '"></span></td>';
                    bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idadministradora_pension + '"></span></td></tr>';
                    $('#tbl_body').append(bodyTable);
                    bodyTable = '';
                    $('#modificar' + item.idadministradora_pension).unbind();
                    $('#modificar' + item.idadministradora_pension).on('click', function () {
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
                                modificar(item.idadministradora_pension);
                            });
                        });
                    });
                    $('#eliminar' + item.idadministradora_pension).unbind();
                    $('#eliminar' + item.idadministradora_pension).on('click', function () {
                        $('#btn_mensaje_aceptar').attr('disabled', false);
                        $('#btn_mensaje_cancelar').attr('disabled', false);
                        $('#modal_titulo_mensaje').html('Advertencia');
                        $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.administradora_pension + '</b> permanentemente?');
                        $('#modal_mensaje').modal('show');
                        $('#btn_mensaje_aceptar').unbind();
                        $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                        $('#btn_mensaje_aceptar').on('click', function () {
                            eliminar(item.idadministradora_pension);
                        });
                    });
                    $('#estado' + item.idadministradora_pension).unbind();
                    $('#estado' + item.idadministradora_pension).on('click', function () {
                        $('#btn_mensaje_aceptar').attr('disabled', false);
                        $('#btn_mensaje_cancelar').attr('disabled', false);
                        $('#modal_titulo_mensaje').html('Advertencia');
                        $('#cuerpo_mensaje').html('¿Está seguro que desea cambiar el estado de <b>' + item.administradora_pension + '</b>?');
                        $('#modal_mensaje').modal('show');
                        $('#btn_mensaje_aceptar').unbind();
                        $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
                        $('#btn_mensaje_aceptar').on('click', function () {
                            modificar_estado(item.idadministradora_pension, Math.abs(item.estado - 1));
                        });
                    });

                });
            } else {
                $('#tbl_body').html('<tr><td colspan="14" class="text-center">No hay datos coincidentes.</td></tr>');
            }
            $('#paginacionFoot').pagination('updateItems', jsonData.registros);
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
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
    var query = 'IDADMINISTRADORA_PENSION=' + id +
        '&ADMINISTRADORA_PENSION="' + encodeURIComponent($('#txtAdministradora').val()) + '"' +
        '&CODIGO="' + encodeURIComponent($('#txtCodigo').val()) + '"' +
        '&IDSISTEMA_PENSION=' + encodeURIComponent($('#cbSistema').val());

    $.ajax({
        url: 'administradorapensiones_frmAdministradoraPensiones.aspx/modificar',
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
    var query = 'ADMINISTRADORA_PENSION="' + encodeURIComponent($('#txtAdministradora').val()) + '"' +
        '&CODIGO="' + encodeURIComponent($('#txtCodigo').val()) + '"' +
        '&IDSISTEMA_PENSION=' + encodeURIComponent($('#cbSistema').val());

    $.ajax({
        url: 'administradorapensiones_frmAdministradoraPensiones.aspx/insertar',
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
    var query = 'IDADMINISTRADORA_PENSION=' + id;
    $.ajax({
        url: 'administradorapensiones_frmAdministradoraPensiones.aspx/eliminar',
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

function modificar_estado(id, estado) {
    var query = 'IDADMINISTRADORA_PENSION=' + id +
       '&ESTADO=' + estado;;
    $.ajax({
        url: 'administradorapensiones_frmAdministradoraPensiones.aspx/modificar_estado',
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