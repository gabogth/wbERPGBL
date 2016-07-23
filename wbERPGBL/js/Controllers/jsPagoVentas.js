var ID;
$(function () {
    initializeComponents();
    $('#btnInsertar').unbind();
    $('#btnInsertar').on('click', function (ex) {
        $('#modal_insertar_titulo').html('Insertar');
        $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
        $('#btnGuardar').attr('disabled', false);
        $('#btnCancelar').attr('disabled', false);
        $('#modalInsertar').modal('show');
        clearInputs();
        $('#btnGuardar').unbind();
        $('#btnGuardar').on('click', function () {
                console.log($('#cbCuentaCorriente').val());
            $('#frmInsertar').unbind();
            $('#frmInsertar').submit(function (e) {
                e.preventDefault();
                insertar();
            });
        });
        ex.preventDefault();
    });
    $('#txtMonto').autoNumeric('init', {
        aSep: '',
        aDec: '.',
        aSign: 'S/. '
    });
});

function clearInputs() {
    $('#frmInsertar input').each(function (index, item) {
        $(item).val('');
    });
    $('#frmInsertar textarea').each(function (index, item) {
        $(item).val('');
    });
    $('#dtpFechaPago').val(moment().format('YYYY-MM-DD'));
}

function establecerData(data) {
    $('#dtpFechaPago').val(data.PAGOVENTAS_FECHAPAGO.split('T')[0]);
    $('#cbTipoPago').empty().append('<option value="' + data.PAGOVENTAS_IDTIPOPAGO + '">' + data.PAGOVENTAS_TIPOPAGO + '</option>').val(data.PAGOVENTAS_IDTIPOPAGO).trigger('change');
    $('#txtCodigo').val(data.PAGOVENTAS_CODIGOREFERENCIA);
    $('#cbCuentaCorriente').empty().append('<option value="' + data.PAGOVENTAS_IDCUENTACORRIENTE + '">' + data.PAGOVENTAS_CUENTACORRIENTE_NOMBRECUENTA + '</option>').val(data.PAGOVENTAS_IDCUENTACORRIENTE).trigger('change');
    $('#txtMonto').val(data.PAGOVENTAS_MONTOPAGO);
    $('#txtDescripcion').val(data.PAGOVENTAS_DESCRIPCION);
    $('#ckVerificada').iCheck(data.PAGOVENTAS_VERIFICADA == 1 ? 'check' : 'uncheck');
    
}

