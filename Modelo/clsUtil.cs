using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo
{
    public class clsUtil
    {
        public static double doubleParse(string valor)
        {
            string separador = System.Globalization.CultureInfo.CurrentCulture.NumberFormat.CurrencyDecimalSeparator;
            string dist_value = valor.Replace(",", separador).Replace(".", separador);
            return double.Parse(dist_value);
        }

        public static object DbNullIfNull(object obj)
        {
            return obj != null ? obj : DBNull.Value;
        }

        public static object DbNullIfNullOrEmpty(string str)
        {
            return !String.IsNullOrEmpty(str) ? str : (object)DBNull.Value;
        }
    }
}
