<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="desgloseDetalle.aspx.cs" Inherits="wbERPGBL.ASP.desgloseDetalle" %>
<%@ Import Namespace="Modelo.archivos" %>
<%@ Import Namespace="Modelo" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Data.SqlClient" %>

<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsDesgloseDetalle.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="IDCuerpo" runat="server">
    <%
        SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
        int idVentas = 0;
        if (Conexion == null)
            HttpContext.Current.Response.Redirect("~/default.aspx");
        try
        {
            idVentas = int.Parse(Request.QueryString["ID"]);
        }
        catch {
            //Response.Redirect("~/ASP/default.aspx");
        }
        
        dsProcedimientos.FACTURA_BUSCAR_POR_IDVENTASDataTable dsVentas = DOMModel.FACTURA_BUSCAR_POR_IDVENTAS(idVentas, Conexion);
        dsProcedimientos.FACTURA_BUSCAR_POR_IDVENTASRow itemVentas = null;
        if (dsVentas == null) { }
        //Response.Redirect("~/ASP/default.aspx");
        else
            itemVentas = (dsProcedimientos.FACTURA_BUSCAR_POR_IDVENTASRow)dsVentas.Rows[0];
        dsProcedimientos.TIPOCOMPROBANTE_BUSCAR_IDRow codigo = DOMModel.TIPOCOMPROBANTE_BUSCAR_POR_ID(itemVentas.idtipo_comprobante, Conexion);
        if (codigo == null) { HttpContext.Current.Response.Redirect("~/default.aspx"); }
    %>
    <div class="tile">
        <h2 class="tile-title">DESGLOSE DE VENTAS</h2>
        <div class="tile-config dropdown">
            <a data-toggle="dropdown" href="#" class="tile-menu"></a>
            <ul class="dropdown-menu pull-right text-right">
                <li><a class="tile-info-toggle" id="btnaadPanel" href="#">Anclar a accesos directos</a></li>
                <li><a href="#">Actualizar</a></li>
                <li><a href="#">Regresar a la página anterior</a></li>
            </ul>
        </div>
        <div class="p-10">
            <section class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="block-area">
                            <div class="alert alert-danger alert-icon" id="dvResultado" style="display: none;">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row block-area">
                    <input type="hidden" value="<%= itemVentas.idmoneda %>" id="txtIDMoneda" />
                    <input type="hidden" value="<%= itemVentas.monto_total.ToString("#.00").Replace(",",".") %>" id="txtMontoFact" />
                    <input type="hidden" value="<% Response.Write(codigo.factor.ToString().Replace(",",".")); %>" class="form-control" id="txtImpuesto" />
                    <input type="hidden" value="<% Response.Write(codigo.idtipo_comprobante); %>" class="form-control" id="txtIDImpuesto" />
                    <input type="hidden" value="<%= (itemVentas.MONEDA_LOCAL != 1 ? itemVentas.MONTO_CONVERTIDO_VENTA.ToString("#.00") : itemVentas.monto_total.ToString("#.00")).Replace(",", ".") %>" class="form-control" id="txtMontoTotalFactura" />
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblEmpresa"><b>Empresa: </b><%= itemVentas.EMPRESA_RAZON_SOCIAL %></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblDoc"><b>Documento: </b><%= itemVentas.SERIE_SERIE + "-" + itemVentas.correlativo %></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblTipoComprobante"><b>Comprobante: </b><%= itemVentas.TIPO_COMPROBANTE_TIPO_COMPROBANTE %></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="txtCliente"><b>Cliente: </b><%= itemVentas.TIPO_DOCUMENTO_IDENTIDAD_ABREVIACION + ": " + itemVentas.CLIENTE_RUC %></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblBaseImponible"><b>Base Imponible: </b><%= itemVentas.MONEDA_SIMBOLO + " " + itemVentas.base_imponible.ToString("#.00") %></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblIGV"><b>IGV: </b><%= itemVentas.MONEDA_SIMBOLO + " " + itemVentas.igv.ToString("#.00") %></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblMontoSoles"><b>Total: </b><%= itemVentas.MONEDA_SIMBOLO + " " + itemVentas.monto_total.ToString("#.00") %></div>
                    </div>
                    <% if (itemVentas.MONEDA_LOCAL != 1)
                        { %>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblCambio"><b>Cambio [TC]: </b><%= "S/." + " " + itemVentas.TIPO_CAMBIO_VENTA.ToString("#.000") %></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblBaseConvertido"><b>Base Imponible[TC]: </b><%= "S/." + " " + itemVentas.BASE_CONVERTIDO_VENTA.ToString("#.00") %></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblIGVConvertido"><b>IGV[TC]: </b><%= "S/." + " " + itemVentas.IGV_CONVERTIDO_VENTA.ToString("#.00") %></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblMontoTotalConvertido"><b>Total [TC]: </b><%= "S/." + " " + itemVentas.MONTO_CONVERTIDO_VENTA.ToString("#.00") %></div>
                    </div>
                    <% } %>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblMontoDesglose"><b>Base Imponible [DES]: </b></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblIGVDesglose"><b>IGV [DES]: </b></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblTotalDesglose"><b>Total [DES]: </b></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblOmitirIGV"><b>OMITIR IGV: </b><%= itemVentas.omitirIGV == 1 ? "SI" : "NO" %></div>
                        <input type="hidden" id="ckImpuesto" name="ckOmitirIGV" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="block-area" id="responsiveTable">
                            <h3 class="block-title">ITEMS: <a href="#" id="btnInsertar"><span class="fa fa-plus fa-1x"></span> AGREGAR UN NUEVO ITEM</a></h3>
                            <div class="table-responsive overflow">
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="text-center">#</th>
                                            <th class="text-center">PRODUCTO/SERVICIO</th>
                                            <th class="text-center">MONEDA</th>
                                            <th class="text-center">MONTO UNITARIO</th>
                                            <th class="text-center">CANTIDAD</th>
                                            <th class="text-center">BASE IMPONIBLE</th>
                                            <th class="text-center">IGV</th>
                                            <th class="text-center">MONTO TOTAL</th>
                                            <th class="text-center"></th>
                                            <th class="text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbl_body">
                                        
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="7" class="text-right"><i>TOTAL DESGLOSE:</i></td>
                                            <td id="txtTotal" class="text-right">0.00</td>
                                            <td colspan="2">SOLES</td>
                                        </tr>
                                        <tr>
                                            <td colspan="7" class="text-right"><i>FACTURADO:</i></td>
                                            <td id="txtTotalFacturado" class="text-right">0.00</td>
                                            <td colspan="2">SOLES</td>
                                        </tr>
                                        <tr>
                                            <td colspan="7" class="text-right"><i>DIFERENCIA:</i></td>
                                            <td id="txtDirefencia" class="text-right">0.00</td>
                                            <td colspan="2">SOLES</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
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
                    <h4 class="modal-title" id="modal_insertar_titulo">NUEVO ITEM DE FACTURACIÓN</h4>
                </div>
                <div class="modal-body">
                    <form id="frmInsertar" action="#">
                        <div class="list-container">
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                         <label class="checkbox-inline">
                                            <input type="radio" name="ckRadio" data-value-type="skip" id="ckProducto" value="producto" checked="checked" />
                                            Producto
                                        </label>
                                        <label class="checkbox-inline">
                                            <input type="radio" name="ckRadio" data-value-type="skip" id="ckServicio" value="servicio"/>
                                            Servicio
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12" id="dvProducto">
                                    <div class="block-area">
                                        <label for="cbProducto:number" id="lblProducto">Producto: </label>
                                        <select id="cbProducto" name="cbProducto:number" data-placeholder="Seleccione el producto" data-allow-clear="true" style="width: 100%;" required="required"></select>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12" id="dvServicio" style="display: none;">
                                    <div class="block-area">
                                        <label for="cbServicio:number" id="lblServicio">Servicio: </label>
                                        <select id="cbServicio" name="cbServicio:number" data-placeholder="Seleccione el servicio" data-allow-clear="true" style="width: 100%;"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label class="checkbox-inline" for="rbPrecioTotal">
                                            <input type="radio" name="cbRadioTotal" data-value-type="skip" id="rbPrecioUnidad" checked="checked">
                                            Precio Por unidad
                                        </label>
                                        <label class="checkbox-inline" for="rbPrecioUnidad">
                                            <input type="radio" name="cbRadioTotal" data-value-type="skip" id="rbPrecioTotal">
                                            Precio Total
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-6">
                                    <div class="block-area">
                                        <label for="txtCantidad:number">Cantidad</label>
						                <input type="text" autocomplete="off" required="required" data-a-sep="" data-a-dec="." class="form-control m-b-10" id="txtCantidad" aria-describedby="cbTipo" name="txtCantidad:number" placeholder="Ingrese Cantidad" />
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-6">
                                    <div class="block-area">
                                        <label for="cbTipo:number">Unidad</label>
							            <select style="width:100%;" id="cbTipo" data-placeholder="Seleccione el servicio" data-allow-clear="true" name="cbTipo:number" required="required">
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label class="checkbox-inline" for="rbIncIGV">
                                            <input type="radio" name="cbRadioIGV" data-value-type="skip" id="rbIncIGV" checked="checked" />
                                            Incluido IGV
                                        </label>
                                        <label class="checkbox-inline" for="rbSinIGV">
                                            <input type="radio" name="cbRadioIGV" data-value-type="skip" id="rbSinIGV" />
                                            Agregar IGV
                                        </label>                                        
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtMonto:number">Monto: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" required="required" data-a-sep="" data-a-dec="." id="txtMonto" name="txtMonto:number" placeholder="Ingrese Monto" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-sm" id="btnGuardar"><span class="fa fa-plus"></span>&nbsp;Agregar</button>
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
                    <h4 class="modal-title" id="modal_titulo_mensaje">NUEVO ITEM DE FACTURACIÓN</h4>
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
</asp:Content>