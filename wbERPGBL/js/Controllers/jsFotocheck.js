$(function () {
    initializeComponents();
    $('#btnInsertar').unbind();
    $('#btnInsertar').on('click', function () {
        $('#modal_insertar_titulo').html('Insertar');
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
        theme: "themes-dark",
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
                console.log(datos);
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idpuesto_trabajador;
                    datos[i].text = datos[i].puesto_trabajador;
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

function cargarSede() {
    $('#cbSede').select2({
        theme: "themes-dark",
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
                console.log(datos);
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idsede;
                    datos[i].text = datos[i].sede;
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

function cargarRoles() {
    $('#cbRol').select2({
        theme: "themes-dark",
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
                console.log(datos);
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idrol;
                    datos[i].text = datos[i].rol;
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
function cargarAreas() {
    $('#cbArea').select2({
        theme: "themes-dark",
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
                console.log(datos);
                for (var i = 0; i < datos.length; i++) {
                    datos[i].id = datos[i].idarea_empresa;
                    datos[i].text = datos[i].area;
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
    $('#btnClearPreviewImage').hide();
    $('#pbFotoSelected').attr('src', '../img/unknowuser.png');
    $('#frmInsertar textarea').each(function (index, item) {
        $(item).val('');
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
                bodyTable += '<td>' + item.codigo_empleado + '</td>';
                bodyTable += '<td>' + item.dni + '</td>';
                bodyTable += '<td>' + item.nombre + '/' + item.apellido + '</td>';
                bodyTable += '<td>' + item.PUESTO_TRABAJADOR_PUESTO_TRABAJADOR + '</td>';
                bodyTable += '<td>' + item.area + '</td>';
                bodyTable += '<td>' + item.alias + '</td>';
                bodyTable += '<td><span class="fa fa-th" style="color:white; cursor: pointer;" id="preview' + item.idusuario + '"></span></td></tr>';
                $('#tbl_body').append(bodyTable);
                bodyTable = '';
                $('#preview' + item.idusuario).unbind();
                $('#preview' + item.idusuario).on('click', function () {
                    $('#txtNombre').val(item.apellido + '/' + item.nombre);
                    $('#cbEmpresa').empty().append('<option value="' + item.idempresa + '">' + item.alias + '</option>').val(item.idempresa).trigger('change');
                    $("#cbSede").empty().append('<option value="' + item.idsede + '">' + item.SEDE_SEDE + '</option>').val(item.idsede).trigger('change');
                    $('#cbArea').empty().append('<option value="' + item.idarea_empresa + '">' + item.area + '</option>').val(item.idarea_empresa).trigger('change');
                    $('#txtCodigo').val(item.codigo_empleado);
                    $('#pbFotoSelected').attr('src', '../response/img_usuario.ashx?ID=' + item.idusuario);
                    $('#modal_insertar_titulo').html('Ver a ' + item.usuario);
                    $('#modalInsertar').modal('show');
                    $('#btnGuardar').attr('disabled', false);
                    $('#btnCancelar').attr('disabled', false);
                    $('#btnGuardar').unbind();
                    $('#btnGuardar').html('<span class="fa fa-file-word-o"></span>&nbsp;&nbsp;Vista Previa');
                    $('#btnGuardar').on('click', function () {
                        $('#frmInsertar').unbind();
                        $('#frmInsertar').submit(function (e) {
                            e.preventDefault();
                            $('#modalInsertar').modal('toggle');
                            var foto = item.foto;
                            var empresa = $('#cbEmpresa').select2('data')[0].id;
                            var area = $('#cbArea').select2('data')[0].text;
                            var nombre_trabajador = $('#txtNombre').val();
                            var codigo = $('#txtCodigo').val();
                            var sede = $('#cbSede').select2('data')[0].text;
                            var fecha_expiracion = $('#txtFechaExpiracion').val();
                            showPreview(foto, empresa, area, nombre_trabajador, codigo, fecha_expiracion, item.idusuario, sede);
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

function modificar(id) {
        
}

function showPreview(foto, logo, AREA, NOMBRE_TRABAJADOR, CODIGO, FECHA_EXPIRACION, IDUSUARIO, sede) {
    var query = 'Reportes/frmFotocheckImpresion.aspx?FOTO=' + foto +
        '&LOGO=' + logo +
        '&AREA=' + AREA +
        '&NOMBRE_TRABAJADOR=' + NOMBRE_TRABAJADOR +
        '&CODIGO=' + CODIGO +
        '&SEDE=' + sede +
        '&IDUSUARIO=' + IDUSUARIO +
        '&FECHA_EXPIRACION=' + FECHA_EXPIRACION;
    $('#frmControlPreview').attr('src', query);
    $('#facturaPreview').modal('show');
    $('#dvLoading').show();
    $('#frmControlPreview').hide();
    $('#frmControlPreview').unbind();
    $('#frmControlPreview').on('load', function () {
        $('#dvLoading').hide();
        $('#frmControlPreview').show();
    });
    $('#facturaTitulo').html(
        NOMBRE_TRABAJADOR + ' - ' + AREA + ' - ' + CODIGO
    );
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