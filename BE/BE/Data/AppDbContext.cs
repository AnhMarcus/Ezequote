using BE.DTO;
using BE.Models;
using Microsoft.EntityFrameworkCore;
namespace BE.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<UserLogin> Users { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
    }
}
