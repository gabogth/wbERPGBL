var myWindow;
$(function () {
    cargarUnidadMedida();
    cargarProducto();
    cargarServicio();
    $('#txtCantidad').autoNumeric('init');
    $('#txtMonto').autoNumeric('init');
    $('input:radio[name=ckRadio]').on('ifChanged', function () {
        if (this.value == 'producto') {
            $('#dvProducto').show();
            $('#dvServicio').hide();
            $('#cbProducto').attr('required', true);
            $('#cbServicio').attr('required', false);
            setSelect2('#cbServicio', null, null);
        }
        else if (this.value == 'servicio') {
            $('#dvProducto').hide();
            $('#dvServicio').show();
            $('#cbServicio').attr('required', true);
            $('#cbProducto').attr('required', false);
            setSelect2('#cbProducto', null, null);
        }
    });
    $('#btnInsertar').on('click', function (e) {
        e.preventDefault();
        $('#modal_titulo_mensaje').html('NUEVO ITEM DE LA FACTURA');
        $('#btnGuardar').html('<span class="fa fa-plus"></span>&nbsp;&nbsp;Agregar');
        $('#btnGuardar').attr('disabled', false);
        $('#btnCancelar').attr('disabled', false);
        $('#modalInsertar').modal('show');
        $('#frmInsertar').unbind();
        $('#frmInsertar').on('submit', function (e) {
            e.preventDefault();
            var imponible = 0.00, igv = 0.00, total = 0.00;
            var camposCalculados = calculoDeCampos();
            insertar(camposCalculados);
        });
    });
    buscar();
});

