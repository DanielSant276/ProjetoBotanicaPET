using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using TCC.API.Context;
using TCC.API.Models;
using TCC.API.Models.Responses;

namespace TCC.API.Controllers.SignalR
{
    public class GameHub : Hub
    {
        private readonly AppDbContext _context;
        private readonly GameStorage _storage;

        public GameHub(AppDbContext context, GameStorage gameStorage)
        {
            _context = context;
            _storage = gameStorage;
        }

        public async Task JoinGroup(string roomId, int maxNumber)
        {
            // Da Join no grupo e inicia o sorteio dos números
            await Groups.AddToGroupAsync(Context.ConnectionId, $"game-{roomId}");

            await Clients.Group($"game-{roomId}").SendAsync("JoinGroup", "admin", "Conectado ao grupo");

            // Verifica se já iniciou a criação dos números e gera todos eles de uma vez
            if (!_storage.CheckAlreadyStartedRoom(roomId))
            {
                _storage.SetStartedRoom(roomId);
                IList<int> numbers = await StartNumberGeneration(roomId, maxNumber);
                _storage.SetNumbers(roomId, numbers);
            }
        }

        private async Task<IList<int>> StartNumberGeneration(string roomId, int maxNumber)
        {
            var numbers = new List<int>();
            // faz o sorteio de todos os números da lista
            for (var i = 0; i < maxNumber; i++)
            {
                int number = await GenerateNumbers(roomId, maxNumber);
                numbers.Add(number);
            }

            return numbers;
        }

        private async Task<int> GenerateNumbers(string roomId, int maxNumber)
        {
            // lógica para a geração de número que já não tenham sido sorteados
            Random random = new Random();
            var numbers = _storage.GetNumbers(roomId);

            int randomNumber;
            do
            {
                randomNumber = random.Next(maxNumber);
            } while (numbers.Contains(randomNumber));

            return randomNumber;
        }

        public async Task GetNumber(string roomId, int indexNumberSorted)
        {
            // fazer um ajuste para verificar se o index atual é maior por um ou igual do que o index registrado se for ok, se não for,
            // enviar todos os números que já foram sorteados para o jogador e ajustar o index dele para o index atual + 1

            _storage.SetRoomDrawIndex(roomId, indexNumberSorted);

            int number = _storage.GetNumber(roomId, indexNumberSorted);

            await Clients.Group($"game-{roomId}").SendAsync("ReceivedNumber", number);
        }

        public async Task GenerateBoardNumbers(string roomId, string playerToken, int maxNumber)
        {
            // gera os números dos tabuleiros do jogador
            Player player = await _context.Players.FindAsync(playerToken);

            if (player == null)
            {
                return;
            }

            Board board = await _context.Boards.FirstOrDefaultAsync(x => x.PlayerId == playerToken);

            if (board == null)
            {
                board = new Board(playerToken);
                board.Id = Guid.NewGuid().ToString();
                board.PlayerId = playerToken;
                _context.Boards.Add(board);
            }

            var generatedNumbers = new List<int>();
            Random random = new Random();

            while (generatedNumbers.Count < 6)
            {
                int numeroAleatorio = random.Next(maxNumber);

                if (!generatedNumbers.Contains(numeroAleatorio))
                {
                    generatedNumbers.Add(numeroAleatorio);
                }
            }

            board.Points = 0;
            board.DrawnNumbers = string.Join(",", generatedNumbers);

            await _context.SaveChangesAsync();

            //GeneratedNumbersResponse generatedNumbersResponse = new GeneratedNumbersResponse(board.DrawnNumbers, board.Id);

            // envia para o jogador os números que foram sorteados para ele
            await Clients.Caller.SendAsync("ReceivedBoard", board.DrawnNumbers);
        }

        public async Task GetRanking(string roomId)
        {
            Room room = await _context.Rooms.Include(x => x.Players).FirstOrDefaultAsync(x => x.Id == roomId);

            IList<PlayerPointsResponse> points = new List<PlayerPointsResponse>();

            foreach (Player player in room.Players)
            {
                Board board = await _context.Boards.FirstOrDefaultAsync(x => x.PlayerId == player.Id);
                if (board != null)
                {
                    PlayerPointsResponse point = new PlayerPointsResponse(player.Name, player.Id, board.Points);
                    points.Add(point);
                }
            }

            await Clients.Caller.SendAsync("ReceivedRanking", points);
        }

        //public async Task GetPoint(string roomId, string playerId, string boardId)
        //{
        //    // adiciona mais 100 pontos a pontuação do jogador
        //    Board board = await _context.Boards.FirstOrDefaultAsync(x => x.PlayerId == playerId || x.Id == boardId);

        //    if (board == null)
        //    {
        //        return;
        //    }

        //    board.Points += 100;

        //    await _context.SaveChangesAsync();

        //    PlayerPointsResponse player = new PlayerPointsResponse(playerId, board.Points);

        //    await Clients.GroupExcept($"game-{roomId}", Context.ConnectionId).SendAsync("AdjustPlayersPoints", board.Points);
        //}
    }
}
