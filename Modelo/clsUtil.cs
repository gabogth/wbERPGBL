using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
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
        public static Bitmap converDataImage(string data)
        {
            try
            {
                var base64Data = Regex.Match(data, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;
                var binData = Convert.FromBase64String(base64Data);
                Bitmap bmp = null;
                using (var stream = new MemoryStream(binData))
                    bmp = new Bitmap(stream);
                return bmp;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
