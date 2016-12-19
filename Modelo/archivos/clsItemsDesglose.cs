using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.archivos
{
    public class Item
    {
        public int? cbProducto { get; set; }
        public string cbProductoText { get; set; }
        public int? cbServicio { get; set; }
        public string cbServicioText { get; set; }
        public bool rbPrecioTotal { get; set; }
        public bool rbPrecioUnidad { get; set; }
        public double? txtCantidad { get; set; }
        public double? precio_unitario { get; set; }
        public int? cbTipo { get; set; }
        public string cbTipoTexto { get; set; }
        public bool rbIncIGV { get; set; }
        public bool rbSinIGV { get; set; }
        public double? txtMonto { get; set; }
        public bool omitirIGV { get; set; }
        public double imponible { get; set; }
        public double igv { get; set; }
        public double total { get; set; }
    }

    public class RootObject
    {
        public List<Item> items { get; set; }
    }
}
