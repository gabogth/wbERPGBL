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

function cargarCuentaContable() {
    $('#cbCuentaContable').select2({
        ajax: {
            url: 'cuentaContable_frmMantenimientoCuentaContable.aspx/buscar_estado',
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
                    datos[i].id = datos[i].idcuenta_contable;
                    datos[i].text = datos[i].CUENTA + ' - ' + datos[i].nombre_cuenta;
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

function cargarEntidadFinanciera() {
    $('#cbEntidadFinanciera').select2({
        
        ajax: {
            url: 'entidadfinanciera_frmMantenimientoEntidadFinanciera.aspx/buscar',
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
                    datos[i].id = datos[i].identidad_financiera;
                    datos[i].text = datos[i].alias;
                }
                console.log(datos);
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
            url: 'moneda_frmMantenimientoMoneda.aspx/buscar',
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
                    datos[i].id = datos[i].idmoneda;
                    datos[i].text = datos[i].moneda;
                }
                console.log(datos);
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
                console.log(datos);
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idempresa;
                    datos[i].text = datos[i].alias;
                }
                console.log(datos);
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

function clearInputs() {
    $('#frmInsertar input').each(function (index, item) {
        $(item).val('');
    });
    $('#frmInsertar textarea').each(function (index, item) {
        $(item).val('');
    });
}

function establecerData(data) {
    $('#txtNombreCuenta').val(data.nombre_cuenta);
    $('#txtNumeroCuenta').val(data.numero_cuenta);
    $('#cbEntidadFinanciera').empty().append('<option value="' + data.identidad_financiera + '">' + data.ENTIDAD_FINANCIERA_ALIAS + '</option>').val(data.identidad_financiera).trigger('change');
    $('#cbMoneda').empty().append('<option value="' + data.idmoneda + '">' + data.MONEDA_MONEDA + '</option>').val(data.idmoneda).trigger('change');
    $('#cbEmpresa').empty().append('<option value="' + data.idempresa + '">' + data.EMPRESA_ALIAS + '</option>').val(data.idempresa).trigger('change');
    $('#cbCuentaContable').empty().append('<option value="' + data.idcuenta_contable + '">' + data.CUENTA + ' ' + data.nombre_cuenta_contable + '</option>').val(data.idcuenta_contable).trigger('change');
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
    cargarCuentaContable();
    $('#txtBuscar').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#paginacionFoot').pagination('selectPage', 1);
            buscar(1, 10);
        }
    });
    cargarEmpresa();
    cargarEntidadFinanciera();
    cargarMoneda();
}

function buscar(indexPag, cantidad) {
    var query = 'q="' + $('#txtBuscar').val() + '"&index=' + indexPag + '&cantidad=' + cantidad;
    $.ajax({
        url: 'cuentascorrientes_frmMantenimientoCuentasCorrientes.aspx/buscar',
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
                bodyTable += '<td>' + item.nombre_cuenta + '</td>';
                bodyTable += '<td>' + item.numero_cuenta + '</td>';
                bodyTable += '<td>' + item.MONEDA_MONEDA + '</td>';
                bodyTable += '<td>' + item.ENTIDAD_FINANCIERA_ALIAS + '</td>';
                bodyTable += '<td>' + item.EMPRESA_ALIAS + '</td>';
                bodyTable += '<td>' + (item.nombre_cuenta_contable == null ? '<center>-</center>' : item.nombre_cuenta_contable) + '</td>';
                bodyTable += '<td class="text-center">' + getStateIcon(item.estado, 'estado' + item.idcuenta_corriente) + '</td>';
                bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idcuenta_corriente + '"></span></td>';
                bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idcuenta_corriente + '"></span></td></tr>';
                $('#tbl_body').append(bodyTable);
                bodyTable = '';
                $('#modificar' + item.idcuenta_corriente).unbind();
                $('#modificar' + item.idcuenta_corriente).on('click', function () {
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
                            modificar(item.idcuenta_corriente);
                        });
                    });
                });
                $('#eliminar' + item.idcuenta_corriente).unbind();
                $('#eliminar' + item.idcuenta_corriente).on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.nombre_cuenta + '</b> permanentemente?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        eliminar(item.idcuenta_corriente);
                    });
                });
                $('#estado' + item.idcuenta_corriente).unbind();
                $('#estado' + item.idcuenta_corriente).on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea cambiar el estado de <b>' + item.nombre_cuenta + '</b>?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        modificar_estado(item.idcuenta_corriente, Math.abs(item.estado - 1));
                    });
                });

            });
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
    var query = 'IDCUENTA_CORRIENTE=' + id +
        '&IDENTIDAD_FINANCIERA="' + encodeURIComponent($('#cbEntidadFinanciera').val()) + '"' +
        '&IDMONEDA=' + encodeURIComponent($('#cbMoneda').val()) +
        '&IDEMPRESA=' + encodeURIComponent($('#cbEmpresa').val()) +
        '&IDCUENTA_CONTABLE=' + encodeURIComponent($('#cbCuentaContable').val()) +
        '&NUMERO_CUENTA="' + encodeURIComponent($('#txtNumeroCuenta').val()) + '"' +
        '&NOMBRE_CUENTA="' + encodeURIComponent($('#txtNombreCuenta').val()) + '"';

    $.ajax({
        url: 'cuentascorrientes_frmMantenimientoCuentasCorrientes.aspx/modificar',
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
    var query = 'IDENTIDAD_FINANCIERA="' + encodeURIComponent($('#cbEntidadFinanciera').val()) + '"' +
            '&IDMONEDA=' + encodeURIComponent($('#cbMoneda').val()) +
            '&IDEMPRESA=' + encodeURIComponent($('#cbEmpresa').val()) +
            '&NUMERO_CUENTA="' + encodeURIComponent($('#txtNumeroCuenta').val()) + '"' +
            '&IDCUENTA_CONTABLE=' + encodeURIComponent($('#cbCuentaContable').val()) +
            '&NOMBRE_CUENTA="' + encodeURIComponent($('#txtNombreCuenta').val()) + '"';

    $.ajax({
        url: 'cuentascorrientes_frmMantenimientoCuentasCorrientes.aspx/insertar',
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
    var query = 'IDCUENTA_CORRIENTE=' + id;
    $.ajax({
        url: 'cuentascorrientes_frmMantenimientoCuentasCorrientes.aspx/eliminar',
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
    var query = 'IDCUENTA_CORRIENTE=' + id +
       '&ESTADO=' + estado;;
    $.ajax({
        url: 'cuentascorrientes_frmMantenimientoCuentasCorrientes.aspx/modificar_estado',
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