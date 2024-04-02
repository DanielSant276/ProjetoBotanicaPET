using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TCC.API.Context;
using TCC.API.Models;

namespace TCC.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlayersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: Players/{id}
        // Pesquisa pelo jogador
        [HttpGet("{id}")]
        public async Task<ActionResult<Player>> GetPlayer(string ip)
        {
            Player player = await _context.Players.FirstOrDefaultAsync(x => x.Ip == ip);

            if (player == null)
            {
                player = new Player(ip);
                _context.Players.Add(player);
                await _context.SaveChangesAsync();
            }

            return Ok(player);
        }


        // GET: Players/{id}
        // Marca um jogador como pronto ou atualiza o nome dele na tela
        [HttpGet("{id}")]
        public async Task<ActionResult<Player>> UpdatePlayerReady(string ip, string name, Boolean ready)
        {
            Player player = await _context.Players.FirstOrDefaultAsync(x => x.Ip == ip);

            if (player == null)
            {
                player = new Player(ip);
            }

            player.Name = name;
            player.Ready = ready;

            _context.Players.Add(player);
            await _context.SaveChangesAsync();

            return Ok(player);
        }
    }
}
