using Microsoft.AspNetCore.Mvc;
using System.Collections.ObjectModel;
using TCC.API.Models;

namespace TCC.API.DTO
{
    public class RoomViewModel
    {

        public int Id { get; set; }

        public Boolean Started { get; set; }

        public int NumberOfPlayers { get; set; }

        public RoomViewModel(int id, bool started, int numberOfPlayers)
        {
            Id = id;
            Started = started;
            NumberOfPlayers = numberOfPlayers;
        }
    }
}
