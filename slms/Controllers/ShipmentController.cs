using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using slms.Data;
using slms.Models;

namespace slms.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShipmentController : ControllerBase
{
    private readonly AppDbContext _context;

    public ShipmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Captain")]
    public async Task<ActionResult<IEnumerable<Shipment>>> GetShipments()
    {
        var query = _context.Shipments
            .Include(shipment => shipment.Ship)
            .Include(shipment => shipment.Cargo)
            .AsQueryable();

        if (User.IsInRole("Captain"))
        {
            query = query.Where(shipment => shipment.Ship != null
                && shipment.Ship.Captain != null
                && shipment.Ship.Captain.Email == User.Identity!.Name);
        }

        var shipments = await query.ToListAsync();

        return Ok(shipments);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Captain")]
    public async Task<ActionResult<Shipment>> GetShipment(int id)
    {
        var query = _context.Shipments
            .Include(shipment => shipment.Ship)
            .Include(shipment => shipment.Cargo)
            .AsQueryable();

        if (User.IsInRole("Captain"))
        {
            query = query.Where(shipment => shipment.Ship != null
                && shipment.Ship.Captain != null
                && shipment.Ship.Captain.Email == User.Identity!.Name);
        }

        var shipment = await query.FirstOrDefaultAsync(shipment => shipment.Id == id);

        if (shipment == null)
        {
            return NotFound();
        }

        return Ok(shipment);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Shipment>> AddShipment(Shipment shipment)
    {
        _context.Shipments.Add(shipment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetShipment), new { id = shipment.Id }, shipment);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateShipment(int id, Shipment shipment)
    {
        if (id != shipment.Id)
        {
            return BadRequest();
        }

        var shipmentExists = await _context.Shipments.AnyAsync(existingShipment => existingShipment.Id == id);
        if (!shipmentExists)
        {
            return NotFound();
        }

        _context.Entry(shipment).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteShipment(int id)
    {
        var shipment = await _context.Shipments.FindAsync(id);

        if (shipment == null)
        {
            return NotFound();
        }

        _context.Shipments.Remove(shipment);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
