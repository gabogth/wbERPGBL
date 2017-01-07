$(function () {
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
    window.carrito = { items: [] };
    $('#txtDireccion').editableSelect({ filter: false });
    $('#btnLimpiarFormulario').unbind();
    $('#btnLimpiarFormulario').on('click', function () {
        limpiarFormulario();
    });
    $('#btnTest').on('click', function () {
        $('#facturaPreview').modal('show');
        $('#frmControlPreview').attr('src', 'Reportes/frmFacturaPreview.aspx?ID=1090');
    });
    $('#btnInsertarDetalle').unbind();
    $('#btnInsertarDetalle').on('click', function () {
        $('#txtItem').val('');
        $('#txtCantidad').val('');
        $('#txtMonto').val('');
        $('#modalInsertar').modal('show');
        $('#cbProyecto').select2('data', null);
        $('#btnGuardar').html('<span class="fa fa-plus"></span>&nbsp;Agregar');
        $('#btnGuardar').unbind();
        $('#btnGuardar').on('click', function () {
            $('#frmInsertarDetalle').unbind();
            $('#frmInsertarDetalle').on('submit', function (e) {
                e.preventDefault();
                var imponible = 0.00, igv = 0.00, total = 0.00;
                var camposCalculados = calculoDeCampos();
                var item = asignarItem(camposCalculados.imponible, camposCalculados.igv, camposCalculados.total);
                window.carrito.items.push(item);
                DrawDetalle();
                $('#modalInsertar').modal('toggle');
            });
        });
    });

    $('#cbEmpresaReView').on('change', function (e) {
        getFacturaDatos($('#cbSerieReView').val(), $('#cbEmpresaReView').val(), $('#txtCorrelativoReView').val());
    });

    $('#cbSerieReView').on('change', function (e) {
        getFacturaDatos($('#cbSerieReView').val(), $('#cbEmpresaReView').val(), $('#txtCorrelativoReView').val());
    });

    $('#txtCorrelativoReView').on('change', function (e) {
        getFacturaDatos($('#cbSerieReView').val(), $('#cbEmpresaReView').val(), $('#txtCorrelativoReView').val());
    });

    $('#lkBuscarDatos').on('click', function (e) {
        e.preventDefault();
        $('#modalReView').modal('show');
        $('#modal_review_titulo').html('BUSCAR FACTURA POR DATOS');
        $('#btnCargarReView').attr('disabled', true);
        $('#txtCorrelativoReView').val('00000000');
        $('#dvSearchFactura').hide();
    });

    $('#ckImpuesto').on('ifChanged', function (e) {
        if ($('#ckImpuesto').is(':checked')) {
            quitarImpuestos();
        } else {
            agregarImpuestos();
        }
    });

    $('#cbEmpresa').on('change', function () {
        getLastCorrelativo($('#cbEmpresa').val(), $('#cbSerie').val());
        comprobarFacturaEmitida($('#cbSerie').val(), $('#cbEmpresa').val(), $('#txtCorrelativo').val());
    });

    $('#cbSerie').on('change', function () {
        getLastCorrelativo($('#cbSerie').val(), $('#cbEmpresa').val());
        comprobarFacturaEmitida($('#cbSerie').val(), $('#cbEmpresa').val(), $('#txtCorrelativo').val());
    });

    $('#txtCorrelativo').attr('disabled', true);

    $('#btnEmitirFactura').unbind();
    $('#btnEmitirFactura').on('click', function () {
        $('#frmCabeceraFactura').unbind();
        $('#frmCabeceraFactura').submit(function (e) {
            e.preventDefault();
            if ($('#tbl_body >tr').length > 0) {
                emitirFatura();
            } else {
                utilClass.showMessage('#dvResultado', 'danger', 'Error:|Debe agregar almenos un item en el detalle.');
            }
        });
    });
    initializeComponents();
});

function limpiarFormulario() {
    $('#txtRazonSocial').val('');
    $('#txtDireccion').val('');
    $('#txtEstado').val('');
    $('#txtOrd').val('');
    $('#txtRuc').val('');
    $('#ckSinRuc').iCheck('uncheck');
    $('#ckImpuesto').iCheck('uncheck');
    $("#tbl_body").empty();
}

