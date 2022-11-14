using System.ComponentModel.DataAnnotations;

namespace ITrackerSPA.Models
{
    public class Project
    {
        public int ProjectId { get; set; }

        [StringLength(256, MinimumLength = 5)]
        [Required]
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Url { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<Issue>? Issues { get; set; }
    }
}
