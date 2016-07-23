using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using Modelo.clientes;

namespace wbERPGBL.Hubs
{
    public class HubConexiones : Hub
    {
        public void Hello()
        {
            Clients.All.hello();
        }

        public override Task OnConnected()
        {
            clsClientes objCliente = new clsClientes();
            objCliente.ClientID = Context.ConnectionId;
            objCliente.Init_conection = DateTime.Now;
            UserHandler.ConnectedIds.Add(objCliente);
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            deleteByID(Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }

        void deleteByID(string ID)
        {
            foreach (clsClientes item in UserHandler.ConnectedIds)
                if (item.ClientID == ID)
                    UserHandler.ConnectedIds.Remove(item);
        }
    }

    public static class UserHandler
    {
        public static HashSet<clsClientes> ConnectedIds = new HashSet<clsClientes>();
    }
}