function emitirFatura() {
    var query = 'bodyfactura=' + encodeURIComponent(JSON.stringify(window.carrito)) +
        '&action=INSERTAR_FACTURA' +
        '&FECHA_EMISION=' + encodeURIComponent($('#txtFecha').val()) +
        '&CORRELATIVO=' + encodeURIComponent($('#txtCorrelativo').val()) +
        '&IDSERIE=' + encodeURIComponent($('#cbSerie').val()) +
        '&RUC=' + encodeURIComponent($('#txtRuc').val()) +
        '&DIRECCION=' + encodeURIComponent($('#txtDireccion').val()) +
        '&RAZON_SOCIAL=' + encodeURIComponent($('#txtRazonSocial').val()) +
        '&ORDEN_TRABAJO=' + encodeURIComponent($('#txtOrd').val()) +
        '&IDTIPO_COMPROBANTE=' + encodeURIComponent($('#txtIDImpuesto').val()) +
        '&TIPO_DOCUMENTO=00' +
        '&IGV=' + encodeURIComponent($('#lbltotal_igv').html()) +
        '&BASE_IMPONIBLE=' + encodeURIComponent($('#lbltotal_base').html()) +
        '&MONTO_TOTAL=' + encodeURIComponent($('#lbltotal_total').html()) +
        '&IDEMPRESA=' + encodeURIComponent($('#cbEmpresa').val()) +
        '&FOOTER=' + encodeURIComponent($('#txtFoot').val()) +
        '&IDMONEDA=' + encodeURIComponent($('#cbMoneda').val());

    $.ajax({
        url: '../response/controller_factura.ashx',
        type: "GET",
        dataType: 'json',
        processData: false,
        contentType: "application/json;charset=utf-8",
        data: query,
        beforeSend: function () {
            
        }
    }).done(function (data) {
        if (data.result == 'success') {
            utilClass.showMessage('#dvResultado', 'success', 'Correcto:|Se ha registrado la venta correctamente.');
            showPreview(data.body, $('#cbEmpresa').select2('data')[0].text, $('#cbSerie').select2('data')[0].text, $('#txtCorrelativo').val());
            getLastCorrelativo($('#cbSerie').val(), $('#cbEmpresa').val());
        } else {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + data.message);
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
    });
}

function showPreview(IDCabecera, empresa, serie, correlativo) {
    $('#frmControlPreview').attr('src', 'Reportes/frmFacturaPreview.aspx?ID=' + IDCabecera);
    $('#facturaPreview').modal('show');
    $('#dvLoading').show();
    $('#frmControlPreview').hide();
    $('#frmControlPreview').unbind();
    $('#frmControlPreview').on('load', function () {
        $('#dvLoading').hide();
        $('#frmControlPreview').show();
    });
    $('#facturaTitulo').html(
        empresa + ' - ' + serie + ' - ' + correlativo
    );
}

function quitarImpuestos() {
    var datos_temp = { items: [] };
    var datos = window.carrito.items;
    var temp_item = null;
    $.each(datos, function (index, item) {
        item.total = item.total - item.igv;
        item.igv = 0;
        item.omitirIGV = true;
        datos_temp.items.push(item);
        
    });
    window.carrito = datos_temp;
    DrawDetalle();
}

function agregarImpuestos() {
    var datos_temp = { items: [] };
    var datos = window.carrito.items;
    var impuesto = parseFloat($('#txtImpuesto').val());
    $.each(datos, function (index, item) {
        item.total = item.imponible * (impuesto + 1);
        item.igv = item.total - item.imponible;
        item.omitirIGV = false;
        datos_temp.items.push(item);
    });
    window.carrito = datos_temp;
    DrawDetalle();
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
                datos.imponible = montoTotal / (impuesto + 1);
                datos.igv = 0;
                datos.total = datos.imponible + datos.igv;
            } else {
                datos.imponible = montoTotal / (impuesto + 1);
                datos.igv = ((1 + impuesto) * datos.imponible) - datos.imponible;
                datos.total = datos.imponible + datos.igv;
            }
        } else {
            if (omitirIGV) {
                datos.imponible = montoTotal;
                datos.igv = 0;
                datos.total = datos.imponible + datos.igv;
            } else {
                datos.imponible = montoTotal;
                datos.igv = ((1 + impuesto) * datos.imponible) - datos.imponible;
                datos.total = datos.imponible + datos.igv;
            }
        }
    } else {
        if (rbIncIGV) {
            if (omitirIGV) {
                datos.imponible = (montoTotal * cantidad) / (impuesto + 1);
                datos.igv = 0;
                datos.total = datos.imponible + datos.igv;
            } else {
                datos.imponible = (montoTotal / (impuesto + 1)) * cantidad;
                datos.igv = ((1 + impuesto) * datos.imponible) - datos.imponible;
                datos.total = datos.imponible + datos.igv;
            }
        } else {
            if (omitirIGV) {
                datos.imponible = montoTotal * cantidad;
                datos.igv = 0;
                datos.total = datos.imponible + datos.igv;
            } else {
                datos.imponible = montoTotal * cantidad;
                datos.igv = ((1 + impuesto) * datos.imponible) - datos.imponible;
                datos.total = datos.imponible + datos.igv;
            }
        }
    }
    return datos;
}

