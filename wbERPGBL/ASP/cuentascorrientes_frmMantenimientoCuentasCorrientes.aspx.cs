﻿using Modelo;
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
    public partial class cuentascorrientes_frmMantenimientoCuentasCorrientes : System.Web.UI.Page
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
                dsProcedimientos.CUENTASCORRIENTES_BUSCAR_POR_QUERYDataTable dtResultado = DOMModel.CUENTACORRIENTE_BUSCAR_POR_QUERY(q, ref registros, index, cantidad, Conexion);
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
        public static string buscar_estado_moneda(string q, int index, int cantidad, int idmoneda)
        {
            clsResult objResultado = new clsResult();
            try
            {
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                int registros = 0;
                dsProcedimientos.CUENTASCORRIENTES_BUSCAR_POR_QUERY_ESTADO_MONEDADataTable dtResultado = DOMModel.CUENTACORRIENTE_BUSCAR_POR_QUERY_ESTADO_MONEDA(q, ref registros, index, cantidad, idmoneda, Conexion);
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
        public static string buscar_estado_moneda_empresa(string q, int index, int cantidad, int idmoneda, int idempresa)
        {
            clsResult objResultado = new clsResult();
            try
            {
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                int registros = 0;
                dsProcedimientos.CUENTASCORRIENTES_BUSCAR_POR_QUERY_ESTADO_MONEDA_EMPRESADataTable dtResultado = DOMModel.CUENTASCORRIENTES_BUSCAR_POR_QUERY_ESTADO_MONEDA_EMPRESA(q, ref registros, index, cantidad, idmoneda, idempresa, Conexion);
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
        public static string insertar(int IDENTIDAD_FINANCIERA, string NOMBRE_CUENTA, string NUMERO_CUENTA, int IDMONEDA, int IDEMPRESA, int? IDCUENTA_CONTABLE)
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
                bool dtResultado = DOMModel.CUENTASCORRIENTES_INSERTAR(IDENTIDAD_FINANCIERA,NOMBRE_CUENTA, NUMERO_CUENTA, IDMONEDA, IDEMPRESA, sessionUS.idusuario, IDCUENTA_CONTABLE, Conexion);
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

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string modificar(int IDCUENTA_CORRIENTE, int IDENTIDAD_FINANCIERA, string NOMBRE_CUENTA, string NUMERO_CUENTA, int IDMONEDA, int IDEMPRESA, int? IDCUENTA_CONTABLE)
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
                bool dtResultado = DOMModel.CUENTASCORIENTES_MODIFICAR(IDCUENTA_CORRIENTE, IDENTIDAD_FINANCIERA, NOMBRE_CUENTA, NUMERO_CUENTA, IDMONEDA, IDEMPRESA, sessionUS.idusuario, IDCUENTA_CONTABLE, Conexion);
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

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string modificar_estado(int ESTADO, int IDCUENTA_CORRIENTE)
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
                bool dtResultado = DOMModel.CUENTASCORIENTES_MODIFICAR_ESTADO(IDCUENTA_CORRIENTE, ESTADO, Conexion);
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

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string eliminar(int IDCUENTA_CORRIENTE)
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
                bool dtResultado = DOMModel.CUENTASCORRIENTES_ELIMINAR(sessionUS.idusuario, IDCUENTA_CORRIENTE, Conexion);
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