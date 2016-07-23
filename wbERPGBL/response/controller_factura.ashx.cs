using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using System.Web;
using Modelo;
using Modelo.factura_modelo;
using System.Data.SqlClient;
using System.Transactions;

namespace wbERPGBL.response
{
    /// <summary>
    /// Descripción breve de controller_factura
    /// </summary>
    public class controller_factura : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            object action = context.Request.QueryString["action"];
            string body, CORRELATIVO, ORDEN_TRABAJO, TIPO_DOCUMENTO, RUC, DIRECCION, RAZON_SOCIAL, FOOTER;
            DateTime FECHA_EMISION;
            double IGV, BASE_IMPONIBLE,  MONTO_TOTAL;
            int IDEMPRESA,  IDMONEDA, IDTIPO_COMPROBANTE, IDSERIE;
            SqlConnection Conexion = null;
            SqlTransaction transaccion_factura = null;
            if (action != null)
            {
                if (action.ToString() == "INSERTAR_FACTURA")
                {
                    clsResult objResultado = new clsResult();
                    try
                    {
                        Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                        if (Conexion == null)
                            HttpContext.Current.Response.Redirect("~/default.aspx");
                        dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
                        if (sessionUS == null)
                            HttpContext.Current.Response.Redirect("~/default.aspx");
                        body = context.Request.QueryString["BODYFACTURA"].ToString();
                        control_items items = JsonConvert.DeserializeObject<control_items>(body);
                        FECHA_EMISION = DateTime.Parse(context.Request.QueryString["FECHA_EMISION"]);
                        CORRELATIVO = context.Request.QueryString["CORRELATIVO"];
                        RUC = context.Request.QueryString["RUC"];
                        FOOTER = context.Request.QueryString["FOOTER"];
                        DIRECCION = context.Request.QueryString["DIRECCION"];
                        RAZON_SOCIAL = context.Request.QueryString["RAZON_SOCIAL"];
                        IDSERIE = int.Parse(context.Request.QueryString["IDSERIE"]);
                        ORDEN_TRABAJO = context.Request.QueryString["ORDEN_TRABAJO"];
                        IDTIPO_COMPROBANTE = int.Parse(context.Request.QueryString["IDTIPO_COMPROBANTE"]);
                        TIPO_DOCUMENTO = context.Request.QueryString["TIPO_DOCUMENTO"];
                        IGV = clsUtil.doubleParse(context.Request.QueryString["IGV"]);
                        BASE_IMPONIBLE = clsUtil.doubleParse(context.Request.QueryString["BASE_IMPONIBLE"]);
                        MONTO_TOTAL = clsUtil.doubleParse(context.Request.QueryString["MONTO_TOTAL"]);
                        IDEMPRESA = int.Parse(context.Request.QueryString["IDEMPRESA"]);
                        IDMONEDA = int.Parse(context.Request.QueryString["IDMONEDA"]);
                        int IDCLIENTE = 0, IDVENTAS_CABECERA = 0;
                        bool OPCabecera = false;
                        bool op = false;
                        dsProcedimientos.CORRELATIVO_EXISTDataTable dtTable = DOMModel.CORRELATIVO_EXIST(IDEMPRESA, IDSERIE, CORRELATIVO, Conexion);
                        if (dtTable == null)
                        {
                            Modelo.dsProcedimientos.CLIENTES_BUSCAR_POR_RUCDataTable clientesDT = DOMModel.CLIENTE_BUSCAR_POR_RUC(RUC, Conexion);
                            if (clientesDT == null)
                                op = DOMModel.CLIENTE_INSERTAR(RUC, RAZON_SOCIAL, DIRECCION, sessionUS.idusuario, ref IDCLIENTE, Conexion);
                            else
                            {
                                foreach (dsProcedimientos.CLIENTES_BUSCAR_POR_RUCRow itemCli in clientesDT.Rows)
                                {
                                    IDCLIENTE = itemCli.idcliente;
                                    op = true;
                                    break;
                                }
                            }
                            if (op != false)
                            {
                                transaccion_factura = Conexion.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
                                OPCabecera = DOMModel.FACTURA_CABECERA_INSERTAR(IDCLIENTE, FECHA_EMISION, IDSERIE, CORRELATIVO, ORDEN_TRABAJO,
                                    IGV, BASE_IMPONIBLE, MONTO_TOTAL, sessionUS.idusuario, IDEMPRESA, IDMONEDA,
                                    items.items[0].omitirIGV ? 1 : 0, FOOTER, ref IDVENTAS_CABECERA, Conexion, transaccion_factura);
                                if (OPCabecera)
                                {
                                    bool OPDETALLE = true;
                                    foreach (items itemxD in items.items)
                                    {
                                        OPDETALLE = DOMModel.FACTURA_DETALLE_INSERTAR(itemxD.imponible, itemxD.igv, itemxD.total, itemxD.cbProyecto,
                                            IDVENTAS_CABECERA, itemxD.cbTipo, itemxD.ckProducto ? 1 : 0, itemxD.ckServicio ? 1 : 0, sessionUS.idusuario, 
                                            clsUtil.doubleParse(itemxD.txtCantidad), itemxD.txtItem, Conexion, transaccion_factura);
                                        if (!OPDETALLE)
                                            break;
                                    }
                                    if (OPDETALLE)
                                    {
                                        string dia = FECHA_EMISION.ToString("dd");
                                        string mes = FECHA_EMISION.ToString("MMMM", new System.Globalization.CultureInfo("es-ES")).ToUpper();
                                        string anio = FECHA_EMISION.ToString("yyyy");
                                        int IDCABECERA_IMPRESION = 0;
                                        bool opImpresionDetalle = false;
                                        bool opImpresion = DOMModel.IMPRESION_FACTURA_INSERTAR(IDEMPRESA,
                                            IDSERIE, CORRELATIVO, RAZON_SOCIAL, dia, mes, anio,
                                            DIRECCION, RUC, ORDEN_TRABAJO, IDTIPO_COMPROBANTE,
                                            IDMONEDA, BASE_IMPONIBLE, 0, BASE_IMPONIBLE, IGV,
                                            MONTO_TOTAL, IDVENTAS_CABECERA, FOOTER, ref IDCABECERA_IMPRESION,
                                            Conexion, transaccion_factura);
                                        if (IDCABECERA_IMPRESION > 0)
                                        {
                                            foreach (items itemCarrito in items.items)
                                            {
                                                double precioUnitario = itemCarrito.imponible / clsUtil.doubleParse(itemCarrito.txtCantidad);
                                                opImpresionDetalle = DOMModel.IMPRESION_FACTURA_DETALLE_INSERTAR(IDCABECERA_IMPRESION,
                                                    clsUtil.doubleParse(itemCarrito.txtCantidad), "", itemCarrito.txtItem,
                                                    precioUnitario, itemCarrito.imponible, Conexion, transaccion_factura);
                                                if (!opImpresionDetalle)
                                                    break;
                                            }
                                            if (opImpresionDetalle)
                                            {
                                                transaccion_factura.Commit();
                                                objResultado.result = "success";
                                                objResultado.message = "ok_server";
                                                objResultado.registros = 1;
                                                objResultado.body = IDVENTAS_CABECERA;
                                            }
                                            else
                                            {
                                                transaccion_factura.Rollback();
                                                objResultado.result = "error";
                                                objResultado.message = "No se pudo insertar la factura.";
                                                objResultado.registros = 0;
                                                objResultado.body = null;
                                            }
                                        }
                                        else
                                        {
                                            transaccion_factura.Rollback();
                                            objResultado.result = "error";
                                            objResultado.message = "No se pudo insertar la factura.";
                                            objResultado.registros = 0;
                                            objResultado.body = null;
                                        }

                                    }
                                    else
                                    {
                                        transaccion_factura.Rollback();
                                        objResultado.result = "error";
                                        objResultado.message = "Error interno.";
                                        objResultado.registros = 0;
                                        objResultado.body = null;
                                    }
                                }
                                else
                                {
                                    transaccion_factura.Rollback();
                                    objResultado.result = "error";
                                    objResultado.message = "Error desconocido.";
                                    objResultado.registros = 0;
                                    objResultado.body = null;
                                }
                            }
                            else
                            {
                                try { transaccion_factura.Rollback(); } catch { }
                                objResultado.result = "error";
                                objResultado.message = "No se pudo insertar el cliente.";
                                objResultado.registros = 0;
                                objResultado.body = null;
                            }
                        }
                        else
                        {
                            objResultado.result = "error";
                            objResultado.message = "Esa factura ya se encuentra emitida.";
                            objResultado.registros = 0;
                            objResultado.body = null;
                        }
                    }
                    catch (Exception ex)
                    {
                        try { transaccion_factura.Rollback(); } catch { }
                        objResultado.result = "error";
                        objResultado.message = ex.Message;
                        objResultado.registros = 0;
                        objResultado.body = null;
                    }
                    context.Response.Write(JsonConvert.SerializeObject(objResultado));
                }
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}