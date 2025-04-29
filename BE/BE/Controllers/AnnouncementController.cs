using BE.Data;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AnnouncementController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var announcement = await _context.Announcements.OrderByDescending(a => a.CreatedAt).ToListAsync();
            return Ok(announcement);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
                return NotFound(new { message = "Announcement not found." });
            return Ok(announcement);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Announcement model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Title) || string.IsNullOrWhiteSpace(model.Content))
                return BadRequest("Invalid input");

            model.CreatedAt = DateTime.UtcNow;
            _context.Announcements.Add(model);
            await _context.SaveChangesAsync();

            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Announcement model)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
                return NotFound(new { message = "Announcement not found." });

            announcement.Title = model.Title;
            announcement.Content = model.Content;
            announcement.CreatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(announcement);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
                return NotFound(new { message = "Announcement not found." });

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Delete successfully."});
        }
        
    }
}
