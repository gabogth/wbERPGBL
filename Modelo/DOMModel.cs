using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Reflection;

namespace Modelo
{
    public class DOMModel
    {
        #region Usuario
        public static SqlConnection Login(string formatCNN, string usuario, string contrasena)
        {
            SqlConnection con = new SqlConnection(String.Format(formatCNN, usuario, contrasena));
            con.Open();
            return con;
        }

        public static dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow getUsuarioPorUsuario(string usuario, SqlConnection conn)
        {
            dsProcedimientos.USUARIO_BUSCAR_POR_USUARIODataTable usuarioDT = new dsProcedimientos.USUARIO_BUSCAR_POR_USUARIODataTable();
            dsProcedimientosTableAdapters.USUARIO_BUSCAR_POR_USUARIOTableAdapter usuarioTA = new dsProcedimientosTableAdapters.USUARIO_BUSCAR_POR_USUARIOTableAdapter();
            usuarioTA.Connection = conn;
            usuarioDT = usuarioTA.GetData(usuario);
            dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow dr = null;
            if (usuarioDT.Rows.Count > 0)
                foreach (dsProcedimientos.USUARIO_BUSCAR_POR_USUARIORow item in usuarioDT.Rows)
                {
                    dr = item;
                    break;
                }
            else
                dr = null;
            return dr;
        }

        public static dsProcedimientos.USUARIO_BUSCAR_POR_IDRow getUsuarioPorID(int idUsuario, SqlConnection conn)
        {
            dsProcedimientos.USUARIO_BUSCAR_POR_IDDataTable usuarioDT = new dsProcedimientos.USUARIO_BUSCAR_POR_IDDataTable();
            dsProcedimientosTableAdapters.USUARIO_BUSCAR_POR_IDTableAdapter usuarioTA = new dsProcedimientosTableAdapters.USUARIO_BUSCAR_POR_IDTableAdapter();
            usuarioTA.Connection = conn;
            usuarioDT = usuarioTA.GetData(idUsuario);
            dsProcedimientos.USUARIO_BUSCAR_POR_IDRow dr = null;
            if (usuarioDT.Rows.Count > 0)
                foreach (dsProcedimientos.USUARIO_BUSCAR_POR_IDRow item in usuarioDT.Rows)
                {
                    dr = item;
                    break;
                }
            else
                dr = null;
            return dr;
        }

