using Modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;

namespace wbERPGBL.response
{
    /// <summary>
    /// Descripción breve de upload_image_reg_user
    /// </summary>
    public class upload_image_reg_user : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            Image img = null;
            string ImagenPath = ConfigurationManager.AppSettings["AVATARS"].ToString();
            string ImageFileName = DateTime.Now.ToString().Replace("-", "").Replace("/", "").Replace(" ", "").Replace(":", "").Replace(".", "") + ".jpg";
            string fullPath = ImagenPath + "\\" + ImageFileName;
            string OP = context.Request.Params["OP"];
            if (OP == "INSERTAR")
            {
                if (context.Request.Files.Count <= 0)
                    img = null;
                else
                {
                    dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
                    if (sessionUS == null)
                        HttpContext.Current.Response.Redirect("~/default.aspx");
                    string FOTO_DIR = context.Request.Params["FOTO_DIR"];
                    if (FOTO_DIR != sessionUS.foto)
                    {
                        img = ObtenerImagen(ref context);
                        if (img != null)
                            img.Save(fullPath);
                        else
                            ImageFileName = "";
                    }
                    string USUARIO = context.Request.Params["USUARIO"];
                    string PASSWORD = context.Request.Params["contrasena"];
                    string NOMBRE = context.Request.Params["NOMBRE"];
                    string APELLIDO = context.Request.Params["APELLIDO"];
                    string DNI = context.Request.Params["DNI"];
                    string CORREO = context.Request.Params["CORREO"];
                    DateTime FECHA_NACIMIENTO = DateTime.Parse(context.Request.Params["FECHA_NACIMIENTO"]);
                    int IDROL = int.Parse(context.Request.Params["IDROL"]);
                    int IDAREA_EMPRESA = int.Parse(context.Request.Params["IDAREA_EMPRESA"]);
                    int IDEMPRESA = int.Parse(context.Request.Params["IDEMPRESA"]);
                    int ES_TRABAJADOR = int.Parse(context.Request.Params["ES_TRABAJADOR"]);
                    int IDSEDE = int.Parse(context.Request.Params["IDSEDE"]);
                    string CODIGO_EMPLEADO = context.Request.Params["CODIGO_EMPLEADO"];
                    string DOMICILIO = context.Request.Params["DOMICILIO"];
                    string MOVIL_PRIVADO1 = context.Request.Params["MOVIL_PRIVADO1"];
                    string MOVIL_PRIVADO2 = context.Request.Params["MOVIL_PRIVADO2"];
                    string MOVIL_EMPRESARIAL = context.Request.Params["MOVIL_EMPRESARIAL"];
                    string TELEFONO_FIJO = context.Request.Params["TELEFONO_FIJO"];
                    string CONTACTO_1 = context.Request.Params["CONTACTO_1"];
                    string CONTACTO_2 = context.Request.Params["CONTACTO_2"];
                    int IDPUESTO_TRABAJADOR = int.Parse(context.Request.Params["IDPUESTO_TRABAJADOR"]);
                    string responseText = insertar(USUARIO, PASSWORD, NOMBRE, APELLIDO, CORREO, FECHA_NACIMIENTO, IDROL, IDAREA_EMPRESA,
                        IDEMPRESA, CODIGO_EMPLEADO, DOMICILIO, MOVIL_PRIVADO1, MOVIL_PRIVADO2, MOVIL_EMPRESARIAL, TELEFONO_FIJO, CONTACTO_1,
                        CONTACTO_2, ImageFileName, IDPUESTO_TRABAJADOR, DNI, IDSEDE, ES_TRABAJADOR);
                    context.Response.Write(responseText);
                }
            }
            else if (OP == "MODIFICAR")
            {
                img = ObtenerImagen(ref context);
                int IDUSUARIO = int.Parse(context.Request.Params["IDUSUARIO"]);
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");

                dsProcedimientos.USUARIO_BUSCAR_POR_IDRow usuario = DOMModel.getUsuarioPorID(IDUSUARIO, Conexion);
                string FOTO_DIR = context.Request.Params["FOTO_DIR"];
                if (usuario.foto != FOTO_DIR)
                {
                    if (img != null)
                        img.Save(fullPath);
                    else
                        ImageFileName = "";
                }
                else
                {
                    ImageFileName = usuario.foto;
                }

                string NOMBRE = context.Request.Params["NOMBRE"];
                string APELLIDO = context.Request.Params["APELLIDO"];
                string CORREO = context.Request.Params["CORREO"];
                DateTime FECHA_NACIMIENTO = DateTime.Parse(context.Request.Params["FECHA_NACIMIENTO"]);
                int IDROL = int.Parse(context.Request.Params["IDROL"]);
                int IDAREA_EMPRESA = int.Parse(context.Request.Params["IDAREA_EMPRESA"]);
                int IDEMPRESA = int.Parse(context.Request.Params["IDEMPRESA"]);
                int ES_TRABAJADOR = int.Parse(context.Request.Params["ES_TRABAJADOR"]);
                int IDSEDE = int.Parse(context.Request.Params["IDSEDE"]);
                string CODIGO_EMPLEADO = context.Request.Params["CODIGO_EMPLEADO"];
                string DOMICILIO = context.Request.Params["DOMICILIO"];
                string MOVIL_PRIVADO1 = context.Request.Params["MOVIL_PRIVADO1"];
                string DNI = context.Request.Params["DNI"];
                string MOVIL_PRIVADO2 = context.Request.Params["MOVIL_PRIVADO2"];
                string MOVIL_EMPRESARIAL = context.Request.Params["MOVIL_EMPRESARIAL"];
                string TELEFONO_FIJO = context.Request.Params["TELEFONO_FIJO"];
                string CONTACTO_1 = context.Request.Params["CONTACTO_1"];
                string CONTACTO_2 = context.Request.Params["CONTACTO_2"];               
                int IDPUESTO_TRABAJADOR = int.Parse(context.Request.Params["IDPUESTO_TRABAJADOR"]);
                string responseText = modificar(NOMBRE, APELLIDO, CORREO, FECHA_NACIMIENTO, IDROL, IDAREA_EMPRESA,
                    IDEMPRESA, CODIGO_EMPLEADO, DOMICILIO, MOVIL_PRIVADO1, MOVIL_PRIVADO2, MOVIL_EMPRESARIAL, TELEFONO_FIJO, CONTACTO_1,
                    CONTACTO_2, ImageFileName, IDPUESTO_TRABAJADOR, IDUSUARIO, DNI, IDSEDE, ES_TRABAJADOR);
                context.Response.Write(responseText);
            }
            else if (OP == "ELIMINAR")
            {
                int IDUSUARIO = int.Parse(context.Request.Params["IDUSUARIO"]);
                string USUARIO = context.Request.Params["USUARIO"];
                string responseText = eliminar(IDUSUARIO, USUARIO);
                context.Response.Write(responseText);
            }
        }

        public string insertar(string USUARIO, string PASSWORD, string NOMBRE, string APELLIDO, string CORREO, DateTime FECHA_NACIMIENTO,
            int IDROL, int IDAREA_EMPRESA, int IDEMPRESA, string CODIGO_EMPLEADO, string DOMICILIO, string MOVIL_PRIVADO1, string MOVIL_PRIVADO2,
            string MOVIL_EMPRESARIAL, string TELEFONO_FIJO, string CONTACTO_1, string CONTACTO_2, string FOTO_DIR,
            int IDPUESTO_TRABAJADOR, string DNI, int IDSEDE, int ES_TRABAJADOR)
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
                bool dtResultado = DOMModel.USUARIO_INSERTAR(USUARIO, PASSWORD, NOMBRE, APELLIDO, CORREO, FECHA_NACIMIENTO, IDROL, IDAREA_EMPRESA,
                    IDEMPRESA, CODIGO_EMPLEADO, DOMICILIO, MOVIL_PRIVADO1, MOVIL_PRIVADO2, MOVIL_EMPRESARIAL, TELEFONO_FIJO, CONTACTO_1,
                    CONTACTO_2, FOTO_DIR, sessionUS.idusuario, IDPUESTO_TRABAJADOR, DNI, IDSEDE, ES_TRABAJADOR, Conexion);
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

        public string modificar(string NOMBRE, string APELLIDO, string CORREO, DateTime FECHA_NACIMIENTO,
            int IDROL, int IDAREA_EMPRESA, int IDEMPRESA, string CODIGO_EMPLEADO, string DOMICILIO, string MOVIL_PRIVADO1, string MOVIL_PRIVADO2,
            string MOVIL_EMPRESARIAL, string TELEFONO_FIJO, string CONTACTO_1, string CONTACTO_2, string FOTO_DIR,
            int IDPUESTO_TRABAJADOR, int IDUSUARIO, string DNI, int IDSEDE, int ES_TRABAJADOR)
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
                bool dtResultado = DOMModel.USUARIO_MODIFICAR(IDUSUARIO, NOMBRE, APELLIDO, CORREO, FECHA_NACIMIENTO, IDROL, 
                    IDAREA_EMPRESA, IDEMPRESA, CODIGO_EMPLEADO, DOMICILIO, MOVIL_PRIVADO1, MOVIL_PRIVADO2, MOVIL_EMPRESARIAL, TELEFONO_FIJO, 
                    CONTACTO_1, CONTACTO_2, FOTO_DIR, sessionUS.idusuario, IDPUESTO_TRABAJADOR, DNI, IDSEDE, ES_TRABAJADOR, Conexion);
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

        public string eliminar(int IDUSUARIO, string USUARIO)
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
                bool dtResultado = DOMModel.USUARIO_ELIMINAR(sessionUS.idusuario, IDUSUARIO, USUARIO, Conexion);
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

        public string buscar(string q, int index, int cantidad)
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

        public Image ObtenerImagen(ref HttpContext context)
        {
            Image returnImage = null;
            try
            {
                for (int i = 0; i < context.Request.Files.Count; i++)
                {
                    HttpPostedFile file = context.Request.Files[i];
                    if (context.Request.Form != null)
                    {
                        string imageid = context.Request.Form.ToString();
                        imageid = imageid.Substring(imageid.IndexOf('=') + 1);

                        if (file != null)
                        {
                            string ext = Path.GetExtension(file.FileName);
                            using (Stream inputStream = file.InputStream)
                            {
                                MemoryStream memoryStream = inputStream as MemoryStream;
                                byte[] buffer = new byte[16 * 1024];
                                int bytesRead;
                                if (memoryStream == null)
                                {
                                    memoryStream = new MemoryStream();
                                    while ((bytesRead = inputStream.Read(buffer, 0, buffer.Length)) > 0)
                                    {
                                        memoryStream.Write(buffer, 0, bytesRead);
                                    }

                                }
                                returnImage = Image.FromStream(memoryStream);
                                Bitmap bmpReturn = ResizeImage((Bitmap)returnImage, 200, 257);
                                return (Image)bmpReturn;
                            }
                        }
                        return null;
                    }
                    else
                    {
                        return null;
                    }

                }
                return null;
            }
            catch { return null; }
        }
        public byte[] imageToByteArray(System.Drawing.Image imageIn)
        {
            MemoryStream ms = new MemoryStream();
            imageIn.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
            return ms.ToArray();
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
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}