using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCC.API.Models
{
    [Table("Room")]
    public class Room
    {
        public Room()
        {
            Players = new Collection<Player>();
        }

        [Key]
        public int Id { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        public Boolean Started { get; set; }

        public ICollection<Player> Players { get; set; }
    }
}
