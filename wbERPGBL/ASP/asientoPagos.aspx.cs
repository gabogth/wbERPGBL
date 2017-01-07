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
    public partial class asientoPagos : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public static string buscar(int ID)
        {
            clsResult objResultado = new clsResult();
            try
            {
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                dsProcedimientos.PAGO_VENTAS_BUSCAR_ASIENTODataTable dtResultado = DOMModel.PAGO_VENTAS_BUSCAR_ASIENTO(ID, Conexion);
                if (dtResultado != null)
                {
                    objResultado.result = "success";
                    objResultado.message = "ok_server";
                    objResultado.registros = dtResultado.Rows.Count;
                    objResultado.body = dtResultado;
                }
                else
                {
                    objResultado.result = "success";
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

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public static string insertar(int? cbCuentaHaber, int? cbCuentaDebe, double? txtMontoDebe, double? txtMontoHaber, string txtGlosa, string METHOD, int IDVENTAS, int? IDPAGO, DateTime txtFechaEmision)
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
                int? IDCABECERA = 0;
                bool dtResultado = DOMModel.ASIENTO_CONTABLE_INSERTAR(cbCuentaDebe, null, txtMontoDebe, null, txtGlosa, null, sessionUS.idusuario, METHOD, IDVENTAS, txtFechaEmision, IDPAGO, ref IDCABECERA, "PAGOS", Conexion);
                bool dtResultado2 = DOMModel.ASIENTO_CONTABLE_INSERTAR_AJUSTE(null, cbCuentaHaber, null, txtMontoHaber, METHOD, IDVENTAS, txtFechaEmision, IDCABECERA, Conexion);
                if (dtResultado != false && dtResultado2 != false)
                {
                    objResultado.result = "success";
                    objResultado.message = "ok_server";
                    objResultado.registros = 1;
                    objResultado.body = dtResultado;
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

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = false)]
        public static string eliminar(int ID)
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
                bool dtResultado = DOMModel.ASIENTO_CONTABLE_ELIMINAR_PAGO_VENTAS(ID, sessionUS.idusuario, Conexion);
                if (dtResultado != false)
                {
                    objResultado.result = "success";
                    objResultado.message = "ok_server";
                    objResultado.registros = 1;
                    objResultado.body = dtResultado;
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