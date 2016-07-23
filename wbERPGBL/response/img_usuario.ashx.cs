using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Modelo;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using System.Configuration;

namespace wbERPGBL.response
{
    /// <summary>
    /// Descripción breve de img_usuario
    /// </summary>
    public class img_usuario : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                string folderMap = ConfigurationManager.AppSettings["AVATARS"].ToString();
                SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
                if (Conexion == null) HttpContext.Current.Response.Redirect("~/default.aspx");
                int ID = int.Parse(context.Request.QueryString["ID"]);
                dsProcedimientos.USUARIO_BUSCAR_POR_IDRow usuarioDT = DOMModel.getUsuarioPorID(ID, Conexion);
                if (usuarioDT == null) HttpContext.Current.Response.Redirect("~/default.aspx");
                string fullPathImage = folderMap + usuarioDT.foto;
                Image img = Image.FromFile(fullPathImage);
                string extension = Path.GetExtension(fullPathImage);
                byte[] imageInBytes = imageToByteArray(img);
                MemoryStream str = new MemoryStream();
                str.Write(imageInBytes, 0, imageInBytes.Length);
                Bitmap bit = new Bitmap(str);
                context.Response.ContentType = "image/" + extension;
                bit.Save(context.Response.OutputStream, ImageFormat.Jpeg);
            }
            catch { }
        }

        public byte[] imageToByteArray(System.Drawing.Image imageIn)
        {
            MemoryStream ms = new MemoryStream();
            imageIn.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
            return ms.ToArray();
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