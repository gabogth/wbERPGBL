using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using Modelo;
using System.Data.SqlClient;
using System.Web.Services;
using System.Web.Script.Services;
using System.Data;
using System.Configuration;

namespace wbERPGBL
{
    public partial class _default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            SqlConnection Conexion = null;
            try
            {
                Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion != null)
                    Conexion.Close();
                Session.Clear();
                Session.Abandon();
            }
            catch { }
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string login(string usuario, string contrasena)
        {
            clsResult objResultado = new clsResult();
            SqlConnection Conexion = null;
            string formatCNN = ConfigurationManager.AppSettings["formatCNN"].ToString();
            try
            {
                try
                {
                    Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                    if (Conexion != null)
                        Conexion.Close();
                }
                catch { }
                Conexion = DOMModel.Login(formatCNN, usuario, contrasena);
                HttpContext.Current.Session["conexion"] = Conexion;
                HttpContext.Current.Session.Timeout = 20;
                dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow dr = DOMModel.getUsuarioPorUsuario(usuario, Conexion);
                if (dr != null)
                {
                    objResultado.result = "success";
                    objResultado.message = "ok_server";
                    objResultado.registros = 1;
                    objResultado.body = dr;
                    HttpContext.Current.Session["usuario"] = dr;
                }
                else
                {
                    objResultado.result = "error";
                    objResultado.message = "[401] - No hay usuarios registrados en la base de datos, porfavor comuniquese su administrador para que le cree un perfil.";
                    objResultado.registros = 0;
                    objResultado.body = null;
                }

                return JsonConvert.SerializeObject(objResultado);
            }
            catch (Exception ex)
            {
                objResultado.result = "error";
                objResultado.message = ex.Message;
                objResultado.registros = 0;
                objResultado.body = null;
                return JsonConvert.SerializeObject(objResultado);
            }
        }
    }
}