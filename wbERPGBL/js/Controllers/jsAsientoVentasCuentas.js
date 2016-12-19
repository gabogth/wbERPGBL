var myWindow;
var lastItem;
var totalBody = 0;
$(function () {
    cargarCuentas();
    $('#txtMontoDebe, #txtMontoHaber, #txtMontoIGV, #txtMontoDebeModificar, #txtMontoHaberModificar').autoNumeric('init');
    buscar();
    buscarTOTALES();
});

function cargarCuentas() {
    $('#cbCuentaDebe, #cbCuentaHaber').select2({
        ajax: {
            url: 'cuentaContable_frmMantenimientoCuentaContable.aspx/buscar_estado',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            data: function (params) {
                if (params == null) {
                    return JSON.stringify({ 'q': "", 'index': 1, 'cantidad': 10 });
                } else {
                    return JSON.stringify({ 'q': (params.term == null ? '' : params.term), 'index': 1, 'cantidad': 10 });
                }
            },
            processResults: function (data, page) {
                var datos = jQuery.parseJSON(data.d);
                datos = datos.body;
                if (datos != null && datos.length > 0) {
                    for (var i = 0; i < datos.length; i++) {
                        datos[i].id = datos[i].idcuenta_contable;
                        datos[i].text = datos[i].CUENTA + ' ' + datos[i].nombre_cuenta;
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
        return "<div>Cargando resultados...</div>";
    }
    var markup = '<div>' + e.text + '</div>';
    return markup;
}
function formatRepoSelection(repo) {
    return repo.text || repo.text;
}

function round(n, decimals) {
    return parseFloat(n.toFixed(decimals));
}

function buscar() {
    $.ajax({
        url: 'asignarCuentaContable.aspx/buscar',
        type: "POST",
        dataType: 'json',
        data: JSON.stringify({ ID: utilClass.getUrlParameter('ID') }),
        contentType: "application/json;charset=utf-8",
        beforeSend: function () {
            $('#tbl_body').html('<tr><td colspan="14" class="text-center"><span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;&nbsp;Procesando...</td></tr>');
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
        } else {
            $('#tbl_body').html('');
            if (jsonData.registros > 0) {
                showTableHTML(jsonData.body, utilClass.getUrlParameter('ID'));
            } else {
                $('#tbl_body').html('<tr><td colspan="14" class="text-center">No hay resultados.</td></tr>');
            }
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
    });
}

function buscarTOTALES() {
    $.ajax({
        url: 'asignarCuentaContable.aspx/buscarTOTALES',
        type: "POST",
        dataType: 'json',
        data: JSON.stringify({ ID: utilClass.getUrlParameter('ID') }),
        contentType: "application/json;charset=utf-8",
        beforeSend: function () {
            
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
        } else {
            showTableHTMLFOOTER(jsonData.body, utilClass.getUrlParameter('ID'));
        }
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
    });
}

function showTableHTML(data, IDVENTAS) {
    var bodyTable = '';
    var last_iddesglose = 0;
    var counterIndex = 1;
    var totalDebe = 0;
    var totalHaber = 0;
    var focoIGV = false;
    $.each(data, function (index, item) {
        lastItem = item;
        bodyTable = '';
        bodyTable += '<tr>';
        bodyTable += '<td>' + (index + 1).toString() + '</td>';
        bodyTable += '<td>' + ((!isNaN(item.idproducto) && item.idproducto != null) ? item.producto : item.servicio) + '</td>';
        bodyTable += '<td class="text-center">SOLES</td>';
        bodyTable += '<td class="text-right">' + item.base_imponible.toFixed(2) + '</td>';
        bodyTable += '<td class="text-left">' + (item.idasiento_contable != null ? ((item.idcuenta_contable_debe != null ? (item.CUENTA_DEBE + ' ' + item.nombre_cuenta_debe) : (item.CUENTA_HABER + ' ' + item.nombre_cuenta_haber))) : '<center>-</center>') + '</td>';
        bodyTable += '<td class="text-right">' + (item.monto_debe != null ? item.monto_debe.format(2, 3, ',', '.') : '<center>-</center>') + '</td>';
        bodyTable += '<td class="text-right">' + (item.monto_haber != null ? item.monto_haber.format(2, 3, ',', '.') : '<center>-</center>') + '</td>';
        bodyTable += '<td class="text-left">' + (item.glosa != null ? item.glosa : '<center>-</center>') + '</td>';
        bodyTable += '<td class="text-center"><span class="fa fa-' + (item.idasiento_contable != null ? 'pencil' : 'plus') + ' text-' + (item.idasiento_contable != null ? 'warning' : 'success') + '" style="cursor: pointer;" id="' + (item.idasiento_contable != null ? 'modificar-asiento' : 'agregar-asiento') + '-' + index + '"></span></td>';
        bodyTable += '<td class="text-center"><span class="fa fa-trash-o" style="color:white; cursor: pointer;" id="eliminar-asiento-' + index + '"></span></td>';
        bodyTable += '</tr>';
        totalDebe += item.monto_debe != null ? item.monto_debe : 0;
        totalHaber += item.monto_haber != null ? item.monto_haber : 0;
        $('#txtTotalDebe').html(totalDebe.toFixed(2));
        $('#txtTotalHaber').html(totalHaber.toFixed(2));
        $('#tbl_body').append(bodyTable);
        bodyTable = '';
        $('#agregar-asiento-' + index).unbind();
        $('#agregar-asiento-' + index).on('click', function () {
            beginTrans(true);
            $('#txtMontoHaber').val(item.base_imponible.toFixed(2));
            $('#txtGlosa').val('FACT/' + item.alias + '-' + item.serie + '-' + item.correlativo);
            if (item.idproducto != null) setSelect2('#cbCuentaHaber', 11, '70.2 Productos terminados'); else setSelect2('#cbCuentaHaber', 12, '70.9 Mercaderías – Otras');
            $('#modal_insertar_titulo').html('NUEVO ASIENTO DE ' + (item.idproducto ? item.producto : item.servicio));
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    insertar(item.iddesglose_ventas, item.idventas_cabecera, 'insertarHaber', 'ITEM_DESGLOSE');
                });
            });
        });
        $('#modificar-asiento-' + index).unbind();
        $('#modificar-asiento-' + index).on('click', function () {
            beginTrans(true);
            $('#txtMontoHaber').val(item.monto_haber.toFixed(2));
            $('#txtGlosa').val(item.glosa);
            setSelect2('#cbCuentaHaber', item.idcuenta_contable_haber, item.CUENTA_HABER + ' ' + item.nombre_cuenta_haber);
            $('#modal_insertar_titulo').html('MODIFICAR ASIENTO DE ' + (item.idproducto ? item.producto : item.servicio));
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-pencil-square-o"></span>&nbsp;&nbsp;Modificar');
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    modificar(item.idasiento_contable, 'modificarHaber');
                });
            });
        });
        $('#eliminar-asiento-' + index).unbind();
        $('#eliminar-asiento-' + index).on('click', function () {
            if (item.idasiento_contable != null) {
                $('#btn_mensaje_aceptar').attr('disabled', false);
                $('#btn_mensaje_cancelar').attr('disabled', false);
                $('#modal_titulo_mensaje').html('Advertencia');
                $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>' + item.alias + ': ' + item.serie + '-' + item.correlativo + '</b> permanentemente?');
                $('#modal_mensaje').modal('show');
                $('#btn_mensaje_aceptar').unbind();
                $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                $('#btn_mensaje_aceptar').on('click', function () {
                    eliminar(item.idasiento_contable);
                });
            } else {
                utilClass.showMessage('#dvResultado', 'danger', 'Error:|No se puede eliminar el asiento.');
            }
        });
    });
    totalBody = totalHaber;
}




