$(function () {
    initializeComponents();
    cargarRepresentante();
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
    $('#txtRuc').val(data.ruc);
    $('#txtRazonSocial').val(data.razon_social);
    $('#txtDireccion').val(data.direccion);
    $('#txtAlias').val(data.alias);
    $('#txtVision').val(data.vision);
    $('#txtMision').val(data.mision);
    $('#txtValores').val(data.valores);
    $('#txtEtica').val(data.etica);
    $('#txtPoliticas').val(data.politicas);
    $('#txtActividadEconomica').val(data.actividad_economica);
    $('#txtPartidaRegistral').val(data.partida_registral);
    setSelect2('#cbRepresentante', data.usuario_representante_legal, data.usuario);
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
    $('#txtBuscar').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#paginacionFoot').pagination('selectPage', 1);
            buscar(1, 10);
        }
    });
}

function buscar(indexPag, cantidad) {
    var query = 'q="' + $('#txtBuscar').val() + '"&index=' + indexPag + '&cantidad=' + cantidad;
    $.ajax({
        url: 'empresa_frmMantenimientoEmpresa.aspx/buscar',
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
            $.each(jsonData.body, function (index, item) {
                bodyTable = '';
                bodyTable += '<tr><td>' + (((indexPag - 1) * cantidad) + index + 1) + '</td>';
                bodyTable += '<td>' + item.ruc + '</td>';
                bodyTable += '<td>' + item.razon_social + '</td>';
                bodyTable += '<td>' + item.direccion + '</td>';
                bodyTable += '<td class="text-center">' + getStateIcon(item.estado, 'estado' + item.idempresa) + '</td>';
                bodyTable += '<td>' + item.alias + '</td>';
                bodyTable += '<td title="' + item.vision + '">' + (item.vision.length >= 10 && item != null ? item.vision.substring(0, 10) : item.vision) + '...' + '</td>';
                bodyTable += '<td title="' + item.mision + '">' + (item.mision.length >= 10 && item != null ? item.mision.substring(0, 10) : item.mision) + '...' + '</td>';
                bodyTable += '<td title="' + item.valores + '">' + (item.valores.length >= 10 && item != null ? item.valores.substring(0, 10) : item.valores) + '...' + '</td>';
                bodyTable += '<td title="' + item.etica + '">' + (item.etica.length >= 10 && item != null ? item.etica.substring(0, 10) : item.etica) + '...' + '</td>';
                bodyTable += '<td title="' + item.politicas + '">' + (item.politicas != null && item.politicas.length >= 10 ? item.politicas.substring(0, 10) : item.politicas) + '...' + '</td>';
                bodyTable += '<td title="' + item.partida_registral + '">' + (item.partida_registral != null && item.partida_registral.length >= 10 ? item.partida_registral.substring(0, 10) : item.partida_registral) + '...' + '</td>';
                bodyTable += '<td title="' + item.actividad_economica + '">' + (item.actividad_economica != null && item.actividad_economica.length >= 10 ? item.actividad_economica.substring(0, 10) : item.actividad_economica) + '...' + '</td>';
                bodyTable += '<td>' + (item.nombre != null ? (item.nombre + ' ' + item.apellido) : '') + '</td>';
                bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idempresa + '"></span></td>';
                bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idempresa + '"></span></td></tr>';
                $('#tbl_body').append(bodyTable);
                bodyTable = '';
                $('#modificar' + item.idempresa).unbind();
                $('#modificar' + item.idempresa).on('click', function () {
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
                            modificar(item.idempresa);
                        });
                    });
                });
                $('#eliminar' + item.idempresa).unbind();
                $('#eliminar' + item.idempresa).on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.razon_social + '</b> permanentemente?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        eliminar(item.idempresa);
                    });
                });

            });
            $('#paginacionFoot').pagination('updateItems', jsonData.registros);
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
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

    var formData = $('#frmInsertar').serializeJSON();

    formData["IDEMPRESA"] = id;
    console.log(formData);

    $.ajax({
        url: 'empresa_frmMantenimientoEmpresa.aspx/modificar',
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
            console.log(actualIndex);
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modalInsertar').modal('toggle');
        console.log(ort);
        console.log(rt);
        console.log(qrt);
    });
}

function insertar() {
    var formData = $('#frmInsertar').serializeJSON();
    $.ajax({
        url: 'empresa_frmMantenimientoEmpresa.aspx/insertar',
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
            console.log(actualIndex);
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modalInsertar').modal('toggle');
        console.log(ort);
        console.log(rt);
        console.log(qrt);
    });
}

function eliminar(id) {
    var query = 'IDEMPRESA=' + id;
    $.ajax({
        url: 'empresa_frmMantenimientoEmpresa.aspx/eliminar',
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

function cargarRepresentante() {
    $('#cbRepresentante').select2({
        theme: "themes-dark",
        ajax: {
            url: 'usuario_frmMantenimientoUsuario.aspx/buscar_trabajador',
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
                if (datos != null) {
                    for (var i = 0; i < datos.length; i++) {
                        datos[i].id = datos[i].idusuario;
                        datos[i].text = datos[i].usuario + ' - ' + datos[i].nombre + '/' + datos[i].apellido;
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