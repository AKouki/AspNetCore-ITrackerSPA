using ITrackerSPA.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace ITrackerSPA.Models
{
    public class Issue
    {
        public int IssueId { get; set; }

        [StringLength(256, MinimumLength = 5)]
        [Required]
        public string? Title { get; set; }
        public string? Description { get; set; }
        public IssueType IssueType { get; set; }
        public Priority Priority { get; set; }
        public Status StatusType { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Creator { get; set; }

        public Project? Project { get; set; }
        public ICollection<Attachment>? Attachments { get; set; }
    }
}
