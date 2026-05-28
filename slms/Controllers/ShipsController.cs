using Microsoft.AspNetCore.Mvc;
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
    public IActionResult GetShips()
    {
        return Ok(_context.Ships.ToList());
    }

    [HttpPost]
    public IActionResult AddShip(Ship ship)
    {
        _context.Ships.Add(ship);
        _context.SaveChanges();
        return Ok(ship);
    }
}