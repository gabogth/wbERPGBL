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
    public partial class configuracionespensiones_frmConfiguracionesPensiones : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string buscar(string q, int index, int cantidad)
        {
            clsResult objResultado = new clsResult();
            try
            {
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                int registros = 0;
                dsProcedimientos.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERYDataTable dtResultado = DOMModel.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERY(q, ref registros, index, cantidad, Conexion);
                objResultado.result = "success";
                objResultado.message = "ok_server";
                objResultado.registros = registros;
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
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string buscar_estado(string q, int index, int cantidad)
        {
            clsResult objResultado = new clsResult();
            try
            {
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                int registros = 0;
                dsProcedimientos.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERY_ESTADODataTable dtResultado = DOMModel.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERY_ESTADO(q, ref registros, index, cantidad, Conexion);
                objResultado.result = "success";
                objResultado.message = "ok_server";
                objResultado.registros = registros;
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
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string insertar(int IDADMINISTRADORA_PENSION, double? APORTE_OBLIGATORIO,
                double? COMISION_FLUJO, double? COMISION_MIXTA, double? PRIMA_SEGURO,
                double? COMISION_SOBRE_SALDO, int ES_CONSTANTE, double? PORCENTAJE_CONTANTE, 
                string CODIGO)
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
                bool dtResultado = DOMModel.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_INSERTAR(IDADMINISTRADORA_PENSION, APORTE_OBLIGATORIO, COMISION_FLUJO,
                    COMISION_MIXTA, PRIMA_SEGURO, COMISION_SOBRE_SALDO, ES_CONSTANTE, PORCENTAJE_CONTANTE, CODIGO, sessionUS.idusuario, Conexion);
                objResultado.result = "success";
                objResultado.message = "ok_server";
                objResultado.registros = 1;
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
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string modificar(int IDCONFIGURACION_ADMINISTRADORA_PENSIONES, int IDADMINISTRADORA_PENSION, double? APORTE_OBLIGATORIO,
                double? COMISION_FLUJO, double? COMISION_MIXTA, double? PRIMA_SEGURO, double? COMISION_SOBRE_SALDO, int ES_CONSTANTE, double? PORCENTAJE_CONTANTE, string CODIGO)
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
                bool dtResultado = DOMModel.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_MODIFICAR(IDCONFIGURACION_ADMINISTRADORA_PENSIONES, IDADMINISTRADORA_PENSION, APORTE_OBLIGATORIO, COMISION_FLUJO,
                    COMISION_MIXTA, PRIMA_SEGURO, COMISION_SOBRE_SALDO, ES_CONSTANTE, PORCENTAJE_CONTANTE, CODIGO, sessionUS.idusuario, Conexion);
                objResultado.result = "success";
                objResultado.message = "ok_server";
                objResultado.registros = 1;
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
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string modificar_estado(int ESTADO, int IDCONFIGURACION_ADMINISTRADORA_PENSIONES)
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
                bool dtResultado = DOMModel.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_MODIFICAR_ESTADO(IDCONFIGURACION_ADMINISTRADORA_PENSIONES, ESTADO, Conexion);
                objResultado.result = "success";
                objResultado.message = "ok_server";
                objResultado.registros = 1;
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
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string eliminar(int IDCONFIGURACION_ADMINISTRADORA_PENSIONES)
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
                bool dtResultado = DOMModel.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_ELIMINAR(IDCONFIGURACION_ADMINISTRADORA_PENSIONES, sessionUS.idusuario, Conexion);
                objResultado.result = "success";
                objResultado.message = "ok_server";
                objResultado.registros = 1;
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
    }
}