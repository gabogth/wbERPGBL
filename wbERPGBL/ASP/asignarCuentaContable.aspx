<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="asignarCuentaContable.aspx.cs" Inherits="wbERPGBL.ASP.asignarCuentaContable" %>
<%@ Import Namespace="Modelo.archivos" %>
<%@ Import Namespace="Modelo" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Data.SqlClient" %>
<%@ Import Namespace="Newtonsoft.Json" %>

<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsAsientoVentasCuentas.js?v=1.5"></script>
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
        <h2 class="tile-title">ASIENTO CONTABLE VENTAS</h2>
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
                    <input type="hidden" value=<%= JsonConvert.SerializeObject(itemVentas.fecha_emision) %> id="txtFechaEmision" />
                    <input type="hidden" value="<%= itemVentas.monto_total.ToString("#.00").Replace(",",".") %>" id="txtMontoFact" />
                    <input type="hidden" value="<%= itemVentas.base_imponible.ToString("#.00").Replace(",",".") %>" id="txtBaseImponibleFact" />
                    <input type="hidden" value="<%= itemVentas.igv.ToString("#.00").Replace(",",".") %>" id="txtIGVFact" />
                    <input type="hidden" value="<% Response.Write(codigo.factor.ToString().Replace(",",".")); %>" class="form-control" id="txtImpuesto" />
                    <input type="hidden" value="<% Response.Write(codigo.idtipo_comprobante); %>" class="form-control" id="txtIDImpuesto" />
                    <input type="hidden" value="<%= (itemVentas.MONEDA_LOCAL != 1 ? itemVentas.MONTO_CONVERTIDO_VENTA.ToString("#.00") : itemVentas.monto_total.ToString("#.00")).Replace(",", ".") %>" class="form-control" id="txtMontoTotalFactura" />
                    <input type="hidden" value="<%= (itemVentas.MONEDA_LOCAL != 1 ? itemVentas.IGV_CONVERTIDO_VENTA.ToString("#.00") : itemVentas.igv.ToString("#.00")).Replace(",", ".") %>" class="form-control" id="txtMontoIGVFactura" />
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
                            <div class="table-responsive overflow">
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="text-center">#</th>
                                            <th class="text-center">PRODUCTO/SERVICIO</th>
                                            <th class="text-center">MONEDA</th>
                                            <th class="text-center">BASE IMPONIBLE</th>
                                            <th class="text-center">CUENTA</th>
                                            <th class="text-center">DEBE</th>
                                            <th class="text-center">HABER</th>
                                            <th class="text-center"></th>
                                            <th class="text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbl_body">
                                        
                                    </tbody>
                                    <tfoot id="tbl_footer">
                                        <tr>
                                            <td colspan="3" class="text-right"><i>TOTAL IGV</i></td>
                                            <td class="text-right" id="txtTotalIGV"><%= (itemVentas.MONEDA_LOCAL != 1 ? itemVentas.IGV_CONVERTIDO_VENTA.ToString("#.00") : itemVentas.igv.ToString("#.00")).Replace(",", ".") %></td>
                                            <td id="txtIGVCuenta"><center>-</center></td>
                                            <td id="txtIGVMontoDebe" class="text-right">-</td>
                                            <td id="txtIGVMontoHaber" class="text-right">-</td>
                                            <td id="btnIGV" class="text-center"></td>
                                            <td id="btnIGVDelete" class="text-center"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" class="text-right"><i>TOTAL FACTURADO</i></td>
                                            <td class="text-right" id="txtTotalMonto"><%= (itemVentas.MONEDA_LOCAL != 1 ? itemVentas.MONTO_CONVERTIDO_VENTA.ToString("#.00") : itemVentas.monto_total.ToString("#.00")).Replace(",", ".") %></td>
                                            <td id="txtTotalCuenta"><center>-</center></td>
                                            <td id="txtTotalMontoDebe" class="text-right">-</td>
                                            <td id="txtTotalMontoHaber" class="text-right">-</td>
                                            <td id="btnTotal" class="text-center"></td>
                                            <td id="btnTotalDelete" class="text-center"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="5" class="text-right"><i>TOTALES</i></td>
                                            <td id="txtDvTotalDebe" class="text-right"></td>
                                            <td id="txtDvTotalHaber" class="text-right"></td>
                                            <td colspan="2" class="text-center"><a href="#" id="btnImpirmir"><span class="fa fa-print fa-1x"></span> Imprimir</a></td>
                                        </tr>
                                        <tr>
                                            <td><i>GLOSA:</i></td>
                                            <td colspan="17" id="txtGlosaComun"></td>
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
    <div class="modal fade" id="modalInsertar" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="modal_insertar_titulo">modal tittle</h4>
                </div>
                <div class="modal-body">
                    <form id="frmInsertar" action="#">
                        <div class="list-container">
                            <div class="row" id="dvDebe">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="cbCuentaDebe:number">Debe: </label>
                                        <select id="cbCuentaDebe" name="cbCuentaDebe:number" data-placeholder="Seleccione la cuenta debe" data-allow-clear="true" style="width: 100%;" required="required"></select>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtMontoDebe:number">Monto Debe: </label>
                                        <input type="text" id="txtMontoDebe" name="txtMontoDebe:number" placeholder="Ingrese monto debe" autocomplete="off" class="form-control m-b-10" required="required" data-a-sep="" data-a-dec="." />
                                    </div>
                                </div>
                            </div>
                            <div class="row" id="dvHaber">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="cbCuentaHaber:number">Haber: </label>
                                        <select id="cbCuentaHaber" name="cbCuentaHaber:number" data-placeholder="Seleccione la cuenta haber" data-allow-clear="true" style="width: 100%;" required="required"></select>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtMontoHaber:number">Monto haber: </label>
                                        <input type="text" id="txtMontoHaber" name="txtMontoHaber:number" placeholder="Ingrese monto haber" autocomplete="off" class="form-control m-b-10" required="required" data-a-sep="" data-a-dec="." />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12 col-md-12">
                                    <div class="block-area">
                                        <label for="txtGlosa">Glosa: </label>
                                        <textarea id="txtGlosa" name="txtGlosa" class="form-control" required="required" placeholder="Ingrese la Glosa"></textarea>
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