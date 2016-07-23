using Modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;

namespace wbERPGBL.response
{
    /// <summary>
    /// Descripción breve de upload_anexo_contrato
    /// </summary>
    public class upload_anexo_contrato : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            string ImagenPath = ConfigurationManager.AppSettings["ANEXO_CONTRATO"].ToString();

            try
            {
                int idupload_contrato = int.Parse(context.Request.QueryString["IDUPLOAD_CONTRATO"]);
                downloadArchivo(idupload_contrato, ref context, ImagenPath);
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
                int IDCONTRATO = int.Parse(context.Request.Params["IDCONTRATO"]);
                byte[] datos = ObtenerImagen(ref context);
                string EXTENSION = FILE_TYPE;
                string PESO_ARCHIVO = GetFileSize(datos.Length);
                File.WriteAllBytes(fullPath, datos);
                string responseText = insertar(IDCONTRATO, NOMBRE_GENERADO, NOMBRE_ARCHIVO, PESO_ARCHIVO, EXTENSION);
                context.Response.Write(responseText);
            }
            else if (OP == "ELIMINAR")
            {
                int IDUPLOAD_CONTRATO = int.Parse(context.Request.Params["IDUPLOAD_CONTRATO"]);
                string responseText = eliminar(IDUPLOAD_CONTRATO, ImagenPath);
                context.Response.Write(responseText);
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

        public string insertar(int IDCONTRATO, string NOMBRE_GENERADO, string NOMBRE_ARCHIVO, string PESO_ARCHIVO,
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
                bool dtResultado = DOMModel.UPLOAD_CONTRATO_INSERTAR(IDCONTRATO, NOMBRE_GENERADO, NOMBRE_ARCHIVO,
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

        public string eliminar(int IDUPLOAD_CONTRATO, string ImagePath)
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
                    dsProcedimientos.UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOADDataTable dtUploadContrato = DOMModel.UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOAD(IDUPLOAD_CONTRATO, Conexion);
                    foreach (dsProcedimientos.UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOADRow item in dtUploadContrato.Rows)
                    {
                        File.Delete(ImagePath + item.nombre_generado);
                        break;
                    }
                }
                catch { }

                bool dtResultado = DOMModel.UPLOAD_CONTRATO_ELIMINAR(IDUPLOAD_CONTRATO, sessionUS.idusuario, Conexion);

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

        public void downloadArchivo(int IDUPLOAD_CONTRATO, ref HttpContext context, string pathFile)
        {
            string mimeType = "";
            clsResult objResultado = new clsResult();
            SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
            if (Conexion != null)
            {
                try
                {
                    dsProcedimientos.UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOADDataTable dtUploadContrato = DOMModel.UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOAD(IDUPLOAD_CONTRATO, Conexion);
                    foreach (dsProcedimientos.UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOADRow item in dtUploadContrato.Rows)
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