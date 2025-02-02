﻿<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="contratos_frmMantenimientoContratos.aspx.cs" Inherits="wbERPGBL.ASP.contratos_frmMantenimientoContratos" %>
<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsContratos.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="IDCuerpo" runat="server">
    <div class="tile">
        <h2 class="tile-title">Mantenimiento de Contratos</h2>
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
                                <table class="table-tile table table-bordered table-hover tile-title">
                                    <thead>
                                        <tr>
                                            <th class="text-center">#</th>
                                            <th class="text-center">TRABAJADOR</th>
                                            <th class="text-center">EMPRESA</th>
                                            <th class="text-center">CELEBRADO</th>
                                            <th class="text-center">MONTO</th>
                                            <th class="text-center">TIPO</th>
                                            <th class="text-center">INICIA</th>
                                            <th class="text-center">FINALIZA</th>
                                            <th class="text-center">RESTAN</th>
                                            <th class="text-center">LABORES</th>
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
                                        <label for="cbTrabajador">Trabajador: </label>
                                        <select id="cbTrabajador" name="cbTrabajador" style="width: 100%;" required="required">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtEmpresa">Empresa: </label>
                                        <input type="text" class="form-control m-b-10" id="txtEmpresa" name="txtEmpresa" readonly="readonly">
                                        <input type="hidden" id="txtIdEmpresa" name="txtIdEmpresa">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtSueldo">Sueldo: </label>
                                        <input type="text" class="form-control m-b-10" id="txtSueldo" name="txtSueldo" required="required" readonly="readonly">
                                        <input type="hidden" id="txtIdSueldo" name="txtIdSueldo">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="cbUsuarioEncargado">Responsable: </label>
                                        <select id="cbUsuarioEncargado" name="cbUsuarioEncargado" style="width: 100%;" required="required">
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="cbTipoContrato">Tipo Contrato: </label>
                                        <select id="cbTipoContrato" name="cbTipoContrato" style="width: 100%;" required="required">
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="dtpEvento">Evento: </label>
                                        <input type="date" class="form-control m-b-10" id="dtpEvento" name="dtpEvento" required="required">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="dtpInicio">Inicia: </label>
                                        <input type="date" class="form-control m-b-10" id="dtpInicio" name="dtpInicio" required="required">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <div><label for="ckIndefinido">Duración: </label></div>
                                        <label for="ckIndefinido">Es indefinido? 
                                            <input type="checkbox" name="ckIndefinido" id="ckIndefinido" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="dtpFin">Termina: </label>
                                        <input type="date" class="form-control m-b-10" id="dtpFin" name="dtpFin">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtDetalles">Detalles: </label>
                                        <textarea class="form-control m-b-10" id="txtDetalles" name="txtDetalles">
                                        </textarea>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtLabores">Labores: </label>
                                        <textarea class="form-control m-b-10" id="txtLabores" name="txtLabores">
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
    <!-- modalAnexos -->
    <div class="modal fade" id="modalAnexos" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="modal_anexos_insertar_titulo">Modal title</h4>
                </div>
                <div class="modal-body">
                    <form id="frmAnexos" action="#">
                        <div class="list-container">
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtFoto">Archivo Seleccionado: </label>
                                        <input type="text" class="form-control m-b-10" id="txtFoto" name="txtFoto" required="required" placeholder="Archivo" readonly="readonly">
                                        <div class="fileupload fileupload-new" data-provides="fileupload">
                                            <span class="btn btn-file btn-sm btn-alt">
                                                <span class="fileupload-new">Seleccione Archivo</span>
                                                <input type="file" id="btnSeleccionarFoto" />
                                            </span>
                                            <span class="fa fa-times" style="cursor: pointer;" id="btnClearPreviewImage"></span>
                                            <button type="button" class="btn btn-sm" id="btnUploadAnexo"><span class="fa fa-play"></span></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <p>Estado de la subida</p>
                                        <div class="progress">
                                            <div class="progress-bar" id="pbUploadAnexo" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
                                        </div>
                                        <p id="lblStatus"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="block-area" id="responsiveTableAnexos">
                                        <div class="table-responsive overflow">
                                            <table class="table table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th class="text-center">#</th>
                                                        <th class="text-center">Archivo</th>
                                                        <th class="text-center">Tamaño</th>
                                                        <th class="text-center">Fecha Subida</th>
                                                        <th class="text-center">Extensión</th>
                                                        <th class="text-center"></th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tbl_body_anexos">
                                        
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="contratoPreview" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" style="background-color: white;">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:black;">&times;</button>
                    <h4 class="modal-title" id="facturaTitulo" style="color:black;">CONTRATO</h4>
                </div>
                <div class="modal-body" style="height: 1800px;">
                    <div id="dvLoading" class="text-center">
                        <span class="fa fa-spinner fa-2x faa-slow faa-spin animated" style="color:black;"></span>&nbsp;Cargando...
                    </div>
                    <iframe src="#" id="frmControlPreview" frameborder="0" height="922px;" width="99.6%"></iframe>
                </div>
            </div>
        </div>
    </div>
    <!-- end modalAnexos -->
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