function showTableHTMLFOOTER(data, IDVENTAS) {
    var focoIGV = false;
    var focoTOTAL = false;
    if (data != null && data.length > 0) {
        $.each(data, function (index, item) {
            if (item.METHOD == 'ITEM_IGV') {
                focoIGV = true;
                $('#txtIGVCuenta').html(item.idasiento_contable != null ? ((item.idcuenta_contable_debe != null ? (item.CUENTA_DEBE + ' ' + item.nombre_cuenta_debe) : (item.CUENTA_HABER + ' ' + item.nombre_cuenta_haber))) : '<center>-</center>');
                $('#txtIGVMontoDebe').html(item.monto_debe != null ? item.monto_debe.format(2, 3, ',', '.') : '<center>-</center>');
                $('#txtIGVMontoHaber').html(item.monto_haber != null ? item.monto_haber.format(2, 3, ',', '.') : '<center>-</center>');
                $('#txtGlosaIGV').html(item.glosa != null ? item.glosa : '<center>-</center>');
                $('#btnIGV').html('<span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar-igv"></span>');
                $('#modificar-igv').unbind();
                $('#modificar-igv').on('click', function () {
                    beginTrans(true);
                    $('#txtMontoHaber').val(item.monto_haber);
                    $('#txtGlosa').val(item.glosa);
                    setSelect2('#cbCuentaHaber', item.idcuenta_contable_haber, item.CUENTA_HABER + ' ' + item.nombre_cuenta_haber);
                    $('#modal_insertar_titulo').html('MODIFICAR ASIENTO DE IGV');
                    $('#modalInsertar').modal('show');
                    $('#btnGuardar').attr('disabled', false);
                    $('#btnCancelar').attr('disabled', false);
                    $('#btnGuardar').unbind();
                    $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
                    $('#btnGuardar').on('click', function () {
                        $('#frmInsertar').unbind();
                        $('#frmInsertar').submit(function (e) {
                            e.preventDefault();
                            modificar(item.idasiento_contable, 'modificarHaber', 'ITEM_IGV');
                        });
                    });
                });
                $('#btnIGVDelete').html('<span class="fa fa-trash" style="color: white; cursor: pointer;" id="borrar-igv"></span>');
                $('#borrar-igv').unbind();
                $('#borrar-igv').on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>el asiento de IGV</b> permanentemente?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        eliminar(item.idasiento_contable);
                    });
                });
                $('#txtDvTotalHaber').html(parseFloat(item.monto_haber + totalBody).toFixed(2));
            } else if (item.METHOD == 'ITEM_TOTAL') {
                focoTOTAL = true;
                $('#txtDvTotalDebe').html(item.monto_debe.toFixed(2));
                $('#txtTotalCuenta').html(item.idasiento_contable != null ? ((item.idcuenta_contable_debe != null ? (item.CUENTA_DEBE + ' ' + item.nombre_cuenta_debe) : (item.CUENTA_HABER + ' ' + item.nombre_cuenta_haber))) : '<center>-</center>');
                $('#txtTotalMontoDebe').html(item.monto_debe != null ? item.monto_debe.format(2, 3, ',', '.') : '<center>-</center>');
                $('#txtTotalMontoHaber').html(item.monto_haber != null ? item.monto_haber.format(2, 3, ',', '.') : '<center>-</center>');
                $('#txtGlosaTotal').html(item.glosa != null ? item.glosa : '<center>-</center>');
                $('#btnTotal').html('<span class="fa fa-pencil text-warning" style="cursor: pointer;" id="modificar-total"></span>');
                $('#modificar-total').unbind();
                $('#modificar-total').on('click', function () {
                    beginTrans(false);
                    $('#txtMontoDebe').val(item.monto_debe);
                    $('#txtGlosa').val(item.glosa);
                    setSelect2('#cbCuentaDebe', item.idcuenta_contable_debe, item.CUENTA_DEBE + ' ' + item.nombre_cuenta_debe);
                    $('#modal_insertar_titulo').html('MODIFICAR ASIENTO DEL TOTAL');
                    $('#modalInsertar').modal('show');
                    $('#btnGuardar').attr('disabled', false);
                    $('#btnCancelar').attr('disabled', false);
                    $('#btnGuardar').unbind();
                    $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
                    $('#btnGuardar').on('click', function () {
                        $('#frmInsertar').unbind();
                        $('#frmInsertar').submit(function (e) {
                            e.preventDefault();
                            modificar(item.idasiento_contable, 'modificarDebe', 'ITEM_TOTAL');
                        });
                    });
                });
                $('#btnTotalDelete').html('<span class="fa fa-trash" style="color: white; cursor: pointer;" id="borrar-total"></span>');
                $('#borrar-total').unbind();
                $('#borrar-total').on('click', function () {
                    $('#btn_mensaje_aceptar').attr('disabled', false);
                    $('#btn_mensaje_cancelar').attr('disabled', false);
                    $('#modal_titulo_mensaje').html('Advertencia');
                    $('#cuerpo_mensaje').html('¿Está seguro que desea eliminar <b>el asiento del TOTAL</b> permanentemente?');
                    $('#modal_mensaje').modal('show');
                    $('#btn_mensaje_aceptar').unbind();
                    $('#btn_mensaje_aceptar').html('<span class="fa fa-trash-o"></span>&nbsp;&nbsp;Eliminar');
                    $('#btn_mensaje_aceptar').on('click', function () {
                        eliminar(item.idasiento_contable);
                    });
                });
            }
        });
    }
    if (!focoIGV) {
        $('#btnIGVDelete').html('');
        $('#txtIGVCuenta').html('<center>-</center>');
        $('#txtIGVMontoDebe').html('<center>-</center>');
        $('#txtIGVMontoHaber').html('<center>-</center>');
        $('#txtGlosaIGV').html('<center>-</center>');
        $('#btnIGV').html('<span class="fa fa-plus text-success" style="cursor: pointer;" id="agregar-igv"></span>');
        $('#agregar-igv').unbind();
        $('#agregar-igv').on('click', function () {
            beginTrans(true);
            $('#txtMontoHaber').val($('#txtMontoIGVFactura').val());
            $('#txtGlosa').val('FACT/' + lastItem.alias + '-' + lastItem.serie + '-' + lastItem.correlativo + '-IGV');
            setSelect2('#cbCuentaHaber', 8, '40.1.1.1 IGV – Cuenta propia');
            $('#modal_insertar_titulo').html('NUEVO ASIENTO DE IGV');
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    insertar(null, lastItem.idventas_cabecera, 'insertarHaber', 'ITEM_IGV');
                });
            });
        });
        $('#txtDvTotalHaber').html(totalBody.toFixed(2));
    }
    if (!focoTOTAL) {
        console.log('ax');
        $('#btnTotalDelete').html('');
        $('#txtDvTotalDebe').html('0.00');
        $('#txtTotalCuenta').html('<center>-</center>');
        $('#txtTotalMontoDebe').html('<center>-</center>');
        $('#txtTotalMontoHaber').html('<center>-</center>');
        $('#txtGlosaTotal').html('<center>-</center>');
        $('#btnTotal').html('<span class="fa fa-plus text-success" style="cursor: pointer;" id="agregar-total"></span>');
        $('#agregar-total').unbind();
        $('#agregar-total').on('click', function () {
            beginTrans(false);
            $('#txtMontoDebe').val($('#txtMontoTotalFactura').val());
            $('#txtGlosa').val('FACT/' + lastItem.alias + '-' + lastItem.serie + '-' + lastItem.correlativo + '-TOTAL');
            setSelect2('#cbCuentaDebe', 7, '12 CUENTAS POR COBRAR COMERCIALES – TERCEROS');
            $('#modal_insertar_titulo').html('NUEVO ASIENTO DEL TOTAL');
            $('#modalInsertar').modal('show');
            $('#btnGuardar').attr('disabled', false);
            $('#btnCancelar').attr('disabled', false);
            $('#btnGuardar').unbind();
            $('#btnGuardar').html('<span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar');
            $('#btnGuardar').on('click', function () {
                $('#frmInsertar').unbind();
                $('#frmInsertar').submit(function (e) {
                    e.preventDefault();
                    insertar(null, lastItem.idventas_cabecera, 'insertarDebe', 'ITEM_TOTAL');
                });
            });
        });
    }
    var totalDesglose = parseFloat($('#txtMontoTotalFactura').val());
    var totalIGV = parseFloat($('#txtIGVFact').val());
    var totalImponible = parseFloat($('#txtBaseImponibleFact').val());
    var montoTotalFactura = parseFloat($('#txtMontoTotalFactura').val());
    $('#txtTotalFacturado').html(montoTotalFactura.toFixed(2));
    $('#txtTotal').html(totalDesglose.toFixed(2));
    $('#lblMontoDesglose').html('<b>Base Imponible [DES]: </b> S/. ' + totalImponible.toFixed(2));
    $('#lblIGVDesglose').html('<b>IGV [DES]: </b> S/. ' + totalIGV.toFixed(2));
    $('#lblTotalDesglose').html('<b>Total [DES]: </b> S/. ' + totalDesglose.toFixed(2));
    $('#txtTotal').html(totalDesglose.toFixed(2));
    $('#txtDirefencia').html(parseFloat(totalDesglose - montoTotalFactura).toFixed(2));
}




