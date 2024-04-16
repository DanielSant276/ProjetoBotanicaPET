using Microsoft.AspNetCore.SignalR;
using TCC.API.Context;

namespace TCC.API.Controllers.SignalR
{
    public class MatchHub : Hub
    {
        private readonly AppDbContext _context;

        public MatchHub(AppDbContext context)
        {
            _context = context;
        }
    }
}
