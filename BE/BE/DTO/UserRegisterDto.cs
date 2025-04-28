using System.ComponentModel.DataAnnotations;

namespace BE.DTO
{
    public class UserRegisterDto
    {
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
