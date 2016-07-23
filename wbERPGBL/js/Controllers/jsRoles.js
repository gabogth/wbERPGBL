$(function () {
    initializeComponents();
    $('#btnInsertar').unbind();
    $('#btnInsertar').on('click', function () {
        showCuadroItems(0, 'INSERTAR', null);
    });
    buscar(1, 10);
});

function showCuadroItems(IDROL, MODE, objResult){
    $.ajax({
        url: 'roles_frmMantenimientoRoles.aspx/listar_items',
        type: "GET",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: 'IDROL=' + IDROL,
        beforeSend: function () {

        }
    }).done(function (data, result) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
            $('#paginacionFoot').pagination('updateItems', 1);
        } else {
            var esInicio = 0;
            var count_categoria = 0;
            var count_formulario = 0;
            var ant_categoria = 0;
            $('#tbl_formularios').html('');
            $.each(jsonData.body, function (index, item) {
                if (esInicio == 0) {
                    esInicio = 1;
                    ant_categoria = item.idcategoria;
                    $('#tbl_formularios').append('<tr>');
                    $('#tbl_formularios').append('<td colspan="2">' + (count_categoria + 1) + '</td>');
                    $('#tbl_formularios').append('<td><b>' + item.CATEGORIA_NOMBRE_MOSTRAR + '</b></td>');
                    $('#tbl_formularios').append('<td class="text-center"><input type="checkbox" name="gbCategoriaAll" class="NoName" id="gbCatAll-' + item.idcategoria + '" value="-1" style="opacity: 50;" /></td></tr>');
                    $('#tbl_formularios').append('<tr>');
                    $('#tbl_formularios').append('<td>&nbsp;</td>');
                    $('#tbl_formularios').append('<td>' + (count_categoria + 1) + '.' + (count_formulario + 1) + '</td>');
                    $('#tbl_formularios').append('<td style="padding-left:2em">' + item.FORMULARIO_NOMBRE_MOSTRAR + '</td>');
                    $('#tbl_formularios').append('<td class="text-center"><input data-inner="cat-' + item.idcategoria + '" type="checkbox" name="gbCategoria' + item.idcategoria + '" value="' + item.idformulario + '" style="opacity: 50;" ' + (item.MARK == 1 ? 'checked="checked"' : '') + ' /></td></tr>');

                    $('#gbCatAll-' + item.idcategoria).unbind();
                    $('#gbCatAll-' + item.idcategoria).change(function (e) {
                        $('input[data-inner=cat-' + item.idcategoria + ']').each(function (inIndex, inItem) {
                            if ($('#gbCatAll-' + item.idcategoria).is(':checked')) {
                                $(this).prop('checked', true);
                            } else {
                                $(this).prop('checked', false);
                            }
                        });
                    });

                    count_formulario++;
                } else {
                    if (ant_categoria == item.idcategoria) {
                        $('#tbl_formularios').append('<tr>');
                        $('#tbl_formularios').append('<td>&nbsp;</td>');
                        $('#tbl_formularios').append('<td>' + (count_categoria + 1) + '.' + (count_formulario + 1) + '</td>');
                        $('#tbl_formularios').append('<td style="padding-left:2em">' + item.FORMULARIO_NOMBRE_MOSTRAR + '</td>');
                        $('#tbl_formularios').append('<td class="text-center"><input type="checkbox" data-inner="cat-' + item.idcategoria + '" name="gbCategoria' + item.idcategoria + '" value="' + item.idformulario + '" style="opacity: 50;" ' + (item.MARK == 1 ? 'checked="checked"' : '') + ' /></td></tr>');
                        count_formulario++;
                    } else {
                        count_categoria++;
                        count_formulario = 0;
                        ant_categoria = item.idcategoria;
                        $('#tbl_formularios').append('<tr>');
                        $('#tbl_formularios').append('<td colspan="2">' + (count_categoria + 1) + '</td>');
                        $('#tbl_formularios').append('<td>' + item.CATEGORIA_NOMBRE_MOSTRAR + '</td>');
                        $('#tbl_formularios').append('<td class="text-center"><input type="checkbox" name="gbCategoriaAll" value="-1" id="gbCatAll-' + item.idcategoria + '" style="opacity: 50;" /></td></tr>');

                        $('#tbl_formularios').append('<tr>');
                        $('#tbl_formularios').append('<td>&nbsp;</td>');
                        $('#tbl_formularios').append('<td>' + (count_categoria + 1) + '.' + (count_formulario + 1) + '</td>');
                        $('#tbl_formularios').append('<td style="padding-left:2em">' + item.FORMULARIO_NOMBRE_MOSTRAR + '</td>');
                        $('#tbl_formularios').append('<td class="text-center"><input data-inner="cat-' + item.idcategoria + '" type="checkbox" name="gbCategoria' + item.idcategoria + '" value="' + item.idformulario + '" style="opacity: 50;" ' + (item.MARK == 1 ? 'checked="checked"' : '') + ' /></td></tr>');
                        count_formulario++;
                        $('#gbCatAll-' + item.idcategoria).unbind();
                        $('#gbCatAll-' + item.idcategoria).change(function (e) {
                            $('input[data-inner=cat-' + item.idcategoria + ']').each(function (inIndex, inItem) {
                                if ($('#gbCatAll-' + item.idcategoria).is(':checked')) {
                                    $(this).prop('checked', true);
                                } else {
                                    $(this).prop('checked', false);
                                }
                            });
                        });
                    }
                }
            });
        }
    }).fail(function (responseObject, responseText, hqqr) {
        $('#tbl_formularios').html('<tr><td colspan="13" class="text-center">Error: ' + responseText + '</td></tr>');
    }).always(function (jqXHR, textStatus, errorThrown) {
        if (MODE == 'INSERTAR') {
            $('#modal_insertar_titulo').html('Insertar');
            $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#modalInsertar').modal('show');
            $('#btnGuardar').unbind();
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    insertar();
                });
            });
        } else {
            $('#modal_insertar_titulo').html('MODIFICAR');
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
            var jsonData = jQuery.parseJSON(jqXHR.d);
            console.log(jsonData);
            establecerData(objResult);
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    modificar(objResult.idrol);
                });
            });
        }
    });
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

