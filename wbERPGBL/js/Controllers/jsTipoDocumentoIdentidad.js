﻿$(function () {
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
    $('#txtTipoDocumento').val(data.tipo_documento_identidad);
    $('#txtAbreviacion').val(data.abreviacion);
    $('#txtCodigo').val(data.codigo);
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
}

function buscar(indexPag, cantidad) {
    var query = 'q="' + $('#txtBuscar').val() + '"&index=' + indexPag + '&cantidad=' + cantidad;
    $.ajax({
        url: 'tipodocumentoidentidad_frmMantenimientoTipoDocumentoIdentidad.aspx/buscar',
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
                bodyTable += '<td>' + item.tipo_documento_identidad + '</td>';
                bodyTable += '<td>' + item.abreviacion + '</td>';
                bodyTable += '<td>' + item.codigo + '</td>';
                bodyTable += '<td class="text-center">' + getStateIcon(item.estado, 'estado' + item.idtipo_documento) + '</td>';
                bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idtipo_documento + '"></span></td>';
                bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idtipo_documento + '"></span></td></tr>';
                $('#tbl_body').append(bodyTable);
                bodyTable = '';
                $('#modificar' + item.idtipo_documento).unbind();
                $('#modificar' + item.idtipo_documento).on('click', function () {
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
                            modificar(item.idtipo_documento);
                        });
                    });
                });
                $('#eliminar' + item.idtipo_documento).unbind();
                $('#eliminar' + item.idtipo_documento).on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.tipo_documento_identidad + '</b> permanentemente?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        eliminar(item.idtipo_documento);
                    });
                });
                $('#estado' + item.idtipo_documento).unbind();
                $('#estado' + item.idtipo_documento).on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea cambiar el estado de <b>' + item.tipo_documento_identidad + '</b>?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        modificar_estado(item.idtipo_documento, Math.abs(item.estado - 1));
                    });
                });

            });
            $('#paginacionFoot').pagination('updateItems', jsonData.registros);
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
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
    var query = 'IDTIPO_DOCUMENTO=' + id +
        '&CODIGO="' + encodeURIComponent($('#txtCodigo').val()) + '"' +
        '&TIPO_DOCUMENTO_IDENTIDAD="' + encodeURIComponent($('#txtTipoDocumento').val()) + '"' +
        '&ABREVIACION="' + encodeURIComponent($('#txtAbreviacion').val()) + '"';

    $.ajax({
        url: 'tipodocumentoidentidad_frmMantenimientoTipoDocumentoIdentidad.aspx/modificar',
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
        $('#modal_mensaje').modal('toggle');
    });
}

function insertar() {
    var query = 'CODIGO="' + encodeURIComponent($('#txtCodigo').val()) + '"' +
        '&TIPO_DOCUMENTO_IDENTIDAD="' + encodeURIComponent($('#txtTipoDocumento').val()) + '"' +
        '&ABREVIACION="' + encodeURIComponent($('#txtAbreviacion').val()) + '"';

    $.ajax({
        url: 'tipodocumentoidentidad_frmMantenimientoTipoDocumentoIdentidad.aspx/insertar',
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
        $('#modal_mensaje').modal('toggle');
    });
}

function eliminar(id) {
    var query = 'IDTIPO_DOCUMENTO=' + id;
    $.ajax({
        url: 'tipodocumentoidentidad_frmMantenimientoTipoDocumentoIdentidad.aspx/eliminar',
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
    var query = 'IDTIPO_DOCUMENTO=' + id +
       '&ESTADO=' + estado;;
    $.ajax({
        url: 'tipodocumentoidentidad_frmMantenimientoTipoDocumentoIdentidad.aspx/modificar_estado',
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