function setSelect2(div, id, value) {
    $(div).empty().append('<option value="' + id + '">' + value + '</option>').val(id).trigger('change');
}

function beginTrans(valor) {
    if (valor) {
        $('#dvHaber').show();
        $('#dvDebe').hide();
        $('#cbCuentaHaber').attr('required', true);
        $('#txtMontoHaber').attr('required', true);
        $('#txtMontoHaber').attr('name', 'txtMontoHaber:number');

        $('#cbCuentaDebe').attr('required', false);
        $('#txtMontoDebe').attr('required', false);
        $('#txtMontoDebe').attr('name', 'txtMontoDebe:skip');

        $('cbCuentaDebe', null, null);
        $('#txtMontoDebe').val(null);
    } else {
        $('#dvHaber').hide();
        $('#dvDebe').show();
        $('#cbCuentaHaber').attr('required', false);
        $('#txtMontoHaber').attr('required', false);
        $('#txtMontoHaber').attr('name', 'txtMontoHaber:skip');

        $('#cbCuentaDebe').attr('required', true);
        $('#txtMontoDebe').attr('required', true);
        $('#txtMontoDebe').attr('name', 'txtMontoDebe:number');

        $('cbCuentaHaber', null, null);
        $('#txtMontoHaber').val(null);
    }
}

