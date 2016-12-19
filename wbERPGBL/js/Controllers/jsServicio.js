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
    $('#txtServicio').val(data.servicio);
    $('#txtCaracteristicas').val(data.descripcion);
    setSelect2('#cbTipoIntangible', data.idtipo_intangible, data.tipo_intangible);
}

function setSelect2(div, id, value) {
    $(div).empty().append('<option value="' + id + '">' + value + '</option>').val(id).trigger('change');
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
    paginacion();
    cargarTipoExistencia();
    $('#txtBuscar').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#paginacionFoot').pagination('selectPage', 1);
            buscar(1, 10);
        }
    });
}

function buscar(indexPag, cantidad) {
    $.ajax({
        url: 'serviciosMantenimiento.aspx/buscar',
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
        bodyTable += '<td>' + item.servicio + '</td>';
        bodyTable += '<td title="' + item.descripcion + '">' + (item.descripcion.length > 20 ? item.descripcion.substring(0, 19) : item.descripcion) + '</td>';
        bodyTable += '<td>' + item.tipo_intangible + '</td>';
        bodyTable += '<td class="text-center">' + getStateIcon(item.estado, 'estado' + item.idservicio) + '</td>';
        bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idservicio + '"></span></td>';
        bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idservicio + '"></span></td></tr>';
        $('#tbl_body').append(bodyTable);
        bodyTable = '';
        $('#modificar' + item.idservicio).unbind();
        $('#modificar' + item.idservicio).on('click', function () {
            establecerData(item);
            $('#modal_insertar_titulo').html('MODIFICAR ' + item.servicio);
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    modificar(item.idservicio);
                });
            });
        });
        $('#eliminar' + item.idservicio).unbind();
        $('#eliminar' + item.idservicio).on('click', function () {
            $('#btn_mensaje_aceptar').attr('disabled', false);
            $('#btn_mensaje_cancelar').attr('disabled', false);
            $('#modal_titulo_mensaje').html('Advertencia');
            $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.servicio + '</b> permanentemente?');
            $('#modal_mensaje').modal('show');
            $('#btn_mensaje_aceptar').unbind();
            $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
            $('#btn_mensaje_aceptar').on('click', function () {
                eliminar(item.idservicio);
            });
        });
        $('#estado' + item.idservicio).unbind();
        $('#estado' + item.idservicio).on('click', function () {
            $('#btn_mensaje_aceptar').attr('disabled', false);
            $('#btn_mensaje_cancelar').attr('disabled', false);
            $('#modal_titulo_mensaje').html('Advertencia');
            $('#cuerpo_mensaje').html('¿Está seguro que desea modificar el estado de <b>' + item.servicio + '</b> permanentemente?');
            $('#modal_mensaje').modal('show');
            $('#btn_mensaje_aceptar').unbind();
            $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
            $('#btn_mensaje_aceptar').on('click', function () {
                modificar_estado(item.idservicio, Math.abs(item.estado - 1));
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
        url: 'serviciosMantenimiento.aspx/insertar',
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
        url: 'serviciosMantenimiento.aspx/modificar',
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
        url: 'serviciosMantenimiento.aspx/modificar_estado',
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
        url: 'serviciosMantenimiento.aspx/eliminar',
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

function cargarTipoExistencia() {
    $('#cbTipoIntangible').select2({
        ajax: {
            url: 'tipoIntangibleMantenimiento.aspx/buscar_estado',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            data: function (params) {
                if (params === null) {
                    return JSON.stringify({ q: "", index: 1, cantidad: 10 });
                } else {
                    console.log(JSON.stringify({ q: (params.term == null ? '' : params.term), index: 1, cantidad: 10 }));
                    return JSON.stringify({ q: (params.term == null ? '' : params.term), index: 1, cantidad: 10 });
                }
            },
            initSelection: function (element, callback) {
                console.log(element);
            },
            processResults: function (data, page) {
                var datos = jQuery.parseJSON(data.d);
                datos = datos.body;
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idtipo_intangible;
                    datos[i].text = datos[i].tipo_intangible;
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