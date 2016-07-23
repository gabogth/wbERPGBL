using Modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;

namespace wbERPGBL.response
{
    /// <summary>
    /// Descripción breve de controllerUploadFactura
    /// </summary>
    public class controllerUploadFactura : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            string ImagenPath = ConfigurationManager.AppSettings["UPLOADS_FACTURA"].ToString();
            string OP = context.Request.Params["OP"];
            if (OP == "INSERTAR")
            {
                Image img = null;
                string NOMBRE_ARCHIVO = context.Request.Params["NOMBRE_ARCHIVO"];
                string ImageFileName = "("
                    + DateTime.Now.ToString().Replace("-", "").Replace("/", "").Replace(" ", "").Replace(":", "").Replace(".", "")
                    + ") - "
                    + NOMBRE_ARCHIVO;
                string fullPath = ImagenPath + "\\" + ImageFileName;
                img = ObtenerImagen(ref context);
                if (img != null)
                    img.Save(fullPath);
                else
                    ImageFileName = "";
                int IDVENTAS_CABECERA = int.Parse(context.Request.Params["IDVENTAS_CABECERA"]);
                string FILE_TYPE = context.Request.Params["FILE_TYPE"];
                byte[] imageBytes = imageToByteArray(img);
                string PESO = GetFileSize(imageBytes.Length);
                if (context.Request.Files.Count <= 0)
                    img = null;
                else
                {
                    dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
                    if (sessionUS == null)
                        HttpContext.Current.Response.Redirect("~/default.aspx");

                    string responseText = insertar(ImageFileName, NOMBRE_ARCHIVO, FILE_TYPE, sessionUS.idusuario, IDVENTAS_CABECERA, PESO);
                    context.Response.Write(responseText);
                }
            }
            else if (OP == "VER")
            {
                try
                {
                    int IDVENTAS_CABECERA = int.Parse(context.Request.Params["IDVENTAS_CABECERA"]);
                    SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                    if (Conexion == null) HttpContext.Current.Response.Redirect("~/default.aspx");
                    dsProcedimientos.VENTAS_CABECERA_UPLOAD_BUSCAR_POR_ID_CABECERARow ventas_cabecera = DOMModel.VENTAS_CABECERA_UPLOAD_BUSCAR_POR_ID_CABECERA(IDVENTAS_CABECERA, Conexion);
                    if (ventas_cabecera == null) HttpContext.Current.Response.Redirect("~/default.aspx");
                    string fullPathImage = ImagenPath + ventas_cabecera.direccion_fisica;
                    Image img = Image.FromFile(fullPathImage);
                    string extension = Path.GetExtension(fullPathImage);
                    byte[] imageInBytes = imageToByteArray(img);
                    MemoryStream str = new MemoryStream();
                    str.Write(imageInBytes, 0, imageInBytes.Length);
                    Bitmap bit = new Bitmap(str);
                    context.Response.ContentType = "image/" + extension;
                    bit.Save(context.Response.OutputStream, ImageFormat.Jpeg);
                }
                catch (Exception ex)
                {
                    Console.Write(ex.Message);
                }
            }
            else if (OP == "download")
            {
                int IDVENTAS_CABECERA = int.Parse(context.Request.Params["IDVENTAS_CABECERA"]);
                downloadArchivo(IDVENTAS_CABECERA, ref context, ImagenPath);
            }
        }

        public void downloadArchivo(int IDVENTAS_CABECERA, ref HttpContext context, string pathFile)
        {
            string mimeType = "";
            clsResult objResultado = new clsResult();
            SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
            if (Conexion != null)
            {
                try
                {
                    dsProcedimientos.VENTAS_CABECERA_UPLOAD_BUSCAR_POR_ID_CABECERARow itemFactura = DOMModel.VENTAS_CABECERA_UPLOAD_BUSCAR_POR_ID_CABECERA(IDVENTAS_CABECERA, Conexion);
                    if (itemFactura != null)
                    {
                        byte[] fileBytes = File.ReadAllBytes(pathFile + itemFactura.direccion_fisica);
                        context.Response.Buffer = true;
                        context.Response.Clear();
                        context.Response.ContentType = mimeType;
                        context.Response.AddHeader("content-disposition", "attachment; filename=" + itemFactura.nombre_archivo);
                        context.Response.BinaryWrite(fileBytes);
                        context.Response.Flush();
                        return;
                    }
                }
                catch (Exception ex)
                {
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                }
            }
            else
            {
                HttpContext.Current.Response.Redirect("~/default.aspx");
            }
        }

        private string GetFileSize(double byteCount)
        {
            string size = "0 Bytes";
            if (byteCount >= 1073741824.0)
                size = String.Format("{0:##.##}", byteCount / 1073741824.0) + " GB";
            else if (byteCount >= 1048576.0)
                size = String.Format("{0:##.##}", byteCount / 1048576.0) + " MB";
            else if (byteCount >= 1024.0)
                size = String.Format("{0:##.##}", byteCount / 1024.0) + " KB";
            else if (byteCount > 0 && byteCount < 1024.0)
                size = byteCount.ToString() + " Bytes";

            return size;
        }

        public byte[] imageToByteArray(System.Drawing.Image imageIn)
        {
            MemoryStream ms = new MemoryStream();
            imageIn.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
            return ms.ToArray();
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
                                return returnImage;
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

        public string insertar(string DIRECCION_FISICA, string NOMBRE_ARCHIVO, string EXTENSION, int USUARIO_CREACION, int IDVENTAS_CABECERA, string PESO)
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
                bool dtResultado = DOMModel.VENTAS_CABECERA_UPLOAD_INSERTAR(DIRECCION_FISICA, NOMBRE_ARCHIVO,
                    EXTENSION, USUARIO_CREACION, IDVENTAS_CABECERA, PESO, Conexion);
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

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}