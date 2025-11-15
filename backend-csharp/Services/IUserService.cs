using BusinessAssistant.Api.Models;

namespace BusinessAssistant.Api.Services;

public interface IUserService
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByIdAsync(string id);
    Task<User> CreateUserAsync(string email, string name, string password, string? phone = null);
    Task<bool> ValidatePasswordAsync(User user, string password);
    Task<User> UpdateUserAsync(string id, string? name = null, string? phone = null);
}

