<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="KeepAliveSession.aspx.cs" Inherits="wbERPGBL.ASP.KeepAliveSession" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <%
            Session.Timeout = 2;
            Session["test"] = "gabogth@gmail.com";
        %>
    </div>
    </form>
</body>
</html>
