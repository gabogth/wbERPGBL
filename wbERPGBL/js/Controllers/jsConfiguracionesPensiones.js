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
    $('#dvAFP').hide();
    $('#txtEsFija').on('ifChanged', function (e) {
        if ($('#txtEsFija').is(':checked')) {
            $('#dvAFP').hide(); 
            $('#dvONP').show();
            $('#txtPorcentaje').attr('required', true);
            $('#txtAporteObligatorio').attr('required', false);
            $('#txtPrima').attr('required', false);
            $('#txtComisionFlujo').attr('required', false);
            $('#txtComisionMixta').attr('required', false);
            $('#txtComisionSaldo').attr('required', false);
        } else {
            $('#dvAFP').show();
            $('#dvONP').hide();
            $('#txtPorcentaje').attr('required', false);
            $('#txtAporteObligatorio').attr('required', true);
            $('#txtPrima').attr('required', true);
            $('#txtComisionFlujo').attr('required', true);
            $('#txtComisionMixta').attr('required', true);
            $('#txtComisionSaldo').attr('required', true);
        }
    });
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
    $('#cbAdministradora').empty().append('<option value="' + data.idadministradora_pension + '">' + data.sistema_pension + '-' + data.administradora_pension + '</option>').val(data.idadministradora_pension).trigger('change');
    $('#txtCodigo').val(data.codigo);
    $('#txtEsFija').iCheck(data.es_constante == 1 ? 'check' : 'uncheck');
    $('#txtPorcentaje').val((data.porcentaje_contante * 100).toFixed(2) + ' %');
    $('#txtAporteObligatorio').val((data.aporte_obligatorio * 100).toFixed(2) + ' %');
    $('#txtPrima').val((data.prima_seguro * 100).toFixed(2) + ' %');
    $('#txtComisionFlujo').val((data.comision_flujo * 100).toFixed(2) + ' %');
    $('#txtComisionMixta').val((data.comision_mixta * 100).toFixed(2) + ' %');
    $('#txtComisionSaldo').val((data.comision_sobre_saldo * 100).toFixed(2) + ' %');
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
    $('#txtAporteObligatorio').autoNumeric('init', { mDec: 2 });
    $('#txtPorcentaje').autoNumeric('init', { mDec: 2 });
    $('#txtPrima').autoNumeric('init', { mDec: 2 });
    $('#txtComisionFlujo').autoNumeric('init', { mDec: 2 });
    $('#txtComisionMixta').autoNumeric('init', { mDec: 2 });
    $('#txtComisionSaldo').autoNumeric('init', { mDec: 2 });
    paginacion();
    $('#txtBuscar').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#paginacionFoot').pagination('selectPage', 1);
            buscar(1, 10);
        }
    });
    cargarAdministradora();
}

