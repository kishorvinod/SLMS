using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using slms.Models;
using slms.Data;

namespace slms.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShipsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ShipsController(AppDbContext context)
    {
        _context = context;
    }


    [HttpGet]
    [Authorize(Roles = "Admin,Captain")]
    public async Task<ActionResult<IEnumerable<Ship>>> GetShips()
    {
        var ships = await _context.Ships
            .Include(ship => ship.Captain)
            .Include(ship => ship.Shipments)
            .ToListAsync();

        return Ok(ships);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Captain")]
    public async Task<ActionResult<Ship>> GetShip(int id)
    {
        var ship = await _context.Ships
            .Include(ship => ship.Captain)
            .Include(ship => ship.Shipments)
            .FirstOrDefaultAsync(ship => ship.Id == id);

        if (ship == null)
        {
            return NotFound();
        }

        return Ok(ship);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Ship>> AddShip(Ship ship)
    {
        _context.Ships.Add(ship);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetShip), new { id = ship.Id }, ship);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateShip(int id, Ship ship)
    {
        if (id != ship.Id)
        {
            return BadRequest();
        }

        var shipExists = await _context.Ships.AnyAsync(existingShip => existingShip.Id == id);
        if (!shipExists)
        {
            return NotFound();
        }

        _context.Entry(ship).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteShip(int id)
    {
        var ship = await _context.Ships.FindAsync(id);

        if (ship == null)
        {
            return NotFound();
        }

        _context.Ships.Remove(ship);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
