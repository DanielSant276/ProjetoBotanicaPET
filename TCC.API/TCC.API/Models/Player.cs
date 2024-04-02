using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCC.API.Models
{
    [Table("Player")]
    public class Player
    {
        public Player(string ip)
        {
            Ip = ip;
        }

        [Key]
        public int Id { get; set; }

        [MaxLength(255)]
        public string? Name { get; set; }

        public string Ip { get; set; }

        public Boolean? Ready { get; set; }

        public int? RoomId { get; set; }

        public Room? Room { get; set; }
    }
}
