using Microsoft.Reporting.WebForms;
using Modelo;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace wbERPGBL.ASP.Reportes
{
    public partial class reporte_pagoVentasPendientes : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    rptPagoVentas.Reset();
                    string TYPE = Request.QueryString["TYPE"];
                    string QUERY = Request.QueryString["QUERY"];
                    string SERIE_FILTRO = Request.QueryString["SERIE_FILTRO"];
                    string CORRELATIVO = Request.QueryString["CORRELATIVO"];
                    string EMPRESA_FILTRO = Request.QueryString["EMPRESA_FILTRO"];
                    string ESTADO_FILTRO = Request.QueryString["ESTADO_FILTRO"];
                    string server = "";
                    rptPagoVentas.InternalBorderColor = System.Drawing.Color.Transparent;
                    rptPagoVentas.ToolBarItemBorderColor = System.Drawing.Color.Transparent;
                    DataTable ds1 = null;
                    ReportDataSource rds = null;
                    SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                    if (Conexion == null)
                        HttpContext.Current.Response.Redirect("~/default.aspx");
                    dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
                    if (TYPE == "RESUMEN") ds1 = DOMModel.REPORTE_PAGO_VENTAS_PENDIENTES(sessionUS.idusuario, QUERY, SERIE_FILTRO, CORRELATIVO, EMPRESA_FILTRO, ESTADO_FILTRO, Conexion);
                    else { ds1 = DOMModel.REPORTE_PAGO_VENTAS_PENDIENTES_DETALLE(sessionUS.idusuario, QUERY, SERIE_FILTRO, CORRELATIVO, EMPRESA_FILTRO, ESTADO_FILTRO, Conexion); }

                    if (TYPE == "RESUMEN") {
                        server = Server.MapPath("~/rptArchives/ventas/rptPagoVentasPendientes.rdlc");
                        rptPagoVentas.LocalReport.DisplayName = "Reporte cancelaciones resumen";
                    }
                    else {
                        server = Server.MapPath("~/rptArchives/ventas/rptPagoVentasPendientesDetalle.rdlc");
                        rptPagoVentas.LocalReport.DisplayName = "Reporte cancelaciones detalle";
                    }
                    rptPagoVentas.LocalReport.ReportPath = server;
                    rds = new ReportDataSource("dsVentas", ds1);
                    rptPagoVentas.LocalReport.DataSources.Add(rds);
                    rptPagoVentas.LocalReport.Refresh();
                }
                catch { }
            }
        }
    }
}