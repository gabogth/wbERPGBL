using Modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace wbERPGBL.ASP
{
    public partial class usuario_frmMantenimientoUsuario : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string consultaReniec(string dni)
        {
            clsResult objResultado = new clsResult();
            try
            {
                var json = new WebClient().DownloadString("http://id360.ddns.net:8086/reniec.aspx?dni=" + dni);
                return json.ToString();
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
        public static string buscar(string q, int index, int cantidad)
        {
            clsResult objResultado = new clsResult();
            try
            {
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                int registros = 0;
                dsProcedimientos.USUARIO_BUSCAR_POR_QUERYDataTable dtResultado = DOMModel.USUARIO_BUSCAR_POR_QUERY(q, ref registros, index, cantidad, Conexion);
                if (dtResultado != null)
                {
                    objResultado.result = "success";
                    objResultado.message = "ok_server";
                    objResultado.registros = registros;
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
        public static string buscar_trabajador(string q, int index, int cantidad)
        {
            clsResult objResultado = new clsResult();
            try
            {
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                int registros = 0;
                dsProcedimientos.TRABAJADOR_BUSCAR_POR_QUERYDataTable dtResultado = DOMModel.TRABAJADOR_BUSCAR_POR_QUERY(q, ref registros, index, cantidad, Conexion);
                if (dtResultado != null)
                {
                    objResultado.result = "success";
                    objResultado.message = "ok_server";
                    objResultado.registros = registros;
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
        public static string reset_pw(int IDUSUARIO, string USUARIO)
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
                bool dtResultado = DOMModel.USUARIO_RESET_PASSWORD(IDUSUARIO, sessionUS.idusuario, USUARIO, Conexion);
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
        public static string enforce_pw(int IDUSUARIO, string USUARIO, string NEW_PW)
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
                bool dtResultado = DOMModel.USUARIO_ENFORCE_PASSWORD(IDUSUARIO, sessionUS.idusuario, NEW_PW, USUARIO, Conexion);
                if (dtResultado != false)
                {
                    sessionUS.cambiar_pw = 0;
                    HttpContext.Current.Session["usuario"] = sessionUS;
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
        public static string modificar_perfil(string txtNombre, string txtApellido, string txtCorreo, 
            string txtDomicilio, string txtMovilPrivado1, string txtMovilPrivado2, string txtMovilEmpresarial,
            string txtTelefonoFijo, string txtContacto1, string txtContacto2, string img_data)
        {
            System.Drawing.Bitmap bmp = null;
            clsResult objResultado = new clsResult();
            try
            {
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");

                dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
                if (sessionUS == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                bmp = clsUtil.converDataImage(img_data);
                string ImagenPath = ConfigurationManager.AppSettings["AVATARS"].ToString();
                string ImageFileName = DateTime.Now.ToString().Replace("-", "").Replace("/", "").Replace(" ", "").Replace(":", "").Replace(".", "") + ".jpg";
                string fullPath = ImagenPath + ImageFileName;
                Bitmap i2 = null;
                try
                {
                    i2 = ResizeImage((Bitmap)bmp, 200, 257);
                }
                catch { }
                if (bmp == null)
                {
                    ImageFileName = "";
                    fullPath = "";
                }
                else {
                    i2.Save(fullPath, System.Drawing.Imaging.ImageFormat.Jpeg);
                }
                bool dtResultado = DOMModel.USUARIO_MODIFICAR_PERFIL(sessionUS.idusuario, txtNombre, txtApellido, txtCorreo,
                    txtDomicilio, txtMovilPrivado1, txtMovilPrivado2, txtMovilEmpresarial, txtTelefonoFijo, txtContacto1,
                    txtContacto2, ImageFileName, Conexion);
                if (dtResultado != false)
                {
                    sessionUS.nombre = txtNombre;
                    sessionUS.apellido = txtApellido;
                    sessionUS.correo = txtCorreo;
                    sessionUS.domicilio = txtDomicilio;
                    sessionUS.movil_privado1 = txtMovilPrivado1;
                    sessionUS.movil_privado2 = txtMovilPrivado2;
                    sessionUS.movil_empresarial = txtMovilEmpresarial;
                    sessionUS.telefono_fijo = txtTelefonoFijo;
                    sessionUS.contacto1 = txtContacto1;
                    sessionUS.contacto2 = txtContacto2;
                    HttpContext.Current.Session["usuario"] = sessionUS;
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

        public static Bitmap ResizeImage(Bitmap image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);
            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);
            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string modificar_estado(int IDUSUARIO, int ESTADO, string USUARIO)
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
                bool dtResultado = DOMModel.USUARIO_MODIFICAR_ESTADO(IDUSUARIO, sessionUS.idusuario, USUARIO, ESTADO, Conexion);
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
        public static string cambiar_pw(string USUARIO, string ANTIGUO_PASSWORD, string NUEVO_PASSWORD)
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
                bool dtResultado = DOMModel.USUARIO_MODIFICAR_PASSWORD(USUARIO, ANTIGUO_PASSWORD, NUEVO_PASSWORD, Conexion);
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