function cargarTipoPago() {
    $('#cbTipoPago').select2({
        theme: "themes-dark",
        ajax: {
            url: 'tipoPago_frmMantenimientoTipoPago.aspx/buscar_estado',
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
                    datos[i].id = datos[i].idtipo_pago;
                    datos[i].text = datos[i].tipo_pago;
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

function cargarCuentasCorrientes() {
    $('#cbCuentaCorriente').select2({
        theme: "themes-dark",
        allowClear: true,
        placeholder: "En blanco en caso de no ser a una cta. corriente.",
        ajax: {
            url: 'cuentascorrientes_frmMantenimientoCuentasCorrientes.aspx/buscar_estado_moneda',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'GET',
            data: function (params) {
                if (params == null) {
                    return 'q=""&index=1&cantidad=10&idmoneda=' + $('#txtIDMoneda').val();
                } else {
                    return 'q="' + (params.term == null ? '' : params.term) + '"&index=' + 1 + '&cantidad=' + 10 + '&idmoneda=' + $('#txtIDMoneda').val();
                }
            },
            processResults: function (data, page) {
                var datos = jQuery.parseJSON(data.d);
                datos = datos.body;
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idcuenta_corriente;
                    datos[i].text = datos[i].nombre_cuenta;
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
    $('#cbCuentaCorriente').on("select2:select", function (e) {
        
        $('#txtMonto').autoNumeric('update', {
            aSep: '',
            aDec: '.',
            aSign: e.params.data.MONEDA_SIMBOLO + ' '
        });
    });
    $('#cbCuentaCorriente').on("select2:unselect", function (e) {
        
        $('#txtMonto').autoNumeric('update', {
            aSep: '',
            aDec: '.',
            aSign: 'S/. '
        });
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

function initializeComponents() {
    ID = utilClass.getUrlParameter('ID');
    buscar(ID);
    cargarTipoPago();
    cargarCuentasCorrientes();
}

function buscar(id) {
    var query = 'IDVENTAS_CABECERA=' + id;
    $.ajax({
        url: 'pagoVentas_frmPagoVentas.aspx/buscar',
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
            var montoTotal = 0.00;
            if (jsonData.body != null) {
                $.each(jsonData.body, function (index, item) {
                    bodyTable = '';
                    bodyTable += '<tr><td>' + (index + 1) + '</td>';
                    bodyTable += '<td>' + item.PAGOVENTAS_FECHAPAGO.split('T')[0] + '</td>';
                    bodyTable += '<td>' + item.PAGOVENTAS_TIPOPAGO + '</td>';
                    bodyTable += item.PAGOVENTAS_IDCUENTACORRIENTE != null ? ('<td>' + item.PAGOVENTAS_EMPRESA_CUENTACORRIENTE_ALIAS + '-' + item.PAGOVENTAS_CUENTACORRIENTE_NOMBRECUENTA + '</td>') : '<td>No especifica.</td>';
                    bodyTable += '<td>' + item.PAGOVENTAS_CODIGOREFERENCIA + '</td>';
                    bodyTable += '<td>' + item.PAGOVENTAS_MONEDA_MONEDA + '</td>';
                    bodyTable += '<td class="text-right">' + item.PAGOVENTAS_MONTOPAGO.toFixed(2) + '</td>';
                    bodyTable += '<td class="text-center">' + getStateIcon(item.PAGOVENTAS_VERIFICADA, 'estado' + item.PAGOVENTAS_IDPAGOVENTAS) + '</td>';
                    bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.PAGOVENTAS_IDPAGOVENTAS + '"></span></td>';
                    bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.PAGOVENTAS_IDPAGOVENTAS + '"></span></td></tr>';
                    $('#tbl_body').append(bodyTable);
                    montoTotal += item.PAGOVENTAS_MONTOPAGO;
                    bodyTable = '';
                    $('#modificar' + item.PAGOVENTAS_IDPAGOVENTAS).unbind();
                    $('#modificar' + item.PAGOVENTAS_IDPAGOVENTAS).on('click', function () {
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
                                modificar(item.PAGOVENTAS_IDPAGOVENTAS);
                            });
                        });
                    });
                    $('#eliminar' + item.PAGOVENTAS_IDPAGOVENTAS).unbind();
                    $('#eliminar' + item.PAGOVENTAS_IDPAGOVENTAS).on('click', function () {
                        $('#btn_mensaje_aceptar').attr('disabled', false);
                        $('#btn_mensaje_cancelar').attr('disabled', false);
                        $('#modal_titulo_mensaje').html('Advertencia');
                        $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.PAGOVENTAS_VENTAS_EMPRESA_ALIAS + '-' + item.PAGOVENTAS_VENTAS_SERIE_SERIE + '-' + item.PAGOVENTAS_VENTAS_CORRELATIVO + '</b> permanentemente?');
                        $('#modal_mensaje').modal('show');
                        $('#btn_mensaje_aceptar').unbind();
                        $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                        $('#btn_mensaje_aceptar').on('click', function () {
                            eliminar(item.PAGOVENTAS_IDPAGOVENTAS);
                        });
                    });
                    $('#estado' + item.PAGOVENTAS_IDPAGOVENTAS).unbind();
                    $('#estado' + item.PAGOVENTAS_IDPAGOVENTAS).on('click', function () {
                        $('#btn_mensaje_aceptar').attr('disabled', false);
                        $('#btn_mensaje_cancelar').attr('disabled', false);
                        $('#modal_titulo_mensaje').html('Advertencia');
                        $('#cuerpo_mensaje').html('¿Está seguro que desea cambiar el estado de <b>' + item.PAGOVENTAS_VENTAS_EMPRESA_ALIAS + '-' + item.PAGOVENTAS_VENTAS_SERIE_SERIE + '-' + item.PAGOVENTAS_VENTAS_CORRELATIVO + '</b>?');
                        $('#modal_mensaje').modal('show');
                        $('#btn_mensaje_aceptar').unbind();
                        $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
                        $('#btn_mensaje_aceptar').on('click', function () {
                            modificar_estado(item.PAGOVENTAS_IDPAGOVENTAS, Math.abs(item.PAGOVENTAS_VERIFICADA - 1));
                        });
                    });
                });
                var monto = parseFloat($('#txtMontoFact').val());
                var montoRestante = monto - montoTotal;
                var porcentaje = montoTotal * 100 / monto;
                $('#txtTotal').html(montoTotal.toFixed(2));
                $('#lblMontoPagado').html('<b>Monto Cancelado: </b>' + montoTotal.toFixed(2));
                $('#lblMontoRestante').html('<b>Monto Restante: </b>' + montoRestante.toFixed(2) + ': [' + porcentaje.toFixed(2) + '%]');
            } else {
                var monto = parseFloat($('#txtMontoFact').val());
                var montoRestante = monto - montoTotal;
                var porcentaje = montoTotal * 100 / monto;
                $('#txtTotal').html(montoTotal.toFixed(2));
                $('#lblMontoPagado').html('<b>Monto Cancelado: </b>' + montoTotal.toFixed(2));
                $('#lblMontoRestante').html('<b>Monto Restante: </b>' + montoRestante.toFixed(2) + ': [' + porcentaje.toFixed(2) + '%]');
                $('#tbl_body').html('<tr><td colspan="14" class="text-center">No hay datos coincidentes.</td></tr>');
            }
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
    });
}

function getStateIcon(data, id) {
    if (data == 1) {
        return '<span class="fa fa-check" style="cursor: pointer;" id="' + id + '"></span>';
    } else {
        return '<span class="fa fa-times" style="cursor: pointer;" id="' + id + '"></span>';
    }
}

function modificar(id) {
    var query = 'IDPAGO_VENTAS=' + id +
    '&FECHA_PAGO="' + encodeURIComponent($('#dtpFechaPago').val()) + '"' +
    '&MONTO_PAGO=' + encodeURIComponent($('#txtMonto').autoNumeric('get')) +
    '&IDTIPO_PAGO=' + encodeURIComponent($('#cbTipoPago').val()) +
    '&CODIGO_REFERENCIA="' + encodeURIComponent($('#txtCodigo').val()) + '"' +
    '&IDCUENTA_CORRIENTE=' + encodeURIComponent($('#cbCuentaCorriente').val()) +
    '&IDMONEDA=' + encodeURIComponent($('#txtIDMoneda').val()) +
    '&VERIFICADA=' + encodeURIComponent($('#ckVerificada').is(':checked') ? '1' : '0') +
    '&IDVENTAS_CABECERA=' + encodeURIComponent(ID) +
    '&DESCRIPCION="' + encodeURIComponent($('#txtDescripcion').val()) + '"';

    $.ajax({
        url: 'pagoVentas_frmPagoVentas.aspx/modificar',
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
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modalInsertar').modal('toggle');
    }).always(function (ort, rt, qrt) {
        buscar(ID);
    });
}

function insertar() {
    var query = 'FECHA_PAGO="' + encodeURIComponent($('#dtpFechaPago').val()) + '"' +
    '&MONTO_PAGO=' + encodeURIComponent($('#txtMonto').autoNumeric('get')) +
    '&IDTIPO_PAGO=' + encodeURIComponent($('#cbTipoPago').val()) +
    '&CODIGO_REFERENCIA="' + encodeURIComponent($('#txtCodigo').val()) + '"' +
    '&IDCUENTA_CORRIENTE=' + encodeURIComponent($('#cbCuentaCorriente').val()) +
    '&IDMONEDA=' + encodeURIComponent($('#txtIDMoneda').val()) +
    '&VERIFICADA=' + encodeURIComponent($('#ckVerificada').is(':checked') ? '1' : '0') +
    '&IDVENTAS_CABECERA=' + encodeURIComponent(ID) +
    '&DESCRIPCION="' + encodeURIComponent($('#txtDescripcion').val()) + '"';

    $.ajax({
        url: 'pagoVentas_frmPagoVentas.aspx/insertar',
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
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modalInsertar').modal('toggle');
    }).always(function (ort, rt, qrt) {
        buscar(ID);
    });
}

function eliminar(id) {
    var query = 'IDPAGO_VENTAS=' + id;
    $.ajax({
        url: 'pagoVentas_frmPagoVentas.aspx/eliminar',
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
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
    }).always(function (ort, rt, qrt) {
        buscar(ID);
    });
}

function modificar_estado(id, estado) {
    var query = 'IDPAGO_VENTAS=' + id +
       '&ESTADO=' + estado;;
    $.ajax({
        url: 'pagoVentas_frmPagoVentas.aspx/modificar_estado',
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
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
    }).always(function (ort, rt, qrt) {
        buscar(ID);
    });
}