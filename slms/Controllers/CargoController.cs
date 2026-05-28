using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using slms.Data;
using slms.Models;

namespace slms.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CargoController : ControllerBase
{
    private readonly AppDbContext _context;

    public CargoController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Captain")]
    public async Task<ActionResult<IEnumerable<Cargo>>> GetCargo()
    {
        var cargo = await _context.Cargo.ToListAsync();

        return Ok(cargo);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Captain")]
    public async Task<ActionResult<Cargo>> GetCargo(int id)
    {
        var cargo = await _context.Cargo.FindAsync(id);

        if (cargo == null)
        {
            return NotFound();
        }

        return Ok(cargo);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Cargo>> AddCargo(Cargo cargo)
    {
        _context.Cargo.Add(cargo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCargo), new { id = cargo.Id }, cargo);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCargo(int id, Cargo cargo)
    {
        if (id != cargo.Id)
        {
            return BadRequest();
        }

        var cargoExists = await _context.Cargo.AnyAsync(existingCargo => existingCargo.Id == id);
        if (!cargoExists)
        {
            return NotFound();
        }

        _context.Entry(cargo).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCargo(int id)
    {
        var cargo = await _context.Cargo.FindAsync(id);

        if (cargo == null)
        {
            return NotFound();
        }

        _context.Cargo.Remove(cargo);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
