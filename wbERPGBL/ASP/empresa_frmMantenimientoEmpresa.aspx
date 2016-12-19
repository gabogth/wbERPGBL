<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="empresa_frmMantenimientoEmpresa.aspx.cs" Inherits="wbERPGBL.ASP.empresa_frmMantenimientoEmpresa" %>
<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsEmpresa.js"></script>
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
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="text-center">#</th>
                                            <th class="text-center">RUC</th>
                                            <th class="text-center">Razón Social</th>
                                            <th class="text-center">Dirección</th>
                                            <th class="text-center">Estado</th>
                                            <th class="text-center">Alias</th>
                                            <th class="text-center">Visión</th>
                                            <th class="text-center">Mision</th>
                                            <th class="text-center">Valores</th>
                                            <th class="text-center">Ética</th>
                                            <th class="text-center">Políticas</th>
                                            <th class="text-center">Partida Registral</th>
                                            <th class="text-center">Actividad Económica</th>
                                            <th class="text-center">Representante Legal</th>
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
    <div class="modal fade" id="modalInsertar" tabindex="-1" role="dialog" aria-hidden="true">
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
                                        <label for="txtRuc">RUC: </label>
                                        <input type="text" class="form-control m-b-10" id="txtRuc" name="txtRuc" required="required" placeholder="Ingrese RUC">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtRazonSocial">Razón Social: </label>
                                        <input type="text" class="form-control m-b-10" id="txtRazonSocial" name="txtRazonSocial" required="required" placeholder="Ingrese Razon Social">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtDireccion">Direccion: </label>
                                        <input type="text" class="form-control m-b-10" id="txtDireccion" name="txtDireccion" required="required" placeholder="Ingrese Dirección">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtAlias">Alias: </label>
                                        <input type="text" class="form-control m-b-10" id="txtAlias" name="txtAlias" required="required" placeholder="Ingrese Alias">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtActividadEconomica">Actividad Económica: </label>
                                        <input type="text" class="form-control m-b-10" id="txtActividadEconomica" name="txtActividadEconomica" required="required" placeholder="Ingrese Actividad económica">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="cbRepresentante:number">Representante Legal: </label>
                                        <select id="cbRepresentante" name="cbRepresentante:number" style="width: 100%;" required="required"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtVision">Visión: </label>
                                        <textarea class="form-control m-b-10" id="txtVision" name="txtVision" required="required" placeholder="Ingrese Visión">
                                        </textarea>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtMision">Misión: </label>
                                        <textarea class="form-control m-b-10" id="txtMision" name="txtMision" required="required" placeholder="Ingrese Misión">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtValores">Valores: </label>
                                        <textarea class="form-control m-b-10" id="txtValores" name="txtValores" required="required" placeholder="Ingrese Valores">
                                        </textarea>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtEtica">Ética: </label>
                                        <textarea class="form-control m-b-10" id="txtEtica" name="txtEtica" required="required" placeholder="Ingrese Ética">
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtPoliticas">Políticas: </label>
                                        <textarea class="form-control m-b-10" id="txtPoliticas" name="txtPoliticas" required="required" placeholder="Ingrese Políticas">
                                        </textarea>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtPartidaRegistral">Partida Registral: </label>
                                        <textarea class="form-control m-b-10" id="txtPartidaRegistral" name="txtPartidaRegistral" required="required" placeholder="Ingrese partida registral">
                                        </textarea>
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
