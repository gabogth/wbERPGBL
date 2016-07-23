using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Modelo;
using System.Data.SqlClient;

namespace wbERPGBL.ASP.Reportes
{
    public partial class frmFacturaPreview : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    rptReporteFactura.Reset();
                    int ID = int.Parse(Request.QueryString["ID"]);
                    DataTable ds1 = null;
                    ReportDataSource rds = null;
                    SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                    if (Conexion == null)
                        HttpContext.Current.Response.Redirect("~/default.aspx");
                    ds1 = DOMModel.FACTURA_BUSCAR_POR_ID(ID, Conexion);
                    string server = Server.MapPath("~/rptArchives/rptFormatoFactura.rdlc");
                    rptReporteFactura.LocalReport.ReportPath = server;
                    rds = new ReportDataSource("dsFactura", ds1);
                    rptReporteFactura.LocalReport.DataSources.Add(rds);
                    rptReporteFactura.LocalReport.Refresh();
                }
                catch { }
            }
        }
    }
}