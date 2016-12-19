using Microsoft.Reporting.WebForms;
using Modelo;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace wbERPGBL.ASP.Reportes
{
    public partial class frmContratoPreview : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    string direccion_logo = "file://" + ConfigurationManager.AppSettings["COORPORATIVO"].ToString();
                    rptReporteContrato.Reset();
                    int idContrato = int.Parse(Request.QueryString["ID"]);
                    SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                    if (Conexion == null)
                        HttpContext.Current.Response.Redirect("~/default.aspx");
                    dsReportes.REPORTE_IMPRESION_CONTRATODataTable contrato = DOMModel.REPORTE_IMPRESION_CONTRATO(idContrato, Conexion);
                    string server = Server.MapPath("~/rptArchives/contratos/" + contrato[0].nombre_reporte);
                    string logo = (direccion_logo + contrato[0].ruc + ".png");
                    rptReporteContrato.LocalReport.ReportPath = server;
                    ReportDataSource rds = new ReportDataSource("dsContrato", (DataTable)contrato);
                    List<ReportParameter> parameters = new List<ReportParameter>();
                    parameters.Add(new ReportParameter("logo_empresa", logo));
                    parameters.Add(new ReportParameter("LaBores", "Hoal mundo"));
                    rptReporteContrato.LocalReport.DataSources.Add(rds);
                    rptReporteContrato.LocalReport.EnableExternalImages = true;
                    rptReporteContrato.LocalReport.EnableHyperlinks = true;
                    rptReporteContrato.LocalReport.SetParameters(parameters);
                    rptReporteContrato.LocalReport.Refresh();
                }
                catch (Exception ex) { Console.WriteLine(ex.Message); }
            }
        }
    }
}