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
using TCC.API.Models.Requests;

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
            IList<Room> rooms = await _context.Rooms.Include(room => room.Players).ToListAsync();

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

        [HttpPost]
        public async Task<ActionResult<IList<RoomViewModel>>> CreateRoom([FromBody] CreateRoomRequest createRoomRequest)
        {
            Player player = await _context.Players.FirstOrDefaultAsync(x => x.Id == createRoomRequest.user.Id);

            if (player != null) 
            {
                Room room = new Room();
                room.Id = Guid.NewGuid().ToString();
                room.Name = createRoomRequest.roomName;
                room.Started = false;
                
                try 
                { 
                    _context.Rooms.Add(room);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    return NotFound();
                }

                return Ok(room);
            }
            else
            {
                return NotFound();
            }
        }

        // GET: Rooms
        // Recebe o nome de uma sala específica
        [HttpGet]
        public async Task<ActionResult<IList<RoomViewModel>>> GetRoomName(string roomId)
        {
            Room room = await _context.Rooms.FirstOrDefaultAsync(x => x.Id == roomId);

            if (room == null)
            {
                return NotFound();
            }

            RoomViewModel roomView = new RoomViewModel(room.Id, room.Name, room.Started, room.Players.Count());

            return Ok(roomView);
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
