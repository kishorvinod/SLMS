using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using slms.Data;
using slms.Models;

namespace slms.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class CaptainsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CaptainsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Captain>>> GetCaptains()
    {
        var captains = await _context.Captains
            .Include(captain => captain.Ships)
            .ToListAsync();

        return Ok(captains);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Captain>> GetCaptain(int id)
    {
        var captain = await _context.Captains
            .Include(captain => captain.Ships)
            .FirstOrDefaultAsync(captain => captain.Id == id);

        if (captain == null)
        {
            return NotFound();
        }

        return Ok(captain);
    }

    [HttpPost]
    public async Task<ActionResult<Captain>> AddCaptain(Captain captain)
    {
        _context.Captains.Add(captain);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCaptain), new { id = captain.Id }, captain);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCaptain(int id, Captain captain)
    {
        if (id != captain.Id)
        {
            return BadRequest();
        }

        var captainExists = await _context.Captains.AnyAsync(existingCaptain => existingCaptain.Id == id);
        if (!captainExists)
        {
            return NotFound();
        }

        _context.Entry(captain).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCaptain(int id)
    {
        var captain = await _context.Captains.FindAsync(id);

        if (captain == null)
        {
            return NotFound();
        }

        _context.Captains.Remove(captain);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
