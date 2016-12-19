<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="perfilModificar.aspx.cs" Inherits="wbERPGBL.ASP.perfilModificar" %>
<%@ Import Namespace="Modelo" %>
<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsPerfilModificar.js"></script>
    <script src="../js/fileupload.min.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="IDCuerpo" runat="server">
<%
    dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow sessionUS = null;
    try
    {
        sessionUS = (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow)HttpContext.Current.Session["usuario"];
        if (sessionUS == null)
            Response.Redirect("~/default.aspx");
    }
    catch
    {
        Response.Redirect("~/default.aspx");
    }
%>
    <div class="tile">
        <h2 class="tile-title">Modificar Perfil</h2>
        <div class="tile-config dropdown">
            <a data-toggle="dropdown" href="#" class="tile-menu"></a>
            <ul class="dropdown-menu pull-right text-right">
                <li><a class="tile-info-toggle" id="btnaadPanel" href="#">Anclar a accesos directos</a></li>
                <li><a href="#">Actualizar</a></li>
                <li><a href="#">Regresar a la página anterior</a></li>
            </ul>
        </div>
        <div class="p-10">
            <section class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="block-area">
                            <div class="alert alert-danger alert-icon" id="dvResultado" style="display: none;">
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="block-area">
                            <form id="frmInsertar" action="#">
                                <div class="list-container">
                                    <div class="fileupload fileupload-new row" data-provides="fileupload">
                                        <div class="input-group col-lg-12 col-sm-12 text-center" style="padding-left: 25%; padding-right: 25%;">
                                            <img id="pbImagen" alt="imagenUsuario" style="width: 100px; height: 130px;" src="../response/img_usuario.ashx?ID=<%= sessionUS.idusuario %>" />
                                        </div>
                                        <div class="input-group col-lg-12 col-sm-12 text-center" style="padding-left: 25%; padding-right: 25%;">
                                            <div class="uneditable-input form-control">
                                                <i class="fa fa-file m-r-5 fileupload-exists"></i>
                                                <span class="fileupload-preview"></span>
                                            </div>
                                            <div class="input-group-btn">
                                                <span class="btn btn-file btn-alt btn-sm">
                                                    <span class="fileupload-new">Seleccionar</span>
                                                    <span class="fileupload-exists">Cambiar</span>
                                                    <input type="file" id="txtFile" />
                                                </span>
                                            </div>
                                            <a href="#" class="btn btn-sm btn-gr-gray fileupload-exists" data-dismiss="fileupload">Remove</a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label for="txtNombre">Nombre: </label>
                                                <input type="text" class="form-control m-b-10" id="txtNombre" value="<%= sessionUS.nombre %>" name="txtNombre" required="required" placeholder="Ingrese Nombre">
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label for="txtApellido">Apellido: </label>
                                                <input type="text" class="form-control m-b-10" id="txtApellido" name="txtApellido" value="<%= sessionUS.apellido %>" required="required" placeholder="Ingrese Apellido">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label for="txtCorreo">Correo: </label>
                                                <input type="email" class="form-control m-b-10" id="txtCorreo" name="txtCorreo" value="<%= sessionUS.correo %>" required="required" placeholder="Ingrese Correo">
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label for="txtDomicilio">Domicilio: </label>
                                                <input type="text" class="form-control m-b-10" id="txtDomicilio" name="txtDomicilio" value="<%= sessionUS.domicilio %>" required="required" placeholder="Ingrese Domicilio">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label for="txtMovilPrivado1">Movil Privado 1: </label>
                                                <input type="text" class="form-control m-b-10" id="txtMovilPrivado1" name="txtMovilPrivado1" value="<%= sessionUS.movil_privado1 %>" required="required" placeholder="Ingrese Movil Privado 1">
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label for="txtMovilPrivado2">Movil Privado 2: </label>
                                                <input type="text" class="form-control m-b-10" id="txtMovilPrivado2" name="txtMovilPrivado2" value="<%= sessionUS.movil_privado2 %>" required="required" placeholder="Ingrese Movil Privado 2">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label for="txtMovilEmpresarial">Movil Empresarial: </label>
                                                <input type="text" class="form-control m-b-10" id="txtMovilEmpresarial" name="txtMovilEmpresarial" value="<%= sessionUS.movil_empresarial %>" required="required" placeholder="Ingrese Movil Empresarial">
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label for="txtTelefonoFijo">Teléfono Fijo: </label>
                                                <input type="text" class="form-control m-b-10" id="txtTelefonoFijo" name="txtTelefonoFijo" required="required" value="<%= sessionUS.telefono_fijo %>" placeholder="Ingrese Teléfono Fijo">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label for="txtContacto1">Contacto 1: </label>
                                                <input type="text" class="form-control m-b-10" id="txtContacto1" name="txtContacto1" required="required" value="<%= sessionUS.contacto1 %>" placeholder="Ingrese Contacto 1">
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label for="txtContacto2">Contacto 2: </label>
                                                <input type="text" class="form-control m-b-10" id="txtContacto2" name="txtContacto2" required="required" value="<%= sessionUS.contacto2 %>" placeholder="Ingrese Contacto 2">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label for="txtDNI">DNI: </label>
                                                <input type="text" class="form-control m-b-10" id="txtDNI" name="txtDNI" disabled="disabled" value="<%= sessionUS.dni %>" placeholder="DNI">
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label">ROL: </label>
                                                <input type="text" class="form-control m-b-10" disabled="disabled" value="<%= sessionUS.rol %>" placeholder="DNI">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label">EMPRESA: </label>
                                                <input type="text" class="form-control m-b-10" disabled="disabled" value="<%= sessionUS.razon_social %>" placeholder="DNI">
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label">AREA: </label>
                                                <input type="text" class="form-control m-b-10" disabled="disabled" value="<%= sessionUS.area %>" placeholder="DNI">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label">PUESTO TRABAJADOR: </label>
                                                <input type="text" class="form-control m-b-10" disabled="disabled" value="<%= sessionUS.puesto_trabajador %>" placeholder="DNI">
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label">CODIGO TRABAJADOR: </label>
                                                <input type="text" class="form-control m-b-10" disabled="disabled" value="<%= sessionUS.codigo_empleado %>" placeholder="DNI">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 col-md-12">
                                            <div class="block-area">
                                                <label">SEDE: </label>
                                                <input type="text" class="form-control m-b-10" disabled="disabled" value="<%= sessionUS.SEDE_SEDE %>" placeholder="DNI">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row" id="rowProgress">
                                        <div class="col-lg-12 col-sm-12 col-xs-1 col-md-12">
                                            <div class="block-area">
                                                <div class="progress">
                                                    <div id="pbProgress" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 col-sm-12">
                                            <div class="block-area">
                                                <button type="submit" class="btn btn-block" id="btnGuardar"><span class="fa fa-floppy-o"></span>&nbsp;&nbsp;Guardar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </section>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="IDFooter" runat="server">
</asp:Content>
