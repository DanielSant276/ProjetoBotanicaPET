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
    [Route("[controller]/[action]")]
    [ApiController]
    public class PlantsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlantsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: Plant
        // Recebe todas as plantas
        [HttpGet]
        public async Task<ActionResult<IList<Plant>>> GetPlants()
        {
            IList<Plant> plants = await _context.Plants.ToListAsync();

            if (plants == null)
            {
                return NotFound();
            }
            return Ok(plants);
        }
    }
}
