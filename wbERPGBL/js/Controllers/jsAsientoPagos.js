var myWindow;
var lastItem;
var totalBody = 0;
$(function () {
    cargarCuentas();
    $('#txtMontoDebe, #txtMontoHaber').autoNumeric('init');
    buscar();
    $('#btnInsertar').unbind();
    $('#btnInsertar').on('click', function () {
        $('#dvFechaPago').show();
        $('#dtpFechaPago').attr('required', true);
        $('#txtMontoDebe').val('0.00');
        $('#txtMontoHaber').val('0.00');
        $('#txtGlosa').val('F/' + $('#txtDocumento').val() + ' ' + $('#txtClienteDoc').val());
        $('#modal_insertar_titulo').html('NUEVO ASIENTO MANUAL');
        $('#modalInsertar').modal('show');
        $('#btnGuardar').attr('disabled', false);
        $('#btnCancelar').attr('disabled', false);
        $('#btnGuardar').unbind();
        $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
        $('#btnGuardar').on('click', function () {
            $('#frmInsertar').unbind();
            $('#frmInsertar').submit(function (e) {
                e.preventDefault();
                insertar(null, parseInt(utilClass.getUrlParameter('ID')), moment($('#dtpFechaPago').val()).format('YYYY-MM-DD'), 'ITEM_PAGO_AJUSTE');
            });
        });
    });
});

