$(function () {
    initializeComponents();
    $('#btnInsertar').unbind();
    $('#btnInsertar').on('click', function () {
        $('#modal_insertar_titulo').html('Insertar');
        $('#dvPW').show();
        $('#txtPassword').attr('required', true);
        $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
        $('#btnGuardar').attr('disabled', false);
        $('#btnCancelar').attr('disabled', false);
        $('#txtUsuario').attr('readonly', false);
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
        $('#btnClearPreviewImage').on('click', function () {
            filename = '';
            $('#btnSeleccionarFoto').val('');
            $('#txtFoto').val('');
            $('#pbFotoSelected').attr('src', '../img/unknowuser.png');
        });
    });
    $('#btnBuscarReniec').unbind();
    $('#btnBuscarReniec').on('click', function (e) {
        e.preventDefault();
        validarDNI(e);
    });
});

function validarDNI(e) {
    $.ajax({
        url: 'usuario_frmMantenimientoUsuario.aspx/consultaReniec',
        type: "GET",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: 'dni="' + $('#txtDNI').val() + '"',
        beforeSend: function () {
            $('#txtDNI').attr('disabled', true);
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.Resultado == 'success') {
            $('#txtNombre').val(jsonData.Nombres);
            $('#txtApellido').val(jsonData.Apellido_paterno + ' ' + jsonData.Apellido_materno);
        } else {
            $('#txtNombre').val('');
            $('#txtApellido').val('');
        }
        $('#txtDNI').attr('disabled', false);
        $('#txtDNI').focus();
    }).fail(function (ort, rt, qrt) {
        $('#txtDNI').attr('disabled', false);
        $('#txtDNI').focus();
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
    cargarRoles();
    cargarEmpresa();
    cargarAreas();
    cargarPuesto();
    cargarSede();
}

function cargarPuesto() {
    $('#cbPuesto').select2({
        
        ajax: {
            url: 'puestotrabajador_frmMantenimientoPuestoTrabajador.aspx/buscar',
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
                    datos[i].id = datos[i].idpuesto_trabajador;
                    datos[i].text = datos[i].puesto_trabajador;
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

function cargarSede() {
    $('#cbSede').select2({
        
        ajax: {
            url: 'sede_frmMantenimientoSede.aspx/buscar_estado',
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
                    datos[i].id = datos[i].idsede;
                    datos[i].text = datos[i].sede;
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

function cargarRoles() {
    $('#cbRol').select2({
        
        ajax: {
            url: 'roles_frmMantenimientoRoles.aspx/buscar',
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
                    datos[i].id = datos[i].idrol;
                    datos[i].text = datos[i].rol;
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
function cargarAreas() {
    $('#cbArea').select2({
        
        ajax: {
            url: 'areaempresa_frmMantenimientoAreaEmpresa.aspx/buscar',
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
                    datos[i].id = datos[i].idarea_empresa;
                    datos[i].text = datos[i].area;
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
function clearInputs() {
    $('#frmInsertar input').each(function (index, item) {
        $(item).val('');
    });
    $('#btnClearPreviewImage').hide();
    $('#pbFotoSelected').attr('src', '../img/unknowuser.png');
    $('#frmInsertar textarea').each(function (index, item) {
        $(item).val('');
    });
}

function establecerData(data) {
    $('#txtUsuario').val(data.usuario);
    $('#txtUsuario').attr('readonly', true);
    $('#txtDNI').val(data.dni);
    $('#txtNombre').val(data.nombre);
    $('#txtApellido').val(data.apellido);
    $('#txtCorreo').val(data.correo);
    $('#txtFechaNacimiento').val(data.fecha_nacimiento.split('T')[0]);
    $("#cbRol").empty().append('<option value="' + data.idrol + '">' + data.ROL_ROL + '</option>').val(data.idrol).trigger('change');
    $("#cbSede").empty().append('<option value="' + data.idsede + '">' + data.SEDE_SEDE + '</option>').val(data.idsede).trigger('change');
    $('#cbArea').empty().append('<option value="' + data.idarea_empresa + '">' + data.area + '</option>').val(data.idarea_empresa).trigger('change');
    $('#cbEmpresa').empty().append('<option value="' + data.idempresa + '">' + data.alias + '</option>').val(data.idempresa).trigger('change');
    $('#cbPuesto').empty().append('<option value="' + data.idpuesto_trabajador + '">' + data.PUESTO_TRABAJADOR_PUESTO_TRABAJADOR + '</option>').val(data.idpuesto_trabajador).trigger('change');
    $('#txtCodigoEmpleado').val(data.codigo_empleado);
    $('#txtDomicilio').val(data.domicilio);
    $('#txtMovilPrivado1').val(data.movil_privado1);
    $('#txtMovilPrivado2').val(data.movil_privado2);
    $('#txtMovilEmpesarial').val(data.movil_empresarial);
    $('#txtTelefonoFijo').val(data.telefono_fijo);
    $('#txtContacto1').val(data.contacto1);
    $('#ckIsTrabajador').iCheck(data.es_trabajador == "1" ? 'check' : 'uncheck');
    $('#txtContacto2').val(data.contacto2);
    $('#txtFoto').val(data.foto);
    if (data.foto != '') {
        $('#pbFotoSelected').attr('src', '../response/img_usuario.ashx?ID=' + data.idusuario);
        $('#btnClearPreviewImage').show();
        $('#btnClearPreviewImage').unbind();
        $('#btnClearPreviewImage').on('click', function () {
            filename = '';
            $('#btnSeleccionarFoto').val('');
            $('#txtFoto').val('');
            $('#pbFotoSelected').attr('src', '../img/unknowuser.png');
        });
    } else {
        $('#pbFotoSelected').attr('src', '../img/unknowuser.png');
        $('#btnClearPreviewImage').hide();
    }
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



function buscar(indexPag, cantidad) {
    var query = 'q="' + $('#txtBuscar').val() + '"&index=' + indexPag + '&cantidad=' + cantidad;
    $.ajax({
        url: 'usuario_frmMantenimientoUsuario.aspx/buscar',
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
                bodyTable += '<td>' + item.usuario + '</td>';
                bodyTable += '<td>' + item.SEDE_SEDE + '</td>';
                bodyTable += '<td>' + item.nombre + '/' + item.apellido + '</td>';
                bodyTable += '<td>' + item.correo + '</td>';
                bodyTable += '<td>' + item.ROL_ROL + '</td>';
                bodyTable += '<td class="text-center">' + getStateIcon(item.estado, 'estado' + item.idusuario) + '</td>';
                bodyTable += '<td><span class="fa fa-key text-warning" style="cursor: pointer;" id="ccu' + item.idusuario + '"></span></td>';
                bodyTable += '<td><span class="fa fa-eye" style="cursor: pointer;" id="vcu' + item.idusuario + '"></span></td>';
                bodyTable += '<td><span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar' + item.idusuario + '"></span></td>';
                bodyTable += '<td><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar' + item.idusuario + '"></span></td>';
                bodyTable += '<td><span class="fa fa-th" style="color:white; cursor: pointer;" id="preview' + item.idusuario + '"></span></td></tr>';
                $('#tbl_body').append(bodyTable);
                bodyTable = '';
                $('#modificar' + item.idusuario).unbind();
                $('#modificar' + item.idusuario).on('click', function () {
                    establecerData(item);
                    $('#dvPW').hide();
                    $('#txtPassword').attr('required', false);
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
                            modificar(item.idusuario);
                        });
                    });
                });
                $('#eliminar' + item.idusuario).unbind();
                $('#eliminar' + item.idusuario).on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.nombre + '/' + item.apellido + '</b> permanentemente?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        eliminar(item.idusuario);
                    });
                });

                $('#estado' + item.idusuario).unbind();
                $('#estado' + item.idusuario).on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea cambiar es estado de <b>' + item.nombre + '/' + item.apellido + '</b>?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        modificar_estado(item.idusuario, Math.abs(item.estado - 1), item.usuario);
                    });
                });

                $('#ccu' + item.idusuario).unbind();
                $('#ccu' + item.idusuario).on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea resetear la contraseña de <b>' + item.nombre + '/' + item.apellido + '</b>?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        reset_pw(item.idusuario, item.usuario);
                    });
                });

                $('#preview' + item.idusuario).unbind();
                $('#preview' + item.idusuario).on('click', function () {
                    establecerData(item);
                    $('#modal_insertar_titulo').html('Ver a ' + item.usuario);
                    $('#modalInsertar').modal('show');
                    $('#btnGuardar').attr('disabled', false);
                    $('#btnCancelar').attr('disabled', false);
                    $('#btnGuardar').unbind();
                    $('#btnGuardar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
                    $('#btnGuardar').on('click', function () {
                        $('#frmInsertar').unbind();
                        $('#frmInsertar').submit(function (e) {
                            e.preventDefault();
                            modificar(item.idusuario);
                        });
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
    var data = new FormData();
    jQuery.each($('#btnSeleccionarFoto')[0].files, function (i, file) {
        data.append('file-' + i, file);
    });
    data.append('OP', 'MODIFICAR');
    data.append('IDUSUARIO', id);
    data.append('NOMBRE', $('#txtNombre').val());
    data.append('APELLIDO', $('#txtApellido').val());
    data.append('DNI',$('#txtDNI').val());
    data.append('CORREO', $('#txtCorreo').val());
    data.append('FECHA_NACIMIENTO', $('#txtFechaNacimiento').val());
    data.append('IDROL', $('#cbRol').val());
    data.append('IDAREA_EMPRESA', $('#cbArea').val());
    data.append('IDEMPRESA', $('#cbEmpresa').val());
    data.append('IDSEDE', $('#cbSede').val());
    data.append('ES_TRABAJADOR', $('#ckIsTrabajador').is(':checked') ? '1' : '0');
    data.append('CODIGO_EMPLEADO', $('#txtCodigoEmpleado').val());
    data.append('DOMICILIO', $('#txtDomicilio').val());
    data.append('MOVIL_PRIVADO1', $('#txtMovilPrivado1').val());
    data.append('MOVIL_PRIVADO2', $('#txtMovilPrivado2').val());
    data.append('MOVIL_EMPRESARIAL', $('#txtMovilEmpesarial').val());
    data.append('TELEFONO_FIJO', $('#txtTelefonoFijo').val());
    data.append('CONTACTO_1', $('#txtContacto1').val());
    data.append('CONTACTO_2', $('#txtContacto2').val());
    data.append('FOTO_DIR', $('#txtFoto').val());
    data.append('IDPUESTO_TRABAJADOR', $('#cbPuesto').val());

    $.ajax({
        url: '../response/upload_image_reg_user.ashx',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        beforeSend: function () {
            $('#btnGuardar').html('<span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;Procesando');
            $('#btnGuardar').attr('disabled', true);
            $('#btnCancelar').attr('disabled', true);
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data);
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
        $('#modalInsertar').modal('toggle');
    });
}

function insertar() {
    var data = new FormData();
    jQuery.each($('#btnSeleccionarFoto')[0].files, function (i, file) {
        data.append('file-' + i, file);
    });
    data.append('OP', 'INSERTAR');
    data.append('USUARIO', $('#txtUsuario').val());
    data.append('contrasena', $('#txtPassword').val());
    data.append('NOMBRE', $('#txtNombre').val());
    data.append('APELLIDO', $('#txtApellido').val());
    data.append('DNI', $('#txtDNI').val());
    data.append('CORREO', $('#txtCorreo').val());
    data.append('FECHA_NACIMIENTO', $('#txtFechaNacimiento').val());
    data.append('IDROL', $('#cbRol').val());
    data.append('IDAREA_EMPRESA', $('#cbArea').val());
    data.append('IDSEDE', $('#cbSede').val());
    data.append('ES_TRABAJADOR', $('#ckIsTrabajador').is(':checked') ? '1' : '0');
    data.append('IDEMPRESA', $('#cbEmpresa').val());
    data.append('CODIGO_EMPLEADO', $('#txtCodigoEmpleado').val());
    data.append('DOMICILIO', $('#txtDomicilio').val());
    data.append('MOVIL_PRIVADO1', $('#txtMovilPrivado1').val());
    data.append('MOVIL_PRIVADO2', $('#txtMovilPrivado2').val());
    data.append('MOVIL_EMPRESARIAL', $('#txtMovilEmpesarial').val());
    data.append('TELEFONO_FIJO', $('#txtTelefonoFijo').val());
    data.append('CONTACTO_1', $('#txtContacto1').val());
    data.append('CONTACTO_2', $('#txtContacto2').val());
    data.append('FOTO_DIR', $('#txtFoto').val());
    data.append('IDPUESTO_TRABAJADOR', $('#cbPuesto').val());
    console.log(data);

    $.ajax({
        url: '../response/upload_image_reg_user.ashx',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        beforeSend: function () {
            $('#btnGuardar').html('<span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;Procesando');
            $('#btnGuardar').attr('disabled', true);
            $('#btnCancelar').attr('disabled', true);
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data);
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
        $('#modalInsertar').modal('toggle');
    });
}

function eliminar(id, usuario) {
    var data = new FormData();
    data.append('OP', 'ELIMINAR');
    data.append('IDUSUARIO', id);
    data.append('USUARIO', usuario);

    $.ajax({
        url: '../response/upload_image_reg_user.ashx',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        beforeSend: function () {
            $('#btnGuardar').html('<span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;Procesando');
            $('#btnGuardar').attr('disabled', true);
            $('#btnCancelar').attr('disabled', true);
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data);
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

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#pbFotoSelected').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function modificar_estado(id, estado, usuario) {
    var query = 'IDUSUARIO=' + id +
       '&ESTADO=' + estado +
       '&USUARIO="' + usuario + '"';
    $.ajax({
        url: 'usuario_frmMantenimientoUsuario.aspx/modificar_estado',
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
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
    });
}

function reset_pw(id, usuario) {
    var query = 'IDUSUARIO=' + id +
       '&USUARIO="' + usuario + '"';
    $.ajax({
        url: 'usuario_frmMantenimientoUsuario.aspx/reset_pw',
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
        }

    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
    });
}