function cargarUnidadMedida() {
    $('#cbTipo').select2({
        ajax: {
            url: 'unidadmedida_frmMantenimientoUnidadMedida.aspx/buscar_estado',
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
                        datos[i].id = datos[i].idunidad_medida;
                        datos[i].text = datos[i].unidad_medida;
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

function cargarProducto() {
    $('#cbProducto').select2({
        ajax: {
            url: 'productoMantenimiento.aspx/buscar_estado',
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
                        datos[i].id = datos[i].idproducto;
                        datos[i].text = datos[i].producto;
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

function cargarServicio() {
    $('#cbServicio').select2({
        ajax: {
            url: 'serviciosMantenimiento.aspx/buscar_estado',
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
                        datos[i].id = datos[i].idservicio;
                        datos[i].text = datos[i].servicio;
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

function calculoDeCampos() {
    var rbPrecioTotal = $('#rbPrecioTotal').is(':checked');
    var montoTotal = parseFloat($('#txtMonto').val());
    var cantidad = parseFloat($('#txtCantidad').val());
    var rbIncIGV = $('#rbIncIGV').is(':checked');
    var impuesto = parseFloat($('#txtImpuesto').val());
    var idImpuesto = $('#txtIDImpuesto').val();
    var omitirIGV = $('#ckImpuesto').is(':checked');
    var datos = {
        imponible: 0,
        igv: 0,
        total: 0
    };
    if (rbPrecioTotal) {
        if (rbIncIGV) {
            if (omitirIGV) {
                datos.imponible = round(montoTotal / (impuesto + 1), 2);
                datos.igv = 0;
                datos.total = datos.imponible + datos.igv;
            } else {
                datos.imponible = round(montoTotal / (impuesto + 1), 2);
                datos.igv = round(((1 + impuesto) * datos.imponible) - datos.imponible, 2);
                datos.total = round(datos.imponible + datos.igv, 2);
            }
        } else {
            if (omitirIGV) {
                datos.imponible = round(montoTotal, 2);
                datos.igv = 0;
                datos.total = round(datos.imponible + datos.igv, 2);
            } else {
                datos.imponible = round(montoTotal, 2);
                datos.igv = round(((1 + impuesto) * datos.imponible) - datos.imponible, 2);
                datos.total = round(datos.imponible + datos.igv, 2);
            }
        }
    } else {
        if (rbIncIGV) {
            if (omitirIGV) {
                datos.imponible = round((montoTotal * cantidad) / (impuesto + 1), 2);
                datos.igv = 0;
                datos.total = round(datos.imponible + datos.igv, 2);
            } else {
                datos.imponible = round((montoTotal / (impuesto + 1)) * cantidad, 2);
                datos.igv = round(((1 + impuesto) * datos.imponible) - datos.imponible, 2);
                datos.total = round(datos.imponible + datos.igv, 2);
            }
        } else {
            if (omitirIGV) {
                datos.imponible = round(montoTotal * cantidad, 2);
                datos.igv = 0;
                datos.total = round(datos.imponible + datos.igv, 2);
            } else {
                datos.imponible = round(montoTotal * cantidad, 2);
                datos.igv = round(((1 + impuesto) * datos.imponible) - datos.imponible, 2);
                datos.total = round(datos.imponible + datos.igv, 2);
            }
        }
    }

    datos.imponible = parseFloat(datos.imponible.toFixed(2));
    datos.igv = parseFloat(datos.igv.toFixed(2));
    datos.total = parseFloat(datos.total.toFixed(2));
    return datos;
}

function round(n, decimals) {
    return parseFloat(n.toFixed(decimals));
}

function buscar() {
    $.ajax({
        url: 'desgloseDetalle.aspx/buscar',
        type: "POST",
        dataType: 'json',
        data: JSON.stringify({ ID: utilClass.getUrlParameter('ID') }),
        contentType: "application/json;charset=utf-8",
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
    });
}

function establecerData(item) {
    if (isNaN(item.idproducto) || item.idproducto == null) {
        $('#dvProducto').hide();
        $('#dvServicio').show();
        $('#cbServicio').attr('required', true);
        $('#cbProducto').attr('required', false);
        $('#ckProducto').iCheck('uncheck');
        $('#ckServicio').iCheck('check');
        setSelect2('#cbProducto', item.idproducto, item.producto);
        setSelect2('#cbServicio', item.idservicio, item.servicio);
    } else {
        $('#dvProducto').show();
        $('#dvServicio').hide();
        $('#cbProducto').attr('required', true);
        $('#cbServicio').attr('required', false);
        $('#ckServicio').iCheck('uncheck');
        $('#ckProducto').iCheck('check');
        setSelect2('#cbProducto', item.idproducto, item.producto);
        setSelect2('#cbServicio', item.idservicio, item.servicio);
    }
    $('#rbPrecioTotal').iCheck('check');
    $('#rbPrecioUnidad').iCheck('uncheck');
    $('#txtCantidad').val(item.cantidad);
    setSelect2('#cbTipo', item.idunidad_medida, item.unidad_medida);
    $('#rbIncIGV').iCheck('check');
    $('#rbSinIGV').iCheck('uncheck');
    $('#txtMonto').val(item.monto_total);
    $('#ckImpuesto').iCheck(item.omitirIGV == 1 ? 'check' : 'uncheck');
}

function showTableHTML(data) {
    var bodyTable = '';
    var totalDesglose = 0;
    var totalIGV = 0;
    var totalImponible = 0;
    $.each(data, function (index, item) {
        bodyTable = '';
        bodyTable += '<tr>';
        bodyTable += '<td>' + (index + 1).toString() + '</td>';
        bodyTable += '<td>' + ((!isNaN(item.idproducto) && item.idproducto != null) ? item.producto : item.servicio) + '</td>';
        bodyTable += '<td class="text-center">SOLES</td>';
        bodyTable += '<td class="text-right">' + (item.base_imponible / item.cantidad).toFixed(2) + '</td>';
        bodyTable += '<td class="text-right">' + item.cantidad.toFixed(2) + '</td>';
        bodyTable += '<td class="text-right">' + item.base_imponible.toFixed(2) + '</td>';
        bodyTable += '<td class="text-right">' + item.impuesto.toFixed(2) + '</td>';
        bodyTable += '<td class="text-right">' + item.monto_total.toFixed(2) + '</td>';
        bodyTable += '<td class="text-center"><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar-detalle-' + item.iddesglose_ventas + '"></span></td>';
        bodyTable += '<td class="text-center"><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar-detalle-' + item.iddesglose_ventas + '"></span></td>';
        bodyTable += '</tr>';
        totalDesglose += item.monto_total;
        totalIGV += item.impuesto;
        totalImponible += item.base_imponible;
        $('#tbl_body').append(bodyTable);
        bodyTable = '';
        $('#modificar-detalle-' + item.iddesglose_ventas).unbind();
        $('#modificar-detalle-' + item.iddesglose_ventas).on('click', function () {
            establecerData(item);
            $('#modal_insertar_titulo').html('MODIFICAR ' + (item.idproducto != null ? item.producto : item.servicio));
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    var imponible = 0.00, igv = 0.00, total = 0.00;
                    var camposCalculados = calculoDeCampos();
                    modificar(camposCalculados, item.iddesglose_ventas);
                });
            });
        });
        $('#eliminar-detalle-' + item.iddesglose_ventas).unbind();
        $('#eliminar-detalle-' + item.iddesglose_ventas).on('click', function () {
            $('#btn_mensaje_aceptar').attr('disabled', false);
            $('#btn_mensaje_cancelar').attr('disabled', false);
            $('#modal_titulo_mensaje').html('Advertencia');
            $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + (item.idproducto != null ? item.producto : item.servicio) + '</b> permanentemente?');
            $('#modal_mensaje').modal('show');
            $('#btn_mensaje_aceptar').unbind();
            $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
            $('#btn_mensaje_aceptar').on('click', function () {
                eliminar(item.iddesglose_ventas);
            });
        });
    });
    var montoTotalFactura = parseFloat($('#txtMontoTotalFactura').val());
    $('#txtTotalFacturado').html(montoTotalFactura.toFixed(2));
    $('#txtTotal').html(totalDesglose.toFixed(2));
    $('#lblMontoDesglose').html('<b>Base Imponible [DES]: </b> S/. ' + totalImponible.toFixed(2));
    $('#lblIGVDesglose').html('<b>IGV [DES]: </b> S/. ' + totalIGV.toFixed(2));
    $('#lblTotalDesglose').html('<b>Total [DES]: </b> S/. ' + totalDesglose.toFixed(2));
    $('#txtTotal').html(totalDesglose.toFixed(2));
    $('#txtDirefencia').html(parseFloat(totalDesglose - montoTotalFactura).toFixed(2));
}

function setSelect2(div, id, value) {
    $(div).empty().append('<option value="' + id + '">' + value + '</option>').val(id).trigger('change');
}

function insertar(item) {
    var formData = $('#frmInsertar').serializeJSON();
    if (isNaN($('#cbProducto').val()) || $('#cbProducto').val() == null)
        formData["cbProducto"] = null;
    else
        formData["cbServicio"] = null;
    formData["BASE_IMPONIBLE"] = item.imponible;
    formData["IMPUESTO"] = item.igv;
    formData["ID"] = utilClass.getUrlParameter('ID');
    formData["MONTO_TOTAL"] = item.total;
    console.log(formData);
    $.ajax({
        url: 'desgloseDetalle.aspx/insertar',
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

function modificar(item, ID) {
    var formData = $('#frmInsertar').serializeJSON();
    if (isNaN($('#cbProducto').val()) || $('#cbProducto').val() == null)
        formData["cbProducto"] = null;
    else
        formData["cbServicio"] = null;
    formData["BASE_IMPONIBLE"] = item.imponible;
    formData["IDVentas"] = parseInt(utilClass.getUrlParameter('ID'));
    formData["IMPUESTO"] = item.igv;
    formData["ID"] = ID;
    formData["MONTO_TOTAL"] = item.total;
    console.log(JSON.stringify(formData));
    $.ajax({
        url: 'desgloseDetalle.aspx/modificar',
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
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|El registro fue modificado correctamente.');
        }
        $('#modalInsertar').modal('toggle');
        buscar();
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modalInsertar').modal('toggle');
        myWindow = window.open("", "myWindow", "width=200,height=100");
        myWindow.document.write(ort.responseText);
        console.log(ort);
        console.log(rt);
        console.log(qrt);
    });
}

function eliminar(id) {
    $.ajax({
        url: 'desgloseDetalle.aspx/eliminar',
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