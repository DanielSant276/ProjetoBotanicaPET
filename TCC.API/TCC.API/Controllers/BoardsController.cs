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
    [Route("api/[controller]")]
    [ApiController]
    public class BoardsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BoardsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: Boards
        // Recebe o board de um determinado jogador
        [HttpGet]
        public async Task<ActionResult<IList<Board>>> GetBoards(string id)
        {
            Board board = await _context.Boards.SingleOrDefaultAsync(x => x.Player.Id == id);

            if (board == null)
            {
                return NotFound();
            }
            return Ok(board);
        }

        // GET: Boards/CreateNewBoard
        // Cria um novo board para um jogador
        [HttpGet("{id}")]
        public async Task<ActionResult<Board>> CreateNewBoard(string playerId)
        {
            Player player = await _context.Players.FindAsync(playerId);

            if (player == null)
            {
                return NotFound();
            }

            Board board = await _context.Boards.FirstOrDefaultAsync(x => x.PlayerId == playerId);
            IList<Plant> plant = await _context.Plants.ToListAsync();

            if (plant == null)
            {
                return NotFound();
            }

            Boolean newBoard = false;

            // Caso o jogador não tenha um board registrado ele irá criar um novo
            if (board == null)
            {
                newBoard = true;
                board = new Board(playerId);

                board.Player = player;
            }

            IList<int> numbers = new List<int>();

            for (int i = 0; i < 6; i++)
            {
                int numberGenerated = new Random().Next(plant.Count());

                if (!numbers.Contains(numberGenerated))
                {
                    numbers.Add(numberGenerated);
                }
                else
                {
                    i--;
                }
            }

            board.DrawnNumbersInt = numbers;
            board.DrawnNumbers = numbers.ToString();
            board.Points = 0;

            if (newBoard)
            {
                _context.Boards.Add(board);
            }
            else
            {
                _context.Entry(board).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();

            return Ok(board);
        }
    }
}
