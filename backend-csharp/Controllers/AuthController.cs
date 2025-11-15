using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace BusinessAssistant.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IUserService userService, ILogger<AuthController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var user = await _userService.CreateUserAsync(
                request.Email,
                request.Name,
                request.Password,
                request.Phone
            );

            var token = GenerateToken(user.Id);
            var response = new AuthResponse
            {
                Token = token,
                User = new UserInfo
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    Phone = user.Phone,
                    CreatedAt = user.CreatedAt
                }
            };

            _logger.LogInformation($"Пользователь зарегистрирован: {user.Email}");
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка регистрации");
            return BadRequest(new { detail = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var user = await _userService.GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                return Unauthorized(new { detail = "Неверный email или пароль" });
            }

            var isValid = await _userService.ValidatePasswordAsync(user, request.Password);
            if (!isValid)
            {
                return Unauthorized(new { detail = "Неверный email или пароль" });
            }

            var token = GenerateToken(user.Id);
            var response = new AuthResponse
            {
                Token = token,
                User = new UserInfo
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    Phone = user.Phone,
                    CreatedAt = user.CreatedAt
                }
            };

            _logger.LogInformation($"Пользователь вошел: {user.Email}");
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка входа");
            return StatusCode(500, new { detail = "Внутренняя ошибка сервера" });
        }
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserInfo>> GetCurrentUser()
    {
        var userId = GetUserIdFromToken();
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { detail = "Требуется авторизация" });
        }

        var user = await _userService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return Unauthorized(new { detail = "Пользователь не найден" });
        }

        return Ok(new UserInfo
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Phone = user.Phone,
            CreatedAt = user.CreatedAt
        });
    }

    [HttpPut("profile")]
    public async Task<ActionResult<UserInfo>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = GetUserIdFromToken();
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { detail = "Требуется авторизация" });
        }

        try
        {
            var user = await _userService.UpdateUserAsync(userId, request.Name, request.Phone);
            return Ok(new UserInfo
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Phone = user.Phone,
                CreatedAt = user.CreatedAt
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { detail = ex.Message });
        }
    }

    private string? GetUserIdFromToken()
    {
        if (!Request.Headers.TryGetValue("Authorization", out var authHeader))
        {
            return null;
        }

        var token = authHeader.ToString().Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase);
        if (string.IsNullOrEmpty(token))
        {
            return null;
        }

        try
        {
            // Простая декодировка токена (в реальном приложении используйте JWT)
            var bytes = Convert.FromBase64String(token);
            var userId = Encoding.UTF8.GetString(bytes);
            return userId;
        }
        catch
        {
            return null;
        }
    }

    private static string GenerateToken(string userId)
    {
        // Простой токен (в реальном приложении используйте JWT)
        var bytes = Encoding.UTF8.GetBytes(userId);
        return Convert.ToBase64String(bytes);
    }
}

public class UpdateProfileRequest
{
    public string? Name { get; set; }
    public string? Phone { get; set; }
}

