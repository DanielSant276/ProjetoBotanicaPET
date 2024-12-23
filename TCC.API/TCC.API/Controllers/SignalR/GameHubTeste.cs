﻿using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Numerics;
using System.Timers;
using TCC.API.Context;
using TCC.API.Models;
using TCC.API.Models.Responses;
using Timer = System.Timers.Timer;

namespace TCC.API.Controllers.SignalR
{
    public class GameHubTeste : Hub
    {
        //private readonly AppDbContext _context;
        //private readonly GameStorage _storage;
        //private static Timer _timer;
        //private static int _currentNumberIndex;
        //private static List<int> _numbers;

        //public GameHubTeste(AppDbContext context, GameStorage gameStorage)
        //{
        //    _context = context;
        //    _storage = gameStorage;

        //    _currentNumberIndex = 0;
        //    _numbers = new List<int>(); // Lista de números sorteados
        //    _timer = new Timer(5000); // 5 segundos
        //    _timer.Elapsed += OnTimerElapsed;
        //    _timer.AutoReset = true;
        //}

        //// Método para iniciar o timer e enviar números aos jogadores
        //public void StartNumberTimer(string roomId)
        //{
        //    _numbers = _storage.GetNumbersForRoom(roomId); // Obtém os números da sala
        //    _timer.Start();
        //}

        //// Método para parar o timer
        //public void StopNumberTimer()
        //{
        //    _timer.Stop();
        //}

        //// Método chamado a cada intervalo do timer
        //private void OnTimerElapsed(object sender, ElapsedEventArgs e)
        //{
        //    if (_currentNumberIndex >= _numbers.Count)
        //    {
        //        StopNumberTimer();
        //        return;
        //    }

        //    int currentNumber = _numbers[_currentNumberIndex];
        //    _currentNumberIndex++;

        //    Clients.All.SendAsync("ReceiveNumber", currentNumber); // Envia o número a todos os jogadores
        //}

        //// Método para chamar Bingo
        //public async Task CallBingo(string roomId, string playerId)
        //{
        //    Player player = await _context.Players.FindAsync(playerId);
        //    _storage.ClearRoomData(roomId);

        //    StopNumberTimer(); // Para o timer ao finalizar o jogo

        //    await Clients.GroupExcept($"game-{roomId}", Context.ConnectionId).SendAsync("CallBingo", player.Name);
        //}

        //// Limpeza de recursos ao desconectar todos os jogadores
        //public async Task HandlePlayerDisconnection(string roomId, string playerId)
        //{
        //    var room = await _context.Rooms.Include(r => r.Players).FirstOrDefaultAsync(r => r.Id == roomId);

        //    if (room != null)
        //    {
        //        var player = room.Players.FirstOrDefault(p => p.Id == playerId);
        //        if (player != null)
        //        {
        //            room.Players.Remove(player);
        //            await _context.SaveChangesAsync();
        //        }

        //        if (room.Players.Count == 0)
        //        {
        //            _storage.ClearRoomData(roomId);

        //            _context.Rooms.Remove(room);
        //            await _context.SaveChangesAsync();
        //        }
        //    }
        //}









        //public async Task JoinGroup(string roomId, int maxNumber)
        //{
        //    // Adiciona o jogador ao grupo correspondente à sala de jogo.
        //    await Groups.AddToGroupAsync(Context.ConnectionId, $"game-{roomId}");

        //    await Clients.Group($"game-{roomId}").SendAsync("JoinGroup", "admin", "Conectado ao grupo");

        //    // Verifica se a sala já iniciou o sorteio de números.
        //    if (!_storage.CheckAlreadyStartedRoom(roomId))
        //    {
        //        _storage.SetStartedRoom(roomId);
        //        IList<int> numbers = await StartNumberGeneration(roomId, maxNumber);
        //        _storage.SetNumbers(roomId, numbers);
        //    }
        //}