function insertar(idDesglose, IDVENTAS, webMethod, TIPO) {
    var formData = $('#frmInsertar').serializeJSON();
    formData['ID'] = idDesglose;
    formData['IDVENTAS'] = IDVENTAS;
    formData['METHOD'] = TIPO;
    console.log(formData);
    $.ajax({
        url: 'asignarCuentaContable.aspx/' + webMethod,
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
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|El registro fue insertado correctamente.');
        }
        $('#modalInsertar').modal('toggle');
        buscar();
        buscarTOTALES();
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modalInsertar').modal('toggle');
        var myWindow = window.open("", null, "height=200,width=400,status=yes,toolbar=no,menubar=no,location=no");
        myWindow.document.write(ort.responseText);
        console.log(ort);
        console.log(rt);
        console.log(qrt);
    });
}

function modificar(ID, webMethod) {
    var formData = $('#frmInsertar').serializeJSON();
    formData["ID"] = ID;
    console.log(formData);
    $.ajax({
        url: 'asignarCuentaContable.aspx/' + webMethod,
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
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|El registro fue modificado correctamente.');
        }
        $('#modalInsertar').modal('toggle');
        buscar();
        buscarTOTALES();
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modalInsertar').modal('toggle');
        myWindow = window.open("", "myWindow", "width=200,height=100");
        myWindow.document.write(ort.responseText);
        console.log(ort);
        console.log(rt);
        console.log(qrt);
    });
}

function eliminar(id) {
    $.ajax({
        url: 'asignarCuentaContable.aspx/eliminar',
        type: "POST",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ ID: id }),
        beforeSend: function () {
            $('#btnGuardar').html('<span class="fa fa-hourglass faa-slow faa-spin animated"></span>&nbsp;&nbsp;Procesando');
            $('#btnGuardar').attr('disabled', true);
            $('#btnCancelar').attr('disabled', true);
        }
    }).done(function (data) {
        var jsonData = jQuery.parseJSON(data.d);
        if (jsonData.result == 'error') {
            utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + jsonData.message);
        } else {
            utilClass.showMessage('#dvResultado', 'success', 'Satisfactorio:|El registro fue modificado correctamente.');
        }
        $('#modal_mensaje').modal('toggle');
        buscar();
        buscarTOTALES();
    }).fail(function (ort, rt, qrt) {
        utilClass.showMessage('#dvResultado', 'danger', 'Error:|' + rt);
        $('#modal_mensaje').modal('toggle');
        var myWindow = window.open("", "_blank");
        myWindow.document.write(ort.responseText);
        console.log(ort);
        console.log(rt);
        console.log(qrt);
    });
}