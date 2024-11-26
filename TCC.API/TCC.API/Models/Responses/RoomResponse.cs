using Microsoft.AspNetCore.Mvc;
using System.Collections.ObjectModel;
using System.Xml.Linq;
using TCC.API.Models;

namespace TCC.API.Models.Responses
{
    public class RoomResponse
    {

        public string Id { get; set; }

        public string Name { get; set; }

        public bool Started { get; set; }

        public int NumberOfPlayers { get; set; }

        public RoomResponse(string id, string name, bool started, int numberOfPlayers)
        {
            Id = id;
            Name = name;
            Started = started;
            NumberOfPlayers = numberOfPlayers;
        }
    }
}
