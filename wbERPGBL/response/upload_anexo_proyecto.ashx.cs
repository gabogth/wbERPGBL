using Modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;

namespace wbERPGBL.response
{
    /// <summary>
    /// Descripción breve de upload_anexo_proyecto
    /// </summary>
    public class upload_anexo_proyecto : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            string ImagenPath = ConfigurationManager.AppSettings["ANEXO_PROYECTO"].ToString();

            try
            {
                int idupload_proyecto = int.Parse(context.Request.QueryString["IDUPLOAD_PROYECTO"]);
                downloadArchivo(idupload_proyecto, ref context, ImagenPath);
                return;
            }
            catch { }

            string OP = context.Request.Params["OP"];
            if (OP == "INSERTAR")
            {
                dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
                if (sessionUS == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                string NOMBRE_ARCHIVO = context.Request.Params["NOMBRE_ARCHIVO"];
                string FILE_TYPE = context.Request.Params["FILE_TYPE"];
                string ImageFileName = "(" 
                    + DateTime.Now.ToString().Replace("-", "").Replace("/", "").Replace(" ", "").Replace(":", "").Replace(".", "") 
                    + ") - " 
                    + NOMBRE_ARCHIVO;
                string fullPath = ImagenPath + "\\" + ImageFileName;
                string NOMBRE_GENERADO = ImageFileName;
                int IDPROYECTO = int.Parse(context.Request.Params["IDPROYECTO"]);
                byte[] datos = ObtenerImagen(ref context);
                string EXTENSION = FILE_TYPE;
                string PESO_ARCHIVO = GetFileSize(datos.Length);
                File.WriteAllBytes(fullPath, datos);
                string responseText = insertar(IDPROYECTO, NOMBRE_GENERADO, NOMBRE_ARCHIVO, PESO_ARCHIVO, EXTENSION);
                context.Response.Write(responseText);
            }
            else if (OP == "ELIMINAR")
            {
                int IDUPLOAD_PROYECTO = int.Parse(context.Request.Params["IDUPLOAD_PROYECTO"]);
                string responseText = eliminar(IDUPLOAD_PROYECTO, ImagenPath);
                context.Response.Write(responseText);
            }
            else if (OP == "dl_backup")
            {
                string backup = context.Request.Params["FILE_NAME"];
                downloadBackUP(backup, ref context);
            }
        }

        private void downloadBackUP(string filename, ref HttpContext context)
        {
            string mimeType = "";
            string directorio = ConfigurationManager.AppSettings["BACK_LOCK"].ToString();
            byte[] fileBytes = File.ReadAllBytes(directorio + filename);
            context.Response.Buffer = true;
            context.Response.Clear();
            context.Response.ContentType = mimeType;
            context.Response.AddHeader("content-disposition", "attachment; filename=" + filename);
            context.Response.BinaryWrite(fileBytes);
            context.Response.Flush();
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

        public byte[] ObtenerImagen(ref HttpContext context)
        {
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
                            byte[] datos = obtenerArray(file.InputStream);
                            return datos;
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

        public string insertar(int IDPROYECTO, string NOMBRE_GENERADO, string NOMBRE_ARCHIVO, string PESO_ARCHIVO, 
            string EXTENSION)
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
                bool dtResultado = DOMModel.UPLOAD_PROYECTO_INSERTAR(IDPROYECTO, NOMBRE_GENERADO, NOMBRE_ARCHIVO,
                    PESO_ARCHIVO, sessionUS.idusuario, EXTENSION, Conexion);
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

        public string eliminar(int IDUPLOAD_PROYECTO, string ImagePath)
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

                try
                {
                    dsProcedimientos.UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOADDataTable dtUploadProyecto = DOMModel.UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOAD(IDUPLOAD_PROYECTO, Conexion);
                    foreach (dsProcedimientos.UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOADRow item in dtUploadProyecto.Rows)
                    {
                        File.Delete(ImagePath + item.nombre_generado);
                        break;
                    }
                }
                catch { }

                bool dtResultado = DOMModel.UPLOAD_PROYECTO_ELIMINAR(IDUPLOAD_PROYECTO, sessionUS.idusuario, Conexion);

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

        public void downloadArchivo(int IDUPLOAD_PROYECTO, ref HttpContext context, string pathFile)
        {
            string mimeType = "";
            clsResult objResultado = new clsResult();
            SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
            if (Conexion != null)
            {
                try
                {
                    dsProcedimientos.UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOADDataTable dtUploadProyecto = DOMModel.UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOAD(IDUPLOAD_PROYECTO, Conexion);
                    foreach (dsProcedimientos.UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOADRow item in dtUploadProyecto.Rows)
                    {
                        byte[] fileBytes = File.ReadAllBytes(pathFile + item.nombre_generado);
                        context.Response.Buffer = true;
                        context.Response.Clear();
                        context.Response.ContentType = mimeType;
                        context.Response.AddHeader("content-disposition", "attachment; filename=" + item.nombre_archivo);
                        context.Response.BinaryWrite(fileBytes);
                        context.Response.Flush();
                        return;
                    }
                }
                catch(Exception ex)
                {
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                }
            }
            else
            {
                HttpContext.Current.Response.Redirect("~/default.aspx");
            }
        }

        public byte[] obtenerArray(Stream input)
        {
            byte[] buffer = new byte[16 * 1024];
            using (MemoryStream ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
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