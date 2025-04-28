namespace BE.Models
{
    public class ResetPassword
    {
        public string Email { get; set; }
        public string CaptchaToken { get; set; }
    }
}
