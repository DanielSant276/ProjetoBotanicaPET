using Microsoft.EntityFrameworkCore;
using TCC.API.Models;

namespace TCC.API.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Plant> Plants { get; set; }
        public DbSet<Player> Players { get; set; }

        public DbSet<Room> Rooms { get; set; }

        public DbSet<Board> Boards { get; set; }
    }
}
