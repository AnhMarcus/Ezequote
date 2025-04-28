using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.DTO
{
    [Table("Users")] // 👈 Phải đúng tên bảng
    public class UserLogin
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string email { get; set; }

        [Required]
        public string password { get; set; }
        [Required]
        public string firstName { get; set; }

        [Required]
        public string lastName { get; set; }

    }
}