function asignarItem(imponible, igv, total) {
    var itemCarrito = {
        cbProyecto: $('#cbProyecto').val(),
        cbProyectoText: $('#cbProyecto').select2('data')[0].text,
        ckProducto: $('#ckProducto').is(':checked'),
        ckServicio: $('#ckServicio').is(':checked'),
        txtItem: $('#txtItem').val(),
        rbPrecioTotal: $('#rbPrecioTotal').is(':checked'),
        rbPrecioUnidad: $('#rbPrecioUnidad').is(':checked'),
        txtCantidad: $('#txtCantidad').val(),
        cbTipo: $('#cbTipo').val(),
        cbTipoTexto: $('#cbTipo').select2('data')[0].text,
        rbIncIGV: $('#rbIncIGV').is(':checked'),
        rbSinIGV: $('#rbSinIGV').is(':checked'),
        txtMonto: $('#txtMonto').val(),
        omitirIGV: $('#ckImpuesto').is(':checked'),
        imponible: parseFloat(imponible.toFixed(2)),
        igv: parseFloat(igv.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    }
    return itemCarrito;
}

function DrawDetalle() {
    var htmlEnd = '';
    $('#tbl_body').html('');
    var total_igv = 0, total_base = 0;
    $.each(window.carrito.items, function (index, item) {
        htmlEnd = '';
        htmlEnd += '<tr>';
        htmlEnd += '<td class="text-center">' + (index + 1) + '</td>';
        htmlEnd += '<td>' + item.txtItem + '</td>';
        htmlEnd += '<td class="text-right">' + parseFloat(item.txtCantidad).toFixed(2) + '</td>';
        htmlEnd += '<td class="text-right">' + parseFloat(item.imponible).toFixed(2) + '</td>';
        htmlEnd += '<td class="text-right">' + parseFloat(item.igv).toFixed(2) + '</td>';
        htmlEnd += '<td class="text-right">' + parseFloat(item.total).toFixed(2) + '</td>';
        htmlEnd += '<td class="text-center"><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + index + '"></span></td>';
        htmlEnd += '<td class="text-center"><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + index + '"></span></td>';
        htmlEnd += '</tr>';
        total_igv += parseFloat(item.igv);
        total_base += parseFloat(item.imponible);
        $('#tbl_body').append(htmlEnd);
        $('#modificar' + index).unbind();
        $('#modificar' + index).on('click', function () {
            $('#ckProducto').iCheck(item.ckProducto == true ? 'check' : 'uncheck');
            $('#ckServicio').iCheck(item.ckServicio == true ? 'check' : 'uncheck');
            $('#txtItem').val(item.txtItem);
            $('#rbPrecioTotal').iCheck(item.rbPrecioTotal == true ? 'check' : 'uncheck'),
            $('#rbPrecioUnidad').iCheck(item.rbPrecioUnidad == true ? 'check' : 'uncheck'),
            $('#txtCantidad').val(item.txtCantidad);
            $('#cbTipo').val(item.cbTipo);
            console.log(item);
            $('#cbProyecto').empty().append('<option value="' + item.cbProyecto + '">' + item.cbProyectoText + '</option>').val(item.cbProyecto).trigger('change');
            $('#cbTipo').empty().append('<option value="' + item.cbTipo + '">' + item.cbTipoTexto + '</option>').val(item.cbTipo).trigger('change');
            $('#rbIncIGV').is(item.rbIncIGV == true ? 'check' : 'uncheck');
            $('#rbSinIGV').is(item.rbSinIGV == true ? 'check' : 'uncheck');
            $('#txtMonto').val(item.txtMonto);
            $('#ckImpuesto').is(item.omitirIGV == true ? 'check' : 'uncheck');
            $('#btnGuardar').html('<span class="fa fa-pencil"></span>&nbsp;Modificar');
            $('#btnGuardar').unbind();
            $('#btnGuardar').on('click', function () {
                $('#frmInsertarDetalle').unbind();
                $('#frmInsertarDetalle').on('submit', function (e) {
                    e.preventDefault();
                    var imponible = 0.00, igv = 0.00, total = 0.00;
                    var camposCalculados = calculoDeCampos();
                    var item = asignarItem(camposCalculados.imponible, camposCalculados.igv, camposCalculados.total);
                    window.carrito.items.splice(index, 1, item);
                    DrawDetalle();
                    $('#modalInsertar').modal('toggle');
                });
            });
            $('#modalInsertar').modal('show');
        });
        $('#eliminar' + index).unbind();
        $('#eliminar' + index).on('click', function () {
            window.carrito.items.splice(index, 1);
            DrawDetalle();
        });
    });
    $('#lbltotal_igv').html(parseFloat(total_igv).toFixed(2));
    $('#lbltotal_base').html(parseFloat(total_base).toFixed(2));
    $('#lbltotal_total').html(parseFloat(total_igv + total_base).toFixed(2));
}

function getLastCorrelativo(idserie, idempresa) {
    var query = 'IDEMPRESA=' + encodeURIComponent(idempresa) +
         '&IDSERIE=' + encodeURIComponent(idserie);

    $.ajax({
        url: 'factura_frmEmitirFactura.aspx/correlativo',
        type: "GET",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: query,
        beforeSend: function () {
            $('#txtCorrelativo').attr('disabled', true);
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            $('#txtCorrelativo').attr('disabled', true);
            $('#txtCorrelativo').val('00000000');
        } else {
            $('#txtCorrelativo').val(jsonData.body);
            $('#txtCorrelativo').attr('disabled', false);
        }

    }).fail(function (ort, rt, qrt) {
        $('#txtCorrelativo').attr('disabled', true);
        $('#txtCorrelativo').val('00000000');
    });
}

function getFacturaDatos(idserie, idempresa, correlativo) {
    $('#btnCargarReView').attr('disabled', true);
    $('#dvSearchFactura').hide();
    if (idserie != null && idempresa != null && correlativo != null) {
        var query = 'IDEMPRESA=' + encodeURIComponent(idempresa) +
            '&IDSERIE=' + encodeURIComponent(idserie) +
            '&CORRELATIVO="' + encodeURIComponent(correlativo) + '"';
        try {
            window.busqueda.abort();
        } catch (Exception) {

        }
        window.busqueda = $.ajax({
            url: 'factura_frmEmitirFactura.aspx/exist_factura',
            type: "GET",
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            data: query,
            beforeSend: function () {
                $('#dvSearchFactura').html('<span class="fa fa-spinner faa-slow faa-spin animated fa-2x">&nbsp;</span>Buscando...');
                $('#dvSearchFactura').show();
                $('#btnCargarReView').attr('disabled', true);
            }
        }).done(function (data) {
            var jsonData = jQuery.parseJSON(data.d);
            if (jsonData.result == 'error') {
                $('#dvSearchFactura').html('<span class="fa fa-times text-danger">&nbsp; ' + jsonData.message + '</span>');
                $('#btnCargarReView').attr('disabled', true);
            } else {
                $('#dvSearchFactura').html('<span class="fa fa-check text-success">&nbsp;Encontrado.</span>'+
                    '<div>'+
                    '<b>Fecha de emisión: </b><i>' + jsonData.body[0].fecha_emision.split('T')[0] + '</i><br />' +
                    '<b>Fecha de registro: </b><i>' + jsonData.body[0].fecha_creacion.replace('T', ' a las ') + '</i><br />' +
                    '<b>Monto: </b><i>' + jsonData.body[0].monto_total.toFixed(2) +
                    '</i></div>');
                $('#btnCargarReView').attr('disabled', false);
                $('#frmBuscarFactura').unbind();
                $('#frmBuscarFactura').submit(function (e) {
                    e.preventDefault();
                    $('#modalReView').modal('toggle');
                    showPreview(jsonData.body[0].idventas_cabecera, $('#cbEmpresaReView').select2('data')[0].text, $('#cbSerieReView').select2('data')[0].text, $('#txtCorrelativoReView').val());
                });
            }
        }).fail(function (ort, rt, qrt) {
            console.log(ort);
            console.log(rt);
            $('#btnCargarReView').attr('disabled', false);
        });
    }
}

function comprobarFacturaEmitida(idserie, idempresa, correlativo) {
    if (idserie != null && idempresa != null && correlativo != null) {
        var query = 'IDEMPRESA=' + encodeURIComponent(idempresa) +
            '&IDSERIE=' + encodeURIComponent(idserie) +
            '&CORRELATIVO="' + encodeURIComponent(correlativo) + '"';
        try {
            window.busqueda.abort();
        } catch (Exception) {

        }
        window.busqueda = $.ajax({
            url: 'factura_frmEmitirFactura.aspx/exist_factura',
            type: "GET",
            dataType: 'json',
            contentType: "application/json;charset=utf-8",
            data: query,
            beforeSend: function () {
                $('#dvSearchFactura').html('<span class="fa fa-spinner faa-slow faa-spin animated fa-2x">&nbsp;</span>Buscando...');
            }
        }).done(function (data) {
            var jsonData = jQuery.parseJSON(data.d);
            if (jsonData.result == 'success') {
                $('#txtCorrelativo').attr('title', 'Ya se encuentra emitida esa factura.');
                $('#txtCorrelativo').tooltip({ placement: 'top', trigger: 'manual' }).tooltip('show');
            } else {
                $('#txtCorrelativo').tooltip('destroy');
            }
        }).fail(function (ort, rt, qrt) {
            console.log(ort);
            console.log(rt);
        });
    }
}

function initializeComponents() {
    $('#txtCantidad').autoNumeric('init');
    $('#txtMonto').autoNumeric('init');
    
    var today = moment().format('YYYY-MM-DD');
    $('#txtFecha').val(today);
    $('#ckSinRuc').on('ifChanged', function (e, x) {
        if ($('#ckSinRuc').is(':checked')) {
            $('#txtRuc').val($('#txtRazonSocial').val());
            $('#lblRuc').html('SIN RUC');
            $('#txtRuc').prop('disabled', true);
            $('#txtRazonSocial').unbind();
            $('#txtRazonSocial').on('change', function () {
                $('#txtRuc').val($('#txtRazonSocial').val());
            });
            $('#txtRazonSocial').on('keyup', function () {
                $('#txtRuc').val($('#txtRazonSocial').val());
            });
            $('#txtRuc').tooltip('destroy');
        } else {
            $('#lblRuc').html('CON RUC');
            $('#txtRuc').prop('disabled', false);
            $('#txtRazonSocial').unbind();
            validarRuc();
            $('#txtRazonSocial').val(''); 
            $('#txtDireccion').val('');
            $('#txtEstado').val('');
        }
    });

    $('#txtCorrelativo').on('change', function () {
        $('#txtCorrelativo').val(utilClass.padLeft($('#txtCorrelativo').val(), 8, '0'));
        comprobarFacturaEmitida($('#cbSerie').val(), $('#cbEmpresa').val(), $('#txtCorrelativo').val());
    });

    $('#txtCorrelativoReView').on('change', function () {
        $('#txtCorrelativoReView').val(utilClass.padLeft($('#txtCorrelativoReView').val(), 8, '0'));
    });

    $('#txtRuc').tooltip({ placement: 'bottom', trigger: 'manual' }).tooltip('show');

    $('#txtRuc').on('keyup', function (e) {
        validarRuc(e);
    });
    cargarEmpresa();
    cargarSerie();
    cargarProyecto();
    cargarMoneda();
    cargarUnidadMedida();
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

function cargarEmpresa() {
    $('#cbEmpresa, #cbEmpresaReView').select2({
        
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
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idempresa;
                    datos[i].text = datos[i].alias;
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

function cargarMoneda() {
    $('#cbMoneda').select2({
        
        ajax: {
            url: 'moneda_frmMantenimientoMoneda.aspx/buscar_estado',
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
                    datos[i].id = datos[i].idmoneda;
                    datos[i].text = '[' + datos[i].simbolo  + '] - ' + datos[i].moneda;
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
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idunidad_medida;
                    datos[i].text = datos[i].unidad_medida;
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

function cargarSerie() {
    $('#cbSerie, #cbSerieReView').select2({
        
        ajax: {
            url: 'serie_frmMantenimientoSerie.aspx/buscar_estado',
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
                    datos[i].id = datos[i].idserie;
                    datos[i].text = datos[i].serie + ' - ' + datos[i].descripcion;
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

function cargarProyecto() {
    $('#cbProyecto').select2({
        
        ajax: {
            url: 'proyecto_frmMantenimientoProyecto.aspx/buscar_idempresa',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'GET',
            cache: false,
            data: function (params) {
                if (params == null) {
                    return 'q=""&index=' + 1 + '&cantidad=' + 10;
                } else {
                    return 'q="' + (params.term == null ? '' : params.term) + '"&index=' + 1 + '&cantidad=' + 10 + '&idempresa=' + $('#cbEmpresa').val();
                }
            },
            processResults: function (data, page) {
                var datos = jQuery.parseJSON(data.d);
                var tmp_datos = datos;
                datos = datos.body;
                if (tmp_datos.registros > 0) {
                    for (var i = 0; i < datos.length; i++) {
                        datos[i].id = datos[i].idproyecto;
                        datos[i].text = datos[i].EMPRESA_ALIAS + ' - ' + datos[i].proyecto;
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

function validarRuc(e) {
    if (!utilClass.validarLength($('#txtRuc').val())) {
        $('#txtRuc').attr('title', 'El RUC debe tener 11 dígitos.');
        $('#txtRuc').tooltip({ placement: 'top', trigger: 'manual' }).tooltip('show');
        $('#txtRazonSocial').val('');
        $('#txtDireccion').val('');
        $('#txtEstado').val('');
        return false;
    } else {
        var verif = utilClass.VerificarRuc($('#txtRuc').val());
        switch (verif) {
            case '401':
                $('#txtRuc').attr('title', 'El RUC no es válido.');
                $('#txtRuc').tooltip({ placement: 'top', trigger: 'manual' }).tooltip('show');
                $('#txtRazonSocial').val('');
                $('#txtDireccion').val('');
                $('#txtEstado').val('');
                return false;
            case '402':
                $('#txtRuc').attr('title', 'El RUC no puede solo acepta números.');
                $('#txtRuc').tooltip({ placement: 'top', trigger: 'manual' }).tooltip('show');
                $('#txtRazonSocial').val('');
                $('#txtDireccion').val('');
                $('#txtEstado').val('');
                return false;
            case 'success':
                $('#txtRuc').tooltip('destroy');
                if (e.keyCode == 13) {
                    $.ajax({
                        url: 'factura_frmEmitirFactura.aspx/consultaSunat',
                        type: "GET",
                        dataType: 'json',
                        contentType: "application/json;charset=utf-8",
                        data: 'ruc="' + $('#txtRuc').val() + '"',
                        beforeSend: function () {
                            $('#txtRuc').attr('disabled', true);
                        }
                    }).done(function (data) {
                        var jsonData = jQuery.parseJSON(data.d);
                        if (jsonData.result == 'success') {
                            $('#txtRazonSocial').val(jsonData.body.Razon_social);
                            $('#txtDireccion').editableSelect('destroy');
                            $('#txtDireccion').html('');
                            $('#txtDireccion').append('<option value="' + jsonData.body.Direccion + '" selected>' + jsonData.body.Direccion + '</option>');
                            try {
                                $.each(jsonData.body.Sucursales, function (index, item) {
                                    $('#txtDireccion').append('<option value="' + item[1] + '">' + item[1] + '</option>');
                                });
                            } catch (Exception) {
                                console.log(Exception);
                            }
                            $('#txtDireccion').editableSelect({ filter: false });
                            $('#txtEstado').val(jsonData.body.Condicion + '/' + jsonData.body.Estado);
                            $('#txtRuc').tooltip('destroy');
                        } else {
                            $('#txtRuc').attr('title', jsonData.message);
                            $('#txtRuc').tooltip({ placement: 'top', trigger: 'manual' }).tooltip('show');
                        }
                        $('#txtRuc').attr('disabled', false);
                        $('#txtRuc').focus();
                    }).fail(function (ort, rt, qrt) {
                        $('#txtRuc').attr('disabled', false);
                        $('#txtRuc').attr('title', rt);
                        $('#txtRuc').tooltip({ placement: 'top', trigger: 'manual' }).tooltip('show');
                        $('#txtRuc').focus();
                    });
                }
                return true;
        }
    }
}