$(function () {
    initializeComponents();
    $('#txtFijo').autoNumeric('init');
    $('#txtPorcentaje').autoNumeric('init');
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
    $('#cbTipo').on('change', function () {
        if ($('#cbTipo').val() == 0) {
            $('#dvPorcentaje').hide();
            $('#dvFijo').show();
            $('#txtFijo').attr('required', true);
            $('#txtPorcentaje').attr('required', false);
        } else {
            $('#dvPorcentaje').show();
            $('#dvFijo').hide();
            $('#txtFijo').attr('required', false);
            $('#txtPorcentaje').attr('required', true);
        }
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
    $('#cbTipo').val(data.es_porcentaje);
    if (data.es_porcentaje == 0) {
        $('#dvFijo').show();
        $('#txtFijo').val(data.fijo);
        $('#txtFijo').attr('required', true);
        $('#dvPorcentaje').hide();
        $('#txtPorcentaje').val(data.porcentaje);
        $('#txtPorcentaje').attr('required', false);
    } else {
        $('#dvFijo').hide();
        $('#txtFijo').val(data.fijo);
        $('#txtFijo').attr('required', false);
        $('#dvPorcentaje').show();
        $('#txtPorcentaje').val(data.porcentaje);
        $('#txtPorcentaje').attr('required', true);
    }
    $('#txtDetalle').val(data.detalle);
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
    $.ajax({
        url: 'asignacionFamiliar_frmMantenimientoAsignacionFamiliar.aspx/buscar',
        type: "POST",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ "q": $('#txtBuscar').val(), "index": indexPag, "cantidad": cantidad }),
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
            if (jsonData.registros > 0) {
                showTableHTML(jsonData.body, indexPag, cantidad);
            } else {
                $('#tbl_body').html('<tr><td colspan="14" class="text-center">No hay resultados.</td></tr>');
            }
            $('#paginacionFoot').pagination('updateItems', jsonData.registros);
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
    });
}

function showTableHTML(data, indexPag, cantidad) {
    var bodyTable = '';
    $.each(data, function (index, item) {
        bodyTable = '';
        bodyTable += '<tr><td>' + (((indexPag - 1) * cantidad) + index + 1) + '</td>';
        bodyTable += '<td>' + item.detalle + '</td>';
        bodyTable += '<td>' + (item.es_porcentaje == 1 ? 'Porcentaje' : 'Fijo') + '</td>';
        bodyTable += '<td>' + (item.es_porcentaje == 1 ? (item.porcentaje.toFixed(2) + ' %') : ('S/. ' + item.fijo.toFixed(2))) + '</td>';
        bodyTable += '<td class="text-center">' + getStateIcon(item.estado, 'estado' + item.idasignacion_familiar) + '</td>';
        bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idasignacion_familiar + '"></span></td>';
        bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idasignacion_familiar + '"></span></td></tr>';
        $('#tbl_body').append(bodyTable);
        bodyTable = '';
        $('#modificar' + item.idasignacion_familiar).unbind();
        $('#modificar' + item.idasignacion_familiar).on('click', function () {
            establecerData(item);
            $('#modal_insertar_titulo').html('MODIFICAR' + item.detalle);
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    modificar(item.idasignacion_familiar);
                });
            });
        });
        $('#eliminar' + item.idasignacion_familiar).unbind();
        $('#eliminar' + item.idasignacion_familiar).on('click', function () {
            $('#btn_mensaje_aceptar').attr('disabled', false);
            $('#btn_mensaje_cancelar').attr('disabled', false);
            $('#modal_titulo_mensaje').html('Advertencia');
            $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.detalle + '</b> permanentemente?');
            $('#modal_mensaje').modal('show');
            $('#btn_mensaje_aceptar').unbind();
            $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
            $('#btn_mensaje_aceptar').on('click', function () {
                eliminar(item.idasignacion_familiar);
            });
        });
        $('#estado' + item.idasignacion_familiar).unbind();
        $('#estado' + item.idasignacion_familiar).on('click', function () {
            $('#btn_mensaje_aceptar').attr('disabled', false);
            $('#btn_mensaje_cancelar').attr('disabled', false);
            $('#modal_titulo_mensaje').html('Advertencia');
            $('#cuerpo_mensaje').html('¿Está seguro que desea modificar el estado de <b>' + item.detalle + '</b> permanentemente?');
            $('#modal_mensaje').modal('show');
            $('#btn_mensaje_aceptar').unbind();
            $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
            $('#btn_mensaje_aceptar').on('click', function () {
                modificar_estado(item.idasignacion_familiar, Math.abs(item.estado - 1));
            });
        });
    });
}

function getStateIcon(data, id) {
    if (data == 1) {
        return '<span class="fa fa-circle-o text-success" style="cursor: pointer;" id="' + id + '"></span>';
    } else {
        return '<span class="fa fa-circle-o text-danger" style="cursor: pointer;" id="' + id + '"></span>';
    }
}

function insertar() {
    var formData = $('#frmInsertar').serializeJSON();
    $.ajax({
        url: 'asignacionFamiliar_frmMantenimientoAsignacionFamiliar.aspx/insertar',
        type: "POST",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(formData),
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
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
    });
}

function modificar(id) {
    var formData = $('#frmInsertar').serializeJSON();
    formData["ID"] = id;
    $.ajax({
        url: 'asignacionFamiliar_frmMantenimientoAsignacionFamiliar.aspx/modificar',
        type: "POST",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(formData),
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
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
    });
}

function modificar_estado(id, estado) {
    $.ajax({
        url: 'asignacionFamiliar_frmMantenimientoAsignacionFamiliar.aspx/modificar_estado',
        type: "POST",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: '{"ID": ' + id + ', "ESTADO": ' + estado + '}',
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
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
    });
}

function eliminar(id) {
    $.ajax({
        url: 'asignacionFamiliar_frmMantenimientoAsignacionFamiliar.aspx/eliminar',
        type: "POST",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: '{"ID": ' + id + '}',
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
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
    });
}