<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="factura_frmEmitirFactura.aspx.cs" Inherits="wbERPGBL.ASP.factura_frmEmitirFactura" %>
<%@ Import Namespace="Modelo" %>
<%@ Import Namespace="System.Data.SqlClient" %>
<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <link href="../css/jquery.editable-select.min.css" rel="stylesheet" type="text/css" />
    <script src="../js/jquery.editable-select.min.js" type="text/javascript"></script>
    <script src="../js/Controllers/jsEmisionFactura.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="IDCuerpo" runat="server">
    <%
        SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
        if (Conexion == null) { HttpContext.Current.Response.Redirect("~/default.aspx"); }
        dsProcedimientos.TIPOCOMPROBANTE_BUSCAR_ACTIVO_POR_CODIGORow codigo = DOMModel.TIPOCOMPROBANTE_BUSCAR_POR_CODIGO("01", Conexion);
        if (codigo == null) { HttpContext.Current.Response.Redirect("~/default.aspx"); }
    %>
    <div class="tile">
        <input type="hidden" value="<% Response.Write(codigo.factor.ToString().Replace(",",".")); %>" class="form-control" id="txtImpuesto" />
        <input type="hidden" value="<% Response.Write(codigo.idtipo_comprobante); %>" class="form-control" id="txtIDImpuesto" />
        <h2 class="tile-title">Emisión de <% Response.Write(codigo.tipo_comprobante); %></h2>
        <div class="tile-config dropdown">
            <a data-toggle="dropdown" href="#" class="tile-menu"></a>
            <ul class="dropdown-menu pull-right text-right">
                <li><a class="tile-info-toggle" id="btnaadPanel" href="#">Anclar a accesos directos</a></li>
                <li><a href="#" id="lkBuscarDatos">Buscar factura por datos</a></li>
                <li><a href="#" id="lkFacturasEmitidas">Buscar facturas emitidas</a></li>
                <li><a href="javascript:location.reload();">Actualizar</a></li>
                <li><a href="#">Regresar a la página anterior</a></li>
            </ul>
        </div>
        <div class="p-10">
            <section class="container">
                <form id="frmCabeceraFactura" action="#">
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-4">
                            <div class="block-area">
                                <label for="cbEmpresa">Empresa</label>
                                <select id="cbEmpresa" style="width:100%;" required="required">
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-4">
                            <div class="block-area">
                                <label for="cbMoneda">Moneda</label>
                                <select id="cbMoneda" style="width:100%;" required="required">
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-4">
                            <div class="block-area">
                                <label for="txtFecha">Fecha de Emision</label>
                                <input type="date" class="form-control" id="txtFecha" name="txtFecha" required="required" />
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-4">
                            <div class="block-area">
                                <label for="cbSerie">Serie</label>
                                <select id="cbSerie" style="width:100%;" required="required">
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-4">
                            <div class="block-area">
                                <label for="txtCorrelativo">Correlativo</label>
                                <input type="number" class="form-control" required="required" id="txtCorrelativo" title="" name="txtCorrelativo" />
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-4">
                            <div class="block-area">
                                <label for="txtRuc" id="lblRuc">CON RUC</label><input type="checkbox" id="ckSinRuc" />
                                <input type="text" id="txtRuc" title="Ingrese un RUC válido" required="required" autocomplete="off" name="txtRuc" placeholder="RUC" class="form-control" />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="block-area">
                                <label for="txtRazonSocial">Razon Social</label>
                                <input type="text" id="txtRazonSocial" name="txtRazonSocial" required="required" placeholder="Ingrese la razón social" class="form-control"/>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="block-area">
                                <label for="txtDireccion">Direccion</label>
                                <input type="text" id="txtDireccion" name="txtDireccion" placeholder="Dirección" class="form-control" required="required" />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-4">
                            <div class="block-area">
                                <label for="txtEstado">Estado</label>
                                <input type="text" id="txtEstado" name="txtEstado" placeholder="Estado" class="form-control"/>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-4">
                            <div class="block-area">
                                <label for="txtOrd">Orden de Trabajo</label>
                                <input type="text" id="txtOrd" name="txtOrd" placeholder="Orden de trabajo" class="form-control"/>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-4">
                            <div class="block-area">
                                <label for="ckImpuesto"><a href="http://www.sunat.gob.pe/legislacion/igv/ley/apendice.htm" target="_blank" title="Ver a detalle la Ley">EXONERACION DE IGV (LEY N.° 28086)</a></label><br />
                                <input type="checkbox"  name="ckImpuesto" id="ckImpuesto" />
                                Omitir impuesto
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="block-area">
                                <label for="txtFoot">Pie de Factura</label>
                                <textarea id="txtFoot" name="txtFoot" placeholder="Ingrese una descripción esta irá al final del detalle, no es obligatorio completar este campo." class="form-control"></textarea>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    </div>
    <div class="tile">
        <h2 class="tile-title"><span class="fa fa-plus-circle fa-2x" style="cursor: pointer;" id="btnInsertarDetalle"></span>&nbsp;&nbsp;Detalle de Facturas</h2>
        <div class="p-10">
            <section class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="block-area" id="responsiveTable">
                            <div class="table-responsive">
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="text-center">#</th>
                                            <th class="text-center">DESCRIPCION</th>
                                            <th class="text-center">CANTIDAD</th>
                                            <th class="text-center">IMPONIBLE</th>
                                            <th class="text-center">IGV</th>
                                            <th class="text-center">TOTAL</th>
                                            <th class="text-center"></th>
                                            <th class="text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbl_body">
                                        
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="3" class="text-right">Base Imponible:</td>
                                            <td class="text-right" id="lbltotal_base">0.00</td>
                                            <td colspan="4"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" class="text-right">Total IGV:</td>
                                            <td class="text-right" id="lbltotal_igv">0.00</td>
                                            <td colspan="4"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" class="text-right">Total:</td>
                                            <td class="text-right" id="lbltotal_total">0.00</td>
                                            <td colspan="4"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="block-area">
                            <div class="alert alert-danger alert-icon" id="dvResultado" style="display:none;">
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="block-area">
                            <button type="submit" form="frmCabeceraFactura" class="btn btn-block btn-alt" id="btnEmitirFactura"><span class="fa fa-print"></span> EMITIR FACTURA</button>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="block-area">
                            <button class="btn btn-block btn-alt" id="btnLimpiarFormulario"><span class="fa fa-trash"></span> LIMPIAR EL FORMULARIO</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>


