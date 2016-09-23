<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="factura_frmModificarProyecto.aspx.cs" Inherits="wbERPGBL.ASP.factura_frmModificarProyecto" %>
<%@ Import Namespace="Modelo.archivos" %>
<%@ Import Namespace="Modelo" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Data.SqlClient" %>

<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsPagoVentas.js"></script>
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
                <div class="row">
                    <input type="hidden" value="<%= itemVentas.idmoneda %>" id="txtIDMoneda" />
                    <input type="hidden" value="<%= itemVentas.monto_total.ToString("#.00").Replace(",",".") %>" id="txtMontoFact" />
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
                        <div class="text-justify" id="lblMontoTotal"><b>FACTURADO: </b><%= itemVentas.MONEDA_SIMBOLO + " " + itemVentas.monto_total.ToString("#.00") %></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblIGV"><b>IGV: </b><%= itemVentas.MONEDA_SIMBOLO + " " + itemVentas.igv.ToString("#.00") %></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblMontoPagado"></div>
                    </div>
                    <div class="col-lg-3">
                        <div class="text-justify" id="lblMontoRestante"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="block-area" id="responsiveTable">
                            <h3 class="block-title">PAGOS: <a href="#" id="btnInsertar"><span class="fa fa-plus fa-1x"></span> AGREGAR UN NUEVO PAGO</a></h3>
                            <div class="table-responsive overflow">
                                <table class="table table-bordered table-hover tile-title">
                                    <thead>
                                        <tr>
                                            <th class="text-center">#</th>
                                            <th class="text-center">FECHA PAGO</th>
                                            <th class="text-center">TIPO PAGO</th>
                                            <th class="text-center">CUENTA CORRIENTE</th>
                                            <th class="text-center">CÓD. DE REFERENCIA</th>
                                            <th class="text-center">MONEDA</th>
                                            <th class="text-center">MONTO</th>
                                            <th class="text-center">VERIF.</th>
                                            <th class="text-center"></th>
                                            <th class="text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbl_body">
                                        
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="6" class="text-right"><i>TOTAL CANCELADO:</i></td>
                                            <td id="txtTotal" class="text-right"></td>
                                            <td colspan="3"></td>
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
                                        <select id="cbTipoPago" required="required" name="cbTipoPago" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="txtCodigo">Còdigo de referencia: </label>
                                        <input type="text" class="form-control m-b-10" id="txtCodigo" name="txtCodigo" placeholder="Còdigo de referencia" required="required">
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="cbCuentaCorriente">Cuenta Corriente: </label>
                                        <select id="cbCuentaCorriente" name="cbCuentaCorriente" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="txtMonto">Monto: </label>
                                        <input type="text" class="form-control m-b-10" id="txtMonto"
                                            data-a-sep="" data-a-dec="." data-a-sign=""
                                            name="txtMonto" placeholder="Monto" required="required" />
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <br />
                                        <label for="ckVerificada">
                                            Pago verificado?
                                        <input type="checkbox" name="ckVerificada" id="ckVerificada" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="block-area">
                                        <label for="txtDescripcion">Descripción: </label>
                                        <textarea id="txtDescripcion" name="txtDescripcion" placeholder="Ingrese una descripción." class="form-control"></textarea>
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
