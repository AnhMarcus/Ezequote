namespace BE.Models
{
    public class UserProfile
    {
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Gender { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
