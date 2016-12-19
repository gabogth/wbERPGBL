$(function () {
    initializeComponents();
    $('#btnBuscar').unbind();
    $('#btnBuscar').on('click', function () {
        buscar();
    });
    buscar();
});

function initializeComponents() {
    cargarSerie();
    cargarEmpresa();
    cargarEstado();
    $('#txtBuscar').keyup(function (e) {
        if (e.keyCode == 13) {
            buscar();
        }
    });
}

function cargarSerie() {
    $('#cbSerie').select2({
        theme: "themes-dark",
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
        theme: "themes-dark",
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
        theme: "themes-dark",
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

function buscar() {
    var serie = $('#cbSerie').val() == null ? '' : utilClass.arrarToString($('#cbSerie').val(), '|');
    var empresa = $('#cbEmpresa').val() == null ? '' : utilClass.arrarToString($('#cbEmpresa').val(), '|');
    var estado = $('#cbEstado').val() == null ? '' : utilClass.arrarToString($('#cbEstado').val(), '|');
    var url = 'Reportes/reporte_pagoVentasPendientes.aspx';
    var query = 'QUERY=' + encodeURIComponent($('#txtBuscar').val())
        + '&SERIE_FILTRO=' + encodeURIComponent(serie)
        + '&CORRELATIVO=' + encodeURIComponent($('#txtCorrelativo').val())
        + '&EMPRESA_FILTRO=' + encodeURIComponent(empresa)
        + '&ESTADO_FILTRO=' + encodeURIComponent(estado)
        + '&FECHA_INICIO=' + encodeURIComponent($('#dtpInicio').val())
        + '&FECHA_FIN=' + encodeURIComponent($('#dtpFin').val())
        + '&OMITIR_EG=' + encodeURIComponent($('#ckOmitirEG').is(':checked') ? 1 : 0)
        + '&TYPE=' + encodeURIComponent($('#cbResumen').is(':checked') ? 'RESUMEN' : 'DETALLE');
    $('#dvLoading2').show();
    $('#frmReporte').hide();
    $('#frmReporte').unbind();
    $('#frmReporte').on('load', function () {
        $('#dvLoading2').hide();
        $('#frmReporte').show();
    });
    $('#frmReporte').attr('src', url + '?' + query);
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