        //private async Task<IList<int>> StartNumberGeneration(string roomId, int maxNumber)
        //{
        //    var numbers = new List<int>();
        //    // Gera uma lista de números aleatórios únicos até o valor máximo especificado.
        //    for (var i = 0; i < maxNumber; i++)
        //    {
        //        Random random = new Random();
        //        int randomNumber;
        //        do
        //        {
        //            randomNumber = random.Next(maxNumber);
        //        } while (numbers.Contains(randomNumber));

        //        numbers.Add(randomNumber);
        //    }

        //    return numbers;
        //}

        //public async Task GetNumber(string roomId, int indexNumberSorted)
        //{
        //    // Obtém o número atual
        //    int number = _storage.GetNumber(roomId, indexNumberSorted);

        //    await Clients.Caller.SendAsync("ReceivedNumber", number);
        //}

        //public async Task GenerateBoardNumbers(string playerId, int maxNumber)
        //{
        //    // gera os números dos tabuleiros do jogador
        //    Player player = await _context.Players.FindAsync(playerId);

        //    if (player == null)
        //    {
        //        return;
        //    }

        //    Board board = await _context.Boards.FirstOrDefaultAsync(x => x.PlayerId == playerId);

        //    if (board == null)
        //    {
        //        board = new Board(playerId);
        //        board.Id = Guid.NewGuid().ToString();
        //        _context.Boards.Add(board);
        //    }

        //    var generatedNumbers = new List<int>();
        //    Random random = new Random();

        //    while (generatedNumbers.Count < 6)
        //    {
        //        int numeroAleatorio = random.Next(maxNumber);

        //        if (!generatedNumbers.Contains(numeroAleatorio))
        //        {
        //            generatedNumbers.Add(numeroAleatorio);
        //        }
        //    }

        //    board.Points = 0;
        //    board.DrawnNumbers = string.Join(",", generatedNumbers);

        //    await _context.SaveChangesAsync();

        //    // envia para o jogador os números que foram sorteados para ele
        //    await Clients.Caller.SendAsync("ReceivedBoard", board.DrawnNumbers);
        //}

        //public async Task GetRanking(string roomId)
        //{
        //    Room room = await _context.Rooms.Include(x => x.Players).FirstOrDefaultAsync(x => x.Id == roomId);

        //    IList<PlayerPointsResponse> points = new List<PlayerPointsResponse>();

        //    foreach (Player player in room.Players)
        //    {
        //        Board board = await _context.Boards.FirstOrDefaultAsync(x => x.PlayerId == player.Id);
        //        if (board != null)
        //        {
        //            PlayerPointsResponse point = new PlayerPointsResponse(player.Name, player.Id, board.Points);
        //            points.Add(point);
        //        }
        //    }

        //    await Clients.Caller.SendAsync("ReceivedRanking", points);
        //}

        //public async Task GainPoint(string roomId, string playerId)
        //{
        //    // adiciona mais 100 pontos a pontuação do jogador
        //    Board board = await _context.Boards.Include(x => x.Player).FirstOrDefaultAsync(x => x.PlayerId == playerId);

        //    if (board == null)
        //    {
        //        return;
        //    }

        //    board.Points += 100;

        //    await _context.SaveChangesAsync();

        //    PlayerPointsResponse player = new PlayerPointsResponse(board.Player.Name, playerId, board.Points);

        //    await Clients.GroupExcept($"game-{roomId}", Context.ConnectionId).SendAsync("UpdateRanking", player);
        //}

        //public async Task CallBingo(string roomId, string playerId)
        //{
        //    Player player = await _context.Players.FindAsync(playerId);

        //    _storage.ClearRoomData(roomId);

        //    var room = await _context.Rooms.FindAsync(roomId);
        //    if (room != null)
        //    {
        //        _context.Rooms.Remove(room);
        //        await _context.SaveChangesAsync();
        //    }

        //    // Notifica todos os membros do grupo, exceto o solicitante, que o jogador chamou "Bingo".
        //    await Clients.GroupExcept($"game-{roomId}", Context.ConnectionId).SendAsync("CallBingo", player.Name);
        //}
    }
}
