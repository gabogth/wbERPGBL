<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="pagoVentas_frmPagoVentas.aspx.cs" Inherits="wbERPGBL.ASP.pagoVentas_frmPagoVentas" %>
<%@ Import Namespace="Modelo.archivos" %>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="Modelo" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Data.SqlClient" %>

<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsPagoVentas.js?v=1.8"></script>
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
        <h2 class="tile-title">PAGOS DE FACTURAS</h2>
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
                    <input type="hidden" value="<%= itemVentas.idempresa %>" id="txtIDEmpresa" />
                    <input type="hidden" value="<%= itemVentas.MONEDA_LOCAL.ToString() %>" id="txtIsLocal" />
                    <input type="hidden" value="<%= itemVentas.MONEDA_SIMBOLO %>" id="txtMonedaSimbolo" />
                    <input type="hidden" value="<%= JsonConvert.SerializeObject(itemVentas.monto_total) %>" id="txtMontoFact" />
                    <input type="hidden" value="<% Response.Write(codigo.factor.ToString().Replace(",",".")); %>" class="form-control" id="txtImpuesto" />
                    <input type="hidden" value="<% Response.Write(codigo.idtipo_comprobante); %>" class="form-control" id="txtIDImpuesto" />
                    <input type="hidden" value=<%= JsonConvert.SerializeObject(itemVentas.fecha_emision) %> class="form-control" id="txtFechaEmisionFactura" />
                    <input type="hidden" value="<%= (itemVentas.MONEDA_LOCAL != 1 ?  JsonConvert.SerializeObject(Math.Round(itemVentas.MONTO_CONVERTIDO_VENTA, 2)) : JsonConvert.SerializeObject(Math.Round(itemVentas.monto_total, 2))) %>" class="form-control" id="txtMontoTotalFactura" />
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
                        <div class="text-justify" id="lblOmitirIGV"><b>OMITIR IGV: </b><%= itemVentas.omitirIGV == 1 ? "SI" : "NO" %></div>
                        <input type="hidden" id="ckImpuesto" name="ckOmitirIGV" />
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify"><b>Fecha de emisión: </b><%= itemVentas.fecha_emision.ToShortDateString() %></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="block-area" id="responsiveTable">
                            <h3 class="block-title">PAGOS: <a href="#" id="btnInsertar"><span class="fa fa-plus fa-1x"></span> AGREGAR UN NUEVO PAGO</a></h3>
                            <div class="table-responsive overflow">
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="text-center">#</th>
                                            <th class="text-center">FECHA PAGO</th>
                                            <th class="text-center">NOMBRE CUENTA</th>
                                            <th class="text-center">TIPO PAGO</th>
                                            <th class="text-center">CHK/OP</th>
                                            <th class="text-center"></th>
                                            <th class="text-center">MONTO</th>
                                            <th class="text-center">TC</th>
                                            <th class="text-center">MONTO[TC]</th>
                                            <th class="text-center">DESCRIPCIÓN</th>
                                            <th class="text-center"></th>
                                            <th class="text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbl_body">
                                        
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="5" class="text-right"><i>TOTAL CANCELADO:</i></td>
                                            <td class="text-right"><%= itemVentas.MONEDA_SIMBOLO %></td>
                                            <td class="text-right" id="lblTotalCancelado"></td>
                                            <td class="text-center">-</td>
                                            <td id="lblTotalCanceladoCambio" class="text-right"></td>
                                            <td colspan="3"></td>
                                        </tr>
                                        <tr>
                                            <td colspan="5" class="text-right"><i>RESTANTE:</i></td>
                                            <td class="text-right"><%= itemVentas.MONEDA_SIMBOLO %></td>
                                            <td class="text-right" id="lblTotalRestante"></td>
                                            <td class="text-center" id="lblPorcentaje"></td>
                                            <td colspan="4">
                                                <div class="progress">
                                                    <div class="progress-bar progress-bar-success" id="pbProgress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
                                                </div>
                                            </td>
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
                    <h4 class="modal-title" id="modal_insertar_titulo">Modal title</h4>
                </div>
                <div class="modal-body">
                    <form id="frmInsertar" action="#">
                        <div class="list-container">
                            <div class="row">
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="dtpFechaPago">Fecha pago: </label>
                                        <input type="date" class="form-control m-b-10" id="dtpFechaPago" name="dtpFechaPago" required="required">
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="cbTipoPago">Tipo pago: </label>
                                        <select id="cbTipoPago" name="cbTipoPago" data-placeholder="Seleccione el tipo de pago" data-allow-clear="true" required="required" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="cbCuentaCorriente">Cuenta corriente: </label>
                                        <select id="cbCuentaCorriente" name="cbCuentaCorriente" data-placeholder="Seleccione la cuenta corriente" data-allow-clear="true" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="txtMonto">Monto: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtMonto" data-a-sep="" data-a-dec="." name="txtMonto" placeholder="Monto" required="required" />
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12" id="dvCheque" style="display: none;">
                                    <div class="block-area">
                                        <label for="txtChecke">Cheque: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtChecke" name="txtChecke" placeholder="N° Cheque" />
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12" id="dvOp" style="display: none;">
                                    <div class="block-area">
                                        <label for="txtOperacion">N° de Operación: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtOperacion" name="txtOperacion" placeholder="N° de Operacion"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="block-area">
                                        <label for="txtDescripcion">Glosa: </label>
                                        <textarea id="txtDescripcion" name="txtDescripcion" placeholder="Ingrese la glosa." class="form-control" required="required"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-sm" id="btnGuardar">Guardar</button>
                            <button type="button" class="btn btn-sm" id="btnCancelar" data-dismiss="modal">Cancelar</button>
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
</asp:Content>
