using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Modelo;
using System.IO;
using System.Configuration;

namespace wbERPGBL.ASP.Reportes
{
    public partial class frmFotocheckImpresion : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    string direccion_logo = "file://" + ConfigurationManager.AppSettings["COORPORATIVO"].ToString();
                    string direccion_foto = "file://" + ConfigurationManager.AppSettings["AVATARS"].ToString();
                    rptReporteFactura.Reset();
                    int IDEMPRESA = int.Parse(Request.QueryString["LOGO"]);
                    int IDUSUARIO = int.Parse(Request.QueryString["IDUSUARIO"]);
                    string foto_trabajador = direccion_foto + Request.QueryString["FOTO"];
                    
                    string area = Request.QueryString["AREA"];
                    string sede = Request.QueryString["SEDE"];
                    string nombre_trabajador = Request.QueryString["NOMBRE_TRABAJADOR"];
                    string codigo_trabajador = IDEMPRESA + Request.QueryString["CODIGO"].PadLeft(5, '0');
                    DateTime fecha_expiracion = DateTime.Parse(Request.QueryString["FECHA_EXPIRACION"]);
                    SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                    if (Conexion == null)
                        HttpContext.Current.Response.Redirect("~/default.aspx");
                    Modelo.dsProcedimientos.EMPRESA_BUSCAR_POR_IDRow empresa = DOMModel.EMPRESA_BUSCAR_POR_ID(IDEMPRESA, Conexion);
                    string server = Server.MapPath("~/rptArchives/fotoCheck.rdlc");
                    string logo = (direccion_logo + empresa.ruc + ".png");
                    rptReporteFactura.LocalReport.ReportPath = server;
                    List<ReportParameter> parameters = new List<ReportParameter>();

                    parameters.Add(new ReportParameter("foto_trabajador", foto_trabajador));
                    parameters.Add(new ReportParameter("logo_empresa", logo));
                    parameters.Add(new ReportParameter("area", area));
                    parameters.Add(new ReportParameter("sede", sede));
                    parameters.Add(new ReportParameter("nombre_trabajador", nombre_trabajador));
                    parameters.Add(new ReportParameter("cod_trabajador", codigo_trabajador));
                    parameters.Add(new ReportParameter("fecha_expiracion", fecha_expiracion.ToString("dd/MM/yyyy")));
                    rptReporteFactura.LocalReport.EnableExternalImages = true;
                    rptReporteFactura.LocalReport.EnableHyperlinks = true;
                    rptReporteFactura.LocalReport.SetParameters(parameters);
                    rptReporteFactura.LocalReport.Refresh();
                }
                catch (Exception ex){ Console.WriteLine(ex.Message); }
            }

        }
    }
}