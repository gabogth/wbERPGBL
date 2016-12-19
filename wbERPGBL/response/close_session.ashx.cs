using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace wbERPGBL.response
{
    /// <summary>
    /// Descripción breve de close_session
    /// </summary>
    public class close_session : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                SqlConnection Conexion = (SqlConnection)context.Session["conexion"];
                if (Conexion != null)
                    Conexion.Close();
            }
            catch { }
            HttpContext.Current.Session.Clear();
            HttpContext.Current.Session.Abandon();
            context.Session.Clear();
            context.Session.Abandon();
            context.Response.Redirect("~/default.aspx");
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