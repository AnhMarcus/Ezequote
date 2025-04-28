using BE.DTO;
using Microsoft.EntityFrameworkCore;
namespace BE.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<UserLogin> Users { get; set; }
    }
}
