<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="configuracionespensiones_frmConfiguracionesPensiones.aspx.cs" Inherits="wbERPGBL.ASP.configuracionespensiones_frmConfiguracionesPensiones" %>
<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsConfiguracionesPensiones.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="IDCuerpo" runat="server">
    <div class="tile">
        <h2 class="tile-title">Mantenimiento de Configuración de Pensiones</h2>
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
                                            <th class="text-center">SISTEMA PENSION</th>
                                            <th class="text-center">ADMINISTRADORA</th>
                                            <th class="text-center">CÓDIGO</th>
                                            <th class="text-center">A/O</th>
                                            <th class="text-center">CXF</th>
                                            <th class="text-center">C.M</th>
                                            <th class="text-center">C/S</th>
                                            <th class="text-center">PRIMA</th>
                                            <th class="text-center">ONP?</th>
                                            <th class="text-center">PORCENTAJE</th>
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
                                        <label for="cbAdministradora">Administradora: </label>
                                        <select id="cbAdministradora" name="cbAdministradora" style="width: 100%;">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtCodigo">Código: </label>
                                        <input type="text" class="form-control m-b-10" id="txtCodigo" name="txtCodigo" required="required" placeholder="Ingrese código...">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtEsFija">Es ONP?: 
                                            <input type="checkbox" id="txtEsFija" name="txtEsFija" checked="checked" />
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12" id="dvONP">
                                    <div class="block-area">
                                        <label for="txtPorcentaje">Porcentaje: </label>
                                        <input type="text" data-a-sep="" data-a-sign=" %" data-p-sign="s" data-a-dec="." class="form-control m-b-10" id="txtPorcentaje" name="txtPorcentaje" required="required" placeholder="Ingrese el porcentaje...">
                                    </div>
                                </div>
                            </div>
                            <div class="row" id="dvAFP">
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="txtAporteObligatorio">Aporte obligatorio <i>(1 = 100%)</i>: </label>
                                        <input type="text" data-a-sep="" data-a-sign=" %" data-p-sign="s" data-a-dec="." class="form-control m-b-10" id="txtAporteObligatorio" name="txtAporteObligatorio" placeholder="Ingrese aporte obligatorio...">
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="txtPrima">Prima de seguro <i>(1 = 100%)</i>: </label>
                                        <input type="text" data-a-sep="" data-a-sign=" %" data-p-sign="s" data-a-dec="." class="form-control m-b-10" id="txtPrima" name="txtPrima" placeholder="Ingrese prima de seguro...">
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="txtComisionFlujo">Comisión por flujo <i>(1 = 100%)</i>: </label>
                                        <input type="text" data-a-sep="" data-a-sign=" %" data-p-sign="s" data-a-dec="." class="form-control m-b-10" id="txtComisionFlujo" name="txtComisionFlujo" placeholder="Ingrese comisión por flujo...">
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="txtComisionMixta">Comisión mixta <i>(1 = 100%)</i>: </label>
                                        <input type="text" data-a-sep="" data-a-sign=" %" data-p-sign="s" data-a-dec="." class="form-control m-b-10" id="txtComisionMixta" name="txtComisionMixta" placeholder="Ingrese comisión mixta...">
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="block-area">
                                        <label for="txtComisionSaldo">Comisión sobre saldo <i>(1 = 100%)</i>: </label>
                                        <input type="text" data-a-sep="" data-a-sign=" %" data-p-sign="s" data-a-dec="." class="form-control m-b-10" id="txtComisionSaldo" name="txtComisionSaldo" placeholder="Ingrese comisión sobre saldo...">
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