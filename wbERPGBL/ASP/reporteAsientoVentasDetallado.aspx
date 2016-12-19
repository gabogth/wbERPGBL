<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="reporteAsientoVentasDetallado.aspx.cs" Inherits="wbERPGBL.ASP.reporteAsientoVentasDetallado" %>
<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsReporteAsientoVentasDetallado.js"></script>
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
                    <div class="col-lg-12">
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
</asp:Content>