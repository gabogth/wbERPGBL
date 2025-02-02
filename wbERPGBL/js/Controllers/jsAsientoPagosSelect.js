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
    $('#btnBuscar').unbind();
    $('#btnBuscar').on('click', function () {
        buscar(1, 10);
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
    $('#txtDocumento').val(data.SERIE_SERIE + '-' + data.correlativo);
    $('#txtMonto').val(data.monto_total.toFixed(2));
    $('#txtRuc').val(data.CLIENTE_RUC);
    $('#txtRazonSocial').val(data.CLIENTE_RAZON_SOCIAL);
    $('#txtFechaEmision').val(data.fecha_emision.split('T')[0]);
    $('#cbEstadoModif').empty().append('<option value="' + data.REGISTRO_ESTADO_IDESTADO_FACTURA + '">' + data.REGISTRO_ESTADO_ESTADO_FACTURA + '</option>').val(data.REGISTRO_ESTADO_IDESTADO_FACTURA).trigger('change');
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
    cargarSerie();
    cargarEmpresa();
    cargarEstado();
    paginacion();
    $('#txtBuscar').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#paginacionFoot').pagination('selectPage', 1);
            buscar(1, 10);
        }
    });
}

function cargarSerie() {
    $('#cbSerie').select2({

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

function cargarEstado() {
    $('#cbEstado, #cbEstadoModif').select2({

        ajax: {
            url: 'estado_frmMantenimientoEstado.aspx/buscar_estado',
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
                    datos[i].id = datos[i].idestado_factura;
                    datos[i].text = datos[i].estado_factura;
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

function cargarEmpresa() {
    $('#cbEmpresa').select2({

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

function buscar(indexPag, cantidad) {
    var serie = $('#cbSerie').val() == null ? '' : utilClass.arrarToString($('#cbSerie').val(), '|');
    var empresa = $('#cbEmpresa').val() == null ? '' : utilClass.arrarToString($('#cbEmpresa').val(), '|');
    var estado = $('#cbEstado').val() == null ? '' : utilClass.arrarToString($('#cbEstado').val(), '|');

    var query = 'q="' + $('#txtBuscar').val() + '"&index=' + indexPag + '&cantidad=' + cantidad
        + '&SERIE_FILTRO="' + serie + '"&CORRELATIVO="' + $('#txtCorrelativo').val() + '"&EMPRESA_FILTRO="' + empresa
        + '"&ESTADO_FILTRO="' + estado + '"';
    $.ajax({
        url: 'facturas_frmMantenimientoFacturasaspx.aspx/buscar',
        type: "GET",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: query,
        beforeSend: function () {
            $('#tbl_body').html('<tr><td colspan="14" class="text-center"><span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;&nbsp;Procesando...</td></tr>');
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        console.log(jsonData);
        if (jsonData.result == 'error') {
            $('#tbl_body').html('<tr><td colspan="14" class="text-center">' + jsonData.message + '</td></tr>');
            $('#paginacionFoot').pagination('updateItems', 1);
        } else {
            $('#tbl_body').html('');
            var bodyTable = '';
            if (jsonData.body != null) {
                $.each(jsonData.body, function (index, item) {
                    bodyTable = '';
                    bodyTable += '<tr><td class="text-center">' + (((indexPag - 1) * cantidad) + index + 1) + '</td>';
                    bodyTable += '<td class="text-center">' + item.EMPRESA_ALIAS + '</td>';
                    bodyTable += '<td class="text-center">' + item.SERIE_SERIE + '-' + item.correlativo + '</td>';
                    bodyTable += '<td class="text-center" data-placement="top" data-html="true" data-toggle="popover" title="Datos adicionales" data-content="<div><b>Razón Social:</b> ' + item.CLIENTE_RAZON_SOCIAL + '<br /><b>Dirección:</b> ' + item.CLIENTE_DIRECCION + '</div>" style="cursor: pointer;">' + item.CLIENTE_RUC + '</td>';
                    bodyTable += '<td class="text-center">' + item.fecha_emision.split('T')[0] + '</td>';
                    bodyTable += '<td class="text-center" data-placement="top" data-html="true" data-toggle="popover" title="Datos adicionales" data-content="<div><b>Nombre:</b> ' + item.USUARIO_CREACION_APELLIDO + ', ' + item.USUARIO_CREACION_NOMBRE + '<br /><b>Correo:</b> ' + item.USUARIO_CREACION_CORREO + '</div>" style="cursor: pointer;">' + item.USUARIO_CREACION_USUARIO + '</td>';
                    bodyTable += '<td class="text-center" data-placement="top" data-html="true" data-toggle="popover" title="Datos adicionales" data-content="<div><b>Último cambio a las:</b> ' + item.REGISTRO_ESTADO_FECHA_CREACION.replace('T', ' a las ') + '.</div>" style="cursor: pointer;">' + item.REGISTRO_ESTADO_ESTADO_FACTURA + '</td>';
                    bodyTable += '<td class="text-center">' + item.MONEDA_SIMBOLO + '</td>';
                    bodyTable += '<td class="text-right">' + item.monto_total.toFixed(2) + '</td>';
                    bodyTable += '<td class="text-right">' + item.PAGO_VENTAS_MONTO_PAGADO.toFixed(2) + '</td>';
                    bodyTable += '<td class="text-right">' + item.PAGO_VENTAS_MONTO_RESTANTE.toFixed(2) + '</td>';
                    bodyTable += '<td class="text-center"><span class="fa fa-money" style="cursor: pointer;" id="seleccionar' + item.idventas_cabecera + '"></span></td>';
                    bodyTable += '<td class="text-center"><span class="fa fa-print" style="color:white; cursor: pointer;" id="btnPreview' + item.idventas_cabecera + '"></span></td></tr>';
                    $('#tbl_body').append(bodyTable);
                    bodyTable = '';
                    $('#seleccionar' + item.idventas_cabecera).unbind();
                    $('#seleccionar' + item.idventas_cabecera).on('click', function () {
                        document.location.href = "asientoPagos.aspx?ID=" + item.idventas_cabecera;
                    });
                    $('#btnPreview' + item.idventas_cabecera).unbind();
                    $('#btnPreview' + item.idventas_cabecera).on('click', function (e) {
                        showPreview(item.idventas_cabecera, item.EMPRESA_ALIAS, item.SERIE_SERIE, item.correlativo);
                    });
                });

                $('[data-toggle="popover"]').popover();
                $('#paginacionFoot').pagination('updateItems', jsonData.registros);
            } else {
                $('#tbl_body').html('<tr><td colspan="14" class="text-center">No hay resultados.</td></tr>');
            }
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