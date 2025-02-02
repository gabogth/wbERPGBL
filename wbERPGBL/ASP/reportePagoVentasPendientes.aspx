﻿<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="reportePagoVentasPendientes.aspx.cs" Inherits="wbERPGBL.ASP.reportePagoVentasPendientes" %>
<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsReportePagoVentasPendientes.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="IDCuerpo" runat="server">
    <div class="tile">
        <h2 class="tile-title">Mantenimiento de Facturas</h2>
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
                    <div class="col-lg-3">
                        <div class="block-area">
                            <label for="rbResumen" class="-inline">
                                Resumen
                                <input type="radio" name="cbReporte" id="cbResumen" checked="checked" />
                            </label>
                            <label for="cbDetalle" class="-inline" style="padding-left: 5em;">
                                Detalle
                                <input type="radio" name="cbReporte" id="cbDetalle"/>
                            </label>
                        </div>
                    </div>
                    <div class="col-lg-9">
                        <div class="block-area">
                            <input type="search" id="txtBuscar" class="form-control m-b-10" placeholder="Filtro de búsqueda...">
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="col-lg-6 col-md-12">
                        <div class="block-area">
                            <label for="cbSerie">Serie</label>
                            <select id="cbSerie" style="width:100%;" multiple="multiple">
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12">
                        <div class="block-area">
                            <label for="txtCorrelativo">Correlativo</label>
                            <input type="number" id="txtCorrelativo" class="form-control m-b-10" placeholder="Correlativo">
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="col-lg-6 col-md-12">
                        <div class="block-area">
                            <label for="cbEmpresa">Empresa</label>
                            <select id="cbEmpresa" style="width:100%;" multiple="multiple">
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12">
                        <div class="block-area">
                            <label for="cbEstado">Estado</label>
                            <select id="cbEstado" style="width:100%;" multiple="multiple">
                            </select>
                        </div>
                    </div>

                    <div class="clearfix"></div>
                    <div class="col-lg-6 col-md-12">
                        <div class="block-area">
                            <label for="dtpInicio">Fecha Inicio</label>
                            <input type="date" class="form-control" id="dtpInicio" name="dtpInicio" />
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12">
                        <div class="block-area">
                            <label for="dtpFin">Fecha Fin</label>
                            <input type="date" class="form-control" id="dtpFin" name="dtpFin" />
                        </div>
                    </div>

                    <div class="clearfix"></div>
                    <div class="col-lg-6 col-md-12">
                        <div class="block-area">
                            <label for="ckOmitirEG">Omitir Empresas de Grupo
                                <input type="checkbox" id="ckOmitirEG" name="ckOmitirEG" checked="checked" />
                            </label>
                        </div>
                    </div>

                    <div class="clearfix"></div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="block-area">
                            <button class="btn btn-block btn-alt" id="btnBuscar"><span class="fa fa-search"></span> BUSCAR</button>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12">
                        <div class="block-area">
                            <button class="btn btn-block btn-alt" id="btnLimpar"><span class="fa fa-paint-brush"></span> LIMPIAR</button>
                        </div>
                    </div>
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
                                <div id="dvLoading2" class="text-center" style="border-width: 1px; border-style: solid; padding-top: 5px; padding-bottom: 5px;">
                                    <span class="fa fa-spinner fa-2x faa-slow faa-spin animated" style="color:black;"></span>&nbsp;Cargando...
                                </div>
                                <iframe src="#" id="frmReporte" width="100%" height="420px"></iframe>
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
                                        <label for="txtDocumento">Documento: </label>
                                        <input type="text"  id="txtDocumento" name="txtDocumento" readonly="readonly" class="form-control m-b-10">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtMonto">Monto: </label>
                                        <input type="text"  id="txtMonto" name="txtMonto" readonly="readonly" class="form-control m-b-10">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtRuc">RUC: </label>
                                        <input type="text" id="txtRuc" name="txtRuc" readonly="readonly" class="form-control m-b-10">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtRazonSocial">Razon Social: </label>
                                        <input type="text"  id="txtRazonSocial" name="txtRazonSocial" readonly="readonly" class="form-control m-b-10">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtFechaEmision">Fecha Emision: </label>
                                        <input type="date" id="txtFechaEmision" name="txtFechaEmision" readonly="readonly" class="form-control m-b-10">
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="cbEstadoModif">Estado</label>
                                        <select id="cbEstadoModif" style="width:100%;">
                                        </select>
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

    <div class="modal fade" id="facturaPreview" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" style="background-color: white;">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:black;">&times;</button>
                    <h4 class="modal-title" id="facturaTitulo" style="color:black;">Modal title</h4>
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
