using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.factura_modelo
{
    public class items
    {
        public bool ckProducto, ckServicio, rbPrecioTotal, rbPrecioUnidad, rbIncIGV, rbSinIGV, omitirIGV;
        public string txtItem, txtMonto, cbProyectoText, txtCantidad;
        public double imponible, igv, total;
        public int cbTipo, cbProyecto;
    }
}
