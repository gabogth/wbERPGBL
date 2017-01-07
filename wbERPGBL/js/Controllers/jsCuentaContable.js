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
    $('#txtNombreCuenta').val(data.nombre_cuenta);
    $('#txtCuenta').val(data.CUENTA);
    $('#cbTipoCuenta').empty().append('<option value="' + data.idtipo_cuenta_contable + '">' + data.tipo_cuenta + '</option>').val(data.idtipo_cuenta_contable).trigger('change');
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
    cargarTipoCuenta();
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
        url: 'cuentaContable_frmMantenimientoCuentaContable.aspx/buscar',
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
        bodyTable += '<td>' + item.CUENTA + '</td>';
        bodyTable += '<td>' + item.nombre_cuenta + '</td>';
        bodyTable += '<td>' + item.tipo_cuenta + '</td>';
        bodyTable += '<td class="text-center">' + getStateIcon(item.estado, 'estado' + item.idcuenta_contable) + '</td>';
        bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idcuenta_contable + '"></span></td>';
        bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idcuenta_contable + '"></span></td></tr>';
        $('#tbl_body').append(bodyTable);
        bodyTable = '';
        $('#modificar' + item.idcuenta_contable).unbind();
        $('#modificar' + item.idcuenta_contable).on('click', function () {
            establecerData(item);
            $('#modal_insertar_titulo').html('MODIFICAR ' + item.nombre_cuenta);
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    modificar(item.idcuenta_contable);
                });
            });
        });
        $('#eliminar' + item.idcuenta_contable).unbind();
        $('#eliminar' + item.idcuenta_contable).on('click', function () {
            $('#btn_mensaje_aceptar').attr('disabled', false);
            $('#btn_mensaje_cancelar').attr('disabled', false);
            $('#modal_titulo_mensaje').html('Advertencia');
            $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.nombre_cuenta + '</b> permanentemente?');
            $('#modal_mensaje').modal('show');
            $('#btn_mensaje_aceptar').unbind();
            $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
            $('#btn_mensaje_aceptar').on('click', function () {
                eliminar(item.idcuenta_contable);
            });
        });
        $('#estado' + item.idcuenta_contable).unbind();
        $('#estado' + item.idcuenta_contable).on('click', function () {
            $('#btn_mensaje_aceptar').attr('disabled', false);
            $('#btn_mensaje_cancelar').attr('disabled', false);
            $('#modal_titulo_mensaje').html('Advertencia');
            $('#cuerpo_mensaje').html('¿Está seguro que desea modificar el estado de <b>' + item.nombre_cuenta + '</b> permanentemente?');
            $('#modal_mensaje').modal('show');
            $('#btn_mensaje_aceptar').unbind();
            $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
            $('#btn_mensaje_aceptar').on('click', function () {
                modificar_estado(item.idcuenta_contable, Math.abs(item.estado - 1));
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
        url: 'cuentaContable_frmMantenimientoCuentaContable.aspx/insertar',
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
        url: 'cuentaContable_frmMantenimientoCuentaContable.aspx/modificar',
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
        url: 'cuentaContable_frmMantenimientoCuentaContable.aspx/modificar_estado',
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
        url: 'cuentaContable_frmMantenimientoCuentaContable.aspx/eliminar',
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

function cargarTipoCuenta() {
    $('#cbTipoCuenta').select2({
        
        ajax: {
            url: 'tipoCuenta_frmMantenimientoTipoCuenta.aspx/buscar_estado',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            data: function (params) {
                if (params == null) {
                    return JSON.stringify({ q: '', index: 1, cantidad: 10 });
                } else {
                    return JSON.stringify({ q: (params.term == null ? '' : params.term), index: 1, cantidad: 10 });
                }
            },
            processResults: function (data, page) {
                var datos = jQuery.parseJSON(data.d);
                datos = datos.body;
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idtipo_cuenta_contable;
                    datos[i].text = datos[i].tipo_cuenta;
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