using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.archivos
{
    public class clsArchivo
    {
        string fullPath, originalPath, fileName, fileOutX;
        DateTime creationDate;

        public DateTime CreationDate
        {
            get
            {
                return creationDate;
            }

            set
            {
                creationDate = value;
            }
        }

        public string FullPath
        {
            get
            {
                return fullPath;
            }

            set
            {
                fullPath = value;
            }
        }

        public string OriginalPath
        {
            get
            {
                return originalPath;
            }

            set
            {
                originalPath = value;
            }
        }

        public string FileName
        {
            get
            {
                return fileName;
            }

            set
            {
                fileName = value;
            }
        }

        public string FileOutX
        {
            get
            {
                return fileOutX;
            }

            set
            {
                fileOutX = value;
            }
        }
    }
}