function establecerData(data) {
    $('#txtRol').val(data.rol);
    $('#txtFecha').val(data.fecha_consulta.split('T')[0]);

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
        url: 'roles_frmMantenimientoRoles.aspx/buscar',
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
                bodyTable += '<td>' + item.rol + '</td>';
                bodyTable += '<td>' + item.fecha_consulta.split('T')[0] + '</td>';
                bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idrol + '"></span></td>';
                bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idrol + '"></span></td></tr>';
                $('#tbl_body').append(bodyTable);
                bodyTable = '';
                $('#modificar' + item.idrol).unbind();
                $('#modificar' + item.idrol).on('click', function () {
                    showCuadroItems(item.idrol, 'MODIFICAR', item)
                });
                $('#eliminar' + item.idrol).unbind();
                $('#eliminar' + item.idrol).on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.rol + '</b> permanentemente?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        eliminar(item.idrol);
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

function getCheckedIDS() {
    var ids = "";
    $('#tbl_formularios input[type=checkbox]').each(function (index, item) {
        ids += $(this).is(':checked') ? ($(this).val() != '-1' ? $(this).val() + '|' : '') : '';
    });
    return ids.length > 0 ? ids.substring(0, ids.length - 1) : '';
}

function getIcon(data) {
    var result = '';
    for (var i = 0; i < data.length; i++) {
        if (data[i] == '0') {
            result += '<span class="fa fa-times text-danger"></span>';
        } else {
            result += '<span class="fa fa-check text-success"></span>';
        }
    }
    return result;
}

function modificar(idrol) {
    var query = 'idrol=' + idrol +
        '&rol="' + $('#txtRol').val() + '"' +
        '&idFormularios="' + getCheckedIDS() + '"' +
        '&fecha_consulta="' + $('#txtFecha').val() + '"';
    $.ajax({
        url: 'roles_frmMantenimientoRoles.aspx/modificar',
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
    var query = 'rol="' + $('#txtRol').val() + '"' +
        '&idFormularios="' + getCheckedIDS() + '"' +
        '&fecha_consulta="' + $('#txtFecha').val() + '"';
    $.ajax({
        url: 'roles_frmMantenimientoRoles.aspx/insertar',
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

function eliminar(idrol) {
    var query = 'idrol=' + idrol;
    $.ajax({
        url: 'roles_frmMantenimientoRoles.aspx/eliminar',
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

