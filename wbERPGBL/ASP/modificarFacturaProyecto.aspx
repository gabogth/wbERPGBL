<%@ Page Title="" Language="C#" MasterPageFile="~/ASP/master.Master" AutoEventWireup="true" CodeBehind="modificarFacturaProyecto.aspx.cs" Inherits="wbERPGBL.ASP.modificarFacturaProyecto" %>
<asp:Content ID="Content1" ContentPlaceHolderID="IDScripts" runat="server">
    <script src="../js/Controllers/jsModificarFacturaProyecto.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="IDCuerpo" runat="server">
    <div class="tile">
        <h2 class="tile-title">Seleccione Factura</h2>
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
                                <table class="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="text-center">#</th>
                                            <th class="text-center">EMPRESA</th>
                                            <th class="text-center">N° DOCUMENTO</th>
                                            <th class="text-center">PARA</th>
                                            <th class="text-center">EMISION</th>
                                            <th class="text-center">EMITIDO POR</th>
                                            <th class="text-center">ESTADO</th>
                                            <th class="text-center"></th>
                                            <th class="text-center">BASE IMPONIBLE</th>
                                            <th class="text-center">IGV</th>
                                            <th class="text-center">TOTAL</th>
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
                    <form id="frmInsertarDetalle" action="#">
                        <div class="list-container">
                             <div class="row">
                                <div class="col-lg-12">
                                    <div class="block-area">
                                        <table class="table  table-hover">
                                            <tr>
                                                <td>Monto Total: </td>
                                                <td>1000.00</td>
                                                <td>Base Imponible: </td>
                                                <td>900.00</td>
                                            </tr>
                                            <tr>
                                                <td>IGV: </td>
                                                <td>100.00</td>
                                                <td>Fecha Emision: </td>
                                                <td>12-02-2015</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12" style="display: none;">
                                    <div class="block-area">
                                         <label class="checkbox-inline" for="ckProducto">
                                            <input type="checkbox" name="ckRadio" id="ckProducto" checked="checked" />
                                            Producto
                                        </label>
                                        <label class="checkbox-inline" for="ckServicio">
                                            <input type="checkbox" name="ckRadio" id="ckServicio"/>
                                            Servicio
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtItem">Descripción: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" id="txtItem" name="txtItem" required="required" placeholder="Ingrese Item" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label class="checkbox-inline" for="rbPrecioTotal">
                                            <input type="radio" name="cbRadioTotal" id="rbPrecioUnidad" checked="checked">
                                            Precio Por unidad
                                        </label>
                                        <label class="checkbox-inline" for="rbPrecioUnidad">
                                            <input type="radio" name="cbRadioTotal" id="rbPrecioTotal">
                                            Precio Total
                                        </label>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-6">
                                    <div class="block-area">
                                        <label for="txtCantidad">Cantidad</label>
						                <input type="text" autocomplete="off" required="required" data-a-sep="" data-a-dec="." class="form-control m-b-10" id="txtCantidad" aria-describedby="cbTipo" name="txtCantidad" placeholder="Ingrese Cantidad" />
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-6">
                                    <div class="block-area">
                                        <label for="cbTipo">Unidad</label>
							            <select style="width:100%;" id="cbTipo" name="cbTipo" required="required">
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label class="checkbox-inline" for="rbIncIGV">
                                            <input type="radio" name="cbRadioIGV" id="rbIncIGV" checked="checked" />
                                            Incluido IGV
                                        </label>
                                        <label class="checkbox-inline" for="rbSinIGV">
                                            <input type="radio" name="cbRadioIGV" id="rbSinIGV" />
                                            Agregar IGV
                                        </label>                                        
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="block-area">
                                        <label for="txtMonto">Monto: </label>
                                        <input type="text" autocomplete="off" class="form-control m-b-10" required="required" data-a-sep="" data-a-dec="." id="txtMonto" name="txtMonto" placeholder="Ingrese Monto" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-sm" id="btnGuardar">Agregar</button>
                            <button type="button" class="btn btn-sm" id="btnCancelar" data-dismiss="modal"><span class="fa fa-times"></span>&nbsp;Cancelar</button>
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
                    <iframe id="frmControlPreview" frameborder="0" height="922px;" width="99.6%"></iframe>
                </div>
            </div>
        </div>
    </div>
</asp:Content>