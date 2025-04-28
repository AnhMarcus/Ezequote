using System.ComponentModel.DataAnnotations;

namespace BE.DTO
{
    public class UserLoginDto
    {
        [Required]
        public string email { get; set; }

        [Required]
        public string password { get; set; }
    }
}
