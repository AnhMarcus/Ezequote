using System.Net;
using System.Net.Http.Json;
using System.Net.Mail;
using System.Text.Json;
using System.Text.Json.Serialization;
using BE.Data;
using BE.Models;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        private static Dictionary<string, PasswordResetEntry> _resetTokens = new Dictionary<string, PasswordResetEntry>();

        public AccountController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("reset-password-request")]
        public async Task<IActionResult> ResetPasswordRequest([FromBody] ResetPassword request)
        {
            // 1. ✅ Xác minh CAPTCHA
            var secretKey = _configuration["Recaptcha:SecretKey"];
            var client = new HttpClient();
            var content = new FormUrlEncodedContent(new[]
            {
            new KeyValuePair<string, string>("secret", secretKey),
            new KeyValuePair<string, string>("response", request.CaptchaToken)
            });

            var captchaResponse = await client.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);
            var captchaJson = await captchaResponse.Content.ReadAsStringAsync();
            Console.WriteLine("Captcha response từ Google: " + captchaJson);
            var captchaResult = JsonSerializer.Deserialize<RecaptchaResponse>(captchaJson);
            if (!captchaResult.Success)
            {
                return BadRequest(new { success = false, message = "Invalid captcha" });
            }

            // 2. ✅ Kiểm tra email có tồn tại trong hệ thống không
            var user = _context.Users.FirstOrDefault(u => u.email == request.Email);
            if (user == null)
            {
                return BadRequest(new { success = false, message = "Email not found" });
            }

            // 3. ✅ Tạo token reset
            var resetToken = Guid.NewGuid().ToString(); // hoặc JWT nếu bạn dùng hệ thống auth
            var expiry = DateTime.UtcNow.AddMinutes(15); //Token hết hạn sau 15 phút
            _resetTokens[resetToken] = new PasswordResetEntry
            {
                Email = request.Email,
                Expiry = expiry
            };
            var resetLink = $"http://localhost:3000/reset-password-confirm?token={resetToken}";

            // 4. Gửi email
            await SendResetEmail(user.email, resetLink);

            // 4. ✅ Lưu token vào DB nếu cần (để xác minh sau này)

            return Ok(new { success = true, message = "Reset link sent to email." });
        }

        private async Task SendResetEmail(string email, string resetLink)
        {
            var smtpClient = new SmtpClient
            {
                Host = _configuration["Email:SmtpServer"],
                Port = int.Parse(_configuration["Email:Port"]),
                Credentials = new NetworkCredential(_configuration["Email:Username"], _configuration["Email:Password"]),
                EnableSsl = true,
            };

            var message = new MailMessage(_configuration["Email:From"], email)
            {
                Subject = "Reset your password",
                Body = $"Click this link to reset your password: {resetLink}",
                IsBodyHtml = false
            };

            await smtpClient.SendMailAsync(message);
        }

        [HttpPost("confirm-reset")]
        public IActionResult ConfirmReset([FromBody] ConfirmReset request)
        {
            if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.NewPassword))
            {
                return BadRequest(new { success = false, message = "Invalid request." });
            }
            if (!_resetTokens.ContainsKey(request.Token))
            {
                return BadRequest(new { success = false, message = "Invalid or expired token." });
            }
            var tokenInfo = _resetTokens[request.Token];
            if (tokenInfo.Expiry < DateTime.UtcNow)
            {
                _resetTokens.Remove(request.Token);
                return BadRequest(new { success = false, message = "Token expired." });
            }
            var user = _context.Users.FirstOrDefault(u => u.email == tokenInfo.Email);
            if (user == null)
            {
                return BadRequest(new { success = false, message = "User not found." });
            }

            // ✅ Cập nhật mật khẩu mới (bạn nên hash password trong thực tế)
            user.password = request.NewPassword;
            _context.SaveChanges();

            // ✅ Xóa token sau khi dùng
            _resetTokens.Remove(request.Token);
            return Ok(new { success = true, message = "Password has been reset successfully." });
        }
    }

    public class PasswordResetEntry
    {
        public string Email { get; set; }
        public DateTime Expiry { get; set; }
    }

    public class ConfirmReset
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }

    public class RecaptchaResponse
    {
        public bool Success { get; set; }

        [JsonPropertyName("challenge_ts")]
        public DateTime ChallengeTs { get; set; }

        public string Hostname { get; set; }
    }

}
