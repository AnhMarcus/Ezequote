using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using BE.Models;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private static UserProfile _user = new UserProfile(); // Giả lập lưu user info

        private string GetCurrentUserEmail()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);
                var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email || c.Type == "email");

                if (emailClaim != null)
                {
                    return emailClaim.Value;
                }
            }
            return null;
        }

        [HttpGet]
        public IActionResult GetProfile()
        {
            var email = GetCurrentUserEmail();
            if (email == null)
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var fileName = $"user_{email}.json";

            if (System.IO.File.Exists(fileName))
            {
                var json = System.IO.File.ReadAllText(fileName);
                _user = JsonSerializer.Deserialize<UserProfile>(json) ?? new UserProfile();
            }

            return Ok(new
            {
                Email = _user.Email,
                Phone = _user.Phone,
                Gender = _user.Gender,
                BirthDate = _user.BirthDate,
                AvatarUrl = _user.AvatarUrl ?? "https://react.semantic-ui.com/images/wireframe/square-image.png"
            });
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateProfile([FromForm] UserProfileDto profile)
        {
            var email = GetCurrentUserEmail();
            if (email == null)
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var fileName = $"user_{email}.json";

            if (System.IO.File.Exists(fileName))
            {
                var json = System.IO.File.ReadAllText(fileName);
                _user = JsonSerializer.Deserialize<UserProfile>(json) ?? new UserProfile();
            } else
            {
                _user = new UserProfile
                {
                    Email = email,
                    Phone = "",
                    Gender = "male",
                    BirthDate = null,
                    AvatarUrl = "https://react.semantic-ui.com/images/wireframe/square-image.png"
                };
            }
            _user.Email = profile.Email;
            _user.Phone = profile.Phone;
            _user.Gender = profile.Gender;
            _user.BirthDate = profile.BirthDate;

            if (profile.Avatar != null)
            {
                var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

                var fileNameUpload = Guid.NewGuid() + Path.GetExtension(profile.Avatar.FileName);
                var filePath = Path.Combine(uploads, fileNameUpload);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profile.Avatar.CopyToAsync(stream);
                }

                var baseUrl = $"{Request.Scheme}://{Request.Host}";
                _user.AvatarUrl = $"{baseUrl}/uploads/{fileNameUpload}";
            }

            // ✅ Ghi thông tin user xuống file user.json để lưu lại khi reload
            var updatedJson = JsonSerializer.Serialize(_user);
            System.IO.File.WriteAllText(fileName, updatedJson);

            return Ok(new { success = true, avatarUrl = _user.AvatarUrl });
        }
    }
}
