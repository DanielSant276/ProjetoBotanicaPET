using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using TCC.API.Context;
using TCC.API.Models;
using TCC.API.Response;

namespace TCC.API.Controllers.SignalR
{
    public class RoomHub : Hub
    {
        private readonly AppDbContext _context;

        public RoomHub(AppDbContext context)
        {
            _context = context;
        }

        public async Task SendReadyStatus(bool isReady)
        {
            await Clients.Caller.SendAsync("ReceiveReadyStatus", isReady);
        }

        public async Task JoinGroup(long roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"room-{roomId}");

            await Clients.Group($"room-{roomId}").SendAsync("JoinGroup", "admin", "Conectado ao grupo");
        }

        public async Task JoinPlayerInRoom(int roomId, string playerId)
        {
            Room room = await _context.Rooms.FindAsync(roomId);
            if (room == null)
            {
                await Clients.Caller.SendAsync("Error", "Sala não encontrada.");
                return;
            }

            Player player = await _context.Players.FirstOrDefaultAsync(x => x.Id == playerId);
            if (player == null)
            {
                await Clients.Caller.SendAsync("Error", "Player não encontrado.");
                return;
            }

            IList<Player> playersInRoom = await _context.Players.Where(p => p.RoomId == roomId).ToListAsync();
            IList<PlayerResponse> allPlayers = new List<PlayerResponse>();
            foreach(Player p in playersInRoom) 
            {
                PlayerResponse playerResponse = new PlayerResponse(p.Id, p.Name, p.Ready);
                allPlayers.Add(playerResponse);
            }

            // Envia a lista de jogadores na sala para o jogador recém-conectado
            await Clients.Caller.SendAsync("GetPlayersInRoom", allPlayers);
            // Envia mensagem do chat para o jogador recem conectado
            await Clients.Caller.SendAsync("Chat", $"Bem vindo a sala {room.Name}...");

            if (!room.Players.Any(p => p.Id == playerId))
            {
                // Se o jogador não estiver na sala, adiciona-o
                player.Ready = false;
                room.Players.Add(player);
                await _context.SaveChangesAsync();
            }
            else
            {
                // Se o jogador já estiver na sala, envie uma mensagem informando-o
                await Clients.Caller.SendAsync("Error", "Você já está na sala.");
            }

            // Envia as informações do jogador recém-conectado para todos os outros jogadores na sala
            PlayerResponse userPlayer =  new PlayerResponse(player.Id, player.Name, player.Ready);
            await Clients.GroupExcept($"room-{roomId}", Context.ConnectionId).SendAsync("NewPlayerConnected", userPlayer);
            await ChatMessage(roomId, $"Jogador {userPlayer.Name} acabou de se conectar");
        }

        public async Task UpdatePlayerInRoom(int roomId, string playerId, bool playerReady)
        {
            Player player = await _context.Players.FirstOrDefaultAsync(x => x.Id == playerId);
            if (player == null)
            {
                await Clients.Caller.SendAsync("Error", "Player não encontrado.");
                return;
            }

            player.Ready = playerReady;
            await _context.SaveChangesAsync();

            // Envia as informações do jogador recém-conectado para todos os outros jogadores na sala
            await Clients.GroupExcept($"room-{roomId}", Context.ConnectionId).SendAsync("GetPlayerUpdate", player);
        }

        public async Task ChatMessage(int roomId, string msg)
        {
            await Clients.GroupExcept($"room-{roomId}", Context.ConnectionId).SendAsync("Chat", msg);
        }

        public async Task CloseCoonection(int roomId, string playerId)
        {
            Player player = await _context.Players.FirstOrDefaultAsync(x => x.Id == playerId);
            if (player == null)
            {
                await Clients.Caller.SendAsync("Error", "Player não encontrado.");
                return;
            }

            Room room = await _context.Rooms.FindAsync(roomId);
            if (room == null)
            {
                await Clients.Caller.SendAsync("Error", "Sala não encontrada.");
                return;
            }

            bool playerInRoom = room.Players.Any(p => p.Id == playerId);
            if (!playerInRoom)
            {
                await Clients.Caller.SendAsync("Error", "O jogador não está na sala.");
                return;
            }

            // Remove o jogador da sala
            room.Players.Remove(player);
            await _context.SaveChangesAsync();

            // Remove o jogador do grupo
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"room-{roomId}");
            
            if (room.Players.Count > 0)
            {
                // Avisa que o jogador saiu do grupo
                await Clients.GroupExcept($"room-{roomId}", Context.ConnectionId).SendAsync("RemovePlayer", player);
                // Envia a mensagem de que o jogador saiu
                await ChatMessage(roomId, $"O usuário {player.Name} saiu da sala");
            }
            else
            {
                _context.Rooms.Remove(room);
                await _context.SaveChangesAsync();
            }
        }
    }
}
