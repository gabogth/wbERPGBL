$(function () {
    buscar();
    cargarProyecto();
});

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
                    return 'q="' + (params.term == null ? '' : params.term) + '"&index=' + 1 + '&cantidad=' + 10 + '&idempresa=' + $('#txtIDEmpresa').val();
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

function buscar() {
    $.ajax({
        url: 'modificarFacturaProyectoEdit.aspx/buscar',
        type: "POST",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ ID: parseInt(utilClass.getUrlParameter('ID')) }),
        beforeSend: function () {
            $('#tbl_body').html('<tr><td colspan="14" class="text-center"><span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;&nbsp;Procesando...</td></tr>');
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result === 'error') {
            $('#tbl_body').html('<tr><td colspan="14" class="text-center">' + jsonData.message + '</td></tr>');
        } else {
            $('#tbl_body').html('');
            var bodyTable = '';
            if (jsonData.body != null && jsonData.body.length > 0) {
                showHTML(jsonData.body);
            } else {
                $('#tbl_body').html('<tr><td colspan="14" class="text-center">No hay resultados.</td></tr>');
            }
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
    });
}

function showHTML(data) {
    $.each(data, function (index, item) {
        bodyTable = '';
        bodyTable += '<tr><td class="text-center">' + (index + 1) + '</td>';
        bodyTable += '<td class="text-left">' + item.VENTAS_DETALLE_item + '</td>';
        bodyTable += '<td class="text-right">' + item.VENTAS_DETALLE_base_imponible.format(2, 3, ',', '.') + '</td>';
        bodyTable += '<td class="text-right">' + item.VENTAS_DETALLE_impuesto.format(2, 3, ',', '.') + '</td>';
        bodyTable += '<td class="text-right">' + item.VENTAS_DETALLE_monto_total.format(2, 3, ',', '.') + '</td>';
        bodyTable += '<td class="text-left">' + item.PROYECTO_proyecto + '</td>';
        bodyTable += '<td class="text-center"><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar-' + item.VENTAS_DETALLE_idventas_detalle + '"></span></td></tr>';
        $('#tbl_body').append(bodyTable);
        bodyTable = '';
        $('#modificar-' + item.VENTAS_DETALLE_idventas_detalle).unbind();
        $('#modificar-' + item.VENTAS_DETALLE_idventas_detalle).on('click', function () {
            setSelect2('#cbProyecto', item.PROYECTO_idproyecto, item.PROYECTO_EMPRESA_alias + ' - ' + item.PROYECTO_proyecto);
            $('#txtItem').val(item.VENTAS_DETALLE_item);
            $('#modal_insertar_titulo').html('MODIFICAR ' + item.VENTAS_DETALLE_item);
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    modificar(item.VENTAS_DETALLE_idventas_detalle);
                });
            });
        });
    });
}

function setSelect2(div, id, value) {
    $(div).empty().append('<option value="' + id + '">' + value + '</option>').val(id).trigger('change');
}

function modificar(id) {
    $.ajax({
        url: 'modificarFacturaProyectoEdit.aspx/modificar',
        type: "POST",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ID: id, cbProyecto: parseInt($('#cbProyecto').val())}),
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
        $('#modalInsertar').modal('toggle');
    });
}