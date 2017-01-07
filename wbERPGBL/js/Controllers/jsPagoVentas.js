$(function () {
    initializeComponents();
});

function clearInputs() {
    $('#dtpFechaPago').val(moment().format('YYYY-MM-DD'));
    setSelect2('#cbTipoPago', null, null);
    setSelect2('#cbCuentaCorriente', null, null);
    $('#txtMonto').val('');
    $('#txtChecke').val('');
    $('#txtOperacion').val('');
    $('#txtDescripcion').val('');
}

function cargarTipoPago() {
    $('#cbTipoPago').select2({
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
                if (datos != null && datos.length > 0) {
                    for (var i = 0; i < datos.length; i++) {
                        datos[i].id = datos[i].idtipo_pago;
                        datos[i].text = datos[i].tipo_pago;
                    }
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
    $('#cbTipoPago').on("select2:select", function (e) {
        if ($(this).select2('data')[0].requiere_cheque == "1") {
            $('#dvCheque').show();
            $('#txtChecke').attr('required', true);
        } else {
            $('#dvCheque').hide();
            $('#txtChecke').attr('required', false);
        }
        if ($(this).select2('data')[0].requiere_op == "1") {
            $('#dvOp').show();
            $('#txtOperacion').attr('required', true);
        } else {
            $('#dvOp').hide();
            $('#txtOperacion').attr('required', false);
        }
    });
    $('#cbTipoPago').on("select2:unselect", function (e) {
        $('#dvCheque').hide();
        $('#txtChecke').attr('required', false);
        $('#dvOp').hide();
        $('#txtOperacion').attr('required', false);
    });
}

function cargarCuentaCorriente() {
    $('#cbCuentaCorriente').select2({
        ajax: {
            url: 'cuentascorrientes_frmMantenimientoCuentasCorrientes.aspx/buscar_estado_moneda_empresa',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'GET',
            data: function (params) {
                if (params == null) {
                    return 'q=""&index=1&cantidad=10&idmoneda=' + $('#txtIDMoneda').val() + '&idempresa=' + $('#txtIDEmpresa').val();
                } else {
                    return 'q="' + (params.term == null ? '' : params.term) + '"&index=1&cantidad=10&idmoneda=' + $('#txtIDMoneda').val() + '&idempresa=' + $('#txtIDEmpresa').val();
                }
            },
            processResults: function (data, page) {
                var datos = jQuery.parseJSON(data.d);
                datos = datos.body;
                if (datos != null && datos.length > 0) {
                    for (var i = 0; i < datos.length; i++) {
                        datos[i].id = datos[i].idcuenta_corriente;
                        datos[i].text = datos[i].nombre_cuenta;
                    }
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

function establecerData(data) {
    $('#dtpFechaPago').val(moment(data.fecha_pago).format('YYYY-MM-DD'));
    setSelect2('#cbTipoPago', data.idtipo_pago, data.tipo_pago);
    setSelect2('#cbCuentaCorriente', data.idcuenta_corriente, data.nombre_cuenta);
    $('#txtMonto').val(data.monto_pago.toFixed(2));
    $('#txtChecke').val(data.cheque);
    $('#txtOperacion').val(data.nro_op);
    $('#txtDescripcion').val(data.descripcion);
    if (data.requiere_cheque == "1") {
        $('#dvCheque').show();
        $('#txtChecke').attr('required', true);
    } else {
        $('#dvCheque').hide();
        $('#txtChecke').attr('required', false);
    }
    if (data.requiere_op == "1") {
        $('#dvOp').show();
        $('#txtOperacion').attr('required', true);
    } else {
        $('#dvOp').hide();
        $('#txtOperacion').attr('required', false);
    }
}

function setSelect2(div, id, value) {
    $(div).empty().append('<option value="' + id + '">' + value + '</option>').val(id).trigger('change');
}

function initializeComponents() {
    $('#txtMonto').autoNumeric('init');
    cargarTipoPago();
    cargarCuentaCorriente();
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
    buscar();
}

function buscar() {
    $.ajax({
        url: 'pagoVentas_frmPagoVentas.aspx/buscar',
        type: "POST",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ 'IDVENTAS_CABECERA': parseInt(utilClass.getUrlParameter('ID')) }),
        beforeSend: function () {
            $('#tbl_body').html('<tr><td colspan="14" class="text-center"><span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;&nbsp;Procesando...</td></tr>');
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
        } else {
            $('#tbl_body').html('');
            if (jsonData.registros > 0) {
                showTableHTML(jsonData.body);
            } else {
                $('#tbl_body').html('<tr><td colspan="14" class="text-center">No hay resultados.</td></tr>');
            }
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modalInsertar').modal('toggle');
    });
}

function showTableHTML(data) {
    var bodyTable = '';
    var montoTotalCancelado = 0.00;
    var montoTotalCanceladoCambio = 0.00;
    $.each(data, function (index, item) {
        bodyTable = '';
        bodyTable += '<tr><td class="text-center">' + (index + 1) + '</td>';
        bodyTable += '<td class="text-center">' + moment(item.fecha_pago).format('DD-MM-YYYY') + '</td>';
        bodyTable += '<td>' + item.nombre_cuenta + '</td>';
        bodyTable += '<td title="' + item.tipo_pago + '">' + (item.tipo_pago.length > 30 ? item.tipo_pago.substring(0, 29) : item.tipo_pago) + '</td>';
        bodyTable += '<td>' + getText(item.cheque, item.nro_op) + '</td>';
        bodyTable += '<td class="text-right">' + item.simbolo + '</td>';
        bodyTable += '<td class="text-right">' + item.monto_pago.toFixed(2) + '</td>';
        bodyTable += '<td class="text-center">' + (item.local != 1 ? item.venta.toFixed(3) : '<center>-</center>') + '</td>';
        bodyTable += '<td class="text-right">' + (item.local != 1 ? (item.venta * item.monto_pago).toFixed(2) : '<center>-</center>') + '</td>';
        bodyTable += '<td title="' + item.descripcion + '" class="text-left">' + (item.descripcion.length > 30 ? item.descripcion.substring(0, 29) : item.descripcion) + '</td>';
        bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idpago_ventas + '"></span></td>';
        bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idpago_ventas + '"></span></td></tr>';
        $('#tbl_body').append(bodyTable);
        montoTotalCancelado += item.monto_pago;
        montoTotalCanceladoCambio += (item.venta * item.monto_pago);
        bodyTable = '';
        $('#modificar' + item.idpago_ventas).unbind();
        $('#modificar' + item.idpago_ventas).on('click', function () {
            establecerData(item);
            $('#modal_insertar_titulo').html('MODIFICAR ' + moment(item.fecha_pago).format('DD-MM-YYYY'));
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    modificar(item.idpago_ventas);
                });
            });
        });
        $('#eliminar' + item.idpago_ventas).unbind();
        $('#eliminar' + item.idpago_ventas).on('click', function () {
            $('#btn_mensaje_aceptar').attr('disabled', false);
            $('#btn_mensaje_cancelar').attr('disabled', false);
            $('#modal_titulo_mensaje').html('Advertencia');
            $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + moment(item.fecha_pago).format('DD-MM-YYYY') + '</b> permanentemente?');
            $('#modal_mensaje').modal('show');
            $('#btn_mensaje_aceptar').unbind();
            $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
            $('#btn_mensaje_aceptar').on('click', function () {
                eliminar(item.idpago_ventas);
            });
        });
    });
    $('#lblTotalCancelado').html(montoTotalCancelado.toFixed(2));
    $('#lblTotalCanceladoCambio').html($('#txtIsLocal').val() != '1' ? montoTotalCanceladoCambio.toFixed(2) : '<center>-</center>');
    $('#lblTotalRestante').html((parseFloat($('#txtMontoFact').val()) - montoTotalCancelado).toFixed(2));
    var percentComplete = (montoTotalCancelado * 100) / parseFloat($('#txtMontoFact').val());
    percentComplete = parseFloat(percentComplete.toFixed(2));
    $('#lblPorcentaje').html(percentComplete.toFixed(2) + '%');
    $('#pbProgress').css('width', percentComplete + '%').attr('aria-valuenow', percentComplete);
}

function getText(cheque, nro_op) {
    if (cheque == null && nro_op == null)
        return '<center>-</center>';
    else if (cheque != null && nro_op == null)
        return cheque;
    else if (cheque == null && nro_op != null)
        return nro_op;
    else
        return cheque + '/' + nro_op;
}

function insertar() {
    var formData = $('#frmInsertar').serializeJSON();
    formData["txtIDMoneda"] = parseInt($('#txtIDMoneda').val());
    formData["txtChecke"] = $('#dvCheque').is(':visible') ? $('#txtChecke').val() : null;
    formData["txtOperacion"] = $('#dvOp').is(':visible') ? $('#txtOperacion').val() : null;
    formData["IDVENTAS_CABECERA"] = parseInt(utilClass.getUrlParameter('ID'));
    console.log(JSON.stringify(formData));
    $.ajax({
        url: 'pagoVentas_frmPagoVentas.aspx/insertar',
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
            buscar();
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        console.log(ort, rt, qrt);
        $('#modalInsertar').modal('toggle');
    });
}

function modificar(id) {
    var formData = $('#frmInsertar').serializeJSON();
    formData["ID"] = id;
    formData["txtChecke"] = $('#dvCheque').is(':visible') ? $('#txtChecke').val() : null;
    formData["txtOperacion"] = $('#dvOp').is(':visible') ? $('#txtOperacion').val() : null;
    console.log(JSON.stringify(formData));
    $.ajax({
        url: 'pagoVentas_frmPagoVentas.aspx/modificar',
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
            buscar();
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        console.log(ort, rt, qrt);
        $('#modalInsertar').modal('toggle');
    });
}

function eliminar(id) {
    $.ajax({
        url: 'pagoVentas_frmPagoVentas.aspx/eliminar',
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
            buscar();
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        console.log(ort, rt, qrt);
        $('#modal_mensaje').modal('toggle');
    });
}