function cargarAdministradora() {
    $('#cbAdministradora').select2({
        theme: "themes-dark",
        ajax: {
            url: 'administradorapensiones_frmAdministradoraPensiones.aspx/buscar',
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
                    datos[i].id = datos[i].idadministradora_pension;
                    datos[i].text = datos[i].sistema_pension + '-' + datos[i].administradora_pension;
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

function buscar(indexPag, cantidad) {
    var query = 'q="' + $('#txtBuscar').val() + '"&index=' + indexPag + '&cantidad=' + cantidad;
    $.ajax({
        url: 'configuracionespensiones_frmConfiguracionesPensiones.aspx/buscar',
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
            if (jsonData.body != null) {
                $.each(jsonData.body, function (index, item) {
                    bodyTable = '';
                    bodyTable += '<tr><td>' + (((indexPag - 1) * cantidad) + index + 1) + '</td>';
                    bodyTable += '<td>' + item.sistema_pension + '</td>';
                    bodyTable += '<td>' + item.administradora_pension + '</td>';
                    bodyTable += '<td>' + item.codigo + '</td>';
                    bodyTable += '<td>' + (item.aporte_obligatorio != null ? (item.aporte_obligatorio * 100).toFixed(2) : '-') + '</td>';
                    bodyTable += '<td>' + (item.comision_flujo != null ? (item.comision_flujo * 100).toFixed(2) : '-') + '</td>';
                    bodyTable += '<td>' + (item.comision_mixta != null ? (item.comision_mixta * 100).toFixed(2) : '-') + '</td>';
                    bodyTable += '<td>' + (item.comision_sobre_saldo != null ? (item.comision_sobre_saldo * 100).toFixed(2) : '-') + '</td>';
                    bodyTable += '<td>' + (item.prima_seguro != null ? (item.prima_seguro * 100).toFixed(2) : '-') + '</td>';
                    bodyTable += '<td>' + (item.es_constante == 1 ? 'SI' : 'NO') + '</td>';
                    bodyTable += '<td>' + (item.porcentaje_contante != null ? (item.porcentaje_contante * 100).toFixed(2) + '%' : '-') + '</td>';
                    bodyTable += '<td class="text-center">' + getStateIcon(item.estado, 'estado' + item.idconfiguracion_administradora_pensiones) + '</td>';
                    bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idconfiguracion_administradora_pensiones + '"></span></td>';
                    bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idconfiguracion_administradora_pensiones + '"></span></td></tr>';
                    $('#tbl_body').append(bodyTable);
                    bodyTable = '';
                    $('#modificar' + item.idconfiguracion_administradora_pensiones).unbind();
                    $('#modificar' + item.idconfiguracion_administradora_pensiones).on('click', function () {
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
                                modificar(item.idconfiguracion_administradora_pensiones);
                            });
                        });
                    });
                    $('#eliminar' + item.idconfiguracion_administradora_pensiones).unbind();
                    $('#eliminar' + item.idconfiguracion_administradora_pensiones).on('click', function () {
                        $('#btn_mensaje_aceptar').attr('disabled', false);
                        $('#btn_mensaje_cancelar').attr('disabled', false);
                        $('#modal_titulo_mensaje').html('Advertencia');
                        $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.sistema_pension + '-' + item.administradora_pension + '</b> permanentemente?');
                        $('#modal_mensaje').modal('show');
                        $('#btn_mensaje_aceptar').unbind();
                        $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                        $('#btn_mensaje_aceptar').on('click', function () {
                            eliminar(item.idconfiguracion_administradora_pensiones);
                        });
                    });
                    $('#estado' + item.idconfiguracion_administradora_pensiones).unbind();
                    $('#estado' + item.idconfiguracion_administradora_pensiones).on('click', function () {
                        $('#btn_mensaje_aceptar').attr('disabled', false);
                        $('#btn_mensaje_cancelar').attr('disabled', false);
                        $('#modal_titulo_mensaje').html('Advertencia');
                        $('#cuerpo_mensaje').html('¿Está seguro que desea cambiar el estado de <b>' + item.sistema_pension + '-' + item.administradora_pension + '</b>?');
                        $('#modal_mensaje').modal('show');
                        $('#btn_mensaje_aceptar').unbind();
                        $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
                        $('#btn_mensaje_aceptar').on('click', function () {
                            modificar_estado(item.idconfiguracion_administradora_pensiones, Math.abs(item.estado - 1));
                        });
                    });

                });
            } else {
                $('#tbl_body').html('<tr><td colspan="14" class="text-center">No hay datos coincidentes.</td></tr>');
            }
            $('#paginacionFoot').pagination('updateItems', jsonData.registros);
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
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
    var query = "";

    if ($('#txtEsFija').is(':checked')) {
        query = 'IDCONFIGURACION_ADMINISTRADORA_PENSIONES=' + id +
        '&IDADMINISTRADORA_PENSION=' + encodeURIComponent($('#cbAdministradora').val()) +
        '&APORTE_OBLIGATORIO=' + encodeURIComponent(null) +
        '&COMISION_FLUJO=' + encodeURIComponent(null) +
        '&COMISION_MIXTA=' + encodeURIComponent(null) +
        '&PRIMA_SEGURO=' + encodeURIComponent(null) +
        '&COMISION_SOBRE_SALDO=' + encodeURIComponent(null) +
        '&ES_CONSTANTE=' + encodeURIComponent($('#txtEsFija').is(':checked') ? '1' : '0') +
        '&PORCENTAJE_CONTANTE=' + encodeURIComponent(($('#txtPorcentaje').autoNumeric('get') / 100).toFixed(5)) +
        '&CODIGO="' + encodeURIComponent($('#txtCodigo').val()) + '"';
    } else {
        query = 'IDCONFIGURACION_ADMINISTRADORA_PENSIONES=' + id +
        '&IDADMINISTRADORA_PENSION=' + encodeURIComponent($('#cbAdministradora').val()) +
        '&APORTE_OBLIGATORIO=' + encodeURIComponent(($('#txtAporteObligatorio').autoNumeric('get') / 100).toFixed(5)) +
        '&COMISION_FLUJO=' + encodeURIComponent(($('#txtComisionFlujo').autoNumeric('get') / 100).toFixed(5)) +
        '&COMISION_MIXTA=' + encodeURIComponent(($('#txtComisionMixta').autoNumeric('get') / 100).toFixed(5)) +
        '&PRIMA_SEGURO=' + encodeURIComponent(($('#txtPrima').autoNumeric('get') / 100).toFixed(5)) +
        '&COMISION_SOBRE_SALDO=' + encodeURIComponent(($('#txtComisionSaldo').autoNumeric('get') / 100).toFixed(5)) +
        '&ES_CONSTANTE=' + encodeURIComponent($('#txtEsFija').is(':checked') ? '1' : '0') +
        '&PORCENTAJE_CONTANTE=' + encodeURIComponent(null) +
        '&CODIGO="' + encodeURIComponent($('#txtCodigo').val()) + '"';
    }
    console.log(query);
    $.ajax({
        url: 'configuracionespensiones_frmConfiguracionesPensiones.aspx/modificar',
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
        $('#modalInsertar').modal('toggle');
    });
}

function insertar() {
    var query = "";

    if ($('#txtEsFija').is(':checked')) {
        query = 'IDADMINISTRADORA_PENSION=' + encodeURIComponent($('#cbAdministradora').val()) +
        '&APORTE_OBLIGATORIO=' + encodeURIComponent(null) +
        '&COMISION_FLUJO=' + encodeURIComponent(null) +
        '&COMISION_MIXTA=' + encodeURIComponent(null) +
        '&PRIMA_SEGURO=' + encodeURIComponent(null) +
        '&COMISION_SOBRE_SALDO=' + encodeURIComponent(null) +
        '&ES_CONSTANTE=' + encodeURIComponent($('#txtEsFija').is(':checked') ? '1' : '0') +
        '&PORCENTAJE_CONTANTE=' + encodeURIComponent(($('#txtPorcentaje').autoNumeric('get') / 100).toFixed(5)) +
        '&CODIGO="' + encodeURIComponent($('#txtCodigo').val()) + '"';
    } else {
        query = 'IDADMINISTRADORA_PENSION=' + encodeURIComponent($('#cbAdministradora').val()) +
        '&APORTE_OBLIGATORIO=' + encodeURIComponent(($('#txtAporteObligatorio').autoNumeric('get') / 100).toFixed(5)) +
        '&COMISION_FLUJO=' + encodeURIComponent(($('#txtComisionFlujo').autoNumeric('get') / 100).toFixed(5)) +
        '&COMISION_MIXTA=' + encodeURIComponent(($('#txtComisionMixta').autoNumeric('get') / 100).toFixed(5)) +
        '&PRIMA_SEGURO=' + encodeURIComponent(($('#txtPrima').autoNumeric('get') / 100).toFixed(5)) +
        '&COMISION_SOBRE_SALDO=' + encodeURIComponent(($('#txtComisionSaldo').autoNumeric('get') / 100).toFixed(5)) +
        '&ES_CONSTANTE=' + encodeURIComponent($('#txtEsFija').is(':checked') ? '1' : '0') +
        '&PORCENTAJE_CONTANTE=' + encodeURIComponent(null) +
        '&CODIGO="' + encodeURIComponent($('#txtCodigo').val()) + '"';
    }
    console.log(query);
    $.ajax({
        url: 'configuracionespensiones_frmConfiguracionesPensiones.aspx/insertar',
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
        $('#modalInsertar').modal('toggle');
    });
}

function eliminar(id) {
    var query = 'IDADMINISTRADORA_PENSION=' + id;
    $.ajax({
        url: 'configuracionespensiones_frmConfiguracionesPensiones.aspx/eliminar',
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
    var query = 'IDADMINISTRADORA_PENSION=' + id +
       '&ESTADO=' + estado;;
    $.ajax({
        url: 'configuracionespensiones_frmConfiguracionesPensiones.aspx/modificar_estado',
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