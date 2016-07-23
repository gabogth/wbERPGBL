<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="reporte_pagoVentasPendientes.aspx.cs" Inherits="wbERPGBL.ASP.Reportes.reporte_pagoVentasPendientes" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=12.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
        <rsweb:ReportViewer ID="rptPagoVentas" runat="server" Height="400px" BorderWidth="0" Width="100%" BorderStyle="None"></rsweb:ReportViewer>
    </div>
    </form>
</body>
</html>
