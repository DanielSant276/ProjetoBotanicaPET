using TCC.API.Models;

namespace TCC.API.Models.Requests
{
    public class CreateRoomRequest
    {
        public string roomName { get; set; }
        public Player user { get; set; }
    }
}
