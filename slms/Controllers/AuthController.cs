using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using slms.Data;
using slms.DTOs;
using slms.Models;
using slms.Services;

namespace slms.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHashService _passwordHashService;

    public AuthController(
        AppDbContext context,
        IConfiguration configuration,
        PasswordHashService passwordHashService)
    {
        _context = context;
        _configuration = configuration;
        _passwordHashService = passwordHashService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(RegisterDto request)
    {
        var role = request.Role.Trim();

        if (role != "Admin" && role != "Captain")
        {
            return BadRequest("Role must be either Admin or Captain.");
        }

        var usernameExists = await _context.Users
            .AnyAsync(user => user.Username == request.Username);

        if (usernameExists)
        {
            return Conflict("Username already exists.");
        }

        var user = new User
        {
            Username = request.Username.Trim(),
            Password = _passwordHashService.HashPassword(request.Password),
            Role = role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Created(string.Empty, new
        {
            user.Id,
            user.Username,
            user.Role
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(user => user.Username == request.Username);

        if (user == null || !_passwordHashService.VerifyPassword(request.Password, user.Password))
        {
            return Unauthorized("Invalid username or password.");
        }

        var expiresAt = DateTime.UtcNow.AddHours(1);
        var token = GenerateJwtToken(user, expiresAt);

        return Ok(new AuthResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt
        });
    }

    private string GenerateJwtToken(User user, DateTime expiresAt)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var secretKey = jwtSettings["Key"] ?? throw new InvalidOperationException("JWT key is missing.");
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Role, user.Role),
            new(JwtRegisteredClaimNames.Sub, user.Username),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
