using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCC.API.Models
{
    [Table("Plant")]
    public class Plant
    {
        public Plant(string name, string scientificName, string about)
        {
            Name = name;
            ScientificName = scientificName;
            About = about;
        }

        [Key]
        public int Id { get; set; }

        [MaxLength(255)]
        public string Name { get; set; }

        [MaxLength(255)]
        public string ScientificName { get; set; }

        [MaxLength(255)]
        public string UsedPart { get; set; }

        [MaxLength(1500)]
        public string About { get; set; }

        [MaxLength(1500)]
        public string Curiosity { get; set; }

        [MaxLength(1500)]
        public string References { get; set; }

        [MaxLength(1500)]
        public string Summary { get; set; }
    }
}
