<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="frmCategorias.aspx.cs" Inherits="wbERPGBL.ASP.frmCategorias" %>
<%@ Import Namespace="Modelo.archivos" %>
<%@ Import Namespace="Modelo" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Data.SqlClient" %>
<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="IDCuerpo" runat="server">
    <%
        SqlConnection Conexion = (SqlConnection)HttpContext.Current.Session["conexion"];
        if (Conexion == null)
            HttpContext.Current.Response.Redirect("~/default.aspx");
        dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
        string CATEGORIA = "";
        try
        {
            int IDCATEGORIA = int.Parse(Request.QueryString["navigator_type"]);
            bool hasEntred = false;
            dsProcedimientos.ROL_LISTAR_ITEMSDataTable dtResultado = DOMModel.ROL_LISTAR_ITEMS(sessionUS.idrol, Conexion);
            if (dtResultado == null)
                Response.Redirect("~/ASP/default.aspx");
            foreach (dsProcedimientos.ROL_LISTAR_ITEMSRow item in dtResultado.Rows)
            {
                if (item.idcategoria == IDCATEGORIA && item.MARK == 1)
                {
                    CATEGORIA = item.CATEGORIA_NOMBRE_MOSTRAR;
                    hasEntred = true;
                }
            }
            if(!hasEntred)
                Response.Redirect("~/ASP/default.aspx");
        }
        catch (Exception ex)
        {
            Response.Redirect("~/ASP/default.aspx");
        }
    %>
    <div class="tile">
        <h2 class="tile-title">Menú <%= CATEGORIA %></h2>
        <div class="tile-config dropdown">
            <a data-toggle="dropdown" href="#" class="tile-menu"></a>
            <ul class="dropdown-menu pull-right text-right">
                <li><a class="tile-info-toggle" id="btnaadPanel" href="#">Anclar a accesos directos</a></li>
                <li><a href="#">Actualizar</a></li>
                <li><a href="#">Regresar a la página anterior</a></li>
            </ul>
        </div>
        <div class="p-10">
            <div class="message-list list-container">
                <%
                    try
                    {
                        int IDCATEGORIA = int.Parse(Request.QueryString["navigator_type"]);
                        dsProcedimientos.ROL_LISTAR_ITEMSDataTable dtResultado = DOMModel.ROL_LISTAR_ITEMS(sessionUS.idrol, Conexion);
                        foreach (dsProcedimientos.ROL_LISTAR_ITEMSRow item in dtResultado.Rows)
                        {
                            if (item.idcategoria == IDCATEGORIA && item.MARK == 1)
                            {
                                Response.Write("<div class=\"media\" id=\"modulo_" + item.idformulario + "\">");
                                Response.Write("<input type=\"checkbox\" class=\"pull-left list-check\">");
                                Response.Write("<a class=\"media-body\" href=\"" + item.FORMULARIO_LINK + "\">");
                                Response.Write("<div class=\"pull-left list-title\">");
                                Response.Write("<span class=\"t-overflow f-bold\">" + item.FORMULARIO_NOMBRE_MOSTRAR + "</span>");
                                Response.Write("</div>");
                                Response.Write("<div class=\"pull-right list-date\">[[0]]</div>");
                                Response.Write("<div class=\"media-body hidden-xs\">");
                                Response.Write("<span class=\"t-overflow\">" + item.FORMULARIO_DESCRIPCION + "</span>");
                                Response.Write("</div>");
                                Response.Write("</a>");
                                Response.Write("</div>");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Response.Redirect("~/ASP/default.aspx");
                    }
                %>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="IDFooter" runat="server">
</asp:Content>
