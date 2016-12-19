using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.archivos
{
    public class clsItemsCuentas
    {
        public int? cbCuentaDebe { get; set; }
        public int? cbCuentaHaber { get; set; }
        public double? txtMontoDebe { get; set; }
        public double? txtMontoHaber { get; set; }
        public string txtGlosa { get; set; }
        public int IDDESGLOSE_VENTAS { get; set; }
    }
}