function cargarCuentas() {
    $('#cbCuentaDebe, #cbCuentaHaber').select2({
        ajax: {
            url: 'cuentaContable_frmMantenimientoCuentaContable.aspx/buscar_estado',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            data: function (params) {
                if (params == null) {
                    return JSON.stringify({ 'q': "", 'index': 1, 'cantidad': 10 });
                } else {
                    return JSON.stringify({ 'q': (params.term == null ? '' : params.term), 'index': 1, 'cantidad': 10 });
                }
            },
            processResults: function (data, page) {
                var datos = jQuery.parseJSON(data.d);
                datos = datos.body;
                if (datos != null && datos.length > 0) {
                    for (var i = 0; i < datos.length; i++) {
                        datos[i].id = datos[i].idcuenta_contable;
                        datos[i].text = datos[i].CUENTA + ' ' + datos[i].nombre_cuenta;
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
        return "<div>Cargando resultados...</div>";
    }
    var markup = '<div>' + e.text + '</div>';
    return markup;
}
function formatRepoSelection(repo) {
    return repo.text || repo.text;
}

function round(n, decimals) {
    return parseFloat(n.toFixed(decimals));
}

function buscar() {
    $.ajax({
        url: 'asientoPagos.aspx/buscar',
        type: "POST",
        dataType: 'json',
        data: JSON.stringify({ ID: utilClass.getUrlParameter('ID') }),
        contentType: "application/json;charset=utf-8",
        beforeSend: function () {
            $('#tbl_body').html('<tr><td colspan="14" class="text-center"><span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;&nbsp;Procesando...</td></tr>');
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        console.log(jsonData);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
        } else {
            $('#tbl_body').html('');
            if (jsonData.registros > 0) {
                showTableHTML(jsonData.body, utilClass.getUrlParameter('ID'));
            } else {
                $('#tbl_body').html('<tr><td colspan="14" class="text-center">No hay resultados.</td></tr>');
            }
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
    });
}

function showTableHTML(data, IDVENTAS) {
    var bodyTable = '';
    var last_iddesglose = 0;
    var counterIndex = 1;
    var totalDebe = 0;
    var totalHaber = 0;
    var lastIDPago = 0;
    $.each(data, function (index, item) {
        lastItem = item;
        bodyTable = '';
        bodyTable += '<tr>';
        if (lastIDPago != item.idpago_ventas) {
            bodyTable += '<td>' + (counterIndex).toString() + '</td>';
            bodyTable += '<td class="text-center">' + (item.fecha_pago != null ? moment(item.fecha_pago).format('DD-MM-YYYY') : moment(item.fecha_asiento).format('DD-MM-YYYY')) + '</td>';
            bodyTable += '<td title="' + item.tipo_pago + '">' + (item.tipo_pago != null ? (item.tipo_pago.length > 30 ? item.tipo_pago.substring(0, 29) : item.tipo_pago): '<center>-</center>') + '</td>';
            bodyTable += '<td class="text-center">' + item.simbolo + '</td>';
            bodyTable += '<td class="text-right">' + (item.idpago_ventas != null ? item.monto_pago.toFixed(2) : '<center>-</center>') + '</td>';
            bodyTable += '<td class="text-center">' + (item.local == 1 ? '-' : item.venta.toFixed(3)) + '</td>';
            counterIndex++;
        } else {
            bodyTable += '<td colspan="6"></td>';
        }
        bodyTable += '<td class="text-left">' + (item.idasiento_contable != null ? ((item.idcuenta_contable_debe != null ? (item.CUENTA_DEBE + ' ' + item.nombre_cuenta_debe) : (item.CUENTA_HABER + ' ' + item.nombre_cuenta_haber))) : '<center>-</center>') + '</td>';
        bodyTable += '<td class="text-right">' + (item.monto_debe != null ? item.monto_debe.format(2, 3, ',', '.') : '<center>-</center>') + '</td>';
        bodyTable += '<td class="text-right">' + (item.monto_haber != null ? item.monto_haber.format(2, 3, ',', '.') : '<center>-</center>') + '</td>';
        if (lastIDPago != item.idpago_ventas) {
            lastIDPago = item.idpago_ventas;
            bodyTable += '<td class="text-left">' + (item.glosa != null ? item.glosa : '<center>-</center>') + '</td>';
            bodyTable += '<td class="text-center"><span class="fa fa-' + (item.idasiento_contable != null ? 'trash-o' : 'plus') + (item.idasiento_contable != null ? ' ' : ' text-success') + '" style="cursor: pointer;" id="' + (item.idasiento_contable != null ? 'eliminar-asiento' : 'agregar-asiento') + '-' + index + '"></span></td>';
            bodyTable += '<td class="text-center"><span class="fa fa-' + (item.idasiento_contable != null ? 'print' : '') + (item.idasiento_contable != null ? ' ' : '') + '" style="cursor: pointer;" id="' + (item.idasiento_contable != null ? 'preview-asiento' : '') + '-' + index + '"></span></td>';
        } else {
            bodyTable += '<td colspan="3"></td>';
        }
        bodyTable += '</tr>';
        totalDebe += item.monto_debe;
        totalHaber += item.monto_haber;
        $('#txtTotalDebe').html(totalDebe.toFixed(2));
        $('#txtTotalHaber').html(totalHaber.toFixed(2));
        $('#tbl_body').append(bodyTable);
        bodyTable = '';
        $('#agregar-asiento-' + index).unbind();
        $('#agregar-asiento-' + index).on('click', function () {
            $('#dvFechaPago').hide();
            $('#dtpFechaPago').attr('required', false);
            $('#txtMontoDebe').val(item.local == 1 ? item.monto_pago.toFixed(2) : (item.venta * item.monto_pago).toFixed(2));
            $('#txtMontoHaber').val(item.local == 1 ? item.monto_pago.toFixed(2) : (item.venta * item.monto_pago).toFixed(2));
            $('#txtGlosa').val('F/' + item.serie + '-' + item.correlativo + ' ' + item.cliente_razon_social);
            $('#modal_insertar_titulo').html('NUEVO ASIENTO DE ' + moment(item.fecha_pago).format('DD-MM-YYYY'));
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    insertar(item.idpago_ventas, parseInt(utilClass.getUrlParameter('ID')), moment(item.fecha_pago).format('YYYY-MM-DD'), 'ITEM_PAGO');
                });
            });
        });
        $('#eliminar-asiento-' + index).unbind();
        $('#eliminar-asiento-' + index).on('click', function () {
            if (item.idasiento_contable != null) {
                $('#btn_mensaje_aceptar').attr('disabled', false);
                $('#btn_mensaje_cancelar').attr('disabled', false);
                $('#modal_titulo_mensaje').html('Advertencia');
                $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar este asiento permanentemente?');
                $('#modal_mensaje').modal('show');
                $('#btn_mensaje_aceptar').unbind();
                $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                $('#btn_mensaje_aceptar').on('click', function () {
                    eliminar(item.idasiento_cabecera);
                });
            } else {
                utilClass.showMessage('#dvResultado', 'danger', 'Error:|No se puede eliminar el asiento.');
            }
        });

        $('#preview-asiento-' + index).unbind();
        $('#preview-asiento-' + index).on('click', function () {
            showPreview(item.idasiento_cabecera);
        });
    });
    $('#txtDvTotalDebe').html(totalDebe.toFixed(2));
    $('#txtDvTotalHaber').html(totalHaber.toFixed(2));
}

function showPreview(IDCabecera) {
    $('#frmControlPreview').attr('src', 'Reportes/reporteAsientoPagos.aspx?ID=' + IDCabecera);
    $('#facturaPreview').modal('show');
    $('#dvLoading').show();
    $('#frmControlPreview').hide();
    $('#frmControlPreview').unbind();
    $('#frmControlPreview').on('load', function () {
        $('#dvLoading').hide();
        $('#frmControlPreview').show();
    });
}

function setSelect2(div, id, value) {
    $(div).empty().append('<option value="' + id + '">' + value + '</option>').val(id).trigger('change');
}

function insertar(IDPAGOS, IDVENTAS, txtFechaEmision, TIPO) {
    var formData = $('#frmInsertar').serializeJSON();
    formData['IDPAGO'] = IDPAGOS;
    formData['txtFechaEmision'] = txtFechaEmision;
    formData['IDVENTAS'] = IDVENTAS;
    formData['METHOD'] = TIPO;
    console.log(formData);
    $.ajax({
        url: 'asientoPagos.aspx/insertar',
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
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|El registro fue insertado correctamente.');
        }
        $('#modalInsertar').modal('toggle');
        buscar();
        buscarTOTALES();
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modalInsertar').modal('toggle');
        var myWindow = window.open("", null, "height=200,width=400,status=yes,toolbar=no,menubar=no,location=no");
        myWindow.document.write(ort.responseText);
        console.log(ort);
        console.log(rt);
        console.log(qrt);
    });
}

function eliminar(id) {
    $.ajax({
        url: 'asientoPagos.aspx/eliminar',
        type: "POST",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ ID: id }),
        beforeSend: function () {
            $('#btnGuardar').html('<span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;Procesando');
            $('#btnGuardar').attr('disabled', true);
            $('#btnCancelar').attr('disabled', true);
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|El registro fue modificado correctamente.');
        }
        $('#modal_mensaje').modal('toggle');
        buscar();
        buscarTOTALES();
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
        var myWindow = window.open("", "_blank");
        myWindow.document.write(ort.responseText);
        console.log(ort);
        console.log(rt);
        console.log(qrt);
    });
}