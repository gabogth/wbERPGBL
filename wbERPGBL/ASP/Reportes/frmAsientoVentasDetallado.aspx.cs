using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using Modelo;
using Microsoft.Reporting.WebForms;
using System.Data;

namespace wbERPGBL.ASP.Reportes
{
    public partial class frmAsientoVentasDetallado : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    rptReporteAsientoVentasDetallado.Reset();
                    string QUERY = String.IsNullOrEmpty(Request.QueryString["QUERY"]) ? null : Request.QueryString["QUERY"];
                    string SERIE_FILTRO = String.IsNullOrEmpty(Request.QueryString["SERIE_FILTRO"]) ? null : Request.QueryString["SERIE_FILTRO"];
                    string CORRELATIVO = String.IsNullOrEmpty(Request.QueryString["CORRELATIVO"]) ? null : Request.QueryString["CORRELATIVO"];
                    string EMPRESA_FILTRO = String.IsNullOrEmpty(Request.QueryString["EMPRESA_FILTRO"]) ? null : Request.QueryString["EMPRESA_FILTRO"];
                    string ESTADO_FILTRO = String.IsNullOrEmpty(Request.QueryString["ESTADO_FILTRO"]) ? null : Request.QueryString["ESTADO_FILTRO"];
                    SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                    if (Conexion == null)
                        HttpContext.Current.Response.Redirect("~/default.aspx");
                    dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
                    if (sessionUS == null)
                        HttpContext.Current.Response.Redirect("~/default.aspx");
                    dsReportes.ASIENTOS_CONTABLES_VENTAS_REGISTRODataTable registros = DOMModel.ASIENTOS_CONTABLES_VENTAS_REGISTRO(sessionUS.idusuario, QUERY, SERIE_FILTRO, CORRELATIVO, EMPRESA_FILTRO, ESTADO_FILTRO, Conexion);
                    string server = Server.MapPath("~/rptArchives/ventas/rptAsientosVentasRegistro.rdlc");
                    rptReporteAsientoVentasDetallado.LocalReport.ReportPath = server;
                    ReportDataSource rds = new ReportDataSource("dsReporteVentas", (DataTable)registros);
                    rptReporteAsientoVentasDetallado.LocalReport.DataSources.Add(rds);
                    rptReporteAsientoVentasDetallado.LocalReport.EnableExternalImages = true;
                    rptReporteAsientoVentasDetallado.LocalReport.EnableHyperlinks = true;
                    rptReporteAsientoVentasDetallado.LocalReport.Refresh();
                }
                catch (Exception ex) { Console.WriteLine(ex.Message); }
            }
        }
    }
}