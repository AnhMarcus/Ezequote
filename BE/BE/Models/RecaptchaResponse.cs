namespace BE.Models
{
    public class RecaptchaResponse
    {
        public bool Success { get; set; }
        // Optional – dành cho reCAPTCHA v3 (v2 không cần nhưng không hại khi có)
        public float Score { get; set; }
        public string Action { get; set; }

        public DateTime ChallengeTs { get; set; }
        public string Hostname { get; set; }
        public string[] ErrorCodes { get; set; }
    }
}
