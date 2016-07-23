<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="usuario_frmMantenimientoUsuario.aspx.cs" Inherits="wbERPGBL.ASP.usuario_frmMantenimientoUsuario" %>
<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsUsuario.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="IDCuerpo" runat="server">
    <div class="tile">
        <h2 class="tile-title">Mantenimiento de empresas</h2>
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
                    <div class="col-lg-11">
                        <div class="block-area">
                            <input type="search" id="txtBuscar" class="form-control m-b-10" placeholder="Filtro de búsqueda...">
                        </div>
                    </div>
                    <div class="col-lg-1">
                        <div class="block-area">
                            <span class="fa fa-plus fa-2x" id="btnInsertar" style="cursor: pointer;"></span>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="block-area">
                            <div class="alert alert-danger alert-icon" id="dvResultado" style="display:none;">
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="block-area" id="responsiveTable">
                            <h3 class="block-title">Resultados:</h3>
                            <div class="table-responsive overflow">
                                <table class="table table-bordered table-hover tile-title">
                                    <thead>
                                        <tr>
                                            <th class="text-center">#</th>
                                            <th class="text-center">Usuario</th>
                                            <th class="text-center">Sede</th>
                                            <th class="text-center">Nombre / Apellido</th>
                                            <th class="text-center">Correo</th>
                                            <th class="text-center">Rol</th>
                                            <th class="text-center"></th>
                                            <th class="text-center"></th>
                                            <th class="text-center"></th>
                                            <th class="text-center"></th>
                                            <th class="text-center"></th>
                                            <th class="text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbl_body">
                                        
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="14">
                                                <div class="container">
                                                    <div class="row">
                                                        <div id="paginacionFoot" class="col-lg-4 col-lg-push-4"></div>
                                                    </div>
                                                </div>
                                                
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </section>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="IDFooter" runat="server">
    <div class="modal fade" id="modalInsertar" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="modal_insertar_titulo">Modal title</h4>
                </div>
                <div class="modal-body">
                    <form id="frmInsertar" action="#">
                        <div class="list-container">
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <img class="profile-pic animated" id="pbFotoSelected" src="../img/unknowuser.png" alt="" />
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtFoto">Imagen Seleccionada: </label>
                                        <input type="text" class="form-control m-b-10" id="txtFoto" name="txtFoto" required="required" placeholder="Foto" readonly="readonly">
                                        <div class="fileupload fileupload-new" data-provides="fileupload">
                                            <span class="btn btn-file btn-sm btn-alt">
                                                <span class="fileupload-new">Seleccione Foto</span>
                                                <span class="fileupload-exists">Cambiar</span>
                                                <input type="file" id="btnSeleccionarFoto" accept="image/jpeg" />
                                            </span>
                                            <span class="fa fa-times" style="cursor: pointer;" id="btnClearPreviewImage"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtUsuario">USUARIO: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtUsuario" name="txtUsuario" required="required" placeholder="Ingrese Usuario">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtCorreo">CORREO: </label>
                                        <input type="email" autocomplete="off" class="form-control m-b-10" id="txtCorreo" name="txtCorreo" required="required" placeholder="Ingrese Correo">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12" id="dvPW">
                                    <div class="block-area">
                                        <label for="txtPassword">Password: </label>
                                        <input type="password" autocomplete="off" class="form-control m-b-10" id="txtPassword" name="txtPassword" required="required" placeholder="Ingrese Password">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <div class="input-group">
                                            <label for="txtDNI">DNI: </label>
                                            <input type="text" class="form-control  m-b-10" placeholder="DNI" id="txtDNI" name="txtDNI" required="required" >
                                            <span class="input-group-btn">
                                            <button class="btn btn-secondary" id="btnBuscarReniec"><span class="fa fa-search"></span></button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtNombre">NOMBRE: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtNombre" name="txtNombre" required="required" placeholder="Ingrese el nombre del trabajador.">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtApellido">APELLIDO: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtApellido" name="txtApellido" required="required" placeholder="Ingrese el apellido del trabajador.">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtFechaNacimiento">Fecha de nacimiento: </label>
                                        <input type="date" class="form-control m-b-10" id="txtFechaNacimiento" name="txtFechaNacimiento" required="required">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="cbRol">Rol: </label>
                                        <select id="cbRol" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-4 col-md-12">
                                    <div class="block-area">
                                        <label for="cbEmpresa">Empresa: </label>
                                        <select id="cbEmpresa" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-12">
                                    <div class="block-area">
                                        <label for="cbArea">Area: </label>
                                        <select id="cbArea" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-12">
                                    <div class="block-area">
                                        <label for="cbPuesto">Puesto: </label>
                                        <select id="cbPuesto" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtCodigoEmpleado">CODIGO DE EMPLEADO: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtCodigoEmpleado" name="txtCodigoEmpleado" required="required" placeholder="Ingrese codigo de empleado">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtDomicilio">DOMICILIO: </label>
                                        <textarea class="form-control m-b-10" id="txtDomicilio" name="txtDomicilio" required="required" placeholder="Ingrese Domicilio">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtMovilPrivado1">Movil Privado 1: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtMovilPrivado1" name="txtMovilPrivado1" required="required" placeholder="Ingrese Movil Privado 1">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtMovilPrivado2">Movil Privado 2: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtMovilPrivado2" name="txtMovilPrivado2" required="required" placeholder="Ingrese Movil Privado 2">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtMovilEmpesarial">Movil Empresarial: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtMovilEmpesarial" name="txtMovilEmpesarial" required="required" placeholder="Ingrese Movil Empesarial">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtTelefonoFijo">Telefono Fijo: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtTelefonoFijo" name="txtTelefonoFijo" required="required" placeholder="Ingrese Telefono Fijo">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtContacto1">Contacto 1: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtContacto1" name="txtContacto1" required="required" placeholder="Ingrese Contacto 1">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtContacto2">Contacto 2: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtContacto2" name="txtContacto2" required="required" placeholder="Ingrese Contacto 2">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="cbSede">Sede: </label>
                                        <select id="cbSede" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="ckIsTrabajador">Es Trabajador?
                                            <input type="checkbox"  name="ckIsTrabajador" id="ckIsTrabajador" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-sm" id="btnGuardar">Guardar</button>
                            <button type="button" class="btn btn-sm" id="btnCancelar" data-dismiss="modal">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="modal_mensaje" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="modal_titulo_mensaje">Modal title</h4>
                </div>
                <div class="modal-body">
                    <form id="frmMensaje" action="#">
                        <div class="list-container">
                            <p id="cuerpo_mensaje">
                                
                            </p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-sm" id="btn_mensaje_aceptar">Aceptar</button>
                            <button type="button" class="btn btn-sm" id="btn_mensaje_cancelar" data-dismiss="modal">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
