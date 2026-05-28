using Microsoft.EntityFrameworkCore;
using slms.Models;

namespace slms.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Ship> Ships { get; set; }

}