namespace BE.Models
{
    public class UserProfileDto
    {
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Gender { get; set; }
        public DateTime? BirthDate { get; set; }
        public IFormFile? Avatar { get; set; }
    }
}
