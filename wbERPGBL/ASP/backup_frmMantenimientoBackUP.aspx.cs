using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v2;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Modelo;
using Modelo.archivos;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace wbERPGBL.ASP
{
    public partial class backup_frmMantenimientoBackUP : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string buscar(string q, int index, int cantidad)
        {
            string directorio = ConfigurationManager.AppSettings["BACK_LOCK"].ToString();
            clsResult objResultado = new clsResult();
            List<clsArchivo> objArchivos = new List<clsArchivo>();
            try
            {
                DirectoryInfo di = new DirectoryInfo(directorio);
                List<FileInfo> diar1 = di.GetFiles().Where(file => file.Name.ToUpper().Contains(q.ToUpper())).ToList();
                if (diar1 != null && diar1.Count > 0)
                {
                    for (int i = ((index - 1) * cantidad); i < diar1.Count; i++)
                    {
                        clsArchivo objArchivo = new clsArchivo();
                        objArchivo.CreationDate = diar1[i].CreationTime;
                        objArchivo.FileName = diar1[i].Name;
                        objArchivo.FullPath = diar1[i].FullName;
                        objArchivo.Exist = diar1[i].Exists;
                        objArchivos.Add(objArchivo);
                    }
                    objResultado.result = "success";
                    objResultado.message = "ok_server";
                    objResultado.registros = objArchivos.Count;
                    objResultado.body = objArchivos;
                }
                else
                {
                    objResultado.result = "success";
                    objResultado.message = "No hay mas registros.";
                    objResultado.registros = 0;
                    objResultado.body = null;
                }
                
            }
            catch (NullReferenceException)
            {
                HttpContext.Current.Response.Redirect("~/default.aspx");
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
        public static string insertar(string NOMBRE_BACKUP, string DATABASE)
        {
            string directorio = ConfigurationManager.AppSettings["BACK_LOCK"].ToString();
            clsResult objResultado = new clsResult();
            try
            {
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                bool dtResultado = DOMModel.BACKUP_GENERAR(directorio + NOMBRE_BACKUP + ".bak", NOMBRE_BACKUP, DATABASE, Conexion);
                if (dtResultado != false)
                {
                    bool op = uploadGoogleDrive(directorio + NOMBRE_BACKUP + ".bak");
                    if (op)
                    {
                        objResultado.result = "success";
                        objResultado.message = "ok_server";
                        objResultado.registros = 1;
                        objResultado.body = dtResultado;
                    }
                    else
                    {
                        objResultado.result = "warning";
                        objResultado.message = "Back up generado en el servidor, pero no hay replica en el servidor de GOOGLE.";
                        objResultado.registros = 1;
                        objResultado.body = dtResultado;
                    }
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

        private static bool uploadGoogleDrive(string _uploadFile)
        {
            string[] scopes = new string[] { DriveService.Scope.Drive,
                                 DriveService.Scope.DriveFile};
            var clientId = "1046416471099-caktkkp5da5ldu0u97nprdt90iogha1k.apps.googleusercontent.com";      // From https://console.developers.google.com
            var clientSecret = "IF0AUh5m6zg_E89NAlaEVZ6x";          // From https://console.developers.google.com
                                                                    // here is where we Request the user to give us access, or use the Refresh Token that was previously stored in %AppData%
            var credential = GoogleWebAuthorizationBroker.AuthorizeAsync(new ClientSecrets
            {
                ClientId = clientId,
                ClientSecret = clientSecret
            },
            scopes,
            Environment.UserName,
            CancellationToken.None,
            new FileDataStore("dev.home.local")).Result;
            DriveService _service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "erpGBL",
            });
            Google.Apis.Drive.v2.Data.File body = new Google.Apis.Drive.v2.Data.File();
            body.Title = System.IO.Path.GetFileName(_uploadFile);
            body.Description = "BackUP erpGBL - Developed by GABO";
            body.MimeType = GetMimeType(_uploadFile);

            // File's content.
            byte[] byteArray = System.IO.File.ReadAllBytes(_uploadFile);
            System.IO.MemoryStream stream = new System.IO.MemoryStream(byteArray);
            try
            {
                FilesResource.InsertMediaUpload request = _service.Files.Insert(body, stream, GetMimeType(_uploadFile));
                request.Upload();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private static string GetMimeType(string fileName)
        {
            string mimeType = "application/unknown";
            string ext = System.IO.Path.GetExtension(fileName).ToLower();
            Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey(ext);
            if (regKey != null && regKey.GetValue("Content Type") != null)
                mimeType = regKey.GetValue("Content Type").ToString();
            return mimeType;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static string eliminar(string NOMBRE_BACKUP)
        {
            clsResult objResultado = new clsResult();
            try
            {
                string directorio = ConfigurationManager.AppSettings["BACK_LOCK"].ToString();
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");

                dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
                if (sessionUS == null)
                    HttpContext.Current.Response.Redirect("~/default.aspx");
                File.Delete(directorio + NOMBRE_BACKUP);
                objResultado.result = "success";
                objResultado.message = "ok_server";
                objResultado.registros = 1;
                objResultado.body = null;
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