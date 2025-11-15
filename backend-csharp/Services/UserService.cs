using System.Security.Cryptography;
using System.Text;
using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace BusinessAssistant.Api.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => EF.Functions.ILike(u.Email, email));
    }

    public async Task<User?> GetUserByIdAsync(string id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User> CreateUserAsync(string email, string name, string password, string? phone = null)
    {
        // Проверяем, существует ли пользователь
        var existingUser = await GetUserByEmailAsync(email);
        if (existingUser != null)
        {
            throw new Exception("Пользователь с таким email уже существует");
        }

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = email,
            Name = name,
            PasswordHash = HashPassword(password),
            Phone = phone,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public Task<bool> ValidatePasswordAsync(User user, string password)
    {
        var hash = HashPassword(password);
        return Task.FromResult(hash == user.PasswordHash);
    }

    public async Task<User> UpdateUserAsync(string id, string? name = null, string? phone = null)
    {
        var user = await GetUserByIdAsync(id);
        if (user == null)
        {
            throw new Exception("Пользователь не найден");
        }

        if (!string.IsNullOrEmpty(name))
        {
            user.Name = name;
        }
        if (phone != null)
        {
            user.Phone = phone;
        }

        await _context.SaveChangesAsync();
        return user;
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}
