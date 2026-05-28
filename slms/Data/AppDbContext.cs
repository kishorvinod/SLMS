using Microsoft.EntityFrameworkCore;
using slms.Models;

namespace slms.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Captain> Captains { get; set; }
    public DbSet<Ship> Ships { get; set; }
    public DbSet<Cargo> Cargo { get; set; }
    public DbSet<Shipment> Shipments { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Captain>()
            .HasMany(captain => captain.Ships)
            .WithOne(ship => ship.Captain)
            .HasForeignKey(ship => ship.CaptainId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ship>()
            .HasMany(ship => ship.Shipments)
            .WithOne(shipment => shipment.Ship)
            .HasForeignKey(shipment => shipment.ShipId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Shipment>()
            .HasOne(shipment => shipment.Cargo)
            .WithMany()
            .HasForeignKey(shipment => shipment.CargoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Cargo>()
            .Property(cargo => cargo.Weight)
            .HasPrecision(18, 2);

        modelBuilder.Entity<User>()
            .HasIndex(user => user.Username)
            .IsUnique();
    }
}
