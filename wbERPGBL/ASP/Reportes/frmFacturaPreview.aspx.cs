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
using System.IO;

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

                    string reportype = "DOC";
                    string mimeType;
                    string encoding;
                    string fileNameExtension;

                    string devinfo = "<DeviceInfo>" +
                    "  <FixedPageWidth>True</FixedPageWidth>" +
                    "  <AutoFit>True</AutoFit>" +
                    "</DeviceInfo>";
                    
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
                    Warning[] warnings;
                    string[] streams;
                    byte[] renderedBytes;
                    renderedBytes = this.rptReporteFactura.LocalReport.Render(reportype, devinfo, out mimeType, out encoding, out fileNameExtension, out streams, out warnings);
                    using (FileStream fs = new FileStream("vista_previa_impresion.docx", FileMode.Create))
                    {
                        fs.Write(renderedBytes, 0, renderedBytes.Length);
                    }
                    rptReporteFactura.LocalReport.Refresh();
                }
                catch { }
            }
        }
    }
}