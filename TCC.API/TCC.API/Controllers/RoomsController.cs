using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TCC.API.Context;
using TCC.API.DTO;
using TCC.API.Models;

namespace TCC.API.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: Rooms
        // Recebe todas as salas
        [HttpGet]
        public async Task<ActionResult<IList<RoomViewModel>>> GetRooms()
        {
            IList<Room> rooms = await _context.Rooms.ToListAsync();

            if (_context.Rooms == null)
            {
                return NotFound();
            }

            IList<RoomViewModel> roomsView = new List<RoomViewModel>();

            foreach (Room room in rooms)
            {
                RoomViewModel roomView = new RoomViewModel(room.Id, room.Name, room.Started, room.Players.Count());
                roomsView.Add(roomView);
            }

            return Ok(roomsView);
        }

        //// Post: Rooms/5
        //// Inicia uma sala
        //[HttpPost("{id}")]
        //public async Task<ActionResult<Room>> StartRoom(int id, string playerId)
        //{
        //    Room room = await _context.Rooms.FindAsync(id);

        //    if (room == null)
        //    {
        //        return NotFound();
        //    }

        //    room.Started = true;

        //    Player player = await _context.Players.FirstOrDefaultAsync(x => x.Id == playerId);

        //    if (player == null)
        //    {
        //        player = new Player(playerId);
        //        _context.Players.Add(player);
        //    }

        //    room.Player.Add(player);

        //    _context.Rooms.Add(room);
        //    await _context.SaveChangesAsync();

        //    return Ok();
        //}

        //// Post: Rooms/5
        //// Atualiza os jogadores da sala
        //[HttpPost("{id}")]
        //public async Task<ActionResult<Room>> UpdateRoom(int id, IList<string> playersId)
        //{
        //    Room room = await _context.Rooms.FindAsync(id);

        //    if (room == null)
        //    {
        //        return NotFound();
        //    }

        //    room.Player = new List<Player>();

        //    foreach (string playerId in playersId)
        //    {
        //        Player player = await _context.Players.FirstOrDefaultAsync(x => x.Id == playerId);

        //        if (player == null)
        //        {
        //            player = new Player(playerId);
        //            _context.Players.Add(player);
        //        }

        //        room.Player.Add(player);
        //    }

        //    _context.Rooms.Add(room);
        //    await _context.SaveChangesAsync();

        //    return Ok();
        //}
    }
}
