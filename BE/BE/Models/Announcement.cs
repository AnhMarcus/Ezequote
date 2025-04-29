using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models
{
    [Table("Announcements")]
    public class Announcement
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } // Tiêu đề thông báo
        [Required]
        public string Content { get; set; } // Nội dung thông báo

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
