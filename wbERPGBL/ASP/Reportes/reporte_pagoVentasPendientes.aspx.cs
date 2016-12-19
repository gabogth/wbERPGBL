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
                    DateTime? aux = null;
                    int? auxInt = null;
                    rptPagoVentas.Reset();
                    string TYPE = Request.QueryString["TYPE"];
                    string QUERY = Request.QueryString["QUERY"];
                    string SERIE_FILTRO = Request.QueryString["SERIE_FILTRO"];
                    string CORRELATIVO = Request.QueryString["CORRELATIVO"];
                    string EMPRESA_FILTRO = Request.QueryString["EMPRESA_FILTRO"];
                    string ESTADO_FILTRO = Request.QueryString["ESTADO_FILTRO"];
                    string fch_inicio = Request.QueryString["FECHA_INICIO"];
                    string fch_fin = Request.QueryString["FECHA_FIN"];
                    string omitir_eg = Request.QueryString["OMITIR_EG"];
                    string server = "";
                    double totalSoles = 0;
                    double totalDolares = 0;
                    double totalPagadoSoles = 0;
                    double totalPagadoDolares = 0;
                    DateTime? FECHA_INICIO = string.IsNullOrEmpty(Request.QueryString["FECHA_INICIO"].Trim()) ? aux : Convert.ToDateTime(Request.QueryString["FECHA_INICIO"].Trim());
                    DateTime? FECHA_FIN = string.IsNullOrEmpty(Request.QueryString["FECHA_FIN"].Trim()) ? aux : Convert.ToDateTime(Request.QueryString["FECHA_FIN"].Trim());
                    int? OMITIR_EG = string.IsNullOrEmpty(Request.QueryString["OMITIR_EG"]) ? auxInt : (int.Parse(Request.QueryString["OMITIR_EG"]) == 1 ? int.Parse(Request.QueryString["OMITIR_EG"]) : auxInt);
                    rptPagoVentas.InternalBorderColor = System.Drawing.Color.Transparent;
                    rptPagoVentas.ToolBarItemBorderColor = System.Drawing.Color.Transparent;
                    DataTable ds1 = null;
                    ReportDataSource rds = null;
                    SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                    if (Conexion == null)
                        HttpContext.Current.Response.Redirect("~/default.aspx");
                    dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
                    if (TYPE == "RESUMEN") ds1 = DOMModel.REPORTE_PAGO_VENTAS_PENDIENTES(sessionUS.idusuario, QUERY, SERIE_FILTRO, CORRELATIVO, EMPRESA_FILTRO, ESTADO_FILTRO, FECHA_INICIO, FECHA_FIN, OMITIR_EG, Conexion);
                    else {
                        ds1 = DOMModel.REPORTE_PAGO_VENTAS_PENDIENTES_DETALLE(sessionUS.idusuario, QUERY, SERIE_FILTRO, CORRELATIVO, EMPRESA_FILTRO, ESTADO_FILTRO, FECHA_INICIO, FECHA_FIN, OMITIR_EG, Conexion);
                        if (ds1 != null)
                        {
                            totalSoles = getTotal(1, ds1);
                            totalDolares = getTotal(0, ds1);
                            totalPagadoSoles = getTotalPagado(1, ds1);
                            totalPagadoDolares = getTotalPagado(0, ds1);
                        }
                    }

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
                    if (TYPE != "RESUMEN")
                    {
                        List<ReportParameter> parameters = new List<ReportParameter>();
                        parameters.Add(new ReportParameter("rpTotalSoles", totalSoles.ToString()));
                        parameters.Add(new ReportParameter("rpTotalDolares", totalDolares.ToString()));
                        parameters.Add(new ReportParameter("rpTotalPagadoSoles", totalPagadoSoles.ToString()));
                        parameters.Add(new ReportParameter("rpTotalPagadoDolares", totalPagadoDolares.ToString()));

                        rptPagoVentas.LocalReport.SetParameters(parameters);
                    }
                    rptPagoVentas.LocalReport.DataSources.Add(rds);
                    rptPagoVentas.LocalReport.Refresh();
                }
                catch (Exception ex){ Console.WriteLine(ex.Message); }
            }
        }

        double getTotal(int moneda, DataTable ds1)
        {
            int ant = 0;
            double totalFacturado = 0;
            foreach (dsReportes.REPORTE_PAGO_VENTAS_DETALLE_PENDIENTESRow item in ds1.Rows)
            {
                if (item.idventas_cabecera != ant)
                {
                    if (item.MONEDA_LOCAL == moneda)
                    {
                        ant = item.idventas_cabecera;
                        totalFacturado += Convert.ToDouble(item.monto_total);
                    }
                }
            }
            return totalFacturado;
        }

        double getTotalPagado(int moneda, DataTable ds1)
        {
            double totalFacturado = 0;
            foreach (dsReportes.REPORTE_PAGO_VENTAS_DETALLE_PENDIENTESRow item in ds1.Rows)
            {
                if (item.MONEDA_LOCAL == moneda)
                {
                    totalFacturado += Convert.ToDouble(item.PAGOVENTAS_MONTO);
                }
            }
            return totalFacturado;
        }
    }
}