        public static bool USUARIO_INSERTAR(string USUARIO, string PASSWORD, string NOMBRE, string APELLIDO, string CORREO,
            DateTime FECHA_NACIMIENTO, int IDROL, int IDAREA_EMPRESA, int IDEMPRESA, string CODIGO_EMPLEADO, string DOMICILIO,
            string MOVIL_PRIVADO1, string MOVIL_PRIVADO2, string MOVIL_EMPRESARIAL, string TELEFONO_FIJO, string CONTACTO_1,
                string CONTACTO_2, string FOTO_DIR, int IDUSUARIO_CREADOR, int IDPUESTO_TRABAJADOR, string DNI, int IDSEDE, 
                int ES_TRABAJADOR, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.USUARIO_INSERTAR(USUARIO, PASSWORD, NOMBRE, APELLIDO, CORREO, FECHA_NACIMIENTO, IDROL, IDAREA_EMPRESA,
                IDEMPRESA, DNI, CODIGO_EMPLEADO, DOMICILIO, MOVIL_PRIVADO1, MOVIL_PRIVADO2, MOVIL_EMPRESARIAL, TELEFONO_FIJO, CONTACTO_1,
                CONTACTO_2, FOTO_DIR, IDUSUARIO_CREADOR, IDPUESTO_TRABAJADOR, IDSEDE, ES_TRABAJADOR);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static dsProcedimientos.USUARIO_BUSCAR_POR_QUERYDataTable USUARIO_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.USUARIO_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.USUARIO_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.USUARIO_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.USUARIO_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.TRABAJADOR_BUSCAR_POR_QUERYDataTable TRABAJADOR_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.TRABAJADOR_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.TRABAJADOR_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.TRABAJADOR_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.TRABAJADOR_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool USUARIO_MODIFICAR(int IDUSUARIO, string NOMBRE, string APELLIDO, string CORREO,
                DateTime FECHA_NACIMIENTO, int IDROL, int IDAREA_EMPRESA, int IDEMPRESA, string CODIGO_EMPLEADO, string DOMICILIO,
                string MOVIL_PRIVADO1, string MOVIL_PRIVADO2, string MOVIL_EMPRESARIAL, string TELEFONO_FIJO, string CONTACTO_1,
                string CONTACTO_2, string FOTO_DIR, int IDUSUARIO_CREADOR, int IDPUESTO_TRABAJADOR, string DNI, int IDSEDE,
                int ES_TRABAJADOR, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.USUARIO_MODIFICAR(IDUSUARIO, NOMBRE, APELLIDO, CORREO, DNI, FECHA_NACIMIENTO, IDROL, IDAREA_EMPRESA,
                IDEMPRESA, CODIGO_EMPLEADO, DOMICILIO, MOVIL_PRIVADO1, MOVIL_PRIVADO2, MOVIL_EMPRESARIAL, TELEFONO_FIJO, CONTACTO_1,
                CONTACTO_2, FOTO_DIR, IDUSUARIO_CREADOR, IDPUESTO_TRABAJADOR, IDSEDE, ES_TRABAJADOR);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool USUARIO_ELIMINAR(int IDUSUARIO_BORRADO, int IDUSUARIO, string USUARIO,SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.USUARIO_ELIMINAR(USUARIO, IDUSUARIO, IDUSUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool USUARIO_MODIFICAR_ESTADO(int IDUSUARIO, int IDUSUARIO_MODIFICACION, string USUARIO, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.USUARIO_MODIFICAR_ESTADO(IDUSUARIO, IDUSUARIO_MODIFICACION, USUARIO, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool USUARIO_RESET_PASSWORD(int IDUSUARIO, int IDUSUARIO_MODIFICACION, string USUARIO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.USUARIO_RESET_PASSWORD(IDUSUARIO, IDUSUARIO_MODIFICACION, USUARIO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool USUARIO_ENFORCE_PASSWORD(int IDUSUARIO, int IDUSUARIO_MODIFICACION, string NEW_PW, string USUARIO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.USUARIO_ENFORCE_PASSWORD(IDUSUARIO, IDUSUARIO_MODIFICACION, USUARIO, NEW_PW);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool USUARIO_MODIFICAR_PASSWORD(string USUARIO, string ANTIGUO_PASSWORD, string NUEVO_PASSWORD, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.USUARIO_MODIFICAR_PASSWORD(USUARIO, NUEVO_PASSWORD, ANTIGUO_PASSWORD);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Roles
        public static int ROL_INSERTAR(string ROL, int IDUSUARIO_CREADOR,
            SqlConnection conn, DateTime FECHA_CONSULTA)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int? returnResult = 0;
            int op = tableAdapter.ROL_INSERTAR(ROL, IDUSUARIO_CREADOR,
                FECHA_CONSULTA, ref returnResult);
            if (op != 0)
                return returnResult.HasValue ? returnResult.Value : -1;
            else
                return -1;
        }

        public static dsProcedimientos.ROL_BUSCAR_POR_QUERYDataTable ROL_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.ROL_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.ROL_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.ROL_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.ROL_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.ROL_LISTAR_CATEGORIASDataTable ROL_LISTAR_CATGORIAS(int IDROL, SqlConnection conn)
        {
            dsProcedimientos.ROL_LISTAR_CATEGORIASDataTable dataTable = new dsProcedimientos.ROL_LISTAR_CATEGORIASDataTable();
            dsProcedimientosTableAdapters.ROL_LISTAR_CATEGORIASTableAdapter tableAdapter = new dsProcedimientosTableAdapters.ROL_LISTAR_CATEGORIASTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDROL);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.ROL_LISTAR_ITEMSDataTable ROL_LISTAR_ITEMS(int IDROL, SqlConnection conn)
        {
            dsProcedimientos.ROL_LISTAR_ITEMSDataTable dataTable = new dsProcedimientos.ROL_LISTAR_ITEMSDataTable();
            dsProcedimientosTableAdapters.ROL_LISTAR_ITEMSTableAdapter tableAdapter = new dsProcedimientosTableAdapters.ROL_LISTAR_ITEMSTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDROL);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool ROL_MODIFICAR(string ROL, int IDROL, int IDUSUARIO_MODIFICADOR, SqlConnection conn, DateTime FECHA_CONSULTA)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ROL_MODIFICAR(IDROL, ROL, IDUSUARIO_MODIFICADOR, FECHA_CONSULTA);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool ROL_ELIMINAR(int IDUSUARIO_BORRADO, int IDROL, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ROL_ELIMINAR(IDROL, IDUSUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Empresa
        public static bool EMPRESA_INSERTAR(string RUC, string RAZON_SOCIAL, string DIRECCION, string VISION,
            string MISION, string VALORES, string ETICA, string POLITICA, int USUARIO_CREACION, string ALIAS,
            SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.EMPRESA_INSERTAR(RUC, RAZON_SOCIAL, DIRECCION, VISION, MISION, VALORES, ETICA,
                POLITICA, USUARIO_CREACION, ALIAS);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static dsProcedimientos.EMPRESA_BUSCAR_POR_QUERYDataTable EMPRESA_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.EMPRESA_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.EMPRESA_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.EMPRESA_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.EMPRESA_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.EMPRESA_BUSCAR_POR_IDRow EMPRESA_BUSCAR_POR_ID(int IDEMPRESA, SqlConnection conn)
        {
            dsProcedimientos.EMPRESA_BUSCAR_POR_IDDataTable dataTable = new dsProcedimientos.EMPRESA_BUSCAR_POR_IDDataTable();
            dsProcedimientosTableAdapters.EMPRESA_BUSCAR_POR_IDTableAdapter tableAdapter = new dsProcedimientosTableAdapters.EMPRESA_BUSCAR_POR_IDTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDEMPRESA);
            if (dataTable.Rows.Count > 0)
                return dataTable[0];
            else
                return null;
        }

        public static bool EMPRESA_MODIFICAR(int IDEMPRESA, string RUC, string RAZON_SOCIAL, string DIRECCION,
            string VISION, string MISION, string VALORES, string ETICA, string POLITICA, int USUARIO_MODIFICACION,
            string ALIAS, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.EMPRESA_MODIFICAR(IDEMPRESA, RUC, RAZON_SOCIAL, DIRECCION, VISION, MISION,
                VALORES, ETICA, POLITICA, USUARIO_MODIFICACION, ALIAS);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool EMPRESA_ELIMINAR(int IDUSUARIO_BORRADO, int IDEMPRESA, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.EMPRESA_ELIMINAR(IDEMPRESA, IDUSUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Puesto Trabajador
        public static bool PUESTO_TRABAJADOR_INSERTAR(string PUESTO_TRABAJADOR, int USUARIO_CREADOR, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.PUESTOTRABAJADOR_INSERTAR(PUESTO_TRABAJADOR, USUARIO_CREADOR);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static dsProcedimientos.PUESTOTRABAJADOR_BUSCAR_POR_QUERYDataTable PUESTO_TRABAJADOR_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.PUESTOTRABAJADOR_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.PUESTOTRABAJADOR_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.PUESTOTRABAJADOR_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.PUESTOTRABAJADOR_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool PUESTO_TRABAJADOR_MODIFICAR(string PUESTO_TRABAJADOR, int USUARIO_MODIFICADOR, int IDPUESTO_TRABAJADOR, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.PUESTOTRABAJADOR_MODIFICAR(PUESTO_TRABAJADOR, USUARIO_MODIFICADOR, IDPUESTO_TRABAJADOR);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool PUESTO_TRABAJADOR_ELIMINAR(int IDUSUARIO_BORRADO, int IDPUESTO_TRABAJADOR, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.PUESTOTRABAJADOR_ELIMINAR(IDUSUARIO_BORRADO, IDPUESTO_TRABAJADOR);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Utilitarios
        public static void GetInstanceQueriesAdapter<IQA>(ref IQA InstanceQueriesAdapter, SqlConnection conexion)
        {
            try
            {
                FieldInfo qAdapterCommandCollection = InstanceQueriesAdapter.GetType().GetField("_commandCollection", BindingFlags.GetProperty | BindingFlags.Instance | BindingFlags.NonPublic);
                MethodInfo initCC = InstanceQueriesAdapter.GetType().GetMethod("InitCommandCollection", BindingFlags.GetProperty | BindingFlags.Instance | BindingFlags.NonPublic);

                if (qAdapterCommandCollection != null && initCC != null)
                {
                    initCC.Invoke(InstanceQueriesAdapter, null);

                    IDbCommand[] qaCC = (IDbCommand[])qAdapterCommandCollection.GetValue(InstanceQueriesAdapter);

                    foreach (SqlCommand singleCommand in qaCC)
                    {
                        SqlConnection newSQLConnection = singleCommand.Connection;
                        newSQLConnection = conexion;
                        singleCommand.Connection = newSQLConnection;
                    }

                    qAdapterCommandCollection.SetValue(InstanceQueriesAdapter, qaCC);
                }
                else
                {
                    throw new Exception("Could not find command collection.");
                }
            }
            catch (Exception _exception)
            {
                throw new Exception(_exception.ToString());
            }
        }

        public static void GetInstanceQueriesAdapter<IQA>(ref IQA InstanceQueriesAdapter, SqlConnection conexion, SqlTransaction trans)
        {
            try
            {
                FieldInfo qAdapterCommandCollection = InstanceQueriesAdapter.GetType().GetField("_commandCollection", BindingFlags.GetProperty | BindingFlags.Instance | BindingFlags.NonPublic);
                MethodInfo initCC = InstanceQueriesAdapter.GetType().GetMethod("InitCommandCollection", BindingFlags.GetProperty | BindingFlags.Instance | BindingFlags.NonPublic);

                if (qAdapterCommandCollection != null && initCC != null)
                {
                    initCC.Invoke(InstanceQueriesAdapter, null);

                    IDbCommand[] qaCC = (IDbCommand[])qAdapterCommandCollection.GetValue(InstanceQueriesAdapter);

                    foreach (SqlCommand singleCommand in qaCC)
                    {
                        SqlConnection newSQLConnection = singleCommand.Connection;
                        newSQLConnection = conexion;
                        singleCommand.Connection = newSQLConnection;
                        singleCommand.Transaction = trans;
                    }

                    qAdapterCommandCollection.SetValue(InstanceQueriesAdapter, qaCC);
                }
                else
                {
                    throw new Exception("Could not find command collection.");
                }
            }
            catch (Exception _exception)
            {
                throw new Exception(_exception.ToString());
            }
        }
        #endregion
        #region AreaEmpresa
        public static bool AREAEMPRESA_INSERTAR(string AREA, int USUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.AREAEMPRESA_INSERTAR(AREA, USUARIO_CREACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.AREAEMPRESA_BUSCAR_POR_QUERYDataTable AREAEMPRESA_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.AREAEMPRESA_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.AREAEMPRESA_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.AREAEMPRESA_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.AREAEMPRESA_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool AREAEMPRESA_MODIFICAR(string AREA, int USUARIO_MODIFICAR, int IDAREA_EMPRESA, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.AREAEMPRESA_MODIFICAR(AREA, USUARIO_MODIFICAR, IDAREA_EMPRESA);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool AREAEMPRESA_ELIMINAR(int IDUSUARIO_BORRADO, int IDAREA_EMPRESA, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.AREAEMPRESA_ELIMINAR(IDAREA_EMPRESA, IDUSUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region EntidadFinanciera
        public static bool ENTIDADFINANCIERA_INSERTAR(string CODIGO, string ENTIDAD, string ALIAS, int IDUSUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ENTIDADFINANCIERA_INSERTAR(CODIGO, ENTIDAD, ALIAS, IDUSUARIO_CREACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.ENTIDADFINANCIERA_BUSCAR_POR_QUERYDataTable ENTIDADFINANCIERA_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.ENTIDADFINANCIERA_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.ENTIDADFINANCIERA_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.ENTIDADFINANCIERA_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.ENTIDADFINANCIERA_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool ENTIDADFINANCIERA_MODIFICAR(int IDENTIDADFINANCIERA, string CODIGO, string ENTIDAD,
                int USUARIO_MODIFICAR, string ALIAS, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ENTIDADFINANCIERA_MODIFICAR(IDENTIDADFINANCIERA, CODIGO, ENTIDAD, 
                USUARIO_MODIFICAR, ALIAS);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool ENTIDADFINANCIERA_ELIMINAR(int IDUSUARIO_BORRADO, int IDENTIDAD_FINANCIERA, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ENTIDADFINANCIERA_ELIMINAR(IDENTIDAD_FINANCIERA, IDUSUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool ENTIDADFINANCIERA_MODIFICAR_ESTADO(int IDENTIDADFINANCIERA, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ENTIDADFINANCIERA_MODIFICAR_ESTADO(IDENTIDADFINANCIERA, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Moneda
        public static bool MONEDA_INSERTAR(string MONEDA, int LOCAL, string SIMBOLO, string CODIGO, int IDUSUARIO_CREADOR, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.MONEDA_INSERTAR(MONEDA, LOCAL, SIMBOLO, CODIGO, IDUSUARIO_CREADOR);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static dsProcedimientos.MONEDA_BUSCAR_POR_QUERYDataTable MONEDA_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.MONEDA_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.MONEDA_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.MONEDA_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.MONEDA_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.MONEDA_BUSCAR_POR_QUERY_ESTADODataTable MONEDA_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.MONEDA_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.MONEDA_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.MONEDA_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.MONEDA_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool MONEDA_MODIFICAR(string MONEDA, int LOCAL, string SIMBOLO, string CODIGO, 
            int IDUSUARIO_MODIFICADOR, int IDMONEDA, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.MONEDA_MODIFICAR(MONEDA, LOCAL, SIMBOLO, CODIGO, IDUSUARIO_MODIFICADOR, IDMONEDA);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool MONEDA_ELIMINAR(int IDUSUARIO_ELIMINACION, int IDMONEDA, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.MONEDA_ELIMINAR(IDUSUARIO_ELIMINACION, IDMONEDA);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool MONEDA_MODIFICAR_ESTADO(int IDMONEDA, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.MONEDA_MODIFICAR_ESTADO(IDMONEDA, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Cuenta Corriente
        public static bool CUENTASCORRIENTES_INSERTAR(int IDENTIDAD_FINANCIERA, string NOMBRE_CUENTA, string NUMERO_CUENTA, 
            int IDMONEDA, int IDEMPRESA, int IDUSUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CUENTASCORRIENTES_INSERTAR(IDENTIDAD_FINANCIERA, NOMBRE_CUENTA, NUMERO_CUENTA, IDMONEDA, IDEMPRESA, 
                IDUSUARIO_CREACION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static dsProcedimientos.CUENTASCORRIENTES_BUSCAR_POR_QUERYDataTable CUENTACORRIENTE_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.CUENTASCORRIENTES_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.CUENTASCORRIENTES_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.CUENTASCORRIENTES_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CUENTASCORRIENTES_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.CUENTASCORRIENTES_BUSCAR_POR_QUERY_ESTADO_MONEDADataTable CUENTACORRIENTE_BUSCAR_POR_QUERY_ESTADO_MONEDA(string query, ref int registros, int index, int cantidad_registros, int IDMONEDA, SqlConnection conn)
        {
            dsProcedimientos.CUENTASCORRIENTES_BUSCAR_POR_QUERY_ESTADO_MONEDADataTable dataTable = new dsProcedimientos.CUENTASCORRIENTES_BUSCAR_POR_QUERY_ESTADO_MONEDADataTable();
            dsProcedimientosTableAdapters.CUENTASCORRIENTES_BUSCAR_POR_QUERY_ESTADO_MONEDATableAdapter tableAdapter = new dsProcedimientosTableAdapters.CUENTASCORRIENTES_BUSCAR_POR_QUERY_ESTADO_MONEDATableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros, IDMONEDA);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool CUENTASCORIENTES_MODIFICAR(int IDCUENTA_CORRIENTE, int IDENTIDAD_FINANCIERA, string NOMBRE_CUENTA, 
            string NUMERO_CUENTA, int IDMONEDA, int IDEMPRESA, int IDUSUARIO_MODIFICAR, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CUENTASCORIENTES_MODIFICAR(IDCUENTA_CORRIENTE, IDENTIDAD_FINANCIERA, NOMBRE_CUENTA, NUMERO_CUENTA,
                IDMONEDA, IDEMPRESA, IDUSUARIO_MODIFICAR);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool CUENTASCORRIENTES_ELIMINAR(int IDUSUARIO_ELIMINACION, int IDCUENTA_CORRIENTE, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CUENTASCORRIENTES_ELIMINAR(IDCUENTA_CORRIENTE, IDUSUARIO_ELIMINACION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool CUENTASCORIENTES_MODIFICAR_ESTADO(int IDCUENTA_CORRIENTE, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CUENTASCORIENTES_MODIFICAR_ESTADO(IDCUENTA_CORRIENTE, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region TIPO COMPROBANTE
        public static bool TIPOCOMPROBANTE_INSERTAR(string CODIGO, string TIPO_COMPROBANTE, double FACTOR, string PORCENTAJE, int IDUSUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPOCOMPROBANTE_INSERTAR(CODIGO, TIPO_COMPROBANTE, Convert.ToDecimal(FACTOR), PORCENTAJE, IDUSUARIO_CREACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.TIPOCOMPROBANTE_BUSCAR_POR_QUERYDataTable TIPOCOMPROBANTE_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.TIPOCOMPROBANTE_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.TIPOCOMPROBANTE_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.TIPOCOMPROBANTE_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.TIPOCOMPROBANTE_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.TIPOCOMPROBANTE_BUSCAR_ACTIVO_POR_CODIGORow TIPOCOMPROBANTE_BUSCAR_POR_CODIGO(string CODIGO, SqlConnection conn)
        {
            dsProcedimientos.TIPOCOMPROBANTE_BUSCAR_ACTIVO_POR_CODIGODataTable dataTable = new dsProcedimientos.TIPOCOMPROBANTE_BUSCAR_ACTIVO_POR_CODIGODataTable();
            dsProcedimientosTableAdapters.TIPOCOMPROBANTE_BUSCAR_ACTIVO_POR_CODIGOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.TIPOCOMPROBANTE_BUSCAR_ACTIVO_POR_CODIGOTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(CODIGO);
            if (dataTable.Rows.Count > 0)
            {
                foreach (dsProcedimientos.TIPOCOMPROBANTE_BUSCAR_ACTIVO_POR_CODIGORow item in dataTable.Rows)
                    return item;
                return null;
            }
            else
                return null;
        }

        public static bool TIPOCOMPROBANTE_MODIFICAR(string CODIGO, string TIPO_COMPROBANTE, double FACTOR, 
            string PORCENTAJE, int IDUSUARIO_MODIFICACION, int IDTIPO_COMPROBANTE, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPOCOMPROBANTE_MODIFICAR(CODIGO, TIPO_COMPROBANTE, Convert.ToDecimal(FACTOR), 
                PORCENTAJE, IDUSUARIO_MODIFICACION, IDTIPO_COMPROBANTE);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool TIPOCOMPROBANTE_ELIMINAR(int IDUSUARIO_ELIMINACION, int IDTIPO_COMPROBANTE, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPOCOMPROBANTE_ELIMINAR(IDTIPO_COMPROBANTE, IDUSUARIO_ELIMINACION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool TIPOCOMPROBANTE_MODIFICAR_ESTADO(int IDTIPO_COMPROBANTE, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPOCOMPROBANTE_MODIFICAR_ESTADO(IDTIPO_COMPROBANTE, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Proyecto
        public static bool PROYECTO_INSERTAR(string PROYECTO, int IDEMPRESA, DateTime FECHA_INICIO, DateTime FECHA_FIN, double LATITUD, double LONGITUD, int USUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.PROYECTO_INSERTAR(PROYECTO, IDEMPRESA, FECHA_INICIO, FECHA_FIN, Convert.ToDecimal(LATITUD), Convert.ToDecimal(LONGITUD), USUARIO_CREACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.PROYECTO_BUSCAR_POR_QUERYDataTable PROYECTO_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.PROYECTO_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.PROYECTO_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.PROYECTO_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.PROYECTO_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.PROYECTO_BUSCAR_POR_QUERY_IDEMPRESADataTable PROYECTO_BUSCAR_POR_QUERY_IDEMPRESA(string query, ref int registros, int index, int cantidad_registros, int IDEMPRESA, SqlConnection conn)
        {
            dsProcedimientos.PROYECTO_BUSCAR_POR_QUERY_IDEMPRESADataTable dataTable = new dsProcedimientos.PROYECTO_BUSCAR_POR_QUERY_IDEMPRESADataTable();
            dsProcedimientosTableAdapters.PROYECTO_BUSCAR_POR_QUERY_IDEMPRESATableAdapter tableAdapter = new dsProcedimientosTableAdapters.PROYECTO_BUSCAR_POR_QUERY_IDEMPRESATableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, IDEMPRESA, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool PROYECTO_MODIFICAR(int IDPROYECTO, string PROYECTO, int IDEMPRESA, DateTime FECHA_INICIO,
            DateTime FECHA_FIN, double LATITUD, double LONGITUD, int IDUSUARIO_MODIFICACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.PROYECTO_MODIFICAR(IDPROYECTO, PROYECTO, IDEMPRESA, FECHA_INICIO, FECHA_FIN,
                Convert.ToDecimal(LATITUD), Convert.ToDecimal(LONGITUD), IDUSUARIO_MODIFICACION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool PROYECTO_ELIMINAR(int IDPROYECTO, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.PROYECTO_ELIMINAR(IDPROYECTO, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool PROYECTO_MODIFICAR_ESTADO(int IDPROYECTO, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.PROYECTO_MODIFICAR_ESTADO(IDPROYECTO, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Upload Proyecto
        public static bool UPLOAD_PROYECTO_INSERTAR(int IDPROYECTO, string NOMBRE_GENERADO, string NOMBRE_ARCHIVO,
            string PESO_ARCHIVO, int USUARIO_CREACION, string EXTENSION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UPLOAD_PROYECTO_INSERTAR(IDPROYECTO, NOMBRE_GENERADO, NOMBRE_ARCHIVO, PESO_ARCHIVO,
                USUARIO_CREACION, EXTENSION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.UPLOAD_PROYECTO_BUSCAR_POR_IDPROYECTODataTable UPLOAD_PROYECTO_BUSCAR_POR_IDPROYECTO(int IDPROYECTO, SqlConnection conn)
        {
            dsProcedimientos.UPLOAD_PROYECTO_BUSCAR_POR_IDPROYECTODataTable dataTable = new dsProcedimientos.UPLOAD_PROYECTO_BUSCAR_POR_IDPROYECTODataTable();
            dsProcedimientosTableAdapters.UPLOAD_PROYECTO_BUSCAR_POR_IDPROYECTOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.UPLOAD_PROYECTO_BUSCAR_POR_IDPROYECTOTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDPROYECTO);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOADDataTable UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOAD(int IDUPLOAD_PROYECTO, SqlConnection conn)
        {
            dsProcedimientos.UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOADDataTable dataTable = new dsProcedimientos.UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOADDataTable();
            dsProcedimientosTableAdapters.UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOADTableAdapter tableAdapter = new dsProcedimientosTableAdapters.UPLOAD_PROYECTO_BUSCAR_POR_IDUPLOADTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDUPLOAD_PROYECTO);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool UPLOAD_PROYECTO_MODIFICAR(int IDUPLOAD_PROYECTO, int IDPROYECTO, string NOMBRE_GENERADO,
            string NOMBRE_ARCHIVO, string PESO_ARCHIVO, int IDUSUARIO_MODIFICACION, string EXTENSION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UPLOAD_PROYECTO_MODIFICAR(IDUPLOAD_PROYECTO, IDPROYECTO, NOMBRE_GENERADO, NOMBRE_ARCHIVO,
                PESO_ARCHIVO, IDUSUARIO_MODIFICACION, EXTENSION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool UPLOAD_PROYECTO_ELIMINAR(int IDUPLOAD_PROYECTO, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UPLOAD_PROYECTO_ELIMINAR(IDUPLOAD_PROYECTO, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool UPLOAD_PROYECTO_MODIFICAR_ESTADO(int IDUPLOAD_PROYECTO, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UPLOAD_PROYECTO_MODIFICAR_ESTADO(IDUPLOAD_PROYECTO, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Serie
        public static bool SERIE_INSERTAR(string SERIE, string DESCRIPCION, int USUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SERIE_INSERTAR(SERIE, DESCRIPCION, USUARIO_CREACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.SERIE_BUSCAR_POR_QUERYDataTable SERIE_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.SERIE_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.SERIE_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.SERIE_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.SERIE_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.SERIE_BUSCAR_POR_QUERY_ESTADODataTable SERIE_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.SERIE_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.SERIE_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.SERIE_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.SERIE_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool SERIE_MODIFICAR(int IDSERIE, string SERIE, string DESCRIPCION, int USUARIO_MODIFICACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SERIE_MODIFICAR(IDSERIE, SERIE, DESCRIPCION, USUARIO_MODIFICACION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool SERIE_ELIMINAR(int IDSERIE, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SERIE_ELIMINAR(IDSERIE, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool SERIE_MODIFICAR_ESTADO(int IDSERIE, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SERIE_MODIFICAR_ESTADO(IDSERIE, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Correlativo
        public static dsProcedimientos.CORRELATIVO_EXISTDataTable CORRELATIVO_EXIST(int IDEMPRESA, int IDSERIE, string CORRELATIVO, SqlConnection conn)
        {
            dsProcedimientos.CORRELATIVO_EXISTDataTable dataTable = new dsProcedimientos.CORRELATIVO_EXISTDataTable();
            dsProcedimientosTableAdapters.CORRELATIVO_EXISTTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CORRELATIVO_EXISTTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDEMPRESA, IDSERIE, CORRELATIVO);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }
        public static string CORRELATIVO_LAST(int IDEMPRESA, int IDSERIE, SqlConnection conn)
        {
            dsProcedimientos.CORRELATIVO_LASTDataTable dataTable = new dsProcedimientos.CORRELATIVO_LASTDataTable();
            dsProcedimientosTableAdapters.CORRELATIVO_LASTTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CORRELATIVO_LASTTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDEMPRESA, IDSERIE);
            if (dataTable.Rows.Count > 0)
            {
                foreach (dsProcedimientos.CORRELATIVO_LASTRow item in dataTable.Rows)
                    return item.CORRELATIVO;
                return null;
            }
            else
                return null;
        }
        #endregion
        #region Tipo Documento Identidad
        public static bool TIPO_DOCUMENTO_IDENTIDAD_INSERTAR(string CODIGO, string TIPO_DOCUMENTO_IDENTIDAD, string ABREVIACION, int IDUSUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_DOCUMENTO_IDENTIDAD_INSERTAR(CODIGO, TIPO_DOCUMENTO_IDENTIDAD, IDUSUARIO_CREACION, ABREVIACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.TIPO_DOCUMENTO_IDENTIDAD_BUSCAR_POR_QUERYDataTable TIPO_DOCUMENTO_IDENTIDAD_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.TIPO_DOCUMENTO_IDENTIDAD_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.TIPO_DOCUMENTO_IDENTIDAD_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.TIPO_DOCUMENTO_IDENTIDAD_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.TIPO_DOCUMENTO_IDENTIDAD_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool TIPO_DOCUMENTO_IDENTIDAD_MODIFICAR(int IDTIPO_DOCUMENTO, string CODIGO, string TIPO_DOCUMENTO_IDENTIDAD,
            int USUARIO_MODIFICACION, string ABREVIACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_DOCUMENTO_IDENTIDAD_MODIFICAR(IDTIPO_DOCUMENTO, CODIGO, TIPO_DOCUMENTO_IDENTIDAD, USUARIO_MODIFICACION, ABREVIACION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool TIPO_DOCUMENTO_IDENTIDAD_ELIMINAR(int IDTIPO_DOCUMENTO, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_DOCUMENTO_IDENTIDAD_ELIMINAR(IDTIPO_DOCUMENTO, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool TIPO_DOCUMENTO_IDENTIDAD_MODIFICAR_ESTADO(int IDTIPO_DOCUMENTO, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_DOCUMENTO_IDENTIDAD_MODIFICAR_ESTADO(IDTIPO_DOCUMENTO, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region EMISION_FACTURA
        public static bool FACTURA_CABECERA_INSERTAR(int IDCLIENTE, DateTime FECHA_EMISION, int IDSERIE, string CORRELATIVO, 
            string ORDEN_TRABAJO, double IGV, double BASE_IMPONIBLE, double MONTO_TOTAL, int USUARIO_CREACION, int IDEMPRESA, 
            int IDMONEDA, int OMITIRIGV, string FOOTER, ref int REF_OUT_IDVENTAS_CABECERA, SqlConnection conn, SqlTransaction trans)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn, trans);
            int? OUT_IDVENTAS_CABECERA = 0;
            int op = tableAdapter.FACTURA_INSERTAR(IDCLIENTE, FECHA_EMISION, IDSERIE, CORRELATIVO, ORDEN_TRABAJO,
                Convert.ToDecimal(IGV), Convert.ToDecimal(BASE_IMPONIBLE), Convert.ToDecimal(MONTO_TOTAL), 
                USUARIO_CREACION, IDEMPRESA, IDMONEDA, OMITIRIGV, FOOTER, ref OUT_IDVENTAS_CABECERA);
            REF_OUT_IDVENTAS_CABECERA = OUT_IDVENTAS_CABECERA.HasValue ? OUT_IDVENTAS_CABECERA.Value : 0;
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool FACTURA_DETALLE_INSERTAR(double BASE_IMPONIBLE, double IMPUESTO, double MONTO_TOTAL, int IDPROYECTO,
        int IDVENTAS_CABECERA, int IDUNIDAD_MEDIDA, int? IDTIPO_EXISTENCIA, int? IDTIPO_INTANGIBLE, int USUARIO_CREACION, 
        double CANTIDAD, string ITEM, SqlConnection conn, SqlTransaction trans)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn, trans);
            int op = tableAdapter.FACTURA_DETALLE_INSERTAR(Convert.ToDecimal(BASE_IMPONIBLE), Convert.ToDecimal(IMPUESTO),
                Convert.ToDecimal(MONTO_TOTAL), IDPROYECTO, IDVENTAS_CABECERA, IDUNIDAD_MEDIDA, IDTIPO_EXISTENCIA, IDTIPO_INTANGIBLE,
                USUARIO_CREACION, Convert.ToDecimal(CANTIDAD), ITEM);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Cliente
        public static bool CLIENTE_INSERTAR(string RUC, string RAZON_SOCIAL, string DIRECCION, int USUARIO_CREACION, ref int OUT_IDCLIENTE, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int? REF_OUT_IDCLIENTE = 0;
            int op = tableAdapter.CLIENTES_INSERTAR(RUC, RAZON_SOCIAL, DIRECCION, USUARIO_CREACION, ref REF_OUT_IDCLIENTE);
            OUT_IDCLIENTE = REF_OUT_IDCLIENTE.HasValue ? REF_OUT_IDCLIENTE.Value : 0;
            if (op != 0)
                return true;
            else
                return false;
        }

        public static dsProcedimientos.CLIENTES_BUSCAR_POR_RUCDataTable CLIENTE_BUSCAR_POR_RUC(string RUC, SqlConnection conn)
        {
            dsProcedimientos.CLIENTES_BUSCAR_POR_RUCDataTable dataTable = new dsProcedimientos.CLIENTES_BUSCAR_POR_RUCDataTable();
            dsProcedimientosTableAdapters.CLIENTES_BUSCAR_POR_RUCTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CLIENTES_BUSCAR_POR_RUCTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(RUC);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }
        #endregion
        #region Unidad Medida
        public static bool UNIDAD_MEDIDA_INSERTAR(string UNIDAD_MEDIDA, string CODIGO, int USUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UNIDAD_MEDIDA_INSERTAR(UNIDAD_MEDIDA, CODIGO, USUARIO_CREACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.UNIDAD_MEDIDA_BUSCAR_POR_QUERYDataTable UNIDAD_MEDIDA_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.UNIDAD_MEDIDA_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.UNIDAD_MEDIDA_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.UNIDAD_MEDIDA_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.UNIDAD_MEDIDA_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.UNIDAD_MEDIDA_BUSCAR_POR_QUERY_ESTADODataTable UNIDAD_MEDIDA_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.UNIDAD_MEDIDA_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.UNIDAD_MEDIDA_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.UNIDAD_MEDIDA_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.UNIDAD_MEDIDA_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool UNIDAD_MEDIDA_MODIFICAR(int IDUNIDAD_MEDIDA, string UNIDAD_MEDIDA, string CODIGO, int USUARIO_MODIFICACION, 
            SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UNIDAD_MEDIDA_MODIFICAR(IDUNIDAD_MEDIDA, UNIDAD_MEDIDA, CODIGO, USUARIO_MODIFICACION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool UNIDAD_MEDIDA_ELIMINAR(int IDUNIDAD_MEDIDA, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UNIDAD_MEDIDA_ELIMINAR(IDUNIDAD_MEDIDA, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool UNIDAD_MEDIDA_MODIFICAR_ESTADO(int IDUNIDAD_MEDIDA, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UNIDAD_MEDIDA_MODIFICAR_ESTADO(IDUNIDAD_MEDIDA, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Impresion de Factura
        public static bool IMPRESION_FACTURA_INSERTAR(int IDEMPRESA, int IDSERIE,
                string CORRELATIVO, string RAZON_SOCIAL, string DIA, string MES, string ANIO,
                string DIRECCION, string RUC, string ORD_TRAB, int IDTIPO_COMPROBANTE, 
                int IDMONEDA, double SUB_TOTAL, double DESCUENTO, double VALOR_VENTA, 
                double IGV, double TOTAL, int IDVENTA_CABECERA, string FOOTER, ref int IDCABECERA_IMPRESION, SqlConnection conn, 
                SqlTransaction trans)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn, trans);
            int? IDCABECERA_IMPRESION_REF = 0;
            int op = tableAdapter.IMPRESION_FACTURAS_CABECERA_INSERTAR(IDEMPRESA, IDSERIE, 
                CORRELATIVO, RAZON_SOCIAL, DIA, MES, ANIO, DIRECCION, RUC, ORD_TRAB,
                IDTIPO_COMPROBANTE, IDMONEDA, Convert.ToDecimal(SUB_TOTAL), Convert.ToDecimal(DESCUENTO), 
                Convert.ToDecimal(VALOR_VENTA), Convert.ToDecimal(IGV), Convert.ToDecimal(TOTAL), 
                IDVENTA_CABECERA, FOOTER, ref IDCABECERA_IMPRESION_REF);
            IDCABECERA_IMPRESION = IDCABECERA_IMPRESION_REF.HasValue ? IDCABECERA_IMPRESION_REF.Value : 0;
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool IMPRESION_FACTURA_DETALLE_INSERTAR(int IDIPRESION_FACTURA_CABECERA,
                double CANTIDAD, string CODIGO, string DESCRIPCION, double P_UNITARIO, double TOTAL, SqlConnection conn,
                SqlTransaction trans)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn, trans);
            int op = tableAdapter.IMPRESION_FACTURAS_DETALLE_INSERTAR(IDIPRESION_FACTURA_CABECERA, 
                Convert.ToDecimal(CANTIDAD), CODIGO, DESCRIPCION, Convert.ToDecimal(P_UNITARIO), Convert.ToDecimal(TOTAL));
            if (op != 0)
                return true;
            else
                return false;
        }

        public static dsProcedimientos.FACTURA_BUSCAR_FACTURA_IMPRESIONDataTable FACTURA_BUSCAR_POR_ID(int IDCABECERA, SqlConnection conn)
        {
            dsProcedimientos.FACTURA_BUSCAR_FACTURA_IMPRESIONDataTable dataTable = new dsProcedimientos.FACTURA_BUSCAR_FACTURA_IMPRESIONDataTable();
            dsProcedimientosTableAdapters.FACTURA_BUSCAR_FACTURA_IMPRESIONTableAdapter tableAdapter = new dsProcedimientosTableAdapters.FACTURA_BUSCAR_FACTURA_IMPRESIONTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDCABECERA);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }
        #endregion
        #region Facturas
        public static dsProcedimientos.FACTURA_BUSCAR_POR_IDVENTASDataTable FACTURA_BUSCAR_POR_IDVENTAS(int IDVENTAS_CABECERA, SqlConnection conn)
        {
            dsProcedimientos.FACTURA_BUSCAR_POR_IDVENTASDataTable dataTable = new dsProcedimientos.FACTURA_BUSCAR_POR_IDVENTASDataTable();
            dsProcedimientosTableAdapters.FACTURA_BUSCAR_POR_IDVENTASTableAdapter tableAdapter = new dsProcedimientosTableAdapters.FACTURA_BUSCAR_POR_IDVENTASTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDVENTAS_CABECERA);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.FACTURA_BUSCAR_POR_QUERYDataTable FACTURA_BUSCAR_POR_QUERY(int IDUSUARIO, 
            string query, ref int registros, int index, int cantidad_registros, string SERIE_FILTRO, 
            string CORRELATIVO, string EMPRESA_FILTRO, string ESTADO_FILTRO, SqlConnection conn)
        {
            dsProcedimientos.FACTURA_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.FACTURA_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.FACTURA_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.FACTURA_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            SqlCommand cmd = new SqlCommand("FACTURA_BUSCAR_POR_QUERY", conn);
            SqlParameter registros_out = new SqlParameter("@REGISTROS", re_registros)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.AddWithValue("@IDUSUARIO", IDUSUARIO);
            cmd.Parameters.AddWithValue("@QUERY", clsUtil.DbNullIfNullOrEmpty(query));
            cmd.Parameters.AddWithValue("@INDEX", index);
            cmd.Parameters.AddWithValue("@CANTIDAD", cantidad_registros);
            cmd.Parameters.AddWithValue("@SERIE_FILTRO", clsUtil.DbNullIfNullOrEmpty(SERIE_FILTRO));
            cmd.Parameters.AddWithValue("@CORRELATIVO", clsUtil.DbNullIfNullOrEmpty(CORRELATIVO));
            cmd.Parameters.AddWithValue("@EMPRESA_FILTRO", clsUtil.DbNullIfNullOrEmpty(EMPRESA_FILTRO));
            cmd.Parameters.AddWithValue("@ESTADO_FILTRO", clsUtil.DbNullIfNullOrEmpty(ESTADO_FILTRO));
            cmd.Parameters.Add(registros_out);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dataTable);
            //dataTable = tableAdapter.GetData(IDUSUARIO, clsUtil.DbNullIfNull(query==""?null:query), index, cantidad_registros, 
            //    ref re_registros, clsUtil.DbNullIfNull(SERIE_FILTRO == "" ? null : SERIE_FILTRO), 
            //    clsUtil.DbNullIfNull(CORRELATIVO == "" ? null : CORRELATIVO), 
            //    clsUtil.DbNullIfNull(EMPRESA_FILTRO == "" ? null : EMPRESA_FILTRO),
            //     clsUtil.DbNullIfNull(ESTADO_FILTRO == "" ? null : ESTADO_FILTRO));
            registros = (int)registros_out.Value;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool FACTURA_ELIMINAR(int IDUSUARIO_ELIMINACION, int IDVENTAS_CABECERA, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.FACTURA_ELIMINAR(IDVENTAS_CABECERA, IDUSUARIO_ELIMINACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Estado Factura
        public static dsProcedimientos.ESTADO_BUSCAR_POR_QUERY_ESTADODataTable ESTADO_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.ESTADO_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.ESTADO_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.ESTADO_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.ESTADO_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }
        #endregion
        #region Registro estado
        public static bool REGISTRO_ESTADO_INSERTAR(int IDVENTAS_CABECERA, int USUARIO_CREACION, int IDESTADO_FACTURA, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.REGISTRO_ESTADO_INSERTAR(IDVENTAS_CABECERA, USUARIO_CREACION, IDESTADO_FACTURA);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Ventas Cabecera Upload
        public static bool VENTAS_CABECERA_UPLOAD_INSERTAR(string DIRECCION_FISICA, string NOMBRE_ARCHIVO, string EXTENSION, int USUARIO_CREACION, int IDVENTAS_CABECERA, string PESO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.VENTAS_CABECERA_UPLOAD_INSERTAR(DIRECCION_FISICA, NOMBRE_ARCHIVO, EXTENSION, USUARIO_CREACION, IDVENTAS_CABECERA, PESO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static dsProcedimientos.VENTAS_CABECERA_UPLOAD_BUSCAR_POR_ID_CABECERARow VENTAS_CABECERA_UPLOAD_BUSCAR_POR_ID_CABECERA(int IDVENTAS_CABECERA, SqlConnection conn)
        {
            dsProcedimientos.VENTAS_CABECERA_UPLOAD_BUSCAR_POR_ID_CABECERADataTable dataTable = new dsProcedimientos.VENTAS_CABECERA_UPLOAD_BUSCAR_POR_ID_CABECERADataTable();
            dsProcedimientosTableAdapters.VENTAS_CABECERA_UPLOAD_BUSCAR_POR_ID_CABECERATableAdapter tableAdapter = new dsProcedimientosTableAdapters.VENTAS_CABECERA_UPLOAD_BUSCAR_POR_ID_CABECERATableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDVENTAS_CABECERA);
            if (dataTable.Rows.Count > 0)
                return dataTable[0];
            else
                return null;
        }
        #endregion
        #region Configuraciones Session
        public static bool CONFIGURACIONES_SESION_INSERTAR_MODIFICAR(string SKIN, int IDUSUARIO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONFIGURACIONES_SESION_INSERTAR_MODIFICAR(SKIN, IDUSUARIO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static dsProcedimientos.CONFIGURACIONES_SESION_BUSCAR_POR_IDUSUARIORow CONFIGURACIONES_SESION_BUSCAR_POR_IDUSUARIO(int IDUSUARIO, SqlConnection conn)
        {
            dsProcedimientos.CONFIGURACIONES_SESION_BUSCAR_POR_IDUSUARIODataTable dataTable = new dsProcedimientos.CONFIGURACIONES_SESION_BUSCAR_POR_IDUSUARIODataTable();
            dsProcedimientosTableAdapters.CONFIGURACIONES_SESION_BUSCAR_POR_IDUSUARIOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CONFIGURACIONES_SESION_BUSCAR_POR_IDUSUARIOTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDUSUARIO);
            if (dataTable.Rows.Count > 0)
                return dataTable[0];
            else
                return null;
        }
        #endregion
        #region Accesos directos
        public static dsProcedimientos.ACCESODIRECTO_BUSCAR_POR_IDUSUARIODataTable ACCESODIRECTO_BUSCAR_POR_IDUSUARIO(int IDUSUARIO, SqlConnection conn)
        {
            dsProcedimientos.ACCESODIRECTO_BUSCAR_POR_IDUSUARIODataTable dataTable = new dsProcedimientos.ACCESODIRECTO_BUSCAR_POR_IDUSUARIODataTable();
            dsProcedimientosTableAdapters.ACCESODIRECTO_BUSCAR_POR_IDUSUARIOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.ACCESODIRECTO_BUSCAR_POR_IDUSUARIOTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDUSUARIO);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }
        public static bool ACCESODIRECTO_INSERTAR(int IDUSUARIO, string URL_DIRECCION, string ICON, string NOMBRE_ACCESO_DIRECTO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ACCESODIRECTO_INSERTAR(IDUSUARIO, URL_DIRECCION, ICON, NOMBRE_ACCESO_DIRECTO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool ACCESODIRECTO_ELIMINAR(int IDACCESO_DIRECTO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ACCESODIRECTO_ELIMINAR(IDACCESO_DIRECTO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Sistema Pensiones
        public static bool SISTEMA_PENSIONES_INSERTAR(string SISTEMA_PENSION, string CODIGO, int USUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SISTEMA_PENSIONES_INSERTAR(SISTEMA_PENSION, USUARIO_CREACION, CODIGO);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.SISTEMA_PENSIONES_BUSCAR_POR_QUERYDataTable SISTEMA_PENSIONES_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.SISTEMA_PENSIONES_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.SISTEMA_PENSIONES_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.SISTEMA_PENSIONES_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.SISTEMA_PENSIONES_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.SISTEMA_PENSIONES_BUSCAR_POR_QUERY_ESTADODataTable SISTEMA_PENSIONES_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.SISTEMA_PENSIONES_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.SISTEMA_PENSIONES_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.SISTEMA_PENSIONES_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.SISTEMA_PENSIONES_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool SISTEMA_PENSIONES_MODIFICAR(int IDSISTEMA_PENSION, string SISTEMA_PENSION, int USUARIO_MODIFICACION, string CODIGO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SISTEMA_PENSIONES_MODIFICAR(IDSISTEMA_PENSION, SISTEMA_PENSION, USUARIO_MODIFICACION, CODIGO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool SISTEMA_PENSIONES_ELIMINAR(int IDSISTEMA_PENSION, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SISTEMA_PENSIONES_ELIMINAR(IDSISTEMA_PENSION, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool SISTEMA_PENSIONES_MODIFICAR_ESTADO(int IDSISTEMA_PENSION, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SISTEMA_PENSIONES_MODIFICAR_ESTADO(IDSISTEMA_PENSION, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Sede
        public static bool SEDE_INSERTAR(string SEDE, string DESCRIPCION, int USUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SEDE_INSERTAR(SEDE, DESCRIPCION, USUARIO_CREACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.SEDE_BUSCAR_POR_QUERYDataTable SEDE_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.SEDE_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.SEDE_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.SEDE_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.SEDE_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.SEDE_BUSCAR_POR_QUERY_ESTADODataTable SEDE_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.SEDE_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.SEDE_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.SEDE_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.SEDE_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool SEDE_MODIFICAR(int IDSEDE, string SEDE, string DESCRIPCION, int USUARIO_MODIFICACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SEDE_MODIFICAR(IDSEDE, SEDE, DESCRIPCION, USUARIO_MODIFICACION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool SEDE_ELIMINAR(int IDSEDE, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SEDE_ELIMINAR(IDSEDE, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool SEDE_MODIFICAR_ESTADO(int IDSEDE, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SEDE_MODIFICAR_ESTADO(IDSEDE, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Tipo Contrato
        public static bool TIPO_CONTRATO_INSERTAR(string TIPO_CONTRATO, string DESCRIPCION, int USUARIO_CREACION, int ES_INICIO, int ES_RENOVACION, int ES_FINAL, int ES_OTROS, string NOMBRE_REPORTE, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_CONTRATO_INSERTAR(TIPO_CONTRATO, DESCRIPCION, USUARIO_CREACION, ES_INICIO, ES_RENOVACION, ES_FINAL, ES_OTROS, NOMBRE_REPORTE);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.TIPO_CONTRATO_BUSCAR_POR_QUERYDataTable TIPO_CONTRATO_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.TIPO_CONTRATO_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.TIPO_CONTRATO_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.TIPO_CONTRATO_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.TIPO_CONTRATO_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.TIPO_CONTRATO_BUSCAR_POR_QUERY_ESTADODataTable TIPO_CONTRATO_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.TIPO_CONTRATO_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.TIPO_CONTRATO_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.TIPO_CONTRATO_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.TIPO_CONTRATO_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool TIPO_CONTRATO_MODIFICAR(int IDTIPO_CONTRATO, string TIPO_CONTRATO, string DESCRIPCION, int USUARIO_MODIFICACION, int ES_INICIO, int ES_RENOVACION, int ES_FINAL, int ES_OTROS, string NOMBRE_REPORTE, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_CONTRATO_MODIFICAR(IDTIPO_CONTRATO, TIPO_CONTRATO, DESCRIPCION, USUARIO_MODIFICACION, ES_INICIO, ES_RENOVACION, ES_FINAL, ES_OTROS, NOMBRE_REPORTE);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool TIPO_CONTRATO_ELIMINAR(int IDTIPO_CONTRATO, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_CONTRATO_ELIMINAR(IDTIPO_CONTRATO, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool TIPO_CONTRATO_MODIFICAR_ESTADO(int IDTIPO_CONTRATO, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_CONTRATO_MODIFICAR_ESTADO(IDTIPO_CONTRATO, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Upload Contrato
        public static bool UPLOAD_CONTRATO_INSERTAR(int IDCONTRATO, string NOMBRE_GENERADO, string NOMBRE_ARCHIVO,
            string PESO_ARCHIVO, int USUARIO_CREACION, string EXTENSION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UPLOAD_CONTRATO_INSERTAR(IDCONTRATO, NOMBRE_GENERADO, NOMBRE_ARCHIVO, PESO_ARCHIVO,
                USUARIO_CREACION, EXTENSION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.UPLOAD_CONTRATO_BUSCAR_POR_IDCONTRATODataTable UPLOAD_CONTRATO_BUSCAR_POR_IDCONTRATO(int IDCONTRATO, SqlConnection conn)
        {
            dsProcedimientos.UPLOAD_CONTRATO_BUSCAR_POR_IDCONTRATODataTable dataTable = new dsProcedimientos.UPLOAD_CONTRATO_BUSCAR_POR_IDCONTRATODataTable();
            dsProcedimientosTableAdapters.UPLOAD_CONTRATO_BUSCAR_POR_IDCONTRATOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.UPLOAD_CONTRATO_BUSCAR_POR_IDCONTRATOTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDCONTRATO);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOADDataTable UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOAD(int IDUPLOAD_CONTRATO, SqlConnection conn)
        {
            dsProcedimientos.UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOADDataTable dataTable = new dsProcedimientos.UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOADDataTable();
            dsProcedimientosTableAdapters.UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOADTableAdapter tableAdapter = new dsProcedimientosTableAdapters.UPLOAD_CONTRATO_BUSCAR_POR_IDUPLOADTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDUPLOAD_CONTRATO);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool UPLOAD_CONTRATO_MODIFICAR(int IDUPLOAD_CONTRATO, int IDCONTRATO, string NOMBRE_GENERADO,
            string NOMBRE_ARCHIVO, string PESO_ARCHIVO, int IDUSUARIO_MODIFICACION, string EXTENSION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UPLOAD_CONTRATO_MODIFICAR(IDUPLOAD_CONTRATO, IDCONTRATO, NOMBRE_GENERADO, NOMBRE_ARCHIVO,
                PESO_ARCHIVO, IDUSUARIO_MODIFICACION, EXTENSION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool UPLOAD_CONTRATO_ELIMINAR(int IDUPLOAD_CONTRATO, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UPLOAD_CONTRATO_ELIMINAR(IDUPLOAD_CONTRATO, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool UPLOAD_CONTRATO_MODIFICAR_ESTADO(int IDUPLOAD_CONTRATO, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.UPLOAD_CONTRATO_MODIFICAR_ESTADO(IDUPLOAD_CONTRATO, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Contrato
        public static bool CONTRATO_TRABAJADOR_INSERTAR(DateTime FECHA_EVENTO, string DETALLES, int USUARIO_ENCARGADO, int USUARIO_CREACION, int IDTIPO_CONTRATO,
                int IDTRABAJADOR, DateTime? FECHA_TERMINO, DateTime FECHA_INICIO, int ES_INDEFINIDO, int IDEMPRESA, int IDSUELDO_TRABAJADOR, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONTRATO_TRABAJADOR_INSERTAR(FECHA_EVENTO, DETALLES, USUARIO_ENCARGADO, USUARIO_CREACION, IDTIPO_CONTRATO,
                IDTRABAJADOR, FECHA_TERMINO, FECHA_INICIO, ES_INDEFINIDO, IDEMPRESA, IDSUELDO_TRABAJADOR);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.CONTRATO_TRABAJADOR_BUSCAR_POR_QUERYDataTable CONTRATO_TRABAJADOR_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.CONTRATO_TRABAJADOR_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.CONTRATO_TRABAJADOR_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.CONTRATO_TRABAJADOR_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CONTRATO_TRABAJADOR_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool CONTRATO_TRABAJADOR_MODIFICAR(int IDCONTRATO_TRABAJADOR, DateTime FECHA_EVENTO, string DETALLES, int USUARIO_ENCARGADO, int USUARIO_MODIFICACION,
                int IDTIPO_CONTRATO, int IDTRABAJADOR, DateTime? FECHA_TERMINO, int ES_INDEFINIDO, int IDEMPRESA, DateTime FECHA_INICIO, int IDSUELDO_TRABAJADOR, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONTRATO_TRABAJADOR_MODIFICAR(IDCONTRATO_TRABAJADOR, FECHA_EVENTO, DETALLES, USUARIO_ENCARGADO, USUARIO_MODIFICACION,
                IDTIPO_CONTRATO, IDTRABAJADOR, FECHA_TERMINO, ES_INDEFINIDO, FECHA_INICIO, IDEMPRESA, IDSUELDO_TRABAJADOR);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool CONTRATO_TRABAJADOR_ELIMINAR(int IDCONTRATO_TRABAJADOR, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONTRATO_TRABAJADOR_ELIMINAR(IDCONTRATO_TRABAJADOR, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool CONTRATO_TRABAJADOR_MODIFICAR_ESTADO(int IDCONTRATO_TRABAJADOR, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONTRATO_TRABAJADOR_MODIFICAR_ESTADO(IDCONTRATO_TRABAJADOR, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Sueldo Trabajador
        public static bool SUELDO_TRABAJADOR_INSERTAR(double SUELDO_TRABAJADOR, string MOTIVO, int USUARIO_CREACION, int IDTRABAJADOR, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SUELDO_TRABAJADOR_INSERTAR(Convert.ToDecimal(SUELDO_TRABAJADOR), MOTIVO, USUARIO_CREACION, IDTRABAJADOR);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.SUELDO_TRABAJADOR_BUSCAR_POR_QUERYDataTable SUELDO_TRABAJADOR_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.SUELDO_TRABAJADOR_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.SUELDO_TRABAJADOR_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.SUELDO_TRABAJADOR_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.SUELDO_TRABAJADOR_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.SUELDO_TRABAJADOR_BUSCAR_POR_QUERY_ESTADODataTable SUELDO_TRABAJADOR_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.SUELDO_TRABAJADOR_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.SUELDO_TRABAJADOR_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.SUELDO_TRABAJADOR_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.SUELDO_TRABAJADOR_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool SUELDO_TRABAJADOR_MODIFICAR(int IDSUELDO_TRABAJADOR, double SUELDO_TRABAJADOR, string MOTIVO, int USUARIO_MODIFICACION, int IDTRABAJADOR, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SUELDO_TRABAJADOR_MODIFICAR(IDSUELDO_TRABAJADOR, Convert.ToDecimal(SUELDO_TRABAJADOR), MOTIVO, USUARIO_MODIFICACION, IDTRABAJADOR);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool SUELDO_TRABAJADOR_ELIMINAR(int IDSUELDO_TRABAJADOR, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SUELDO_TRABAJADOR_ELIMINAR(IDSUELDO_TRABAJADOR, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool SUELDO_TRABAJADOR_MODIFICAR_ESTADO(int IDSUELDO_TRABAJADOR, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.SUELDO_TRABAJADOR_MODIFICAR_ESTADO(IDSUELDO_TRABAJADOR, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Remuneracion Minima Vital
        public static bool REMUNERACION_MINIMA_VITAL_INSERTAR(double REMUNERACION_MINIMA_VITAL, DateTime FECHA_INICIO, int USUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.REMUNERACION_MINIMA_VITAL_INSERTAR(Convert.ToDecimal(REMUNERACION_MINIMA_VITAL), USUARIO_CREACION, FECHA_INICIO);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERYDataTable REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERY_ESTADODataTable REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.REMUNERACION_MINIMA_VITAL_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool REMUNERACION_MINIMA_VITAL_MODIFICAR(int IDREMUNERACION_MINIMA_VITAL, double REMUNERACION_MINIMA_VITAL, DateTime FECHA_INICIO, int USUARIO_MODIFICACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.REMUNERACION_MINIMA_VITAL_MODIFICAR(IDREMUNERACION_MINIMA_VITAL, Convert.ToDecimal(REMUNERACION_MINIMA_VITAL), USUARIO_MODIFICACION, FECHA_INICIO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool REMUNERACION_MINIMA_VITAL_ELIMINAR(int IDREMUNERACION_MINIMA_VITAL, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.REMUNERACION_MINIMA_VITAL_ELIMINAR(IDREMUNERACION_MINIMA_VITAL, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool REMUNERACION_MINIMA_VITAL_MODIFICAR_ESTADO(int IDREMUNERACION_MINIMA_VITAL, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.REMUNERACION_MINIMA_VITAL_MODIFICAR_ESTADO(IDREMUNERACION_MINIMA_VITAL, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Administradora de Pensiones
        public static bool ADMINISTRADORAS_PENSIONES_INSERTAR(string ADMINISTRADORA_PENSION, string CODIGO, int USUARIO_CREACION, int IDSISTEMA_PENSION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ADMINISTRADORAS_PENSIONES_INSERTAR(ADMINISTRADORA_PENSION, CODIGO, USUARIO_CREACION, IDSISTEMA_PENSION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERYDataTable ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERY_ESTADODataTable ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.ADMINISTRADORAS_PENSIONES_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool ADMINISTRADORAS_PENSIONES_MODIFICAR(int IDADMINISTRADORA_PENSION, string ADMINISTRADORA_PENSION, string CODIGO, int USUARIO_MODIFICACION, int IDSISTEMA_PENSION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ADMINISTRADORAS_PENSIONES_MODIFICAR(IDADMINISTRADORA_PENSION, ADMINISTRADORA_PENSION, CODIGO, USUARIO_MODIFICACION, IDSISTEMA_PENSION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool ADMINISTRADORAS_PENSIONES_ELIMINAR(int IDADMINISTRADORA_PENSION, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ADMINISTRADORAS_PENSIONES_ELIMINAR(IDADMINISTRADORA_PENSION, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool ADMINISTRADORAS_PENSIONES_MODIFICAR_ESTADO(int IDADMINISTRADORA_PENSION, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.ADMINISTRADORAS_PENSIONES_MODIFICAR_ESTADO(IDADMINISTRADORA_PENSION, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Configuracion Administradora de Pensiones
        public static bool CONFIGURACIONES_ADMINISTRADORA_PENSIONES_INSERTAR(int IDADMINISTRADORA_PENSION, double? APORTE_OBLIGATORIO,
                double? COMISION_FLUJO, double? COMISION_MIXTA, double? PRIMA_SEGURO, double? COMISION_SOBRE_SALDO, int ES_CONSTANTE, double? PORCENTAJE_CONTANTE, string CODIGO,
                int USUARIO_CREACION, SqlConnection conn)
        {
            decimal? control = null;
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_INSERTAR(IDADMINISTRADORA_PENSION,
                APORTE_OBLIGATORIO.HasValue ? Convert.ToDecimal(APORTE_OBLIGATORIO) : control,
               COMISION_FLUJO.HasValue ? Convert.ToDecimal(COMISION_FLUJO) : control,
               COMISION_MIXTA.HasValue ? Convert.ToDecimal(COMISION_MIXTA) : control,
               PRIMA_SEGURO.HasValue ? Convert.ToDecimal(PRIMA_SEGURO) : control,
               COMISION_SOBRE_SALDO.HasValue ? Convert.ToDecimal(COMISION_SOBRE_SALDO) : control,
               ES_CONSTANTE,
               PORCENTAJE_CONTANTE.HasValue ? Convert.ToDecimal(PORCENTAJE_CONTANTE) : control,
               CODIGO, USUARIO_CREACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERYDataTable CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERY_ESTADODataTable CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool CONFIGURACIONES_ADMINISTRADORA_PENSIONES_MODIFICAR(int IDCONFIGURACION_ADMINISTRADORA_PENSIONES, int IDADMINISTRADORA_PENSION, double? APORTE_OBLIGATORIO,
                double? COMISION_FLUJO, double? COMISION_MIXTA, double? PRIMA_SEGURO, double? COMISION_SOBRE_SALDO, int ES_CONSTANTE, double? PORCENTAJE_CONTANTE, string CODIGO,
                int USUARIO_MODIFICACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            decimal? control = null;
            int op = tableAdapter.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_MODIFICAR(IDCONFIGURACION_ADMINISTRADORA_PENSIONES, 
               IDADMINISTRADORA_PENSION,
               APORTE_OBLIGATORIO.HasValue ? Convert.ToDecimal(APORTE_OBLIGATORIO) : control,
               COMISION_FLUJO.HasValue ? Convert.ToDecimal(COMISION_FLUJO) : control,
               COMISION_MIXTA.HasValue ? Convert.ToDecimal(COMISION_MIXTA) : control,
               PRIMA_SEGURO.HasValue ? Convert.ToDecimal(PRIMA_SEGURO) : control,
               COMISION_SOBRE_SALDO.HasValue ? Convert.ToDecimal(COMISION_SOBRE_SALDO) : control,
               ES_CONSTANTE,
               PORCENTAJE_CONTANTE.HasValue ? Convert.ToDecimal(PORCENTAJE_CONTANTE) : control,
               CODIGO, USUARIO_MODIFICACION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool CONFIGURACIONES_ADMINISTRADORA_PENSIONES_ELIMINAR(int IDCONFIGURACION_ADMINISTRADORA_PENSIONES, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_ELIMINAR(IDCONFIGURACION_ADMINISTRADORA_PENSIONES, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool CONFIGURACIONES_ADMINISTRADORA_PENSIONES_MODIFICAR_ESTADO(int IDCONFIGURACION_ADMINISTRADORA_PENSIONES, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONFIGURACIONES_ADMINISTRADORA_PENSIONES_MODIFICAR_ESTADO(IDCONFIGURACION_ADMINISTRADORA_PENSIONES, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Configuracion Usuario Planilla
        public static bool CONFIGURACION_USUARIO_PLANILLA_INSERTAR(int IDTRABAJADOR, int CARGA_FAMILIAR, int? CANTIDAD_HIJOS, int IDCONFIGURACION_ADMINISTRADORA_PENSIONES,
                string TIPO_COMISION, int USUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONFIGURACION_USUARIO_PLANILLA_INSERTAR(IDTRABAJADOR, CARGA_FAMILIAR, CANTIDAD_HIJOS, IDCONFIGURACION_ADMINISTRADORA_PENSIONES,
                USUARIO_CREACION, TIPO_COMISION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERYDataTable CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERY_ESTADODataTable CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CONFIGURACION_USUARIO_PLANILLA_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool CONFIGURACION_USUARIO_PLANILLA_MODIFICAR(int IDCONFIGURACION_USUARIO_PLANILLA, int IDTRABAJADOR, int CARGA_FAMILIAR, int? CANTIDAD_HIJOS, int IDCONFIGURACION_ADMINISTRADORA_PENSIONES,
                int USUARIO_MODIFICACION, string TIPO_COMISION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONFIGURACION_USUARIO_PLANILLA_MODIFICAR(IDCONFIGURACION_USUARIO_PLANILLA, IDTRABAJADOR, CARGA_FAMILIAR, CANTIDAD_HIJOS, IDCONFIGURACION_ADMINISTRADORA_PENSIONES,
                USUARIO_MODIFICACION, TIPO_COMISION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool CONFIGURACION_USUARIO_PLANILLA_ELIMINAR(int IDCONFIGURACION_USUARIO_PLANILLA, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONFIGURACION_USUARIO_PLANILLA_ELIMINAR(IDCONFIGURACION_USUARIO_PLANILLA, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool CONFIGURACION_USUARIO_PLANILLA_MODIFICAR_ESTADO(int IDCONFIGURACION_USUARIO_PLANILLA, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CONFIGURACION_USUARIO_PLANILLA_MODIFICAR_ESTADO(IDCONFIGURACION_USUARIO_PLANILLA, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Categoria
        public static bool CATEGORIA_INSERTAR(string ICON, string NOMBRE_MOSTRAR, int USUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CATEGORIA_INSERTAR(ICON, NOMBRE_MOSTRAR, USUARIO_CREACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.CATEGORIA_BUSCAR_POR_QUERYDataTable CATEGORIA_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.CATEGORIA_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.CATEGORIA_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.CATEGORIA_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CATEGORIA_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.CATEGORIA_BUSCAR_POR_QUERY_ESTADODataTable CATEGORIA_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.CATEGORIA_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.CATEGORIA_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.CATEGORIA_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.CATEGORIA_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool CATEGORIA_MODIFICAR(int IDCATEGORIA, string ICON, string NOMBRE_MOSTRAR, int USUARIO_MODIFICACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CATEGORIA_MODIFICAR(IDCATEGORIA, ICON, NOMBRE_MOSTRAR, USUARIO_MODIFICACION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool CATEGORIA_ELIMINAR(int IDCATEGORIA, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CATEGORIA_ELIMINAR(IDCATEGORIA, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool CATEGORIA_MODIFICAR_ESTADO(int IDCATEGORIA, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.CATEGORIA_MODIFICAR_ESTADO(IDCATEGORIA, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Formulario
        public static bool FORMULARIO_INSERTAR(string DESCRIPCION, string LINK, string NOMBRE_MOSTRAR, int IDCATEGORIA, int USUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.FORMULARIO_INSERTAR(LINK, NOMBRE_MOSTRAR, DESCRIPCION, USUARIO_CREACION, IDCATEGORIA);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.FORMULARIO_BUSCAR_POR_QUERYDataTable FORMULARIO_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.FORMULARIO_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.FORMULARIO_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.FORMULARIO_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.FORMULARIO_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.FORMULARIO_BUSCAR_POR_QUERY_ESTADODataTable FORMULARIO_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.FORMULARIO_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.FORMULARIO_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.FORMULARIO_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.FORMULARIO_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool FORMULARIO_MODIFICAR(int IDFORMULARIO, string LINK, string NOMBRE_MOSTRAR, string DESCRIPCION, int USUARIO_MODIFICACION, int IDCATEGORIA, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.FORMULARIO_MODIFICAR(IDFORMULARIO, LINK, NOMBRE_MOSTRAR, DESCRIPCION, USUARIO_MODIFICACION, IDCATEGORIA);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool FORMULARIO_ELIMINAR(int IDFORMULARIO, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.FORMULARIO_ELIMINAR(IDFORMULARIO, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool FORMULARIO_MODIFICAR_ESTADO(int IDFORMULARIO, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.FORMULARIO_MODIFICAR_ESTADO(IDFORMULARIO, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Registro Rol
        public static bool REGISTRO_ROL_INSERTAR(int IDFORMULARIO, int IDROL, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.REGISTRO_ROL_INSERTAR(IDFORMULARIO, IDROL);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static bool REGISTRO_ROL_ELIMINAR(int IDREGISTRO_ROL, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.REGISTRO_ROL_ELIMINAR(IDREGISTRO_ROL);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static bool REGISTRO_ROL_ELIMINAR_IDROL(int IDROL, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.REGISTRO_ROL_ELIMINAR_IDROL(IDROL);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Tipo de pago
        public static bool TIPO_PAGO_INSERTAR(string TIPO_PAGO, string CODIGO, int USUARIO_CREACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_PAGO_INSERTAR(TIPO_PAGO, CODIGO, USUARIO_CREACION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.TIPO_PAGO_BUSCAR_POR_QUERYDataTable TIPO_PAGO_BUSCAR_POR_QUERY(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.TIPO_PAGO_BUSCAR_POR_QUERYDataTable dataTable = new dsProcedimientos.TIPO_PAGO_BUSCAR_POR_QUERYDataTable();
            dsProcedimientosTableAdapters.TIPO_PAGO_BUSCAR_POR_QUERYTableAdapter tableAdapter = new dsProcedimientosTableAdapters.TIPO_PAGO_BUSCAR_POR_QUERYTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsProcedimientos.TIPO_PAGO_BUSCAR_POR_QUERY_ESTADODataTable TIPO_PAGO_BUSCAR_POR_QUERY_ESTADO(string query, ref int registros, int index, int cantidad_registros, SqlConnection conn)
        {
            dsProcedimientos.TIPO_PAGO_BUSCAR_POR_QUERY_ESTADODataTable dataTable = new dsProcedimientos.TIPO_PAGO_BUSCAR_POR_QUERY_ESTADODataTable();
            dsProcedimientosTableAdapters.TIPO_PAGO_BUSCAR_POR_QUERY_ESTADOTableAdapter tableAdapter = new dsProcedimientosTableAdapters.TIPO_PAGO_BUSCAR_POR_QUERY_ESTADOTableAdapter();
            tableAdapter.Connection = conn;
            int? re_registros = 0;
            dataTable = tableAdapter.GetData(query, index, cantidad_registros, ref re_registros);
            registros = re_registros.HasValue ? re_registros.Value : 0;
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool TIPO_PAGO_MODIFICAR(int IDTIPO_PAGO, string TIPO_PAGO, string CODIGO, int USUARIO_MODIFICACION, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_PAGO_MODIFICAR(IDTIPO_PAGO, TIPO_PAGO, CODIGO, USUARIO_MODIFICACION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool TIPO_PAGO_ELIMINAR(int IDTIPO_PAGO, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_PAGO_ELIMINAR(IDTIPO_PAGO, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool TIPO_PAGO_MODIFICAR_ESTADO(int IDTIPO_PAGO, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.TIPO_PAGO_MODIFICAR_ESTADO(IDTIPO_PAGO, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Pago Ventas
        public static bool PAGO_VENTAS_INSERTAR(DateTime FECHA_PAGO, double MONTO_PAGO, int IDTIPO_PAGO, string CODIGO_REFERENCIA,
                int? IDCUENTA_CORRIENTE, int IDMONEDA, int VERIFICADA, int IDVENTAS_CABECERA, int USUARIO_CREACION, string DESCRIPCION, 
                SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.PAGO_VENTAS_INSERTAR(FECHA_PAGO, Convert.ToDecimal(MONTO_PAGO), IDTIPO_PAGO, CODIGO_REFERENCIA, 
                IDCUENTA_CORRIENTE, IDMONEDA, VERIFICADA, IDVENTAS_CABECERA, USUARIO_CREACION, DESCRIPCION);
            if (op != 0)
                return true;
            else
                return false;
        }
        public static dsProcedimientos.PAGO_VENTAS_BUSCAR_POR_IDVENTASDataTable PAGO_VENTAS_BUSCAR_POR_IDVENTAS(int IDVENTAS_CABECERA, SqlConnection conn)
        {
            dsProcedimientos.PAGO_VENTAS_BUSCAR_POR_IDVENTASDataTable dataTable = new dsProcedimientos.PAGO_VENTAS_BUSCAR_POR_IDVENTASDataTable();
            dsProcedimientosTableAdapters.PAGO_VENTAS_BUSCAR_POR_IDVENTASTableAdapter tableAdapter = new dsProcedimientosTableAdapters.PAGO_VENTAS_BUSCAR_POR_IDVENTASTableAdapter();
            tableAdapter.Connection = conn;
            dataTable = tableAdapter.GetData(IDVENTAS_CABECERA);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static bool PAGO_VENTAS_MODIFICAR(int IDPAGO_VENTAS, DateTime FECHA_PAGO, double MONTO_PAGO, int IDTIPO_PAGO, string CODIGO_REFERENCIA,
                int? IDCUENTA_CORRIENTE, int IDMONEDA, int VERIFICADA, int IDVENTAS_CABECERA, int USUARIO_MODIFICACION, string DESCRIPCION,
                SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.PAGO_VENTAS_MODIFICAR(IDPAGO_VENTAS, FECHA_PAGO, Convert.ToDecimal(MONTO_PAGO), IDTIPO_PAGO, CODIGO_REFERENCIA, 
                IDCUENTA_CORRIENTE, IDMONEDA, VERIFICADA, IDVENTAS_CABECERA, USUARIO_MODIFICACION, DESCRIPCION);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool PAGO_VENTAS_ELIMINAR(int IDPAGO_VENTAS, int USUARIO_BORRADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.PAGO_VENTAS_ELIMINAR(IDPAGO_VENTAS, USUARIO_BORRADO);
            if (op != 0)
                return true;
            else
                return false;
        }

        public static bool PAGO_VENTAS_MODIFICAR_ESTADO(int IDPAGO_VENTAS, int ESTADO, SqlConnection conn)
        {
            dsProcedimientosTableAdapters.QueriesTableAdapter tableAdapter = new dsProcedimientosTableAdapters.QueriesTableAdapter();
            GetInstanceQueriesAdapter(ref tableAdapter, conn);
            int op = tableAdapter.PAGO_VENTAS_MODIFICAR_ESTADO(IDPAGO_VENTAS, ESTADO);
            if (op != 0)
                return true;
            else
                return false;
        }
        #endregion
        #region Reporte Pago Venta
        public static dsReportes.REPORTE_PAGO_VENTAS_PENDIENTESDataTable REPORTE_PAGO_VENTAS_PENDIENTES(int IDUSUARIO, string QUERY, string SERIE_FILTRO, string CORRELATIVO, string EMPRESA_FILTRO, string ESTADO_FILTRO, SqlConnection conn)
        {
            dsReportes.REPORTE_PAGO_VENTAS_PENDIENTESDataTable dataTable = new dsReportes.REPORTE_PAGO_VENTAS_PENDIENTESDataTable();
            dsReportesTableAdapters.REPORTE_PAGO_VENTAS_PENDIENTESTableAdapter tableAdapter = new dsReportesTableAdapters.REPORTE_PAGO_VENTAS_PENDIENTESTableAdapter();
            tableAdapter.Connection = conn;
            SqlCommand cmd = new SqlCommand("REPORTE_PAGO_VENTAS_PENDIENTES", conn);
            cmd.Parameters.AddWithValue("@IDUSUARIO", IDUSUARIO);
            cmd.Parameters.AddWithValue("@QUERY", clsUtil.DbNullIfNullOrEmpty(QUERY));
            cmd.Parameters.AddWithValue("@SERIE_FILTRO", clsUtil.DbNullIfNullOrEmpty(SERIE_FILTRO));
            cmd.Parameters.AddWithValue("@CORRELATIVO", clsUtil.DbNullIfNullOrEmpty(CORRELATIVO));
            cmd.Parameters.AddWithValue("@EMPRESA_FILTRO", clsUtil.DbNullIfNullOrEmpty(EMPRESA_FILTRO));
            cmd.Parameters.AddWithValue("@ESTADO_FILTRO", clsUtil.DbNullIfNullOrEmpty(ESTADO_FILTRO));
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dataTable);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }

        public static dsReportes.REPORTE_PAGO_VENTAS_DETALLE_PENDIENTESDataTable REPORTE_PAGO_VENTAS_PENDIENTES_DETALLE(int IDUSUARIO, string QUERY, string SERIE_FILTRO, string CORRELATIVO, string EMPRESA_FILTRO, string ESTADO_FILTRO, SqlConnection conn)
        {
            dsReportes.REPORTE_PAGO_VENTAS_DETALLE_PENDIENTESDataTable dataTable = new dsReportes.REPORTE_PAGO_VENTAS_DETALLE_PENDIENTESDataTable();
            dsReportesTableAdapters.REPORTE_PAGO_VENTAS_DETALLE_PENDIENTESTableAdapter tableAdapter = new dsReportesTableAdapters.REPORTE_PAGO_VENTAS_DETALLE_PENDIENTESTableAdapter();
            tableAdapter.Connection = conn;
            SqlCommand cmd = new SqlCommand("REPORTE_PAGO_VENTAS_DETALLE_PENDIENTES", conn);
            cmd.Parameters.AddWithValue("@IDUSUARIO", IDUSUARIO);
            cmd.Parameters.AddWithValue("@QUERY", clsUtil.DbNullIfNullOrEmpty(QUERY));
            cmd.Parameters.AddWithValue("@SERIE_FILTRO", clsUtil.DbNullIfNullOrEmpty(SERIE_FILTRO));
            cmd.Parameters.AddWithValue("@CORRELATIVO", clsUtil.DbNullIfNullOrEmpty(CORRELATIVO));
            cmd.Parameters.AddWithValue("@EMPRESA_FILTRO", clsUtil.DbNullIfNullOrEmpty(EMPRESA_FILTRO));
            cmd.Parameters.AddWithValue("@ESTADO_FILTRO", clsUtil.DbNullIfNullOrEmpty(ESTADO_FILTRO));
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dataTable);
            if (dataTable.Rows.Count > 0)
                return dataTable;
            else
                return null;
        }
        #endregion
    }
}