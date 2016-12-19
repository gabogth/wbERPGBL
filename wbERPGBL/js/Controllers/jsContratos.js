var auxEmpresa;
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
    $('#btnSeleccionarFoto').on('change', function () {
        var filename = $('#btnSeleccionarFoto').val();
        filename = filename.toLowerCase();
        filename = filename.replace('c:\\fakepath\\', '');
        $('#txtFoto').val(filename);
        readURL(this);
        $('#btnClearPreviewImage').show();
        $('#btnClearPreviewImage').unbind();
        $('#btnUploadAnexo').show();
        $('#btnClearPreviewImage').on('click', function () {
            filename = '';
            $('#btnSeleccionarFoto').val('');
            $('#txtFoto').val('');
            $('#pbFotoSelected').attr('src', '../img/unknowuser.png');
        });
    });
    $('#cbTrabajador').on('change', function (e) {
        var trabajador = $('#cbTrabajador').select2('data')[0];
        if (trabajador.sueldo_trabajador == null) {
            $('#txtEmpresa').val(auxEmpresa.razon_social);
            $('#txtIdEmpresa').val(auxEmpresa.idempresa);
            $('#txtSueldo').val(auxEmpresa.sueldo_trabajador == -1 ? null : auxEmpresa.sueldo_trabajador.toFixed(2));
            $('#txtIdSueldo').val(auxEmpresa.idsueldo_trabajador == -1 ? null : auxEmpresa.idsueldo_trabajador);
        } else {
            console.log("Combo", trabajador);
            $('#txtEmpresa').val(trabajador.EMPRESA_RAZON_SOCIAL);
            $('#txtIdEmpresa').val(trabajador.idempresa);
            $('#txtSueldo').val(trabajador.sueldo_trabajador == -1 ? null : trabajador.sueldo_trabajador.toFixed(2));
            $('#txtIdSueldo').val(trabajador.idsueldo_trabajador == -1 ? null : trabajador.idsueldo_trabajador);
        }
        
    });
    $('#ckIndefinido').on('ifChanged', function (e) {
        if ($('#ckIndefinido').is(':checked')) {
            $('#dtpFin').attr('required', false);
            $('#dtpFin').attr('disabled', true);
        } else {
            $('#dtpFin').attr('required', true);
            $('#dtpFin').attr('disabled', false);
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
    auxEmpresa = data;
    $('#cbTrabajador').empty().append('<option value="' + data.idtrabajador + '">' + data.usuario + ' - ' + data.nombre + '/' + data.apellido + '</option>').val(data.idtrabajador).trigger('change');
    $('#txtEmpresa').val(data.razon_social);
    $('#cbUsuarioEncargado').empty().append('<option value="' + data.usuario_encargado + '">' + data.ENCARGADO_USUARIO + ' - ' + data.ENCARGADO_NOMBRE + '/' + data.ENCARGADO_APELLIDO + '</option>').val(data.usuario_encargado).trigger('change');
    $('#dtpEvento').val(data.fecha_evento.split('T')[0]);
    $('#cbTipoContrato').empty().append('<option value="' + data.idtipo_contrato + '">' + data.tipo_contrato + '</option>').val(data.idtipo_contrato).trigger('change');
    $('#ckIndefinido').iCheck(data.es_indefinido == 1 ? 'check' : 'uncheck');
    $('#dtpInicio').val(data.fecha_inicio.split('T')[0]);
    $('#dtpFin').val(data.fecha_termino != null ? data.fecha_termino.split('T')[0] : null);
    $('#txtDetalles').val(data.detalles);
    $('#txtIdEmpresa').val(data.CONTRATISTA_IDEMPRESA);
    $('#txtSueldo').val(data.sueldo_trabajador);
    $('#txtIdSueldo').val(data.idsueldo_trabajador);
    $('#txtLabores').val(data.labores);
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
    cargarTrabajador();
    cargarTipoContrato();
}

function cargarTrabajador() {
    $('#cbTrabajador, #cbUsuarioEncargado').select2({
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

function cargarTipoContrato() {
    $('#cbTipoContrato').select2({
        theme: "themes-dark",
        ajax: {
            url: 'tipoContrato_frmMantenimientoTipoContrato.aspx/buscar_estado',
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
                    datos[i].id = datos[i].idtipo_contrato;
                    datos[i].text = datos[i].tipo_contrato;
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
        url: 'contratos_frmMantenimientoContratos.aspx/buscar',
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
                    bodyTable += '<td>' + item.apellido + '/' + item.nombre + '</td>';
                    bodyTable += '<td>' + item.alias + '</td>';
                    bodyTable += '<td class="text-center">' + item.fecha_evento.split('T')[0] + '</td>';
                    bodyTable += '<td class="text-left">' + item.sueldo_trabajador.toFixed(2) + '</td>';
                    bodyTable += '<td>' + item.tipo_contrato + '</td>';
                    bodyTable += '<td class="text-center">' + item.fecha_inicio.split('T')[0] + '</td>';
                    bodyTable += '<td class="text-center">' + (item.fecha_termino != null ? item.fecha_termino.split('T')[0] : '-') + '</td>';
                    if (item.fecha_termino != null) {
                        var fechaFin = moment(item.fecha_termino.split('T')[0], 'YYYY-MM-DD');
                        var fechaInicio = moment(item.fecha_inicio.split('T')[0], 'YYYY-MM-DD');
                        var fechaHoy = moment();
                        var diferenciaDias = fechaInicio.diff(fechaFin, 'days');
                        var restanDias = fechaHoy.diff(fechaFin, 'days');
                        bodyTable += '<td class="text-center">' + restanDias + ' días</td>';
                    } else {
                        bodyTable += '<td class="text-center">-</td>';
                    }
                    bodyTable += '<td>' + item.labores + '</td>';
                    bodyTable += '<td class="text-center">' + getStateIcon(item.estado, 'estado' + item.idcontrato_trabajador) + '</td>';
                    bodyTable += '<td class="text-center"><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idcontrato_trabajador + '"></span></td>';
                    bodyTable += '<td class="text-center"><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idcontrato_trabajador + '"></span></td>';
                    bodyTable += '<td class="text-center"><span class="fa fa-file" style="color:white; cursor: pointer;" id="preview' + item.idcontrato_trabajador + '"></span></td>';
                    bodyTable += '<td class="text-center"><span class="fa fa-folder-o" style="color:white; cursor: pointer;" id="downloads' + item.idcontrato_trabajador + '"></span></td></tr>';
                    $('#tbl_body').append(bodyTable);
                    bodyTable = '';
                    $('#modificar' + item.idcontrato_trabajador).unbind();
                    $('#modificar' + item.idcontrato_trabajador).on('click', function () {
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
                                modificar(item.idcontrato_trabajador);
                            });
                        });
                    });
                    $('#downloads' + item.idcontrato_trabajador).unbind();
                    $('#downloads' + item.idcontrato_trabajador).on('click', function () {
                        $('#btnUploadAnexo').unbind();
                        $('#btnUploadAnexo').on('click', function () {
                            insertar_anexos_proyecto(item.idcontrato_trabajador);
                        });
                        $('#modal_anexos_insertar_titulo').html('ARCHIVOS DEL CONTRATO DE  ' + item.nombre + '/' + item.apellido);
                        $('#modalAnexos').modal('show');
                        cargarUploadProyectos(item.idcontrato_trabajador);
                    });
                    $('#eliminar' + item.idcontrato_trabajador).unbind();
                    $('#eliminar' + item.idcontrato_trabajador).on('click', function () {
                        $('#btn_mensaje_aceptar').attr('disabled', false);
                        $('#btn_mensaje_cancelar').attr('disabled', false);
                        $('#modal_titulo_mensaje').html('Advertencia');
                        $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar el contrato de <b>' + item.nombre + '/' + item.apellido + '</b> permanentemente?');
                        $('#modal_mensaje').modal('show');
                        $('#btn_mensaje_aceptar').unbind();
                        $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                        $('#btn_mensaje_aceptar').on('click', function () {
                            eliminar(item.idcontrato_trabajador);
                        });
                    });

                    $('#preview' + item.idcontrato_trabajador).unbind();
                    $('#preview' + item.idcontrato_trabajador).on('click', function () {
                        showPreview(item.idcontrato_trabajador, item.nombre, item.apellido, item.fecha_evento, item.ruc);
                    });

                    $('#estado' + item.idcontrato_trabajador).unbind();
                    $('#estado' + item.idcontrato_trabajador).on('click', function () {
                        $('#btn_mensaje_aceptar').attr('disabled', false);
                        $('#btn_mensaje_cancelar').attr('disabled', false);
                        $('#modal_titulo_mensaje').html('Advertencia');
                        $('#cuerpo_mensaje').html('¿Está seguro que desea cambiar el estado del contrato de <b>' + item.nombre + '/' + item.apellido + '</b>?');
                        $('#modal_mensaje').modal('show');
                        $('#btn_mensaje_aceptar').unbind();
                        $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
                        $('#btn_mensaje_aceptar').on('click', function () {
                            modificar_estado(item.idcontrato_trabajador, Math.abs(item.estado - 1));
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

function cargarUploadProyectos(id) {
    $.ajax({
        url: 'contratos_frmMantenimientoContratos.aspx/buscarUploads',
        type: "GET",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: 'IDCONTRATO=' + id,
        beforeSend: function () {
            $('#tbl_body_anexos').html('<tr><td colspan="14" class="text-center"><span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;&nbsp;Procesando...</td></tr>');
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            $('#tbl_body_anexos').html('<tr><td colspan="14" class="text-center">Error: ' + jsonData.message + '</td></tr>');
        } else {
            $('#tbl_body_anexos').html('');
            var bodyTable = '';
            $.each(jsonData.body, function (index, item) {
                bodyTable = '';
                bodyTable += '<tr><td>' + (index + 1) + '</td>';
                bodyTable += '<td class="text-left"> <a href="../response/upload_anexo_contrato.ashx?IDUPLOAD_CONTRATO=' + item.idupload_contrato + '" target="_blank">' + item.nombre_archivo + '</a></td>';
                bodyTable += '<td class="text-right">' + item.peso_archivo + '</td>';
                bodyTable += '<td class="text-center">' + item.fecha_creacion.replace('T', ' a las ') + '</td>';
                bodyTable += '<td class="text-center">' + item.extension + '</td>';
                bodyTable += '<td class="text-center"><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar_anexo' + item.idupload_contrato + '"></span></td></tr>';
                $('#tbl_body_anexos').append(bodyTable);
                bodyTable = '';
                $('#eliminar_anexo' + item.idupload_contrato).unbind();
                $('#eliminar_anexo' + item.idupload_contrato).on('click', function () {
                    eiminar_anexos_proyecto(item.idupload_contrato, id);
                });
            });
        }
    }).fail(function (ort, rt, qrt) {
        $('#tbl_body_anexos').html('<tr><td colspan="14" class="text-center">Error: ' + jsonData.rt + '</td></tr>');
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
    var query = 'IDCONTRATO_TRABAJADOR=' + id +
        '&FECHA_EVENTO="' + encodeURIComponent($('#dtpEvento').val()) + '"' +
        '&LABORES="' + encodeURIComponent($('#txtLabores').val()) + '"' +
        '&DETALLES="' + encodeURIComponent($('#txtDetalles').val()) + '"' +
        '&USUARIO_ENCARGADO=' + encodeURIComponent($('#cbUsuarioEncargado').val()) +
        '&IDTIPO_CONTRATO=' + encodeURIComponent($('#cbTipoContrato').val()) +
        '&IDEMPRESA=' + encodeURIComponent($('#txtIdEmpresa').val()) +
        '&IDTRABAJADOR=' + encodeURIComponent($('#cbTrabajador').val()) + 
        '&IDSUELDO_TRABAJADOR=' + encodeURIComponent($('#txtIdSueldo').val()) +
        '&ES_INDEFINIDO=' + encodeURIComponent($('#ckIndefinido').is(':checked') ? '1' : '0') +
        '&FECHA_INICIO="' + encodeURIComponent($('#dtpInicio').val()) + '"' +
        '&FECHA_TERMINO=' + encodeURIComponent($('#ckIndefinido').is(':checked') ? null : '"' + $('#dtpFin').val() + '"');
    $.ajax({
        url: 'contratos_frmMantenimientoContratos.aspx/modificar',
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
    var query = 'FECHA_EVENTO="' + encodeURIComponent($('#dtpEvento').val()) + '"' +
        '&DETALLES="' + encodeURIComponent($('#txtDetalles').val()) + '"' +
        '&USUARIO_ENCARGADO=' + encodeURIComponent($('#cbUsuarioEncargado').val()) +
        '&LABORES="' + encodeURIComponent($('#txtLabores').val()) + '"' +
        '&IDTIPO_CONTRATO=' + encodeURIComponent($('#cbTipoContrato').val()) +
        '&IDTRABAJADOR=' + encodeURIComponent($('#cbTrabajador').val()) +
        '&IDSUELDO_TRABAJADOR=' + encodeURIComponent($('#txtIdSueldo').val()) +
        '&IDEMPRESA=' + encodeURIComponent($('#txtIdEmpresa').val()) +
        '&ES_INDEFINIDO=' + encodeURIComponent($('#ckIndefinido').is(':checked') ? '1' : '0') +
        '&FECHA_INICIO="' + encodeURIComponent($('#dtpInicio').val()) + '"' +
        '&FECHA_TERMINO=' + encodeURIComponent($('#ckIndefinido').is(':checked') ? null : '"' + $('#dtpFin').val() + '"');

    $.ajax({
        url: 'contratos_frmMantenimientoContratos.aspx/insertar',
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
    var query = 'IDCONTRATO_TRABAJADOR=' + id;
    $.ajax({
        url: 'contratos_frmMantenimientoContratos.aspx/eliminar',
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


function insertar_anexos_proyecto(idcontrato) {
    var data = new FormData();
    console.log($('#btnSeleccionarFoto')[0].files);
    jQuery.each($('#btnSeleccionarFoto')[0].files, function (i, file) {
        data.append('file-' + i, file);
    });
    var filename = $('#btnSeleccionarFoto').val();
    var fileType = $('#btnSeleccionarFoto')[0].files[0].type;
    filename = filename.toLowerCase();
    filename = filename.replace('c:\\fakepath\\', '');
    data.append('OP', 'INSERTAR');
    data.append('NOMBRE_ARCHIVO', filename);
    data.append('FILE_TYPE', fileType);
    data.append('IDCONTRATO', idcontrato);
    console.log(data);
    $.ajax({
        url: '../response/upload_anexo_contrato.ashx',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        beforeSend: function () {
            $('#pbUploadAnexo').attr('aria-valuenow', '0');
            $('#pbUploadAnexo').css('width', 0);
        },
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    percentComplete = parseInt(percentComplete * 100);
                    $('#pbUploadAnexo').attr('aria-valuenow', percentComplete + '%');
                    $('#pbUploadAnexo').css('width', percentComplete + '%');
                    $('#lblStatus').html('<i>' + percentComplete + '% completado</i>');
                    if (percentComplete === 100) {
                        $('#pbUploadAnexo').attr('aria-valuenow', '0%');
                        $('#pbUploadAnexo').css('width', '0%');
                    }
                }
            }, false);
            return xhr;
        }
    }).done(function (data) {
        $('#lblStatus').html('<i>Subido correctamente.</i>');
        $('#pbUploadAnexo').attr('aria-valuenow', '0%');
        $('#pbUploadAnexo').css('width', '0%');
        cargarUploadProyectos(idcontrato);
    }).fail(function (ort, rt, qrt) {
        $('#lblStatus').html('<i>Un error ha ocurrido.</i>');
        $('#pbUploadAnexo').attr('aria-valuenow', '0%');
        $('#pbUploadAnexo').css('width', '0%');
        cargarUploadProyectos(idcontrato);
    });
}

function eiminar_anexos_proyecto(idUpload, idcontrato) {
    var data = new FormData();
    data.append('OP', 'ELIMINAR');
    data.append('IDUPLOAD_CONTRATO', idUpload);
    console.log(data);
    $.ajax({
        url: '../response/upload_anexo_contrato.ashx',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {
            
        }
    }).done(function (data) {
        if (data.result != 'success') {
            alert('Un error ah ocurrido: ' + data.message);
        } else {
            cargarUploadProyectos(idcontrato);
        }
    }).fail(function (ort, rt, qrt) {
        alert('Un error ah ocurrido: ' + rt);
        cargarUploadProyectos(idcontrato);
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function showPreview(idContrato, nombre, apellido, fecha_evento, ruc) {
    $('#frmControlPreview').attr('src', 'Reportes/frmContratoPreview.aspx?ID=' + idContrato);
    $('#contratoPreview').modal('show');
    $('#dvLoading').show();
    $('#frmControlPreview').hide();
    $('#frmControlPreview').unbind();
    $('#frmControlPreview').on('load', function () {
        $('#dvLoading').hide();
        $('#frmControlPreview').show();
    });
    $('#facturaTitulo').html(
        '[' + ruc + ']-(' + fecha_evento + '):' + nombre + '' + apellido
    );
}

function modificar_estado(id, estado) {
    var query = 'IDCONTRATO_TRABAJADOR=' + id +
       '&ESTADO=' + estado;;
    $.ajax({
        url: 'contratos_frmMantenimientoContratos.aspx/modificar_estado',
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