using Microsoft.AspNetCore.SignalR;
using TCC.API.Context;

namespace TCC.API.Controllers.SignalR
{
    public class LobbyHub : Hub
    {
        private readonly AppDbContext _context;

        public LobbyHub(AppDbContext context)
        {
            _context = context;
        }

        public async Task JoinGroup(long roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"room-{roomId}");

            await Clients.Group($"lobby").SendAsync("JoinGroup", "admin", "Conectado ao grupo");
        }
    }
}
