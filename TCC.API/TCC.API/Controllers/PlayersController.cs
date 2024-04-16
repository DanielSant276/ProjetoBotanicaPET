using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TCC.API.Context;
using TCC.API.Models;
using TCC.API.Response;

namespace TCC.API.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly Dictionary<string, string> _connectedClients = new Dictionary<string, string>();

        public PlayersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: Players/GetPlayerById/{id}
        // Pesquisa pelo jogador
        [HttpGet("{id}")]
        public async Task<ActionResult<Player>> GetPlayerById(string id)
        {
            if (id == "" || id == "undefined")
            {
                id = Guid.NewGuid().ToString();
            }

            Player player = await _context.Players.FirstOrDefaultAsync(x => x.Id == id);

            if (player == null)
            {
                player = new Player(id, "", false);
                _context.Players.Add(player);
                await _context.SaveChangesAsync();
            }

            return Ok(player);
        }


        // POST: Players/UpdatePlayerById/{PlayerResponse}
        // Marca um jogador como pronto ou atualiza o nome dele na tela
        [HttpPost]
        public async Task<ActionResult<Player>> UpdatePlayer(PlayerResponse playerResponse)
        {
            try
            {
                Player player = await _context.Players.FirstOrDefaultAsync(x => x.Id == playerResponse.Id);

                if (player == null)
                {
                    player = new Player(playerResponse.Id, playerResponse.Name, playerResponse.Ready);
                    _context.Players.Add(player);
                }

                player.Name = playerResponse.Name;
                player.Ready = playerResponse.Ready;

                await _context.SaveChangesAsync();

                return Ok(player);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());

                return NotFound();
            }
        }
    }
}
