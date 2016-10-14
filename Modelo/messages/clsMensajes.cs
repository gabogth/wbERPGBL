using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.messages
{
    public class clsMensajes
    {
        string asunto, sumary, autor_email, autor_name;
        DateTime fecha_emision;

        public string Asunto
        {
            get
            {
                return asunto;
            }

            set
            {
                asunto = value;
            }
        }

        public string Autor_email
        {
            get
            {
                return autor_email;
            }

            set
            {
                autor_email = value;
            }
        }

        public string Autor_name
        {
            get
            {
                return autor_name;
            }

            set
            {
                autor_name = value;
            }
        }

        public DateTime Fecha_emision
        {
            get
            {
                return fecha_emision;
            }

            set
            {
                fecha_emision = value;
            }
        }

        public string Sumary
        {
            get
            {
                return sumary;
            }

            set
            {
                sumary = value;
            }
        }
    }
}
