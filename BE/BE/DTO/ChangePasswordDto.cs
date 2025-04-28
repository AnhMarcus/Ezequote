using System.ComponentModel.DataAnnotations;

namespace BE.DTO
{
    public class ChangePasswordDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }
    }
}
