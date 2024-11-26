using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TCC.API.Context;
using TCC.API.Models;
using TCC.API.Models.Requests;
using TCC.API.Models.Responses;

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
        public async Task<ActionResult<IList<RoomResponse>>> GetRooms(string playerId)
        {
            IList<Room> rooms = await _context.Rooms.Include(room => room.Players).ToListAsync();

            rooms = rooms.Where(room => !room.Players.Any(player => player.Id == playerId)).ToList();

            if (_context.Rooms == null)
            {
                return NotFound();
            }

            IList<RoomResponse> roomsView = new List<RoomResponse>();

            foreach (Room room in rooms)
            {
                if (!room.Started && room.Players.Count > 0)
                {
                    RoomResponse roomView = new RoomResponse(room.Id, room.Name, room.Started, room.Players.Count());
                    roomsView.Add(roomView);
                }
                else if (room.Players.Count == 0)
                {
                    _context.Rooms.Remove(room);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(roomsView);
        }

        [HttpPost]
        public async Task<ActionResult<IList<RoomResponse>>> CreateRoom([FromBody] CreateRoomRequest createRoomRequest)
        {
            // O limite máximo de salas é de 14, não será possível criar mais do que isso de salas
            IList<Room> allRooms = await _context.Rooms.Where(x => !x.Started). ToListAsync();

            if (allRooms.Count >= 14)
            {
                return StatusCode(409, "Máximo de salas criadas, entre em uma sala já existente ou aguarde um pouco");
            }

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
                    return StatusCode(500, "Ocorreu um erro ao criar a sala. Por favor, tente novamente.");
                }

                return Ok(room);
            }
            else
            {
                return NotFound("Jogador não encontrado");
            }
        }

        // GET: Rooms
        // Recebe uma sala específica
        [HttpGet]
        public async Task<ActionResult<IList<RoomResponse>>> GetRoom(string roomId)
        {
            Room room = await _context.Rooms.FirstOrDefaultAsync(x => x.Id == roomId);

            if (room == null)
            {
                return NotFound();
            }

            RoomResponse roomView = new RoomResponse(room.Id, room.Name, room.Started, room.Players.Count());

            return Ok(roomView);
        }

        // GET: VerifyRoom
        // Verifica se a sala está cheia
        [HttpGet]
        public async Task<ActionResult<IList<RoomResponse>>> VerifyRoom(string roomId)
        {
            Room room = await _context.Rooms.Include(room => room.Players).FirstOrDefaultAsync(x => x.Id == roomId);

            if (room == null)
            {
                return NotFound();
            }

            if (room.Players.Count == 4)
            {
                return Ok(false);
            }
            return Ok(true);
        }
    }
}
