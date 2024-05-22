using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TCC.API.Context;
using TCC.API.Models;
using TCC.API.Models.Responses;

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

        public async Task JoinGroup(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"room-{roomId}");

            await Clients.Group($"room-{roomId}").SendAsync("JoinGroup", "admin", "Conectado ao grupo");
        }

        public async Task JoinPlayerInRoom(string roomId, string playerId)
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
            foreach (Player p in playersInRoom)
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
            PlayerResponse userPlayer = new PlayerResponse(player.Id, player.Name, player.Ready);
            await Clients.GroupExcept($"room-{roomId}", Context.ConnectionId).SendAsync("NewPlayerConnected", userPlayer);
            await ChatMessage(roomId, $"Jogador {userPlayer.Name} acabou de se conectar");
        }

        public async Task UpdatePlayerInRoom(string roomId, string playerId, bool playerReady)
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

            Room room = await _context.Rooms.Include(x => x.Players).FirstOrDefaultAsync(x => x.Id == roomId);

            if (room == null || room.Players.Count() <= 1)
            {
                return;
            }

            bool allPlayersReady = true;
            foreach (Player playerInRoom in room.Players)
            {
                if (!playerInRoom.Ready)
                {
                    allPlayersReady = false;
                    break;
                }
            }

            if (allPlayersReady)
            {
                await ChatMessage(roomId, "Todos os jogadores estão prontos. O jogo começará em...");

                room.Started = true;

                await _context.SaveChangesAsync();

                await Clients.Group($"room-{roomId}").SendAsync("StartGame", roomId);
                
            }
        }

        public async Task ChatMessage(string roomId, string msg)
        {
            await Clients.Group($"room-{roomId}").SendAsync("Chat", msg);
        }

        public async Task CloseConection(string roomId, string playerId)
        {
            Player player = await _context.Players.FirstOrDefaultAsync(x => x.Id == playerId);
            if (player == null)
            {
                await Clients.Caller.SendAsync("Error", "Player não encontrado.");
                return;
            }

            Room room = await _context.Rooms.Include(x => x.Players).FirstOrDefaultAsync(x => x.Id == roomId);
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
