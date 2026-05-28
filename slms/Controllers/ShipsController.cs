using Microsoft.AspNetCore.Mvc;
using slms.Models;

namespace slmsAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShipsController : ControllerBase
{
    private static List<Ship> ships = new List<Ship>();
    [HttpGet]
    public IActionResult GetShips()
    {
        return Ok(ships);
    }

    [HttpPost]
    public IActionResult AddShip(Ship ship)
    {
        ships.Add(ship);
        return Ok(ship);
    }
}