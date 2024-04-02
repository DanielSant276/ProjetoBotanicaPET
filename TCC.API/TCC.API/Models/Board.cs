using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCC.API.Models
{
    [Table("Board")]
    public class Board
    {
        public Board(int playerId)
        {
            PlayerId = playerId;
        }

        [Key]
        public int Id { get; set; }

        public int PlayerId { get; set; }

        public Player? Player { get; set; }

        [NotMapped]
        public IList<int> DrawnNumbersInt { get; set; } = new List<int>();

        public string DrawnNumbers
        {
            get => string.Join(",", DrawnNumbersInt);
            set => DrawnNumbersInt = value.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList();
        }

        public int Points { get; set; }
    }
}
