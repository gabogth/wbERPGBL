using Modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace wbERPGBL.ASP
{
    public partial class asientoVentas_frmAsientoVentas : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public static string buscar(string q, int index, int cantidad, string SERIE_FILTRO, string CORRELATIVO, string EMPRESA_FILTRO, string ESTADO_FILTRO)
        {
            clsResult objResultado = new clsResult();
            try
            {
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
                if (sessionUS == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                int? registros = 0;
                dsProcedimientos.FACTURA_BUSCAR_POR_QUERY_DESGLOSE_ASIENTOSDataTable dtResultado = DOMModel.FACTURA_BUSCAR_POR_QUERY_DESGLOSE_ASIENTOS(sessionUS.idusuario, q, ref registros, index, cantidad, (String.IsNullOrEmpty(SERIE_FILTRO) ? null : SERIE_FILTRO), (String.IsNullOrEmpty(CORRELATIVO) ? null : CORRELATIVO), (String.IsNullOrEmpty(EMPRESA_FILTRO) ? null : EMPRESA_FILTRO), (String.IsNullOrEmpty(ESTADO_FILTRO) ? null : ESTADO_FILTRO), Conexion);
                objResultado.result = "success";
                objResultado.message = "ok_server";
                objResultado.registros = registros.HasValue ? registros.Value : 0;
                objResultado.body = dtResultado;
            }
            catch (Exception ex)
            {
                objResultado.result = "error";
                objResultado.message = ex.Message;
                objResultado.registros = 0;
                objResultado.body = null;
            }
            return JsonConvert.SerializeObject(objResultado);
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public static string insertar(int cbCuentaDebe, int cbCuentaHaber, int cbCuentaIGV, double txtMontoDebe, double txtMontoHaber, double txtMontoIGV, string txtGlosa, int IDVENTAS_DETALLE)
        {
            clsResult objResultado = new clsResult();
            try
            {
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");

                dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
                if (sessionUS == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                if (false && false && false)
                {
                    objResultado.result = "success";
                    objResultado.message = "ok_server";
                    objResultado.registros = 1;
                    objResultado.body = (false && false && false);
                }
                else
                {
                    objResultado.result = "error";
                    objResultado.message = "session_expired";
                    objResultado.registros = 0;
                    objResultado.body = null;
                }
            }
            catch (Exception ex)
            {
                objResultado.result = "error";
                objResultado.message = ex.Message;
                objResultado.registros = 0;
                objResultado.body = null;
            }
            return JsonConvert.SerializeObject(objResultado);
        }
    }
}