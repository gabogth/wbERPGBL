﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="reporteAsientoPagos.aspx.cs" Inherits="wbERPGBL.ASP.Reportes.reporteAsientoPagos" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=12.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>
        <rsweb:ReportViewer ID="rptAsiento" runat="server" Height="500px" Width="100%">
        </rsweb:ReportViewer>
    
    </div>
    </form>
</body>
</html>
