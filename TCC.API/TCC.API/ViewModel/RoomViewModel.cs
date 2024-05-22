using Microsoft.AspNetCore.Mvc;
using System.Collections.ObjectModel;
using System.Xml.Linq;
using TCC.API.Models;

namespace TCC.API.DTO
{
    public class RoomViewModel
    {

        public string Id { get; set; }

        public string Name { get; set; }

        public Boolean Started { get; set; }

        public int NumberOfPlayers { get; set; }

        public RoomViewModel(string id, string name, bool started, int numberOfPlayers)
        {
            Id = id;
            Name = name;
            Started = started;
            NumberOfPlayers = numberOfPlayers;
        }
    }
}
