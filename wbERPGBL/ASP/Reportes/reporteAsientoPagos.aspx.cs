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
    public partial class reporteAsientoPagos : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    rptAsiento.Reset();
                    int ID = int.Parse(Request.QueryString["ID"]);
                    DataTable ds1 = null;
                    ReportDataSource rds = null;
                    SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                    if (Conexion == null)
                        HttpContext.Current.Response.Redirect("~/default.aspx");
                    ds1 = DOMModel.ASIENTO_CONTABLE_BUSCAR_IDPAGOS(ID, Conexion);
                    string server = Server.MapPath("~/rptArchives/asientos/rptAsientoPagos.rdlc");
                    rptAsiento.LocalReport.ReportPath = server;
                    rds = new ReportDataSource("dsPagos", ds1);
                    rptAsiento.LocalReport.DataSources.Add(rds);
                    rptAsiento.LocalReport.Refresh();
                }
                catch { }
            }
        }
    }
}