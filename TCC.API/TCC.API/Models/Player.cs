using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCC.API.Models
{
    [Table("Player")]
    public class Player
    {
        public Player(string id, string name, Boolean ready)
        {
            Id = id;
            Name = name;
            Ready = ready;
        }

        [Key]
        public string Id { get; set; }

        [MaxLength(255)]
        public string Name { get; set; }

        public Boolean Ready { get; set; }

        public int? RoomId { get; set; }

        public Room? Room { get; set; }
    }
}