</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="IDFooter" runat="server">
    <div class="modal fade" id="modalInsertar" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="modal_insertar_titulo">Agregar Nuevo Item</h4>
                </div>
                <div class="modal-body">
                    <form id="frmInsertarDetalle" action="#">
                        <div class="list-container">
                             <div class="row">
                                <div class="col-lg-12">
                                    <div class="block-area">
                                        <label for="cbProyecto">Proyecto: </label>
                                        <select id="cbProyecto" required="required" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12" style="display: none;">
                                    <div class="block-area">
                                         <label class="checkbox-inline" for="ckProducto">
                                            <input type="checkbox" name="ckRadio" id="ckProducto" checked="checked" />
                                            Producto
                                        </label>
                                        <label class="checkbox-inline" for="ckServicio">
                                            <input type="checkbox" name="ckRadio" id="ckServicio"/>
                                            Servicio
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtItem">Descripción: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtItem" name="txtItem" required="required" placeholder="Ingrese Item" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label class="checkbox-inline" for="rbPrecioTotal">
                                            <input type="radio" name="cbRadioTotal" id="rbPrecioUnidad" checked="checked">
                                            Precio Por unidad
                                        </label>
                                        <label class="checkbox-inline" for="rbPrecioUnidad">
                                            <input type="radio" name="cbRadioTotal" id="rbPrecioTotal">
                                            Precio Total
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-6">
                                    <div class="block-area">
                                        <label for="txtCantidad">Cantidad</label>
						                <input type="text" autocomplete="off" required="required" data-a-sep="" data-a-dec="." class="form-control m-b-10" id="txtCantidad" aria-describedby="cbTipo" name="txtCantidad" placeholder="Ingrese Cantidad" />
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-6">
                                    <div class="block-area">
                                        <label for="cbTipo">Unidad</label>
							            <select style="width:100%;" id="cbTipo" name="cbTipo" required="required">
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label class="checkbox-inline" for="rbIncIGV">
                                            <input type="radio" name="cbRadioIGV" id="rbIncIGV" checked="checked" />
                                            Incluido IGV
                                        </label>
                                        <label class="checkbox-inline" for="rbSinIGV">
                                            <input type="radio" name="cbRadioIGV" id="rbSinIGV" />
                                            Agregar IGV
                                        </label>                                        
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtMonto">Monto: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" required="required" data-a-sep="" data-a-dec="." id="txtMonto" name="txtMonto" placeholder="Ingrese Monto" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-sm" id="btnGuardar">Agregar</button>
                            <button type="button" class="btn btn-sm" id="btnCancelar" data-dismiss="modal"><span class="fa fa-times"></span>&nbsp;Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="modal_mensaje" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="modal_titulo_mensaje">Modal title</h4>
                </div>
                <div class="modal-body">
                    <form id="frmMensaje" action="#">
                        <div class="list-container">
                            <p id="cuerpo_mensaje">
                                
                            </p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-sm" id="btn_mensaje_aceptar">Aceptar</button>
                            <button type="button" class="btn btn-sm" id="btn_mensaje_cancelar" data-dismiss="modal">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="facturaPreview" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" style="background-color: white;">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:black;">&times;</button>
                    <h4 class="modal-title" id="facturaTitulo" style="color:black;">Modal title</h4>
                </div>
                <div class="modal-body" style="height: 1800px;">
                    <div id="dvLoading" class="text-center">
                        <span class="fa fa-spinner fa-2x faa-slow faa-spin animated" style="color:black;"></span>&nbsp;Cargando...
                    </div>
                    <iframe src="#" id="frmControlPreview" frameborder="0" height="922px;" width="99.6%"></iframe>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalReView" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="modal_review_titulo">Modal title</h4>
                </div>
                <div class="modal-body">
                    <form id="frmBuscarFactura" action="#">
                        <div class="list-container">
                             <div class="row">
                                <div class="col-lg-12">
                                    <div class="block-area">
                                        <label for="cbEmpresaReView">Empresa</label>
                                        <select id="cbEmpresaReView" style="width:100%;" required="required">
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="cbSerieReView">Serie</label>
                                        <select id="cbSerieReView" style="width:100%;" required="required">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtCorrelativoReView">Correlativo</label>
                                        <input type="number" class="form-control" required="required" id="txtCorrelativoReView" name="txtCorrelativoReView" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="block-area" id="dvSearchFactura">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" form="frmBuscarFactura" class="btn btn-sm" id="btnCargarReView"><span class="fa fa-download"></span>&nbsp;Cargar</button>
                            <button type="button" class="btn btn-sm" id="btnCancelarReView" data-dismiss="modal"><span class="fa fa-times"></span>&nbsp;Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</asp:Content>

