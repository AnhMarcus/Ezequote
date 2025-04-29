using Microsoft.AspNetCore.Mvc;
using BE.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using BE.Data;
using BE.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public UserController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("/login")]
        public IActionResult Login(UserLoginDto loginData)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.email == loginData.email && u.password == loginData.password);

            if (user == null)
                return Unauthorized(new { status = 0, message = "Wrong account or password" });

            var token = GenerateJwtToken(user);

            // Tạo đường dẫn file riêng cho mỗi users
            var fileName = $"user_{user.email}.json";

            // Tạo file user.json mặc định nếu chưa có

            if (!System.IO.File.Exists(fileName))
            {
                // Nếu chưa có file thì tạo mới hoàn toàn
                var defaultProfile = new UserProfile
                {
                    Email = user.email,
                    Phone = "",
                    Gender = "male",
                    BirthDate = null,
                    AvatarUrl = "https://react.semantic-ui.com/images/wireframe/square-image.png"
                };
                var json = System.Text.Json.JsonSerializer.Serialize(defaultProfile);
                System.IO.File.WriteAllText(fileName, json);
            }
            else {
                // Nếu đã có file rồi thì đọc ra và kiểm tra
                var json = System.IO.File.ReadAllText(fileName);
                var currentProfile = System.Text.Json.JsonSerializer.Deserialize<UserProfile>(json) ?? new UserProfile();

                bool updated = false;

                if (string.IsNullOrEmpty(currentProfile.Phone))
                {
                    currentProfile.Phone = "";
                    updated = true;
                }
                if (string.IsNullOrEmpty(currentProfile.Gender))
                {
                    currentProfile.Gender = "male";
                    updated = true;
                }
                if (currentProfile.BirthDate == null)
                {
                    currentProfile.BirthDate = null;
                    updated = true;
                }
                if (string.IsNullOrEmpty(currentProfile.AvatarUrl))
                {
                    currentProfile.AvatarUrl = "https://react.semantic-ui.com/images/wireframe/square-image.png";
                    updated = true;
                }
                if (string.IsNullOrEmpty(currentProfile.Email))
                {
                    currentProfile.Email = user.email;
                    updated = true;
                }

                if (updated)
                {
                    var updatedJson = System.Text.Json.JsonSerializer.Serialize(currentProfile);
                    System.IO.File.WriteAllText(fileName, updatedJson);
                }
            }


            return Ok(new
            {
                status = 1,
                message = "Login successfully",
                data = new { token, firstName = user.firstName, lastName = user.lastName, email = user.email, role = user.role }
            });
        }

        // Get all users
        [Authorize]
        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users.Select(u => new
            {
                u.Id,
                u.email
            }).ToList();
            return Ok(users);
        }

        // Register -> Lưu vào Database
        [HttpPost("register")]
        public IActionResult Register(UserRegisterDto newUser)
        {
            if (string.IsNullOrEmpty(newUser.email) || string.IsNullOrEmpty(newUser.password))
            {
                return BadRequest(new { status = 0, message = "Please enter email and password" });
            }

            var exists = _context.Users.Any(u => u.email == newUser.email);
            if (exists)
            {
                return Conflict(new { status = 0, message = "Email already exists" });
            }

            var user = new UserLogin
            {
                email = newUser.email,
                password = newUser.password,
                firstName = newUser.firstName,
                lastName = newUser.lastName,
                role = "user"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { status = 1, message = "Registered successfully" });
        }

        // Change password
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users.FirstOrDefaultAsync(x => x.email == model.Email);
            if (user == null)
                return NotFound("User not found.");

            if (user.password != model.CurrentPassword)
                return BadRequest("Current password is incorrect.");

            user.password = model.NewPassword;
            await _context.SaveChangesAsync();

            return Ok("Password changed successfully.");
        }

        private string GenerateJwtToken(UserLogin user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.email)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims, // 👈 thêm claims
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}