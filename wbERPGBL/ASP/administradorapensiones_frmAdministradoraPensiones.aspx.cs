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
    public partial class administradorapensiones_frmAdministradoraPensiones : System.Web.UI.Page
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
                dsProcedimientos.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERYDataTable dtResultado = DOMModel.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERY(q, ref registros, index, cantidad, Conexion);
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
                dsProcedimientos.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERY_ESTADODataTable dtResultado = DOMModel.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERY_ESTADO(q, ref registros, index, cantidad, Conexion);
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
        public static string insertar(string ADMINISTRADORA_PENSION, string CODIGO, int IDSISTEMA_PENSION)
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
                bool dtResultado = DOMModel.ADMINISTRADORAS_PENSIONES_INSERTAR(ADMINISTRADORA_PENSION, CODIGO, sessionUS.idusuario, IDSISTEMA_PENSION, Conexion);
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
        public static string modificar(int IDADMINISTRADORA_PENSION, string ADMINISTRADORA_PENSION, string CODIGO, int IDSISTEMA_PENSION)
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
                bool dtResultado = DOMModel.ADMINISTRADORAS_PENSIONES_MODIFICAR(IDADMINISTRADORA_PENSION, ADMINISTRADORA_PENSION, CODIGO, sessionUS.idusuario, IDSISTEMA_PENSION, Conexion);
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
        public static string modificar_estado(int ESTADO, int IDADMINISTRADORA_PENSION)
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
                bool dtResultado = DOMModel.ADMINISTRADORAS_PENSIONES_MODIFICAR_ESTADO(IDADMINISTRADORA_PENSION, ESTADO, Conexion);
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
        public static string eliminar(int IDADMINISTRADORA_PENSION)
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
                bool dtResultado = DOMModel.ADMINISTRADORAS_PENSIONES_ELIMINAR(IDADMINISTRADORA_PENSION, sessionUS.idusuario, Conexion);
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